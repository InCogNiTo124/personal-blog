<script lang="ts">
  import PostListViewGroup from '$lib/components/PostViews/PostListViewGroup.svelte';
  export let data: {
    posts: Post[];
    page: number;
    noPosts: boolean;
    lastPage: boolean;
  };
</script>

<PostListViewGroup {...data} />
