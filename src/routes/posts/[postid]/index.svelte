<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page, fetch }) => {
    const res = await fetch(`/posts/${page.params.postid}.json`);
    const { post } = await res.json();
    if (post) {
      return {
        props: {
          post,
        },
      };
    }
  };
</script>

<script>
  import { INLINE_CLASS } from '$lib/utils';
  export let post;
</script>

<div class="post">
  <a class={INLINE_CLASS} href="/" sveltekit:prefetch>Back to main page</a>

  <div class="post-title">
    <h1>{post.title}</h1>
    <p>{post.date}</p>
  </div>

  <div class="post-content" bind:innerHTML={post.content} contenteditable="false" />

  <br />
  <hr />

  <a class={INLINE_CLASS} href="/" sveltekit:prefetch>Back to main page</a>
</div>

<style scoped lang="css">
  .post-title {
    padding: 2rem 0;
  }
  .post-content :global(h2) {
    padding: 1.5rem 0;
  }
  .post-content :global(h3) {
    padding: 1rem 0;
  }
  .post-content :global(h4) {
    padding: 0.5rem 0;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    padding-left: 2rem;
  }

  .post-content :global(li) {
    padding: 0.5rem;
  }

  .post-content :global(.toc) {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--main-red);
    margin-bottom: 1rem;
  }

  .post-content :global(.toc li) {
    padding: 0.25rem;
  }

  :global(figure) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 1.5rem 0;
  }

  :global(figure img) {
    width: 100%;
  }

  :global(figcaption) {
    font-size: 0.875rem;
    color: var(--caption-grey);
    padding-top: 0.5rem;
  }
</style>
