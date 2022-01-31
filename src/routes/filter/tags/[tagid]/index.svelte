<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ page, fetch }) => {
    let { tagid } = page.params;

    let res = await fetch(`/filter/tags/${tagid}.json`);
    const { posts } = await res.json();

    let tagName = tagid;
    if (Number(tagid)) {
      res = await fetch(`/getters/tag/${tagid}.json`);
      ({ tagName } = await res.json());
    }

    return {
      props: {
        posts,
        tagName,
        noPosts: !posts.length,
      },
    };
  };
</script>

<script lang="ts">
  import PostListViewGroup from '$lib/components/PostViews/PostListViewGroup.svelte';
  export let posts: Post[] = [];
  export let tagName: string;
  export let noPosts: boolean;
</script>

<div class="tag-title">
  Filtered by tag: <span>{tagName}</span>
</div>

<PostListViewGroup {posts} {noPosts} />

<style scoped>
  div.tag-title {
    font-style: oblique;
    padding: 2rem 0 1rem 1rem;
  }

  .tag-title span {
    font-style: normal;
    font-weight: 600;
  }
</style>
