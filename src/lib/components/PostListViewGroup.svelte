<script lang="ts">
  import { fade } from "svelte/transition";
  import { cubicInOut as cubic } from "svelte/easing";
  
  import PostListView from "$lib/components/PostListView.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let posts: Post[] = [];
</script>

<div>
  {#each posts as post, i}
    <div in:fade={{ easing: cubic, duration: 700, delay: i * 75 }}>
      <PostListView {post} />
    </div>
  {:else}
    <Loader />
  {/each}
</div>
