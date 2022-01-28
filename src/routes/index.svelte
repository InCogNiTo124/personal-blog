<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/posts.json');
    const { posts } = await res.json();
    return {
      props: {
        posts,
      },
    };
  };
</script>

<script lang="ts">
  import PostListViewGroup from '$lib/components/PostListViewGroup.svelte';
  export let posts: Array<Post>;
</script>

<PostListViewGroup {posts} />
