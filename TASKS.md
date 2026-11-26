# Tasks: Mavpy studio site

How this file works: the agent takes the first unchecked task under **Now**, ticks `[x]` when it's done, adds a short note under it, and moves finished work to **Done** at the bottom. Anything blocked goes under the person it waits on. M-numbers (M8, M10, M11…) are kept so old commits and notes still make sense.

## Now (unblocked)

- [ ] Lighthouse re-check on production, `/` and `/uk/`, mobile + desktop (last run 2026-11-20; since then: phone picker, bot links, carousel autoplay).
- [ ] Move hosting to Cloudflare (M8): `@astrojs/cloudflare` instead of `@astrojs/vercel`, re-enter the secrets, deploy to a `*.workers.dev` preview, re-register the Telegram webhook there. Doesn't need the domain; the domain is attached later. Vercel Hobby is non-commercial, Cloudflare's free tier allows commercial use.
  - Code done on branch `cloudflare` (2026-11-26): adapter swapped, `wrangler.jsonc` (worker `mavpy`, live at mavpy.mavpy-studio.workers.dev), `imageService: 'compile'` + `session: false` so the adapter doesn't add an Images binding or a KV namespace. Tested in local workerd (`npx wrangler dev`): pages, 404, webhook 401, form action (honeypot + validation). Left for Nikita, on the studio Cloudflare account: connect the repo, add secrets, test on workers.dev, `setWebhook`, then merge to `main` and delete the Vercel project (steps in the account-move plan). `site` stays on vercel.app until then.

## Waiting on Serhii: design

His Trello cards: **Update Figma**, **Block Design**, **Animations & Micro-interactions**, **Responsive / Adaptive**. Items come from his Figma changelist (2026-11-23, M11). Items marked _spec'd_ are described well enough to build early; Figma may only tweak values.

- Header
  - [ ] Language switcher on the right, before a new CTA button; text EN / UA, active language highlighted. _Update Figma._
- Hero
  - [ ] Entrance: heading slides up line by line from under a mask; subheading appears from blur; order heading → subheading → button → background. _Animations, spec'd._
  - [ ] Button: arrow nudges right on hover. _Animations, spec'd._
  - [ ] Background: thin grid that glows around the cursor; static fallback on touch. _Block Design._
- Trust bar
  - [ ] Client logos run left in an endless line, pause on hover, static with reduced motion. _Block Design (logos)._
- Situation
  - [ ] Orange border on card hover. _Animations, spec'd._
- Process
  - [ ] Mascot: drop the current tilt; scale up from the bottom-left corner instead. _Animations, spec'd._
  - [ ] Subheading across the full width. _Block Design._
  - [ ] Cards: lift + orange border on hover. _Animations, spec'd._
- Cases
  - [ ] Accordion: "+" that rotates into "×" instead of the chevron; smooth open; first case open by default. _Block Design, mostly spec'd._
  - [ ] Image sizes: the next card's edge visible. _Update Figma._
- Testimonials
  - [ ] Card lifts on hover; author photos. _Block Design + real testimonials._
- About
  - [ ] Build the chosen variant. A: two founders, photo + text each. B: one founder large, team in small photos, text below. _Block Design + Nikita's photo decision._
- Pricing
  - [ ] Card hover: gradient border or cursor spotlight. _Animations / Block Design._
  - [ ] Recommended tier: badge + orange border. _Block Design + which tier._
- Footer
  - [ ] Slightly darker background. _Block Design._
- Whole page
  - [ ] Other micro-animations per his references. _Animations._
  - [ ] Mobile pass. _Responsive / Adaptive._
  - [ ] "Technologies we use" block. _Block Design._

## Waiting on Serhii: content

