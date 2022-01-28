<script>
  import { browser } from '$app/env';
  import dark from '/images/dark.png';
  import light from '/images/light.png';
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme_store';

  import { LIGHT, DARK, storageTheme } from '$lib/utils';
  let val = LIGHT;
  onMount(() => {
    val = localStorage.getItem(storageTheme) || LIGHT;
  });

  function toggleTheme() {
    if (browser) {
      val = val === LIGHT ? DARK : LIGHT;
      theme.set(val);
    }
  }
</script>

<img on:click={toggleTheme} src={val === LIGHT ? dark : light} alt={`${val} icon`} />

<style>
  img {
    cursor: pointer;
    height: 2rem;
  }
</style>
