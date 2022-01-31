<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cubicInOut as cubic } from 'svelte/easing';

  import PostListView from '$lib/components/PostViews/PostListView.svelte';
  import Loader from '$lib/components/Loader.svelte';

  export let posts: Post[] = [];
  export let noPosts: boolean;
</script>

<div>
  {#each posts as post, i}
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
</div>

<style>
  .empty-message {
    padding-left: 1rem;
    padding-top: 2rem;
  }
</style>