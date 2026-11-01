import { defineConfig } from 'astro/config';
import rehypeCallouts from './src/plugins/rehype-callouts.mjs';

export default defineConfig({
  site: 'https://bauflowbeasty.github.io',
  markdown: {
    // Code is always dark, in both site themes (doc.css sets the exact background).
    shikiConfig: {
      theme: 'github-dark-default',
    },
    // > **Note** / > **Warning** (and ES) blockquotes → callout--note / callout--warn.
    rehypePlugins: [rehypeCallouts],
  },
});
