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
- [x] Testimonials (scroll-snap row + arrows)
  - Within ~1px of both frames (desktop: cards 483×451, section 872 vs 873; mobile: cards 305, section 1641 vs 1642). Figma's 4 testimonials. Mobile stacks (cards capped at 483 px on tablets); lg is a scroll-snap row that runs edge to edge but snaps to the column, using a `--bleed` var in `cqw` (vw includes the scrollbar; % in `scroll-padding` is relative to the scroller). **Arrows aren't in Figma** (Webflow has them): two 48 px circles beside the subtitle, disabled at the ends. Quotes break per sentence on desktop as in the frame (except card 1's two manual breaks). Typographic quotes (“ ” / « ») instead of Figma's mixed ones. Bram's avatar was cropped to him alone (the file had two people). Dmytro is still a grey-circle placeholder.
- [x] About / team
  - Desktop matches the frame exactly (panel 1226×522, card 434, photo 356×434, section 1014); mobile section 1244 = frame. One founder, as in Figma. lg: sand panel with Figma's uneven insets (24 left, 67 right); mobile has no panel, photo first. Card title is Archivo 32: desktop Medium with "design agency." Regular, mobile line 1 ExtraBold (reuses the h2 weight). **Added Archivo 400/500 and Roboto 400 italic** (the paragraphs are italic; without it the browser fakes a slant). Forced line breaks come from `\n` in the copy (`whitespace-pre-line`). **Mobile h2 now has −3% tracking site-wide** (Heading.astro): every mobile frame heading measured ~6% narrower than ours at the same cap height.
- [x] Pricing
  - Desktop within 1px of the frame (cards 392×487 vs 486, section 871 vs 870, button 160 wide); mobile cards 432 = frame, section 1614 vs 1613. Figma prices ($500/$700/$800) and card 3's desktop title "Revamp your website" (mobile Figma says "Refresh an outdated site"). Card titles are Archivo Medium 32/28 (stems match the about title). On lg each card is a 4-row subgrid (title, "You get", list, price row), so rows line up when a uk title wraps; the price never breaks, and the button drops under it when the row is too narrow (uk at 1024). Mobile button overrides use `max-lg:` so they beat Button's own `py`/`text` classes regardless of CSS order. Each "Get my estimate" link has the card title as sr-only text, so the three links are distinguishable. They link to `#contact`; pre-selecting the goal is planned for M5.
- [x] Contact section (UI only): **polish it to match the rest of the design system; don't copy the frame exactly** (decided 2026-11-19: the Figma contact block looks unfinished). Keep the frame's structure, copy and section rhythm (outer spacing, sand card with the orange left border, white form card). Rebuild the details using patterns other sections already use. Issues seen in the frames:
  - **Heading:** on desktop it's centred and lighter than every other h2. Use the shared `Heading` (ExtraBold, the same size and tracking as other sections). Centred is fine here because it's the closing call to action, but decide that on purpose.
  - **Subline:** forced line breaks on mobile and a smaller size than body text elsewhere. Use the standard subline style with natural wrapping.
  - **Fields don't match each other:** desktop has tiny 260×24 outlined boxes, mobile has underlines. The goal select puts its label inline, with 14 px text and a thin chevron. Use one field style at every breakpoint (the underline from `Input.astro`): label above, body-size value, full column width, and the same chevron as the cases accordion.
  - **Desktop grid:** the 2×2 grid leaves dead space (fields fill about half of each column), and the button is the small variant floating next to the select. Make the fields fill their columns. Put the button on the select's row, aligned to the field baseline or bottom, or span it across the full width. Use the `lg` button as in the hero, since this is the page's main CTA.
  - **Mobile:** the field right inset is larger than the left. Use symmetric card padding, the same as the other mobile cards.
  - **States the frame doesn't show:** design hover, focus-visible, invalid with an inline error, disabled/loading on the button, and a slot for the form-level success/error message. Reserve space so the layout doesn't jump. Use the existing tokens only (`error`, the orange ramp, greys).
  - Process: show Nikita a screenshot of the polished version (desktop + mobile, EN + UK) for sign-off before ticking. List the deviations from Figma under "Questions for Serhii".
  - Signed off by Nikita. Outer rhythm within ~1px of both frames; cards are taller (desktop sand card 639 vs 609) because labels sit above fields and error lines are reserved. lg form is a 2-col grid of 3-row subgrids (label/control/error), so the button sits on the select row; the form message reuses the button's error row. Mobile has no sand card (as in the frame). Goal values are `attract|launch|revamp|other`. Heading got a `center` prop. Screenshots were taken via headless Chrome over CDP when the extension dropped.

## M5: Contact form

- [x] Zod schema + Astro Action + client validation
  - Pages are static, so the form calls `actions.contact` from a script (JS required). Inline errors are our own localized copy, not the browser's `validationMessage` (that follows the browser language, not the page's). Fixed a Button bug on the way: it rendered `type="button" type="submit"`, so the button never submitted.
- [x] Honeypot + time-to-submit check
  - Hidden `website` field + under 3 s from page load → fake success, nothing delivered.
- [x] Telegram + Airtable delivery (`src/lib/leads.ts`), env vars, `.env.example`
  - Both channels in parallel, success if either works. Secrets via `astro:env` (works on Cloudflare too). Personal accounts for now: bot @MavpyLeadsBot → group "Mavpy Leads", Airtable table "Mavpy Leads" (created via the meta API; the token has write scopes only, so it can't read records back). Env vars set on Vercel (Production + Preview).
- [ ] (Optional) email via Resend
  - Blocked until the production domain exists (Resend only sends to other people from a verified domain).
- [x] Success and error states in EN and UK, then an end-to-end test on the preview deploy
  - Tested on production (mavpy-site.vercel.app): lead arrives, no channel errors. Preview URLs sit behind Vercel Authentication; the production domain doesn't.

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
- [ ] Swap Telegram bot/group and Airtable base to Mavpy accounts (only env var values change)
- [ ] Move hosting to Cloudflare (free, commercial use allowed; Vercel Hobby is non-commercial): `@astrojs/cloudflare` instead of `@astrojs/vercel`, re-enter the secrets, point DNS
- [ ] README: stack, env vars, how to edit copy and translations, plus screenshots (desktop + mobile, EN and UK) saved in `docs/screenshots/` and embedded in the README
  - Take them from the final production build, after Serhii's fixes. Capture at 1440 and 375 px.

## Asks for Nikita

- Mascot (Figma `1:512`): 2x PNG with a transparent background, cropped as in the desktop frame. The current one is a 1x cut-out from Webflow.

## Questions for Serhii

- Leads go to a Telegram group (bot) + an Airtable table. Who should be in the group, and whose Airtable workspace should own the base? Is email (Resend) also wanted?
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
- Testimonial project lines read oddly in English ("about full redesign site", "about design and develop"). Keep as in Figma, or rewrite (e.g. "Full redesign", "Design and development")?
- About: "Founded 2022" here vs "since 2021" on Webflow, and "Three years in" (2022 + 3 = 2025). Which year, and should the count update itself?
- Contact section: the Figma block looked unfinished, so we restyled it to match the rest of the site: shared heading style, one underline field style on all screens, a full-size button, and designed error/loading states. Structure and copy are unchanged. OK?
- Testimonials on desktop: we added ‹ › arrows (Webflow has them, Figma doesn't) so mouse users can scroll the row. OK?
