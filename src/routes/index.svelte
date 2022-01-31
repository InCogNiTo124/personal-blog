<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    let res = await fetch('/posts.json');
    const { posts } = await res.json();

    for (const post of posts) {
      res = await fetch(`/tags/${post.id}.json`);
      const { tags } = await res.json();
      post.tags = tags;
    }

    return {
      props: {
        posts,
        noPosts: !posts.length,
      },
    };
  };
</script>

<script lang="ts">
  import PostListViewGroup from '$lib/components/PostViews/PostListViewGroup.svelte';
  export let posts: Post[];
  export let noPosts: boolean;
</script>

<PostListViewGroup {posts} {noPosts} />
