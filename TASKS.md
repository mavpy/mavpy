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
- [x] Private GitHub repo `mavpy-site`, first push, Vercel preview deploy
  - github.com/yeldynov/mavpy-site (private). Deployed by hand at https://mavpy-site.vercel.app/ (matches `site` in astro.config.mjs).

## M1: Audit (no code)

- [x] List every section of the page (desktop and mobile frames), with notes on layout differences, in `docs/audit.md`
  - 10 sections plus the header. Desktop `1:331`, mobile `1:904`. The Figma mobile frame has no menu; we follow Webflow's hamburger.
- [x] Compare against the live Webflow site: missing sections, interactions, animations, copy differences
  - Live site: https://mavpy.webflow.io/. No scroll animations, only a GSAP accordion and the slider. Big copy split: Figma tells a one-founder story, Webflow a two-founder one (see audit §2).
- [x] List the form fields and validation rules
  - Name, email, goal (plus honeypot, time check, locale). Rules in audit §3.
- [x] List the assets to export (images, icons, logo, OG image) and export them into `src/assets/`
  - Gaps: a full crypto screenshot, Natalia's avatar is 95 px (the Figma MCP rate limit was hit), Dmytro's photo.

## M2: Foundations

- [x] Design tokens from the UI kit (colors, type scale, spacing, radii, shadows, breakpoints) in `@theme`
  - Figma MCP was rate-limited, so tokens come from Nikita's UI-kit screenshots plus pixel sampling of the full-res frames (sips → BMP → read pixels). Neutrals and `#ffab01` are confirmed; the 4 other orange ramp shades are eyeballed (`TODO(figma)`). Type sizes are fluid `clamp()` between the 375 and 1280 values. Breakpoints: Tailwind defaults (md 768, lg 1024, xl 1280); there's no custom set in the kit.
  - "MORE" is **BBH Hegarty** 135 (not Archivo); h2 is Archivo ExtraBold 64/60; body is Roboto 23.
- [x] Fonts through Fontsource (with Cyrillic subsets)
  - The weights already installed match the UI kit exactly. Roboto ships Cyrillic via unicode-range. Archivo/Hegarty stacks fall back to Roboto for Cyrillic until Serhii decides. Helvetica is registered as `Helvetica Neue Thin` so a locally installed Helvetica Neue can't hijack it.
- [x] `Base.astro` layout: meta, fonts, lang, hreflang
  - og:image comes in M7. Skip link included.
- [x] i18n config + `en.ts` / `uk.ts` skeleton + `utils.ts`
  - Rich text is stored as parts (`{ before, em, after }`) instead of HTML strings. Both pages render `components/Home.astro`.
- [x] UI components: Button (all variants and states), Container, Section, Heading, Input/Textarea, Card
  - Button: lg/sm, `block`, hover/active/disabled/aria-busy. The state→colour mapping of the kit ramp is a guess (hover `orange-300`, active `orange-700`, disabled `orange-200`). No Textarea: the form has no message field (audit §3); Input does `input` and `select`. Not visually checked yet; that happens when sections use them in M4.

## M3: Layout

- [x] Header: nav, language switcher, CTA, mobile menu (accessible, closes on Esc or on a link click)
  - **No CTA**: the Figma header has none (Figma wins); the CONTACT link covers it. The language link (UA/EN, not in Figma) sits after the nav on desktop and top-left on mobile, which keeps the logo centred as in Figma. The mobile menu is a native `popover` (Esc, focus return, top layer) plus 3 lines of JS for link-click close. The language link carries the section in view as the hash. Checked at 375/768/1024/1280/1920 in EN and UK.
- [x] Footer
  - Positions within 1px of the frames at 375 and 1920. Wordmark is BBH Hegarty sized to the column (`leading-[0.7]` = cap height, so the margins equal the Figma gaps). Contacts from Figma (`src/data/site.ts`). I added a space in "INST: @mavpy_agency" (Figma has none).

## M4: Sections (one task per section, filled in from docs/audit.md)

- [x] Hero + trust bar
  - Within ~1px of both frames (measured in the browser against the exports). Kit vs frames: MORE tracking is ~1% (not 5%), statement leading is 30/46 px; note and desktop trust items use −3%/−4% tracking. The button is 58 px (`py-[15.5px]`). "clients" is sized from `hero.clientsEm` per language (uk «клієнтів» = 3.5). On /uk/, "БІЛЬШЕ" falls back to regular Roboto (no Cyrillic in Hegarty), which is part of the open font question.