- [ ] Real cases: 4 (2 Serhii + 2 Nikita), each captioned task → solution → result. Earlier list: ENT clinic first, then AOM (college platform), shop, maybe the tea site; Gvozdi is not a case. Replaces cases 2–5 and their "to be confirmed" facts; drop the crypto case if it isn't one of them.
- [ ] Real testimonials to replace #4–6 (Dmytro, Julia, Daria; only the first 3 are real), with photos. Natalia's avatar in higher resolution.
- [ ] Team block in two variants (two founders / founder + 4 roles).
- [ ] Ukrainian copy review (`uk.ts`, marked `// review: Serhii`). He also listed "replace fonts": already done in M9 (Inter Tight + Unbounded); ask what he means.
- [ ] Copy pass over all texts.
- [ ] Current studio email, plus access to mavpy.studio@gmail.com (for the account swap in Launch).

## Launch (M8, after the design work)

- [ ] Pick the domain: mavpy.dev (820 UAH first year, then 1220) or mavpy.com.ua (720 UAH). Buy it on Cloudflare Registrar, attach it to the Cloudflare deployment, update `site` in astro.config.mjs, re-run the `setWebhook` curl from `.env.example`.
- [ ] Airtable to mavpy.studio@gmail.com: base moved (2026-11-26); new token from the studio account on the host + local `.env`, then revoke the personal one.
- [ ] E-mail sending: Resend → Domains → add the domain (one-click DNS on Cloudflare: DKIM, SPF/MX on `send.`, DMARC `p=none`), verify, then set `MAIL_FROM="MAVPY <hello@domain>"` + `RESEND_API_KEY` on the host. Optional: Cloudflare Email Routing to forward hello@ to Gmail.
- [ ] **Allow search indexing:** set `indexable = true` in `src/pages/robots.txt.ts`, deploy, check /robots.txt lists the sitemap, submit it in Google Search Console.
- [ ] Final check on production, then retake the README screenshots (1440 px @1x, method in the M8 notes under Done).

## Later (ideas, not planned)

- [ ] Bot: AI follow-up questions and a short lead summary for the call.
- [ ] Cookie banner: a "change cookie settings" link (only matters once `PUBLIC_GA_ID` is set).

## Decisions for Nikita

Technical and setup calls that are Nikita's alone.

- Domain: mavpy.dev or mavpy.com.ua (when the design is final).
- Whether Nikita's photo goes in the team block (waiting on Serhii's two variants).
- When to move hosting to Cloudflare (can happen now, see Now).
- Studio accounts (Airtable, Resend, GA, Cloudflare hosting) move to mavpy.studio@gmail.com (agreed with Serhii 2026-11-21). Telegram bot/group and the GitHub org stay as they are (Nikita, 2026-11-26).

## To settle with Serhii

Copy, translation, prices, contact details and brand content. Nikita and Serhii decide these together. The site is the source of truth; changes come from Serhii through Figma.

- Bot questionnaire (already built): confirm the questions and button options (call slot, business, current site, budget, timing), plus the "Start over" copy (intro line, button, "already have your answers" reply).
- Auto-reply e-mail wording (`contact.autoReply`) and the cookie banner copy.
- Default language, and whether to remember the visitor's choice.
- Hero: add a stats line ("X projects · Y years · Upwork rating") and a second "See cases" button?
- Which pricing tier is recommended.
- Button extra effects: shine or magnetic?
- Testimonials autoplay: the previous card now peeks into the left gutter on desktop (Figma shows the row starting at the column).

## Done

Notes are kept: they explain why things are built the way they are.

### M0: Setup

- [x] Fill in `<FIGMA_URL>` and `<WEBFLOW_URL>` in AGENTS.md
  - Already filled in.
- [x] Connect the Figma MCP server in Claude Code and check that the file opens
  - Works. Pages: `0:1` design, `1:1424` items, `1:1886` ui-kit.
