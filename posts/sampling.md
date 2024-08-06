---
date: 2024-08-02
title: "Sampling a categorical PMF"
subtitle: "There's more than meets the eye"
tags:
  - math
  - research
  - code
  - stats
---
# Sampling a categorical PMF: more than meets the eye

Sampling a sample from a distribution appears in a lot of places in natural
sciences, but I would guess it's mostly been used lately to power LLMs, due to
internal workings of the Transformer architecture. This blogpost will talk about
how to efficiently sample from a categorical distribution given logits.

## The naive way

Mathematically, most general method to sample a categorical distribution is to
sample from its quantile function. A quantile function is the inverse of the
cumulative distribution function (CDF), and CDF for a particular value `$x$` is
defined as the sum of PMF probabilities for all the values less than `$x$`. But
first, we need to calculate PMF from the logits using softmax. Lots of fancy
words, so let's see an example:

```python
import numpy as np

logits = [4, 1, 2, 6, 3, 2]
a = np.array(logits, dtype=np.float64)
E = np.exp(a)
pmf = E / np.sum(E)
print(pmf)
# array([0.00548473, 0.11016379, 0.01490905, 0.8140064,
# 0.04052699, 0.01490905])
cdf = np.cumsum(E)
print(cdf)
# array([0.00548473, 0.11564852, 0.13055757, 0.94456396,
# 0.98509095, 1.        ])
```

![1. logits of a chosen distribution](/images/sampling-logit.png)

![2. PMF of a chosen distribution](/images/sampling-prob.png)

![3. CDF of a chosen distribution](/images/sampling-cdf.png)

![4. quantile function of a chosen distribution](/images/sampling-quantile.png)

In order to actually sample from the example distribution, we'll sample from a
unit uniform and search the corresponding value in the quantile function. For
example, sampling 0.5 results with 3 (this is supposed to happen in 81.40% of
cases), and sampling 0.111 results with 1 (this is supposed to happen in 0.55%
of cases).

In software, though, we don't have a neat way to represent this quantile
function. Usually, after generating a uniform sample, the CDF is searched for
the first value larger than the sampled one, ideally with binary search.[^search]

So with a Python-esque pseudocode, this procedure can be described as:

```python
def sample(logits):
  # O(n)
  exps = [exp(x) for x in logits]   

  # O(n)
  denom = sum(exps)                 

  # O(n)
  probs = [x/denom for x in exps]   

  # O(1), probably
  sample = Uniform(0, 1).sample()   

  # O(lg(n)), hopefully
  index = search_for(sample)        
  return index
```

This will work... but at what cost? We're traversing the `logits` vector no less
 than 3 times[^stable] just to obtain probability mass function, and then the search.

## A better way

If you don't already know, you could probably guess there is a better way to
sample a categorical distribution given the logits. Ideally, it would work
without the obvious bottleneck of calculating the PMF from the logits.

