<script lang="ts">
  import PostListView from '$lib/components/PostViews/PostListView.svelte';
  import SectionGroup from '$slib/components/Sections/SectionGroup.svelte';

  export let posts: Post[] = [];
  export let noPosts: boolean;
  export let lastPage: boolean;
  export let page: number = 1;
</script>

<SectionGroup
  sections={posts.map((post) => ({ post, id: post.id }))}
  noSections={noPosts}
  {lastPage}
  {page}
  Section={PostListView}
>
  <p slot="empty-list">No posts found!</p>
</SectionGroup>
