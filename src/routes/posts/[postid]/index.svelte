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

<a class={INLINE_CLASS} href="/" sveltekit:prefetch>Back to main page</a>

<h1 class="post-title">{post.title}</h1>

<div class="post-content" bind:innerHTML={post.content} contenteditable="false" />

<br />
<hr />

<a class={INLINE_CLASS} href="/" sveltekit:prefetch>Back to main page</a>

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
</style>
