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
  import PostFullView from '$lib/components/PostViews/PostFullView.svelte';

  export let post;
</script>

<PostFullView {post} />
