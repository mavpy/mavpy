# Mavpy studio site (Astro)

Brief for the coding agent. Planning happens in a separate chat. **TASKS.md** is the task list: read it at the start of every session, work on the first unchecked task, and tick it off when it's done.

## Goal

Port the Mavpy (Мавпы) web studio's Webflow site to code, matching the Figma design: pixel-faithful, responsive, in English and Ukrainian, with a working contact form that delivers leads automatically. It's a real client-facing site, so prioritise quality and speed. I'm also learning as I go: explain non-obvious choices briefly, in a line or two.

## Sources of truth

- **Figma:** `https://www.figma.com/design/daR2lf05KfRp9cp6oHdj02/MAVPY-for-dev?node-id=0-1&p=f&t=G6gqhxcFwnKDoFUS-0`. Frames: desktop, mobile, UI kit. Before building a section, look at its desktop and mobile frames.
  - **Don't use the Figma MCP server.** The account is on a View seat with a tiny call limit (it failed even on the first call of a session). Instead, ask Nikita for what you need: screenshots, full-res frame exports, assets, or values copied from Inspect (hex, font, size). Say exactly which node or element and what format.
  - Full-res frame exports can be measured precisely: convert with `sips -s format bmp`, then read pixels in stdlib Python (color runs for backgrounds and edges, dark-pixel row profiles for text; Roboto cap height ≈ 0.711 em). Prefer values from the UI kit when it lists them.
- **This site is now the source of truth** (decided 2026-11-20). It replaces the Webflow site. The copy was synced from Webflow once (commit `95e3cfd`); from here on, all changes come from Serhii (the designer) through Figma.
  - When Serhii updates a Figma frame, apply what changed and keep everything else as built. Where Figma differs from the site and it isn't clearly a new change, ask Nikita before overwriting.
  - Where a Figma change conflicts with how the site was built on purpose (accessibility, consistency, behaviour Figma doesn't show), keep the build and list it under "To settle with Serhii".
  - **Don't take spacing or sizes from Webflow.** It was built by hand. Measure from the Figma frames.
- **Webflow (retired):** `https://mavpy.webflow.io/`. Only a historical reference now (original behaviour, form messages, the CSS variables behind the button and form states). Don't sync copy or visuals from it.
- **Full-res frame exports** (1×) are committed in `docs/figma/`: `desktop-1-331.png` (1920 × 9269) and `mobile-1-904.png` (375 × 12561). Measure from these first; ask Nikita only for what they don't show (UI kit, hover states, assets, exact hex).
- The team section (design v3.15) shows four people: Serhii, Nikita, Julia and Marina, with photos (decided by Nikita 2026-11-27).
- Copy fixes and the team section come from Serhii. Use placeholders marked `TODO(copy)` until they arrive.

## Stack

- Astro (latest) + TypeScript (strict)
- Tailwind CSS v4 (`npx astro add tailwind`), with design tokens from the UI kit in `@theme` inside `src/styles/global.css`
- `@astrojs/cloudflare` adapter (Workers, `wrangler.jsonc`): pages are pre-rendered (static), and only the form action and the Telegram webhook run on the server
- Images through `astro:assets` `<Image />`, stored in `src/assets/`. Export them from Figma at 2x and as SVG for icons and the logo
- Fonts: the ones the UI kit uses, self-hosted through Fontsource, with only the weights we need. **They must include Cyrillic subsets**
- No UI framework. Add a small island (vanilla script, or Preact if needed) only for real interactivity such as the mobile menu or form state
- Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`

## Structure

```
src/
  layouts/Base.astro        <head>, SEO meta, hreflang, fonts, lang attribute
  components/ui/            Button, Container, Section, Heading, Card, Input... (from the UI kit)
  components/sections/      one component per page section
  i18n/en.ts, i18n/uk.ts    all copy, same keys in both (uk typed as `typeof en`)
  i18n/utils.ts             getLang(Astro.url), t(lang), localized path helper
  pages/index.astro         English (/)
  pages/uk/index.astro      Ukrainian (/uk/)
  actions/index.ts          contact form action
```

Components stay presentational: copy comes in through props or `t()`. **No hard-coded text in components.**

## i18n

- Astro built-in i18n: `defaultLocale: 'en'`, `locales: ['en', 'uk']`, `prefixDefaultLocale: false`
- URL paths use the ISO 639-1 language code, same as `hreflang` and `<html lang>`: Ukrainian is `/uk/`, not `/ua/` (`ua` is the country code). Decided 2026-11-20
- A language switcher in the header keeps the same section anchor when switching
- `<html lang>`, `hreflang` alternates, and localized `<title>`/description/OG for each language
- Ukrainian copy: draft the translation in natural Ukrainian (not word-for-word) and mark it `// review: Serhii` until it is approved
- Check the layout with the Ukrainian text, which is often 15–30% longer: no overflow and no broken buttons

## Contact form

- Astro Action with a Zod schema. Validate on the client (native constraints plus inline errors) and again on the server
- Spam protection: a honeypot field plus a minimum time-to-submit
- Delivery: **Telegram bot** message to the studio group plus an **Airtable** record; a **Resend** auto-reply to the visitor (live once the domain is verified). Secrets go in env vars (see `.env.example`), never committed
- UX: loading state, success and error messages in both languages, and the form keeps its values on error
- The delivery code lives in `src/lib/leads.ts`, so another channel (Google Sheet, CRM) can be added later

## Quality bar

- Mobile-first. Check at 375, 768, 1280 and 1440 px against the frames
- Semantic HTML, one `h1` per page, alt text on images, visible focus states, a keyboard-usable menu, and `prefers-reduced-motion` respected
- Lighthouse 95+ on all four scores, for both languages
- SEO: sitemap (`@astrojs/sitemap` with i18n), robots.txt, OG image, favicon set, canonical URLs

## Working rules

- Work one TASKS.md task at a time. When a task is done: run `npm run check` and `npm run build`, tick the box, add a one-line note if something is worth remembering, and commit with a message like `feat(hero): ...`
- Small commits, one per task or section
- Don't add dependencies beyond the ones above without saying why
- Nikita and Serhii are equal partners. **Nikita makes every technical decision** (hosting, services, accounts, architecture): recommend, and add open ones to "Decisions for Nikita" in TASKS.md. Copy, translation, prices, contact details and brand content are decided by both together: add those to "To settle with Serhii"
- When something is blocked on one of those lists, add it there and move on to the next task
- Nikita appears in the team section as a team member (name, role, photo). Don't add personal links or portfolio credits beyond that
