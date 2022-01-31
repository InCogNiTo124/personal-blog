<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page, fetch }) => {
    let res = await fetch(`/posts/${page.params.postid}.json`);
    const { post } = await res.json();

    res = await fetch(`/tags/${post.id}.json`);
    post.tags = (await res.json()).tags;
    
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
