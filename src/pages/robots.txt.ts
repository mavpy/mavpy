import type { APIRoute } from 'astro';

// TODO(M8): set to true once the real domain is live (see TASKS.md). Until then the preview
// stays out of search results: placeholder copy shouldn't get indexed under mavpy-site.vercel.app.
const indexable = false;

// Built from `site`, so the sitemap URL follows the domain when it changes (M8).
export const GET: APIRoute = ({ site }) =>
  new Response(
    indexable
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`
      : 'User-agent: *\nDisallow: /\n',
  );