- [x] Pain points ("Which of these sounds like you")
  - Cards are **equal width** (Nikita overruled Figma's 355/341/477). Desktop matches the frame (section 823 px, cards 367 px); mobile is within 1 px. On lg the cards use a subgrid so bodies line up when a uk title wraps. A `min-h` on a subgrid item doesn't grow its tracks, so the 367 px minimum sits on the body. The "situation |" tag is desktop-only and `aria-hidden`. Heading now switches to left-aligned at `lg`, not `md`.
- [x] Process ("How we do it")
  - Desktop matches the frame (section 966, header card 276, steps card 434 vs 435). Steps are equal columns (same call as the pain cards). Mobile cards use one consistent rhythm; Figma's three mobile cards each have different padding. The mascot is a **temporary 1x cut-out from Webflow** (`mascot-cutout.png`, `TODO(asset)`); `mascot.png` (Figma 1:512) has a beige background, so it can't be used. Desktop mascot sits flush on the card bottom (Figma leaves a 7px gap). "process |" label matches "situation |" (Figma has no bar here and "pro" in bold; Nikita asked for the bar). "hand‑offs" uses a non-breaking hyphen.
- [x] Cases (exclusive accordion, `<details name>`)
  - Within ~1px of the desktop frame (open card 826, closed 203, mat insets, chevron) and ~1–3px of mobile. `<details name="cases">` does the exclusive accordion; a 3-line script keeps the open card from closing (as on Webflow); closed cards are clickable anywhere. Height animates via `interpolate-size` (Chrome; others snap). Figma's open and closed cards disagree on offsets, so both use the closed values (no title jump). Link is black + orange ↗ on mobile too (Figma mobile's #ff6b31 fails contrast on sand). Titles are Roboto on mobile as well (the mobile frame looks like Archivo). Cropped a 27px black capture bar off the clinic and massage screenshots. Cases 2–5 show "to be confirmed" facts and a non-link "View live site" until Serhii sends facts and URLs.
- [ ] Testimonials (scroll-snap row + arrows)
- [ ] About / team
- [ ] Pricing
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

- [ ] Animations and hovers: start from what Webflow does, then go beyond it to design-studio-level motion (decided 2026-11-19). Not a 1:1 port
  - Before building, audit the Webflow interactions (list them), then propose a motion concept to Nikita for sign-off: scroll-reveals, staggered headline/text reveals, hero entrance, hover/cursor details, section transitions, smooth scroll. Pick what fits the brand; don't animate everything
  - Tooling: decide with Nikita (CSS scroll-driven animations + View Transitions first; a small library such as GSAP/Motion only if CSS can't do it). Say why if adding a dependency
  - Rules: only animate `transform`/`opacity`, no layout shift, no CLS/LCP regression (Lighthouse 95+ still applies), content visible without JS, full `prefers-reduced-motion` fallback (static or simple fades), keyboard/focus states not affected, check both languages
- [ ] Image optimisation, lazy loading, font preloads
- [ ] Accessibility pass (keyboard, contrast, landmarks, alt text)
- [ ] Lighthouse 95+ on `/` and `/uk/`, mobile and desktop
- [ ] Favicon set, OG image, robots.txt, 404 page

## M8: Handoff

- [ ] Send Serhii the preview link plus the review list (copy, translation, team section)
- [ ] Apply his fixes
- [ ] Connect his domain on Vercel, then run a final check in production
- [ ] README: stack, env vars, how to edit copy and translations, plus screenshots (desktop + mobile, EN and UK) saved in `docs/screenshots/` and embedded in the README
  - Take them from the final production build, after Serhii's fixes. Capture at 1440 and 375 px.

## Asks for Nikita

- Mascot (Figma `1:512`): 2x PNG with a transparent background, cropped as in the desktop frame. The current one is a 1x cut-out from Webflow.

## Questions for Serhii

- Where should leads go: Telegram, email, or both? Which chat or address?
- Final copy and team section: when?
- Who approves the Ukrainian translation?
- Analytics: Google Analytics, Plausible, or none?
- Archivo and BBH Hegarty have no Cyrillic glyphs. What should Ukrainian headings use? (Options: a Cyrillic-capable look-alike for /uk/, or let the browser fall back to a system font.)
- Helvetica Neue Thin is a commercial Linotype font. Does the studio have a web licence? If not, we need a free substitute.
- Production domain?
- Copy direction: we're building Figma's one-founder "design agency" version (decided 2026-11-19). Please confirm the Figma copy where it differs from Webflow: hero line, trust bar, process 01, about, logo text, "since 2021/2022". Details in docs/audit.md §2.
- Which contact details are current? Figma: mavpy_agency@gmail.com, +380 99 320 84 54. Webflow: mavpy.studio@gmail.com, +38 (099) 220 83 43.
- Prices: Figma $500 / $700 / $800 (third card "Revamp your website"), or Webflow $1000 / $700 / "Care plan" $40/m? Also, the third card's title differs between Figma desktop and mobile.
- Pain card 3: "High traffic, no enquiries" (Figma) or "Admins drown in calls" (Webflow)?
- Testimonials: Figma's 4 or Webflow's 6? Dmytro's company and quote differ.
- Facts and live URLs for cases 2–5 (only the clinic has them), plus a full screenshot of the crypto site (the open crypto card is an upscaled strip until then).
- Cases on mobile: Figma has an orange (#ff6b31) "View live site →" and Archivo-looking titles; we use desktop's black link with ↗ and Roboto titles (contrast, consistency). OK?
- Natalia's avatar in higher resolution, and Dmytro's photo.
