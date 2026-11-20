// @ts-check
import { defineConfig, envField } from 'astro/config';
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
  // Lead delivery secrets, read through `astro:env/server` so any adapter (Vercel now, Cloudflare
  // later) works. Optional: a channel with missing config just counts as failed (see lib/leads.ts).
  env: {
    schema: {
      TELEGRAM_BOT_TOKEN: secret(),
      TELEGRAM_CHAT_ID: secret(),
      AIRTABLE_TOKEN: secret(),
      AIRTABLE_BASE_ID: secret(),
      RESEND_API_KEY: secret(),
      MAIL_FROM: secret(),
      AIRTABLE_TABLE: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Leads',
      }),
    },
  },
  // One-page site: inlining the CSS saves a render-blocking round trip before first paint.
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
});

function secret() {
  return envField.string({
    context: 'server',
    access: 'secret',
    optional: true,
  });
}
