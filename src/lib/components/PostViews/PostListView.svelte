<script lang="ts">
  import { SELF } from '$slib/utils';
  import Tags from '$slib/components/Filters/Tags.svelte';
  import Section from '$slib/components/Sections/Section.svelte';

  interface Props {
    post: Post;
  }

  let { post }: Props = $props();
</script>

<Section url={`/posts/${post.id}`} urlTarget={SELF} title={post.title}>
  {#snippet body()}
    <div >
      <p class="subtitle">
        {@html post.subtitle}
      </p>
      <p class="date">
        {post.date}
      </p>
      <Tags tags={post.tags} />
    </div>
  {/snippet}
</Section>

<style scoped lang="css">
  .date {
    font-style: oblique;
    font-size: 0.875rem;

    padding-bottom: 0.375rem;
  }

  .subtitle {
    padding-bottom: 0.75rem;
  }
</style>
