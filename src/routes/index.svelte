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
  export let posts: Array<Array<Post>>;

  const gridPosts = [];
  let gridRow = [];
  posts.forEach((post, idx) => {
    gridRow.push(post);
    if ((idx + 1) % 3 === 0 || idx === posts.length - 1) {
      gridPosts.push(gridRow);
      gridRow = [];
    }
  });
  posts = gridPosts;
</script>

<h1>Lorem ipsum</h1>

<div class="postgrid">
  {#each posts as postRow}
    <div class="postrow">
      {#each postRow as post}
        <div class="post">
          <a sveltekit:prefetch href={`/posts/${post.id}`}>
            <h3>{post.title}</h3>
          </a>
          <div bind:innerHTML={post.subtitle} contenteditable="false" />
          <div>{post.date}</div>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  h1 {
    width: fit-content;
    margin: auto;

    margin-bottom: 32px;
  }

  .post {
    height: 200px;
    width: 200px;
    padding: 16px;
    margin: 8px;
    border: 1px solid black;

    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  .postrow {
    display: flex;
    justify-content: flex-start;
    width: fit-content;
  }

  .postgrid {
    width: 80%;
    margin: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>
