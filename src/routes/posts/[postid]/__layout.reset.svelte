<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { LIGHT, storageTheme } from '$lib/utils';
  import { theme } from '$lib/stores/theme_store';
  import Header from '$lib/components/Header.svelte';

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

<Header />
<div id="app">
  <div id="content">
    <div id="main">
      <slot />
    </div>
  </div>
</div>
