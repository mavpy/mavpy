// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: replace with Serhii's domain (M8). Sitemap and canonical URLs need it.
  site: 'https://mavpy-site.vercel.app',
  // Pages stay static (prerendered); only routes that opt out (the form action) run as functions.
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'uk'],
    routing: { prefixDefaultLocale: false },
  },
  // Sitemap writes hreflang alternates for each page from the same locale list.
  integrations: [
    sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', uk: 'uk' } } }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