- [x] Scaffold Astro (TypeScript strict; folder isn't empty, so scaffold into a temp dir and move files in), add Tailwind v4, the Vercel adapter, sitemap and Prettier
  - Astro 7, Tailwind 4.3. `site` in astro.config.mjs is a placeholder until the domain is known. `npm run format` runs Prettier.
- [x] Sort `_raw-assets/` (from Serhii's Drive): pictures -> `src/assets/images/`, logos/icons -> `src/assets/logos|icons/`, fonts -> `public/fonts/` + `@font-face` (or Fontsource if available; check Cyrillic), favicon.svg + favicon_dark.svg -> `public/` (dark via `media="(prefers-color-scheme: dark)"`), webclip.svg -> `public/apple-touch-icon.png` 180x180. Then delete `_raw-assets/`
  - Fonts: Roboto 400/500/700, Archivo 800/900 and BBH Hegarty 400 come from Fontsource (imported in global.css). Helvetica Neue Thin isn't on Fontsource, so it's self-hosted as `public/fonts/HelveticaNeue-Thin.woff2`. **Archivo and BBH Hegarty have no Cyrillic** (neither the files nor Fontsource). Image filenames are slugified; the arrow variants are in `src/assets/icons/arrows*/`.
- [x] Private GitHub repo `mavpy-site`, first push, Vercel preview deploy
  - github.com/mavpy/mavpy (private). Auto-deploys from `main` via Vercel Git (previews for other branches) at https://mavpy-site.vercel.app/ (matches `site` in astro.config.mjs).

### M1: Audit (no code)

- [x] List every section of the page (desktop and mobile frames), with notes on layout differences, in `docs/audit.md`
  - 10 sections plus the header. Desktop `1:331`, mobile `1:904`. The Figma mobile frame has no menu; we follow Webflow's hamburger.
- [x] Compare against the live Webflow site: missing sections, interactions, animations, copy differences
  - Live site: https://mavpy.webflow.io/. No scroll animations, only a GSAP accordion and the slider. Big copy split: Figma tells a one-founder story, Webflow a two-founder one (see audit §2).
- [x] List the form fields and validation rules
  - Name, email, goal (plus honeypot, time check, locale). Rules in audit §3.
- [x] List the assets to export (images, icons, logo, OG image) and export them into `src/assets/`
  - Gaps: a full crypto screenshot, Natalia's avatar is 95 px (the Figma MCP rate limit was hit), Dmytro's photo.

### M2: Foundations

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

### M3: Layout

- [x] Header: nav, language switcher, CTA, mobile menu (accessible, closes on Esc or on a link click)
  - **No CTA**: the Figma header has none (Figma wins); the CONTACT link covers it. The language link (UA/EN, not in Figma) sits after the nav on desktop and top-left on mobile, which keeps the logo centred as in Figma. The mobile menu is a native `popover` (Esc, focus return, top layer) plus 3 lines of JS for link-click close. The language link carries the section in view as the hash. Checked at 375/768/1024/1280/1920 in EN and UK.
- [x] Footer
  - Positions within 1px of the frames at 375 and 1920. Wordmark is BBH Hegarty sized to the column (`leading-[0.7]` = cap height, so the margins equal the Figma gaps). Contacts from Figma (`src/data/site.ts`). I added a space in "INST: @mavpy_agency" (Figma has none).

### M4: Sections (one task per section, filled in from docs/audit.md)

- [x] Hero + trust bar
  - Within ~1px of both frames (measured in the browser against the exports). Kit vs frames: MORE tracking is ~1% (not 5%), statement leading is 30/46 px; note and desktop trust items use −3%/−4% tracking. The button is 58 px (`py-[15.5px]`). "clients" is sized from `hero.clientsEm` per language (uk «клієнтів» = 3.5). On /uk/, "БІЛЬШЕ" falls back to regular Roboto (no Cyrillic in Hegarty), which is part of the open font question.
- [x] Pain points ("Which of these sounds like you")
  - Cards are **equal width** (Nikita overruled Figma's 355/341/477). Desktop matches the frame (section 823 px, cards 367 px); mobile is within 1 px. On lg the cards use a subgrid so bodies line up when a uk title wraps. A `min-h` on a subgrid item doesn't grow its tracks, so the 367 px minimum sits on the body. The "situation |" tag is desktop-only and `aria-hidden`. Heading now switches to left-aligned at `lg`, not `md`.
- [x] Process ("How we do it")
  - Desktop matches the frame (section 966, header card 276, steps card 434 vs 435). Steps are equal columns (same call as the pain cards). Mobile cards use one consistent rhythm; Figma's three mobile cards each have different padding. The mascot is one 2x transparent `mascot.png` (uncut, from Nikita, 2026-11-20): whole figure on mobile; on lg a 246 px `overflow-x: clip` window with the image pulled 48 px left reproduces the desktop frame's crop. Mobile shows ~4 px more sweater per side than the frame (accepted). Desktop mascot sits flush on the card bottom (Figma leaves a 7px gap). "process |" label matches "situation |" (Figma has no bar here and "pro" in bold; Nikita asked for the bar). "hand‑offs" uses a non-breaking hyphen.
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
  - Process: show Nikita a screenshot of the polished version (desktop + mobile, EN + UK) for sign-off before ticking. List the deviations from Figma under "To settle with Serhii".
  - Signed off by Nikita. Outer rhythm within ~1px of both frames; cards are taller (desktop sand card 639 vs 609) because labels sit above fields and error lines are reserved. lg form is a 2-col grid of 3-row subgrids (label/control/error), so the button sits on the select row; the form message reuses the button's error row. Mobile has no sand card (as in the frame). Goal values are `attract|launch|care|other`. Heading got a `center` prop. Screenshots were taken via headless Chrome over CDP when the extension dropped.

### M5: Contact form

- [x] Zod schema + Astro Action + client validation
  - Pages are static, so the form calls `actions.contact` from a script (JS required). Inline errors are our own localized copy, not the browser's `validationMessage` (that follows the browser language, not the page's). Fixed a Button bug on the way: it rendered `type="button" type="submit"`, so the button never submitted.
- [x] Honeypot + time-to-submit check
  - Hidden `website` field + under 3 s from page load → fake success, nothing delivered.
- [x] Telegram + Airtable delivery (`src/lib/leads.ts`), env vars, `.env.example`
  - Both channels in parallel, success if either works. Secrets via `astro:env` (works on Cloudflare too). Personal accounts for now: bot @MavpyLeadsBot → group "Mavpy Leads", Airtable table "Mavpy Leads" (created via the meta API; the token has write scopes only, so it can't read records back). Env vars set on Vercel (Production + Preview).
- [x] Auto-reply e-mail to the visitor via Resend
  - `sendAutoReply` in leads.ts, called after a delivered lead, best effort (never fails the lead), in the visitor's language, Reply goes to the studio Gmail. No `RESEND_API_KEY` = skipped. Until the domain is verified, Resend only delivers to the account owner, so the key is in local `.env` only, **not on Vercel** (otherwise every real lead would log a 403).
- [x] Success and error states in EN and UK, then an end-to-end test on the preview deploy
  - Tested on production (mavpy-site.vercel.app): lead arrives, no channel errors. Preview URLs sit behind Vercel Authentication; the production domain doesn't.

### M6: Ukrainian

- [x] Translate all copy into `uk.ts` (natural Ukrainian), mark it for Serhii's review
  - Already written section by section in M3–M5. Checked here: same keys and array lengths as `en.ts` (only prices, brand names and URLs are identical), no hard-coded copy in components or `src/data/`, apostrophes normalised to ’. Whole file is marked `// review: Serhii`.
- [x] Ukrainian OG/meta
  - Already in `Base.astro`: localized title/description/og:title/og:description, `og:locale` uk_UA + alternate, hreflang en/uk/x-default, canonical per language. og:image is an M7 task.
- [x] Layout check with the UK text at every breakpoint
  - Headless Chrome over CDP at 375/768/1024/1280/1440/1920, EN and UK: no horizontal scroll, no clipped text, no wrapped buttons; menu and form error states checked. The hero word's letter-spacing box pokes past the viewport at 768–1280 (the ink doesn't); `html { overflow-x: clip }` already handles that. «Медична клініка» wraps on mobile because the chevron column stays reserved on the open card (intended).

### M7: Polish

- [x] Animations and hovers: start from what Webflow does, then go beyond it to design-studio-level motion (decided 2026-11-19). Not a 1:1 port
  - Before building, audit the Webflow interactions (list them), then propose a motion concept to Nikita for sign-off: scroll-reveals, staggered headline/text reveals, hero entrance, hover/cursor details, section transitions, smooth scroll. Pick what fits the brand; don't animate everything
  - Tooling: decide with Nikita (CSS scroll-driven animations + View Transitions first; a small library such as GSAP/Motion only if CSS can't do it). Say why if adding a dependency
  - Rules: only animate `transform`/`opacity`, no layout shift, no CLS/LCP regression (Lighthouse 95+ still applies), content visible without JS, full `prefers-reduced-motion` fallback (static or simple fades), keyboard/focus states not affected, check both languages
  - Webflow audit: only the GSAP accordion, the slider, and 0.3s colour hovers (no scroll interactions); all of it was already ported. Nikita signed off on: pure CSS, a hero entrance, scroll reveals, hover details, and a language cross-fade.
  - `.rise` (hero, load-time, staggered by `--d`; the "MORE" bar wipes in), `.reveal` (`animation-timeline: view()`, staggered per row by `--i`), and `@view-transition` for EN⇄UK; all live in global.css inside `prefers-reduced-motion: no-preference` (verified: 0 animations under reduce). Reveals use `transform`, hover lifts use `translate`, so they compose. h2 reveals come from Heading.astro. Scroll-driven reveals replay when you scroll back up and are static in Firefox. Desktop testimonial cards don't reveal (their view timeline binds to the horizontal scroller), which is harmless. Hovers: card lift (pain, pricing), case-link arrow nudge, underline draw on nav/footer links, mascot tilt. Card got a `style` prop.
- [x] Image optimisation, lazy loading, font preloads
  - Already in place: WebP via `<Image>`, width/height on every img, `loading="lazy"` + `decoding="async"`, no images above the fold (LCP is the "clients" text). Fixed `sizes` on the case screenshots and Serhii's photo from measured widths: they claimed 290/327 px below lg but render up to 933/975 px on tablets (blurry at 2x); srcsets widened to match. Checked the chosen candidate at 600/768/1024/1440 (beware: Chrome reuses a larger cached candidate, so test on a fresh cache). Preloads in Base.astro: Helvetica Thin (LCP) + Hegarty/Roboto-500 latin on EN, Roboto Cyrillic 400/500 on /uk/; `?url` imports resolve to the same hashed files as the CSS, and there are no "preloaded but unused" warnings. Skipped AVIF (WebP already passes Lighthouse; add `<Picture formats>` if the image weight shows up). Still 1x: Natalia's avatar (asset ask); the mascot is 2x since 2026-11-20.
- [x] Accessibility pass (keyboard, contrast, landmarks, alt text)
  - Lighthouse a11y 100 with no failed audits on both pages; landmarks, heading order, alt text, labels, focus ring and reduced motion were already right. Fixed: the language link's name now contains its visible text ("UA, Українською", WCAG 2.5.3); the mobile menu makes the page behind it `inert` (a popover isn't modal, so Tab used to walk onto hidden content; `beforetoggle`, so focus can return to the menu button); the submit button gets focus back after a failed send (disabling it dropped focus to body); `grey-light` went from #a0a0a0 to #949494 so the field underline reaches 3:1 (WCAG 1.4.11); soft hyphen in «Крипто­компанія» (one 231 px word overflowed every case card at 320 px). Checked with puppeteer-core from the scratchpad (not a project dependency).
- [x] Lighthouse 95+ on `/` and `/uk/`, mobile and desktop
  - Local build behind a gzip server (`npx serve`), Lighthouse 12, two runs each: mobile 96 EN / 95 UK, desktop 100/100; a11y, best practices, SEO 100 everywhere; CLS 0, TBT 0. Started at mobile 85/78. Fixes: (1) `src/styles/fonts.css` replaces the Fontsource imports with only the faces we use (Roboto latin+cyrillic, Archivo/Hegarty latin, woff2 only, unicode-range kept): 50 @font-face blocks → 13, CSS 94 → 46 KB; Fontsource's per-subset CSS files can't be used because they drop unicode-range. (2) `build.inlineStylesheets: 'always'`: no render-blocking CSS request. (3) Helvetica Neue Thin subset with pyftsubset and split latin 22 KB / cyrillic 10 KB (was 105 KB, preloaded on every page); regenerate from git history if more glyphs are needed. (4) Logos through svgo (precision 2, viewBox kept): 11 → 3.8 KB each, inlined 3×; pixel-diffed against the originals. Tried dropping the Roboto preloads: no gain, kept. The LCP element is the small UA link because the hero fades in from opacity 0 (Chrome skips those); it's harmless. Production (mavpy-site.vercel.app, 2026-11-20, two mobile runs): mobile 98–99 EN / 99–100 UK, desktop 100/100, other scores 100. TBT 40–170 ms varies between runs (local CPU noise).
- [x] Favicon set, OG image, robots.txt, 404 page
  - Favicons: the existing light/dark SVGs + apple-touch-icon, plus `favicon.ico` (16/32/48, rendered from favicon.svg in Chrome) for clients that request /favicon.ico. No web manifest (not an installable app). OG: `public/og.jpg` 1200×630 (63 KB), cropped from Figma `6:9` (top 48 px of grunge dropped), one image for both languages with localized `og:image:alt`, plus `twitter:card`. `robots.txt` is an endpoint built from `site`; it says `Disallow: /` until launch (Nikita, 2026-11-20: keep the preview out of search), flipped in M8. 404: one bilingual page (the host serves the same file for /uk/... too), `noindex`, no canonical/hreflang/og:url (Base got `title`/`noindex` props); big "404" in Hegarty like the hero. Header/footer nav links are now `/#id` / `/uk/#id` so they work from the 404; on the home page they still scroll in place (checked: same document).

### M9: Review answers (2026-11-21)

- [x] Contact subline: "from $500" -> "from $700"
- [x] Form goal "Revamp your website" -> "Care plan" (id `care`)
  - Airtable already sends with `typecast: true`, so the new "Care plan" select option is created on the first lead; old records keep "Revamp your website".
- [x] About "Five years" computed from 2021 at build time
  - `studioYears` in en.ts; words for 5–10, digits after that; uk plural via `Intl.PluralRules('uk')` (рік/роки/років). Pages are static, so it updates on the next deploy after New Year. The footer's "2021-2026" is still hard-coded.
- [x] Testimonials: swipeable scroll-snap carousel on mobile
  - One scroller at every size now: mobile cards are 88% wide so the next one peeks, plus a "2 / 6" counter below; desktop arrows unchanged. `.reveal` moved from the cards to the list (a view timeline inside a horizontal scroller never fires). Reduced motion: `scroll-behavior: auto`.
- [x] Placeholder avatars (Dmytro, Julia, Daria): initials circles in orange-ramp tints, `TODO(photo)`
  - Rendered from the name (Cyrillic initials on /uk/), no image files; `placeholder.svg` deleted.
- [x] Ukrainian heading fonts: Cyrillic look-alikes for Archivo and BBH Hegarty, only on `lang="uk"`
  - Nikita picked Inter Tight + Unbounded 900 (over Onest + Dela Gothic One). `:root:lang(uk)` swaps the tokens in global.css: Inter Tight for whole display headings; Hegarty stays first with Unbounded behind it (Cyrillic faces only), so the Latin footer wordmark keeps Hegarty. Unbounded's 900 file is declared as weight 400 because Hegarty text asks for 400. On /uk/ it's preloaded instead of Roboto Cyrillic 400. «БІЛЬШЕ» fits from 320 to 1920 with no overlap; EN loads none of the new files.
- [x] Hero bar merged with the first letter of MORE / БІЛЬШЕ, same height as the letters (Nikita, 2026-11-21)
  - The bar is a run of the font's own I glyphs (`aria-hidden`), not a box: Chrome snaps box backgrounds to whole pixels but draws text at sub-pixel positions, so a box was up to 1 device px off. Glyphs step by exactly half their ink width so every pixel is covered twice and the edges stay smooth. Measured at 2x from 320 to 1920 in both languages: same top and bottom rows as the letters; effective edges within 0.25 device px. `--color-ink` removed (the bar now uses the text colour).
- [x] GA4 prepped but off: `PUBLIC_GA_ID` + cookie banner (EN/UK)
  - `components/Consent.astro`, rendered from Base only when the var is set. Consent Mode v2 defaults all denied; Accept grants `analytics_storage` only (no ads). gtag.js is never requested before Accept; choice in localStorage (`mavpy-consent`). No "change cookie settings" link yet: clearing site data brings the banner back.

### M10: After Serhii's call (2026-11-21)

- [x] Contact form: phone field
  - Required phone (placeholder/hint `+380…`, accepts any international number, validated by Zod on the server too); email becomes optional; the form rejects a submit with neither phone nor email filled, with an inline error in EN and UK.
  - Phone appears in the Telegram message and in a new Airtable "Phone" field (add the column by hand first: `typecast` creates select options, not fields).
  - Changed on the way (Nikita, 2026-11-23): phone **and** email are both required, and the goal field is gone (the bot asks it). Phone = country-code picker (transparent native select over a "🇺🇦 +380" label; names from `Intl.DisplayNames`, flags from the ISO code; RU/BY left out) + national number. `toE164` in `src/data/phone.ts` is shared by the form and the server: drops a trunk 0 (not for IT), a typed "+…" wins over the picker, 8–15 digits; leads carry `+380671234567`. Auto-reply lost its goal box. Fields now show focus as a 2px underline instead of the global ring. **Before deploying: add the Airtable "Phone" column** (the old "Goal" column is no longer written).
- [x] Telegram confirmation for the visitor
  - Each lead gets a `leadId`; the success card shows an "Open in Telegram" button linking to `t.me/<BOT_USERNAME>?start=<leadId>` (`TELEGRAM_BOT_USERNAME` in env and `.env.example`).
  - Bot webhook as an Astro API route, rejecting requests without the right `X-Telegram-Bot-Api-Secret-Token`: on `/start <leadId>` it replies with a confirmation in the lead's language and saves the chat id to that Airtable record. No Make. (A bot can't message someone by phone number; they have to start the bot first.)
  - The auto-reply e-mail carries the same "Open in Telegram" link (`t.me/<BOT_USERNAME>?start=<leadId>`) as the success card (Nikita, 2026-11-23). It goes live with the e-mail once the domain is verified in Resend (M8).
  - Done: leadId = the Airtable record id (no Airtable = no id = no button). Webhook `src/pages/api/telegram.ts`: private chats only, replies in the response body (no extra API call), saves the chat id with a PATCH whose response also gives Name + Locale (the write-only token is enough). Unknown or missing lead → a "leave a request" reply with the site link. Tested locally: 401 without the secret, group ignored, unknown/bad ids → hello in en/uk. Happy path tested on production 2026-11-23: live form action → deep link → simulated `/start` → chat id saved, confirmation in the lead's language (uk over the user's en). Done 2026-11-23: `TELEGRAM_BOT_USERNAME` (MavpyLeadsBot) + `TELEGRAM_WEBHOOK_SECRET` set on Vercel (Production + Preview; the secret is also in local `.env`), webhook registered to mavpy-site.vercel.app/api/telegram (re-run the `.env.example` curl when the domain changes in M8). Airtable text column "TelegramChatId" added by Nikita and checked with a throwaway record (create → PATCH → delete): the PATCH returns Name + Locale as expected. Table id `tblyBJ6ZJQ3NXHG1X` (the meta API's field endpoints need it; the token can't read the schema).
