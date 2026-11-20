# Mavpy studio site (Astro)

Brief for the coding agent. Planning happens in a separate chat. **TASKS.md** is the task list: read it at the start of every session, work on the first unchecked task, and tick it off when it's done.

## Goal

Port the Mavpy (Мавпы) web studio's Webflow site to code, matching the Figma design: pixel-faithful, responsive, in English and Ukrainian, with a working contact form that delivers leads automatically. It's a real client-facing site, so prioritise quality and speed. I'm also learning as I go: explain non-obvious choices briefly, in a line or two.

## Sources of truth

- **Figma:** `https://www.figma.com/design/daR2lf05KfRp9cp6oHdj02/MAVPY-for-dev?node-id=0-1&p=f&t=G6gqhxcFwnKDoFUS-0`. Frames: desktop, mobile, UI kit. Before building a section, look at its desktop and mobile frames.
  - **Don't use the Figma MCP server.** The account is on a View seat with a tiny call limit (it failed even on the first call of a session). Instead, ask Nikita for what you need: screenshots, full-res frame exports, assets, or values copied from Inspect (hex, font, size). Say exactly which node or element and what format.
  - Full-res frame exports can be measured precisely: convert with `sips -s format bmp`, then read pixels in stdlib Python (color runs for backgrounds and edges, dark-pixel row profiles for text; Roboto cap height ≈ 0.711 em). Prefer values from the UI kit when it lists them.
- **Live Webflow site:** `https://mavpy.webflow.io/` (published; easiest to read with curl). The designer comments link is `https://comments.webflow.com/comment/mavpy?project=1c4379eba7be62ba92ad8f28abf12e56&workflow=comment&pageId=6ab38924dac03dc90dad24da`. Use it for copy, behaviour (menus, hovers, animations) and anything Figma doesn't show.
- **Figma wins on visuals and on copy** (decided 2026-11-19). Where they differ, use Figma and list the difference under "Questions for Serhii" so he can confirm.
  - **Webflow is fine for:** colors, fonts, UI-element styling and states (buttons, inputs), behaviour, and things Figma doesn't show (the mobile menu, form messages). Its CSS variables are in the shared stylesheet linked from the page `<head>`.
  - **Don't take spacing or sizes from Webflow.** It was built by hand and doesn't follow the design exactly. Measure spacing from the Figma frames.
- **Full-res frame exports** (1×) are committed in `docs/figma/`: `desktop-1-331.png` (1920 × 9269) and `mobile-1-904.png` (375 × 12561). Measure from these first; ask Nikita only for what they don't show (UI kit, hover states, assets, exact hex).
- The about section shows one founder (Serhii), as in Figma. There is no second co-founder or CTO block.
- Copy fixes and the team section come from Serhii. Use placeholders marked `TODO(copy)` until they arrive.

## Stack

- Astro (latest) + TypeScript (strict)
- Tailwind CSS v4 (`npx astro add tailwind`), with design tokens from the UI kit in `@theme` inside `src/styles/global.css`
- `@astrojs/vercel` adapter: pages are pre-rendered (static), and only the form action runs on the server
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
  pages/ua/index.astro      Ukrainian (/ua/; language code stays `uk`)
  actions/index.ts          contact form action
```

Components stay presentational: copy comes in through props or `t()`. **No hard-coded text in components.**

## i18n

- Astro built-in i18n: `defaultLocale: 'en'`, `locales: ['en', 'uk']`, `prefixDefaultLocale: false`
- A language switcher in the header keeps the same section anchor when switching
- `<html lang>`, `hreflang` alternates, and localized `<title>`/description/OG for each language
- Ukrainian copy: draft the translation in natural Ukrainian (not word-for-word) and mark it `// review: Serhii` until he approves it
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
- Serhii is Nikita's partner, not a client. **Nikita makes every technical decision** (hosting, services, accounts, architecture): recommend and ask Nikita. "Questions for Serhii" is only for copy, translation, prices, contact details and brand content
- When something is blocked on Serhii, add it to "Questions for Serhii" in TASKS.md and move on to the next task
- This is a private studio project: don't add my name, personal links or portfolio credits to the site
