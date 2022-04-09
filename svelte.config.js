import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    vite: () => ({
      resolve: {
        alias: {
          $slib: path.resolve('./submodule/lib'),
        },
      },
      server: {
        fs: {
          allow: ['./src', './static', './submodule', './node_modules', './.svelte-kit'],
        },
      },
    }),
  },
};

export default config;
