<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { LIGHT, storageTheme } from '$lib/utils';
  import { theme } from '$lib/stores/theme_store';

  onMount(() => {
    if (browser) {
      theme.useLocalStorage();
      theme.subscribe((newval) => {
        document.getElementById('body').setAttribute('class', newval);
      });
      document
        .getElementById('body')
        .setAttribute('class', localStorage.getItem(storageTheme) || LIGHT);
    }
  });
</script>

<div id="app">
  <div id="content">
    <div id="main">
      <slot />
    </div>
  </div>
</div>

<style>
  #content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  #app {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: start;
    font-size: larger;
    height: 100vh;
  }

  #main {
    text-align: justify;
    padding: 30px 10px;
  }

  @media screen and (min-width: 650px) {
    #app {
      flex-direction: row;
      justify-content: center;
    }
    #content {
      display: flex;
      flex-direction: column;
      width: 750px;
      padding-top: 50px;
    }
  }
</style>
