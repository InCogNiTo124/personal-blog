<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/env';
  import Cookies from 'js-cookie';

  import { LIGHT, COOKIE_KEY_THEME } from '$slib/utils';
  import { theme } from '$slib/stores/theme_store';

  import Header from '$lib/components/Header.svelte';

  onMount(() => {
    if (browser) {
      theme.useCookie();
      theme.subscribe((newval) => {
        document.getElementById('body').setAttribute('class', newval);
      });
      document
        .getElementById('body')
        .setAttribute('class', Cookies.get(COOKIE_KEY_THEME) || LIGHT);
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
