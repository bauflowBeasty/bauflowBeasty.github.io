import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bauflowbeasty.github.io',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-default',
      },
    },
  },
});
