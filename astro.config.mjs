// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://threadradar.xyz',
  integrations: [sitemap()],
  output: 'static',
});