- [x] Bot pre-call questionnaire (depends on the Telegram confirmation task)
  - Flow updated 2026-11-23 (Nikita). After `/start <leadId>` and the confirmation, in the lead's language, each step with "Skip":
    1. "Thanks! We'll contact you soon, the call takes 15 minutes max. What time suits you best?" Buttons: 11:00–13:00 / 15:00–16:00 / 18:00–19:00 / Other. Saved as "CallSlot": a preferred slot only, no calendar booking.
    2. Business domain, broad rather than specific: Healthcare / Beauty & wellness / E-commerce / Education / Services / Other (free text).
    3. Current website: link or "none".
    4. Budget: under 10 000 UAH / 10–20 000 / more / not sure.
    5. Launch timing: urgent / 1–2 months / no rush.
  - Ends with a short "Done" message. All copy in en.ts/uk.ts.
  - Answers go to the same Airtable record (new fields: CallSlot, Business, CurrentSite, Budget, Timing, Step; later Redone, see below, AnswersUpdated: date+time, Kyiv, set each time a round is finished, and PreviousAnswers: long text, JSON snapshot taken at Start over so the updated summary bolds what changed). The current question is stored in "Step", so the serverless webhook stays stateless. One summary message goes to the studio group when the lead finishes or abandons (e.g. "Lead X: 15–16, healthcare, no site, 10–20k UAH"). No Make.
  - Done 2026-11-23 in `src/pages/api/telegram.ts`. The confirmation stays as it was, with the intro + first question in the same message. Each question has option buttons (+ "Other" on time/business) and "Skip"; typed text answers the current question. Taps on an old question are ignored. Airtable stores button answers in English. The token now has `data.records:read` (lookup by TelegramChatId, newest by `Created`) and schema write; the 6 text columns were created through the meta API. Summary to the group only on finish (abandoned = answers stay in Airtable, no ping). Tested locally with a throwaway record (deleted). Production webhook re-registered with `callback_query` (checked 2026-11-23).
