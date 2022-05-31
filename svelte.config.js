import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite: () => ({
      resolve: {
        alias: {
          $slib: path.resolve('/submodule/lib'),
        },
      },
      server: {
        fs: {
          allow: [
            './src',
            './static',
            './submodule/lib',
            './node_modules',
            './.svelte-kit',
          ],
        },
      },
    }),
  },
};

export default config;
