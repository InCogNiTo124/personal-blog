<script>
  import dark from "images/dark.png";
  import light from "images/light.png";
  import { onMount } from "svelte";
  import { theme } from "../stores/theme_store.js";

  import { LIGHT, DARK, storageTheme } from "./utils.js";
  let val = LIGHT;
  onMount(() => {
    val = localStorage.getItem(storageTheme) || LIGHT;
  });

  function toggleTheme() {
    if (process.browser) {
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
