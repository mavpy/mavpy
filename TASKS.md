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

## M5: Contact form

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

## M6: Ukrainian

- [x] Translate all copy into `uk.ts` (natural Ukrainian), mark it for Serhii's review
  - Already written section by section in M3–M5. Checked here: same keys and array lengths as `en.ts` (only prices, brand names and URLs are identical), no hard-coded copy in components or `src/data/`, apostrophes normalised to ’. Whole file is marked `// review: Serhii`.
- [x] Ukrainian OG/meta
  - Already in `Base.astro`: localized title/description/og:title/og:description, `og:locale` uk_UA + alternate, hreflang en/uk/x-default, canonical per language. og:image is an M7 task.
- [x] Layout check with the UK text at every breakpoint
  - Headless Chrome over CDP at 375/768/1024/1280/1440/1920, EN and UK: no horizontal scroll, no clipped text, no wrapped buttons; menu and form error states checked. The hero word's letter-spacing box pokes past the viewport at 768–1280 (the ink doesn't); `html { overflow-x: clip }` already handles that. «Медична клініка» wraps on mobile because the chevron column stays reserved on the open card (intended).

## M7: Polish

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

## M8: Handoff

- [ ] Send Serhii the preview link plus the review list (copy, translation, team section)
- [ ] Apply his fixes
- [ ] Connect his domain on Vercel, then run a final check in production
- [ ] **Allow search indexing at launch:** set `indexable = true` in `src/pages/robots.txt.ts` (it's `Disallow: /` while the site is a preview), update `site` in astro.config.mjs to the real domain, deploy, then check /robots.txt lists the sitemap and submit it in Google Search Console
- [ ] Swap Telegram bot/group and Airtable base to Mavpy accounts (only env var values change)
- [ ] Domain + e-mail sending (later phase): buy the domain (Cloudflare Registrar, at cost), Resend → Domains → add it (one-click DNS on Cloudflare: DKIM, SPF/MX on `send.`, DMARC `p=none`), verify, then set `MAIL_FROM="MAVPY <hello@domain>"` + `RESEND_API_KEY` on the host. Optional: Cloudflare Email Routing to forward hello@ to Gmail. Full steps in the M5 auto-reply plan notes.
- [ ] Move hosting to Cloudflare (free, commercial use allowed; Vercel Hobby is non-commercial): `@astrojs/cloudflare` instead of `@astrojs/vercel`, re-enter the secrets, point DNS
- [x] README: stack, env vars, how to edit copy and translations, plus screenshots (desktop + mobile, EN and UK) saved in `docs/screenshots/` and embedded in the README
  - Take them from the final production build, after Serhii's fixes. Capture at 1440 and 375 px.
  - README written (2026-11-20). Screenshots: desktop only (Nikita, 2026-11-20), 1440 px @1x from production: hero EN + UK, plus how-we-work, cases, pricing, contact sections (DevTools script: scrolls the page first for lazy images, grows the viewport to the section height or off-screen parts render blank). Retake after Serhii's fixes.

## M9: Review answers (2026-11-21)

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
- [x] GA4 prepped but off: `PUBLIC_GA_ID` + cookie banner (EN/UK)
  - `components/Consent.astro`, rendered from Base only when the var is set. Consent Mode v2 defaults all denied; Accept grants `analytics_storage` only (no ads). gtag.js is never requested before Accept; choice in localStorage (`mavpy-consent`). No "change cookie settings" link yet: clearing site data brings the banner back.

## Decisions for Nikita

Technical and setup calls that are Nikita's alone.

- Production domain name (registrar: Cloudflare, at cost, per M8).
- Mavpy-owned accounts for the Telegram bot and group, Airtable, Resend and hosting: who creates and owns them? (M8 swaps the personal ones out; only env var values change.)
- When to move hosting from Vercel Hobby (non-commercial) to Cloudflare: before launch, or right after?

## To settle with Serhii

Copy, translation, prices, contact details and brand content. Nikita and Serhii decide these together. The site is the source of truth; changes come from Serhii through Figma.

- Testimonial project lines read oddly in English ("full redesign site", "design and develop", "full design and dev").
- Auto-reply e-mail wording (`contact.autoReply`) and the Ukrainian translation review (`uk.ts`, `// review: Serhii`), plus the new cookie banner copy.
- Contact details: Figma's mavpy_agency@gmail.com / +380 99 320 84 54 vs Webflow's mavpy.studio@gmail.com / +38 (099) 220 83 43.
- Assets: facts and live URLs for cases 2–5, a full crypto screenshot, Natalia's avatar in higher resolution, real photos for Dmytro, Julia and Daria.
