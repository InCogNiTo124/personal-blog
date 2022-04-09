<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import { LIGHT, storageTheme } from '$slib/utils';
  import { theme } from '$slib/stores/theme_store';
  import Nav from '$lib/components/Nav.svelte';
  import Header from '$lib/components/Header.svelte';

  let segment = '';
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
  <Nav {segment} />
  <div id="content">
    <div id="main">
      <slot />
    </div>
  </div>
</div>
