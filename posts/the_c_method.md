---
date: 2022-01-13
title: "The C method"
subtitle: "An analytical knee/elbow searching method"
tags:
  - math
  - machine-learning
  - optimization
grammarly_score_start: 67
grammarly_score_end: 84
---
Knee searching is quite important operation. Here I describe the method I personally developed: the so-called **C-method**.

## Description

It all started with an observation: many tradeoff curves I've come across with vaguely look like $`\frac1x`$ or $`1-\frac1x`$. The most generic form of this equation is:

```math
f\left(x\right) = a+ \frac{b}{x+c}
```

It has three shape parameters: $`a`$, $`b`$, and $`c`$, and fitting these parameters should be enough. However, I felt that this is way too much degrees of freedom; if I restrict the function with some constraints, I should ideally get the functional form with only one shape parameter. The restrictions I came up with is to anchor the function such that $`f(0) = 0`$ and $`f(1) = 1`$.

### Constraint 1
When $`f(0)=0`$ is fed into the equation form results in a relation:
```math
\begin{align*}
0 = f(0) &= a+\frac{b}{0+c} =\\
         &= a+\frac{b}c =\\
         &\Leftrightarrow =\\
       b &= -ac \\
\end{align*}
```
which is cute and simple. Feeding the relation back into the equation results with:
```math
\begin{align*}
    f(x) &= a - \frac{ac}{x+c} =\\
         &= a\left(1 - \frac{c}{x+c}\right) =\\
         &= a\left(\frac{x+c}{x+c} - \frac{c}{x+c}\right) =\\
         &= \frac{ax}{x+c}
\end{align*}
```
Nice and simple

### Constaint 2
Feeding $`f(1)=1`$ gets us a quick win:
```math
\begin{align*}
1 = f(1) &= \frac{a}{1+c} \Leftrightarrow \\
       a &= 1+c \\
\end{align*}
```
and feeding it back results in:
```math
f(x) = \frac{\left(1+c\right)x}{x+c}
```

## Analysis
The result has several properties:
1. $`\lim_{c \rightarrow 0} = 1`$
2. $`\lim_{c \rightarrow +\infty} = x`$
3. When $`c \lt 0`$, the curve "flips", meaning the curve avoids the unit square.

I decided I did not like this as, while perfectly mathematically correct, it's not match my intuition at all :sweat_smile: to me, ideally $`\lim_{c \rightarrow 0}`$ should go to $`x`$ and $`\lim_{c \rightarrow +\infty}`$ should go to $`x`$. Also, I would like to restrict $`c`$ to all positive reals.

## Better solution
All of my problems are solved with a following substitution: $`c \rightarrow \frac1{e^c}`$. Mathematicians probably hate me right now. Anyhow, doing the substitution gave me:
```math
\begin{align*}
f(x) = \frac{\left(1+c\right)x}{x+c} &\rightarrow \frac{\left(1+\frac1{e^c}\right)x}{x+\frac1{e^c}} = \\
    &= \frac{x\left(e^c+1\right)}{xe^c + 1}\\
\end{align*}
```
Personal opinion, it's got a nice visual which is easy to remember. The only difference is the parantheses :smile:

The animation of the function image

### Analysis
1. $`\lim_{c \rightarrow -\infty} = x`$, which was what I wanted
2. $`\lim_{c \rightarrow +\infty} = 1`$, which was also what I wanted
3. Flipping is now disabled

## How to use it to find a knee?
Two ways: the intuitive way, the technical way, and the hacky way.

### The intuitive way
The intuitive way starts with an observation that the function graph is symmetric with respect to the line $`y=1-x`$. Intersecting the graph with the line gives:
```math
\begin{align*}
1-x &= \frac{x\left(e^c+1\right)}{xe^c+1} \\
\left(1-x\right)\left(xe^c+1\right) &= x\left(e^c+1\right) \\
e^cx+1-e^cx^2-e^cx-x&=0 \\
e^cx^2+2x-1&=0 \\
\end{align*}
```

The quadratic equation has two solutions, however I must disregard one of them as it's smaller than $`0`$. Therefore, the knee point is at:
```math
x=\frac{-1+\sqrt{1+e^c}}{e^c}
```

### The technical way
The second way is way more technical as it involves a lot of calculus. If I define a curvature function $`K(x)=\frac{f''}{\left(1+f'^2\right)^\frac32}`$, I could find an extreme point by $`\frac{d}{dx}K\left(x\right) = 0`$. 

The second feels rather hacky.
