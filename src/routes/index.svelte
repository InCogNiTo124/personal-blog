<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch, url: { searchParams } }) => {    
    let res = await fetch(`/api/getters/posts/${searchParams.get('page') || 1}.json`);
    const { posts, lastPage } = await res.json();

    for (const post of posts) {
      res = await fetch(`/api/getters/tags/${post.id}.json`);
      const { tags } = await res.json();
      post.tags = tags;
    }

    return {
      props: {
        posts,
        noPosts: !posts.length,
        page: Number(searchParams.get('page')) || 1,
        lastPage,
      },
    };
  };
</script>

<script lang="ts">
  import PostListViewGroup from '$lib/components/PostViews/PostListViewGroup.svelte';
  export let posts: Post[];
  export let page: number;
  export let noPosts: boolean;
  export let lastPage: boolean;
</script>

<PostListViewGroup {posts} {noPosts} {page} {lastPage} />
