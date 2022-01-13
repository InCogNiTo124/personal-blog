<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/posts.json');
    const { posts } = await res.json();
    return {
      props: {
        posts,
      },
    };
  };
</script>

<script lang="ts">
  export let posts: Array<Post>;
</script>

<h1>Post list</h1>

{#each posts as post}
  <div class="post">
    <h2>
      <a class="title" sveltekit:prefetch href={`/posts/${post.id}`}>
        {post.title}
      </a>
    </h2>
    <div class="subtitle" bind:innerHTML={post.subtitle} contenteditable="false" />
    <br />
    <div class="date">{post.date}</div>
    <hr />
  </div>
{/each}

<style>
  h1 {
    width: fit-content;
    margin: auto;

    margin-bottom: 32px;
  }

  .post {
    display: flex;
    flex-direction: column;
  }

  .post .title {
    color: red;
  }

  .post .subtitle {
    font-size: 1.25em;
  }

  .post .date {
    font-style: oblique;
  }

  .post hr {
    width: 100%;
    border: none;
    border-top: 1px solid black;
  }
</style>
