<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cubicInOut as cubic } from 'svelte/easing';

  import PostListView from '$lib/components/PostViews/PostListView.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import Pager from '../Filters/Pager.svelte';

  export let posts: Post[] = [];
  export let noPosts: boolean;
  export let lastPage: boolean;
  export let page: number = 1;
</script>

<div>
  {#each posts as post, i (post.id)}
    <div in:fade={{ easing: cubic, duration: 700, delay: i * 75 }}>
      <PostListView {post} />
    </div>
  {:else}
    {#if noPosts}
      <div class="empty-message">No posts found!</div>
    {:else}
      <Loader />
    {/if}
  {/each}

  <Pager {page} showNext={!lastPage} />
</div>

<style>
  .empty-message {
    padding-left: 1rem;
    padding-top: 2rem;
  }
</style>
