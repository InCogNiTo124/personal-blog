<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ params, fetch, url: { searchParams } }) => {
    let { tagid } = params;
    const page = parseInt(searchParams.get('page')) || 1;

    let res = await fetch(`/api/filter/tags/${tagid}/${page}.json`);
    const { posts, lastPage } = await res.json();

    let tagName = tagid;
    if (Number(tagid)) {
      res = await fetch(`/api/getters/tag/${tagid}.json`);
      ({ tagName } = await res.json());
    }

    return {
      props: {
        posts,
        tagName,
        noPosts: !posts.length,
        page,
        lastPage,
      },
    };
  };
</script>

<script lang="ts">
  import PostListViewGroup from '$lib/components/PostViews/PostListViewGroup.svelte';
  export let posts: Post[] = [];
  export let tagName: string;
  export let noPosts: boolean;
  export let page: number;
  export let lastPage: boolean;
</script>

<div class="tag-title">
  Filtered by tag: <span>{tagName}</span>
</div>

<PostListViewGroup {posts} {noPosts} {page} {lastPage} />

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
