import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $slib: path.resolve('/submodule/lib'),
    },
  },
  server: {
    port: 3000,
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
};

export default config;
