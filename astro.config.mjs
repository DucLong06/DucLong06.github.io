import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://duclong06.github.io — user site, deploys to `/`, no base config needed
export default defineConfig({
  site: 'https://duclong06.github.io',
  output: 'static',
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap(),
    tailwind(),
  ],
  vite: {
    ssr: {
      // OGL uses browser globals — must be bundled, not treated as external in SSR
      noExternal: ['ogl'],
    },
  },
});
