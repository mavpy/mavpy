# Tasks: Mavpy studio site

The agent works top to bottom, ticks `[x]` when a task is done, and adds short notes under it.

## M0: Setup

- [x] Fill in `<FIGMA_URL>` and `<WEBFLOW_URL>` in AGENTS.md
  - Already filled in.
- [x] Connect the Figma MCP server in Claude Code and check that the file opens
  - Works. Pages: `0:1` design, `1:1424` items, `1:1886` ui-kit.
- [x] Scaffold Astro (TypeScript strict; folder isn't empty, so scaffold into a temp dir and move files in), add Tailwind v4, the Vercel adapter, sitemap and Prettier
  - Astro 7, Tailwind 4.3. `site` in astro.config.mjs is a placeholder until the domain is known. `npm run format` runs Prettier.
- [x] Sort `_raw-assets/` (from Serhii's Drive): pictures -> `src/assets/images/`, logos/icons -> `src/assets/logos|icons/`, fonts -> `public/fonts/` + `@font-face` (or Fontsource if available; check Cyrillic), favicon.svg + favicon_dark.svg -> `public/` (dark via `media="(prefers-color-scheme: dark)"`), webclip.svg -> `public/apple-touch-icon.png` 180x180. Then delete `_raw-assets/`
  - Fonts: Roboto 400/500/700, Archivo 800/900 and BBH Hegarty 400 come from Fontsource (imported in global.css). Helvetica Neue Thin isn't on Fontsource, so it's self-hosted as `public/fonts/HelveticaNeue-Thin.woff2`. **Archivo and BBH Hegarty have no Cyrillic** (neither the files nor Fontsource). Image filenames are slugified; the arrow variants are in `src/assets/icons/arrows*/`.
- [ ] Private GitHub repo `mavpy-site`, first push, Vercel preview deploy

## M1: Audit (no code)

- [ ] List every section of the page (desktop and mobile frames), with notes on layout differences, in `docs/audit.md`
- [ ] Compare against the live Webflow site: missing sections, interactions, animations, copy differences
- [ ] List the form fields and validation rules
- [ ] List the assets to export (images, icons, logo, OG image) and export them into `src/assets/`

## M2: Foundations

- [ ] Design tokens from the UI kit (colors, type scale, spacing, radii, shadows, breakpoints) in `@theme`
- [ ] Fonts through Fontsource (with Cyrillic subsets)
- [ ] `Base.astro` layout: meta, fonts, lang, hreflang
- [ ] i18n config + `en.ts` / `uk.ts` skeleton + `utils.ts`
- [ ] UI components: Button (all variants and states), Container, Section, Heading, Input/Textarea, Card

## M3: Layout

- [ ] Header: nav, language switcher, CTA, mobile menu (accessible, closes on Esc or on a link click)
- [ ] Footer

## M4: Sections (one task per section, filled in from docs/audit.md)

- [ ] Hero
- [ ] Section 2
- [ ] Section 3
- [ ] ...
- [ ] Contact section (UI only)

## M5: Contact form

- [ ] Zod schema + Astro Action + client validation
- [ ] Honeypot + time-to-submit check
- [ ] Telegram delivery (`src/lib/leads.ts`), env vars, `.env.example`
- [ ] (Optional) email via Resend
- [ ] Success and error states in EN and UK, then an end-to-end test on the preview deploy

## M6: Ukrainian

- [ ] Translate all copy into `uk.ts` (natural Ukrainian), mark it for Serhii's review
- [ ] Ukrainian OG/meta
- [ ] Layout check with the UK text at every breakpoint

## M7: Polish

- [ ] Animations and hovers to match Webflow (with reduced-motion fallbacks)
- [ ] Image optimisation, lazy loading, font preloads
- [ ] Accessibility pass (keyboard, contrast, landmarks, alt text)
- [ ] Lighthouse 95+ on `/` and `/uk/`, mobile and desktop
- [ ] Favicon set, OG image, robots.txt, 404 page

## M8: Handoff

- [ ] Send Serhii the preview link plus the review list (copy, translation, team section)
- [ ] Apply his fixes
- [ ] Connect his domain on Vercel, then run a final check in production
- [ ] README: stack, env vars, how to edit copy and translations

## Questions for Serhii

- Where should leads go: Telegram, email, or both? Which chat or address?
- Final copy and team section: when?
- Who approves the Ukrainian translation?
- Analytics: Google Analytics, Plausible, or none?
- Archivo and BBH Hegarty have no Cyrillic glyphs. What should Ukrainian headings use? (Options: a Cyrillic-capable look-alike for /uk/, or let the browser fall back to a system font.)
- Helvetica Neue Thin is a commercial Linotype font. Does the studio have a web licence? If not, we need a free substitute.
- Production domain?
