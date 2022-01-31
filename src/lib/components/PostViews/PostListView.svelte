<script lang="ts">
  import { browser } from '$app/env';
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme_store';
  import { BLANK, LIGHT, storageTheme } from '$lib/utils';

  let themeValue = LIGHT;

  export let post: Post;

  onMount(() => {
    if (browser) {
      theme.subscribe((newval) => {
        themeValue = newval;
      });

      themeValue = localStorage.getItem(storageTheme) || LIGHT;
    }
  });
</script>

<div class="section {themeValue}">
  <h3>
    <a href={`/posts/${post.id}`} sveltekit:prefetch>
      <div>
        {post.title}
      </div>
    </a>
  </h3>
  <div>
    <p>
      {@html post.subtitle}
    </p>
    <br />
    <p class="date">
      {post.date}
    </p>
  </div>
</div>

<style scoped>
  .section {
    padding: 20px 0;
    margin: 10px 0;
    padding: 10px 5px;
    padding-left: 15px;
    opacity: 1;
  }

  .section h3 {
    width: max-content;
  }

  .section h3 div {
    padding: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid black;
  }

  .dark-theme h3 div {
    border-bottom: 1px solid white;
  }

  .section h3 div:hover {
    border-color: rgba(218, 0, 0, 1);
  }

  .section div {
    padding-left: 5px;
  }

  .date {
    font-style: oblique;
    font-size: 0.875rem;
  }
</style>
