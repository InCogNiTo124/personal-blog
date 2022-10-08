<script lang="ts">
  import PostFullView from '$lib/components/PostViews/PostFullView.svelte';

  export let data: {
    post: Post;
  };
</script>

<PostFullView {...data} />