- [x] Testimonials: infinite carousel
  - Arrows and swipe wrap around (last → first, first → last); arrows are never disabled; the "n / N" counter stays correct.
  - Done 2026-11-23: items render 3× (outer copies `inert`), start on the middle copy, jump back one copy's width 150 ms after scrolling stops. On desktop the previous card now peeks into the left gutter. Also drifts left on its own (`SPEED` = 30 px/s; Nikita, 2026-11-23): paused on hover, focus, for 3 s after a touch, off-screen; off with reduced motion.
- [x] Testimonial #1 (Natalia) project line: "Full redesign" → "Design and development" in EN and UK.
- [x] Rename the bot to "Mavpy bot" in @BotFather (Nikita; shows as "Mavpy Bot").

### After the reorganisation (2026-11-23)

- [x] Footer "2021-2026": end year computed at build time (`yearRange` in en.ts, shared with uk.ts). Static pages, so it changes on the first deploy after New Year.

### M8: Launch (done so far)

- [x] Send Serhii the preview link plus the review list (copy, translation, team section)
  - He reviewed the preview on the 2026-11-21 call.
- [x] Apply his fixes
  - Tracked as M9 and M10.
- [x] README: stack, env vars, how to edit copy and translations, plus screenshots saved in `docs/screenshots/` and embedded in the README
  - README written (2026-11-20). Screenshots: desktop only (Nikita, 2026-11-20), 1440 px @1x from production: hero EN + UK, plus how-we-work, cases, pricing, contact sections (DevTools script: scrolls the page first for lazy images, grows the viewport to the section height or off-screen parts render blank).
- [x] Bot: start the questionnaire over (Nikita, 2026-11-23: a misclick shouldn't be final)
  - The intro says "Tapped the wrong answer? Send /start to begin again." A repeat `/start`, typed or from the link, finds the chat's newest lead (`findChatLead`, now including finished ones). If the questionnaire is finished, the bot says it has the answers and shows a "Start over" button. If it's half done, it carries on with that button under the current question. Start over clears the 5 answers and asks again. The studio summary after a redo says "Questionnaire (updated)": the tap writes `Redone = yes`, a text column added through the meta API (separate, non-fatal write). Pushed 2026-11-23; not yet tried in real Telegram.
