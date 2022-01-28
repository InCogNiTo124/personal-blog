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

<h1>{post.title}</h1>

<div class="post-content" bind:innerHTML={post.content} contenteditable="false" />