Luckily for us, the people have already worked out the math for this one - it's
called a [Gumbel max trick](https://homes.cs.washington.edu/~ewein//blog/2022/03/04/gumbel-max/).
While the notation may appear daunting, the math isn't _that_ involved,
considering the result that's proved. It turns out you can sample from a
categorical distribution **directly from the logits** (and, in a single pass,
too!) just by adding samples of a standard
[Gumbel distribution](https://en.wikipedia.org/wiki/Gumbel_distribution) to the
logits, and storing where we the largest sum was. And, as per the Wiki article,
sampling the standard Gumbel distribution is as easy as

```math
G=-\ln(-\ln(x))
```

where `$x$` is `$\Uniform\(0, 1\)$`. Beautiful :heart:.

The Python-esque pseudocode is as straighforward as it gets:

```python
def sample(logits):
  # lowest number there exist
  max = -inf                        
  max_i = 0

  # O(n)
  for i, x in enumerate(logits):    
    # O(1), probably
    G = Gumbel(0, 1).sample()       
    if x+G > max:
      max = x+G
      max_i = i
  return max_i
```

The cool thing is we've inlined the search for the sample within a single pass.
On the other hand, for every iteration we do a bit more work by sampling from
the Standard Gumbel distribution. Let's find out if it's significant!

## Experiments

Wooo I love testing things and quantifying their effects!
(This may sound ironic but I swear it's not)

First, let's measure the goodness of fit. I wrote a script that samples from a
distribution and checks if samples fit the theoretical.

```python
if __name__ == "__main__":
  for k in (5, 10, 50, 100):
    total_count = 5000 * k
    logits = [random.random() for _ in range(n)]
    expected_freq = [t * total_count for t in categorical(logits)]
    samples = [0] * k
    for _ in range(total_count):
      i = sample_gumbel(logits)
      samples[i] += 1
    result = scipy.stats.chisquare(samples, expected_freq, ddof=k - 2)
    print(f"cumulative, linear, k={k}, p_value={result.pvalue}")
```

Before revealing the results, a small discussion about `ddof`: it means "delta
degrees of freedom" and is meant to be used when you're estimating the
parameters of the distribution. It's `k-1` by default, meaning that for 6-valued
categorical distribution, the test statistic chi2 has 5 degrees of freedom.
However, one could argue that I'm estimating **almost all of the parameters**:
if a categorical distribution has 6 values, I need to specify only 5, because
the last one is `$1-\sum\(\others\)$`. That means the degrees of freedom should
always be 1. The delta of degrees of freedom is therefore a solution of `$1=k-1-(ddof)$`.

The results are as follows:

```text
cumulative, lg2, k=5, p_value=0.00019925739287637194
cumulative, lg2, k=10, p_value=0.008461415566727616
cumulative, lg2, k=50, p_value=7.124183672561275e-12
cumulative, lg2, k=100, p_value=6.995927907952046e-24

cumulative, linear, k=5, p_value=0.0328113340380732
cumulative, linear, k=10, p_value=0.0007787471757505004
cumulative, linear, k=50, p_value=3.897773339242245e-09
cumulative, linear, k=100, p_value=6.67085374753579e-29

cumulative, gumbel, k=5, p_value=0.024586426885631972
cumulative, gumbel, k=10, p_value=0.002726706790486292
cumulative, gumbel, k=50, p_value=1.8746773795404964e-15
cumulative, gumbel, k=100, p_value=4.6684047775788335e-31
```

For actual speed sampling, I modified the script to create logits with some
interesting dimension sizes and measure sampling speed:

```python
...
sizes = (
    list(range(2, 10))
    + list(range(10, 100, 10))
    + list(range(100, 1000, 100))
    + list(range(1000, 10_000, 1000))
    + [10_000]
)

for n in tqdm.tqdm(sizes):
  for _ in range(10_000):
    logits = [random.random() for _ in range(n)]
    start = datetime.now()
    sample_gumbel(logits)
    time_delta = datetime.now() - start
    us = time_delta.microseconds
    # store us
    ...
```

Time to run! Timing the script runtimes should be a sanity check of our claims
that the gumbel trick speeds things up:

```console
❯ time py sampling_gumbel.py
python3 sampling_gumbel.py  73.66s user 0.03s system 102% cpu 1:13.45 total
❯ time py sampling_linear.py
python3 sampling_linear.py  64.46s user 0.04s system 102% cpu 1:03.11 total
❯ time py sampling_lg2.py
python3 sampling_lg2.py  59.40s user 0.01s system 102% cpu 58.008 total
```

... Uhm, what the fuck?![^anger]

Why does the Gumbel-trick sampling have the longest total
runtime? I expected it to be the fastest! Top-10 stat betrayals, together with
[the variance estimator being biased](https://en.wikipedia.org/wiki/Bias_of_an_estimator#Sample_variance).
This should not be happening[^denial].

Maybe it's just for the total :smile: maybe most of the time it really is faster
... [^bargain] Let's plot the values with respect to the number of categorical
dimensions:

![Plot of average inference latency wrt number of dimensions for all three methods](/images/sampling-time.png)

And this is a summary of linear regressions fitting:

```console
method=lg2
coef=0.06403413031829312
intercept=0.7498273801200668
R2=0.9999879315657421

method=linear
coef=0.07284179397885818
intercept=0.0899031120106315
R2=0.999994925648005

method=gumbel
coef=0.09117484397945508
intercept=-0.26593860287300686
R2=0.9999685320065995
```

Oh no... The `$R^2$` does not lie... Gumbel trick sampling adds 9 microseconds
per 100 dimensions, as opposed to softmax-then-linear-or-log search which add 7.3
and 6.4 microseconds, respectively. Something is terribly wrong[^depression].

## Profiling Gumbel

Let's turn to profiling why the Gumbel sampling script is so slow. For that,
I'll use the trustworthy `cProfile` Python module.

```console
$ python3 -m cProfile sampling_gumbel.py
2400977993 function calls (2400974614 primitive calls) in 257.503 seconds
Ordered by: cumulative time

     ncalls  tottime  percall  cumtime  percall filename:lineno(function)
      27/26    0.000    0.000  457.539   17.598 threading.py:637(wait)
      26/25   29.408    1.131  250.130   10.005 threading.py:323(wait)
     360000  108.327    0.000  190.104    0.001 sampling.py:50(sample_gumbel)
 1199880008   56.947    0.000   56.947    0.000 {method 'random' of '_random.Random' objects}
 1199880002   54.208    0.000   54.208    0.000 {built-in method math.log}
    108/102    7.321    0.068   50.046    0.491 {method 'acquire' of '_thread.lock' objects}
      131/1    0.000    0.000    7.303    7.303 {built-in method builtins.exec}
        2/1    1.067    0.534    7.303    7.303 sampling.py:1(<module>)
~~~output cropped~~~
```

Oh no. I don't know what all the `threading` and `lock` invocation mean (I
presume it's the `cProfile`), but it turns out `math.log()` gets called
_~1.2 billion times_ and accounts for 54 seconds of profiling runtime, which
amounts to about 20%. Well shit, this can't really be fixed, I absolutely need
the log to sample Gumbel...[^accept]

... or do I?

## Hello, Padé, my old friend

[^search]: This algorithm is well suited for not-large, 0 anchored, consecutive-valued categorical variables. In case you have values 3, 1M and 10B, you're probably better off using a binary tree or a similar structure.
[^stable]: Actually this naive implementation of softmax has numerical stability issues. For a numerically stable solution, _yet another_ traversal to find the max is necessary
[^anger]: Anger
[^denial]: Denial
[^bargain]: Bargaining
[^depression]: Depression
[^accept]: Acceptance
