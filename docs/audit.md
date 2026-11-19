# M1 audit: Mavpy home page

Sources checked on 2026-11-19:

- **Figma** `daR2lf05KfRp9cp6oHdj02`, page `design` (`0:1`):
  - Desktop frame `1:331` (1920 × 9269)
  - Mobile frame `1:904` (375 × 12561)
  - Also on the page: a full-page capture of the old Webflow build (`2:2`, 18 Nov) and an OG thumbnail (`6:9`, 1920 × 1085)
  - The `ui-kit` page (`1:1886`) is still to read in M2
- **Webflow:** the published site at https://mavpy.webflow.io/ (same content as the comments preview).

The site is one page. The Figma layers are absolutely positioned (no auto-layout), so read spacing from coordinates. On desktop the content column is **1226 px wide, starting at x = 348**. On mobile the gutter is about 24 px.

Type: headings look like Archivo ExtraBold/Black, the "clients" word is Helvetica Neue Thin, and body text is Roboto. Confirm this against the UI kit in M2. BBH Hegarty isn't obviously used in the design frames yet.

---

## 1. Sections

Each section has a small right-aligned label ("situation |", "process", "cases |", "clients |", "about |", "pricing |"). On Webflow these labels are static text.

| #   | Section                                                       | Anchor         | Desktop                                                                                                                                                                                                                                                                                                                                               | Mobile (375)                                                                                                                                                               |
| --- | ------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | **Header**                                                    | –              | Logo on the left, 4 links on the right (HOW WE WORK, CASES, PRICING, CONTACT), uppercase Roboto. Not sticky: Webflow `nav_fixed` is `position:absolute`.                                                                                                                                                                                              | Logo centred, **no menu at all in Figma**. Webflow has a hamburger (`w-nav`) below 479 px. → We build a hamburger in the Figma style (required by AGENTS.md).              |
| 1   | **Hero**                                                      | `#top`         | Small h1 line "Conversion-focused **websites** for growing businesses". "MORE" in black display type, with a solid black bar that bleeds off the left edge. "Not just / a new / website" right-aligned, top right. Huge thin "clients" across the full width (1262 px). Bottom-right: two-line note plus the orange "Get an estimate" button.         | Everything centred and stacked: tagline, MORE (with the bar from the left edge), "clients" at full width, "Not just a new website", note, full-width button.               |
| 2   | **Trust bar**                                                 | –              | White strip, 4 items in one row.                                                                                                                                                                                                                                                                                                                      | 4 items stacked, separated by hairlines.                                                                                                                                   |
| 3   | **Pain points** ("Which of these sounds like you right now?") | `#situation`   | Beige background (`#EEEDEA`-ish). h2 plus subline. 3 white cards with different widths (355 / 341 / 477).                                                                                                                                                                                                                                             | Centred h2. 3 full-width cards, text centred.                                                                                                                              |
| 4   | **Process** ("How we do it")                                  | `#how-we-work` | Wide white header card with the monkey mascot overflowing its top-left corner, h2, short intro and the "process" label. Below it, one white card with 3 numbered columns (01–03).                                                                                                                                                                     | Mascot centred above the card. 3 separate numbered cards, centred.                                                                                                         |
| 5   | **Cases** ("Real projects, real results")                     | `#cases`       | **Accordion.** The open item has the title and type on the left, 5 labelled facts (Goal / Starting point / What we did / Timeframe / Result) and "View live site ↗" (black, orange arrow); a big screenshot sits on the right. Each closed row shows the title, type, "View live site ↗", a cropped screenshot strip and a thin "V" chevron. 5 cases. | Each case is a card: screenshot on top, then title and type, then a chevron in a grey circle, then "View live site →" in orange. The first one is open with all the facts. |
| 6   | **Testimonials** ("What it's like to work with us")           | `#clients`     | 4 cards in a horizontal row that **overflows the right edge**, so it's a slider or scroller. Each card: quote, then a grey footer with name, company, project and a round avatar.                                                                                                                                                                     | The same 4 cards stacked vertically, quotes centred.                                                                                                                       |
| 7   | **About** ("A craft studio, not a conveyor belt")             | `#about`       | Beige panel holding a white text card ("Hi, I'm Serhii, founder of MAVPY design agency." plus 3 italic paragraphs) and the founder photo on the right. A hidden giant vertical "MAVPY" text layer (`1:344`) is probably unused.                                                                                                                       | Photo first, then the text card, centred.                                                                                                                                  |
| 8   | **Pricing** ("Pick your goal, see the price")                 | `#pricing`     | 3 white cards. Each has a title, a cream "You get:" box, 3 bullets, then "from $X" and a small "Get my estimate" button.                                                                                                                                                                                                                              | Stacked cards with full-width buttons.                                                                                                                                     |
| 9   | **Contact** ("Tell us your goal, we'll price it")             | `#contact`     | Beige card with an **orange left border**. Centred h2 and subline. White form card laid out as a 2 × 2 grid: Name and E-mail on top, Goal select and the button below.                                                                                                                                                                                | Stacked; inputs are underline-only; full-width button.                                                                                                                     |
| 10  | **Footer**                                                    | –              | Dark (`#333`). Three columns: logo and slogan, contacts, nav. Giant "MAVPY" wordmark across the width, then the copyright line with an underlined "MAVPY DESIGN STUDIO".                                                                                                                                                                              | Everything centred: logo and slogan, nav, contacts, wordmark, copyright.                                                                                                   |

Smaller desktop/mobile differences:

- The h2s are left-aligned on desktop and centred on mobile, everywhere.
- "View live site" is black with an orange ↗ on desktop, and orange text with → on mobile.
- On mobile the pain-point and pricing titles get a different line break.
- **Pricing card 3 has two titles:** "Revamp your website" on desktop, "Refresh an outdated site" on mobile.
- The hero CTA reads "Get an estimate"; every pricing and form button reads "Get my estimate".

## 2. Figma vs the live Webflow site

### Copy

> **Decision (2026-11-19): Figma wins on copy as well. The about section shows one founder.** Every row below uses the Figma column. The Webflow column stays for reference, and the rows are listed for Serhii to confirm.

Webflow wins on copy by default, but parts of the Webflow page are clearly unfinished, so they can't simply win. My proposals are in the right-hand column.

| Where                | Figma                                                                                                             | Webflow                                                                                                                                                                                                                             | Proposal                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Logo                 | "DESIGN AGENCY"                                                                                                   | Header logo PNG says "DESIGN & DEV"; the footer SVG says "DESIGN AGENCY"                                                                                                                                                            | Figma ("DESIGN AGENCY"); ask                                                         |
| Hero h1 (small line) | Conversion-focused websites for growing businesses                                                                | Desktop: "Websites & booking systems for businesses". Mobile: Figma's line. (The page has two h1s.)                                                                                                                                 | Ask; we ship one h1                                                                  |
| Hero note            | Scoped, priced upfront, / delivered end-to-end.                                                                   | Designed and built in-house. / Priced upfront.                                                                                                                                                                                      | Ask                                                                                  |
| Trust bar items 3–4  | Founder-led, direct · Reply within 24h                                                                            | Designed and built in-house · PageSpeed 90+ on mobile                                                                                                                                                                               | Ask                                                                                  |
| Pain card 3          | **High traffic, no enquiries** / People visit, but the site fails to convert…                                     | **Admins drown in calls** / Patients call, can't get through and book elsewhere. No-shows eat the schedule.                                                                                                                         | Ask                                                                                  |
| Process intro        | One clear path. The right people for your goal — no more, no less.                                                | Design that can actually be built. Code that sells. Both under one roof.                                                                                                                                                            | Ask                                                                                  |
| Process 01           | **Full cycle, done for you** / From zero to a steady flow of clients — nothing lost in hand-offs.                 | **Design and code under one roof** / Strategy, design, build and automation by the two founders…                                                                                                                                    | Ask                                                                                  |
| Cases                | 5 named cases (Medical clinic, Massage studio, English school, Crypto company, B2B Solar company) with real facts | 1 real case ("Strategy, design & layout for a clinic website", Company: Doctor LOR), then **6 template titles** ("Perfect SLA, 24/7", "Preventing human errors" twice…) that all reuse the clinic copy. Typo: "teady patient flow". | **Figma**, because the Webflow version is placeholder. Need the facts for cases 2–5. |
| Testimonials         | 4 (Natalia M., Bram V., Ivan V., Dmytro V. / FitK online store, quote "What I remember most is how calm it was…") | 6 (adds Julia G. and Daria L.). Dmytro is a "Dental clinic" with a different quote. Project lines are shorter ("full design and dev").                                                                                              | Ask which set is real                                                                |
| About                | One founder: "Founded 2022. The founder leads every project…", a "Hi, I'm Serhii…" card, a single photo           | **Two founders:** "Building since 2021. A founder leads…". A Serhii card (strategy & design) plus a **second co-founder card (CTO)** with a photo. Then a tech strip: UX / UI · Figma · Next.js · GSAP · Automation.                | **Figma: one founder** (decided)                                                     |
| Pricing              | $500 / $700 / $800; card 3 "Revamp your website"                                                                  | $1000 / $700 / **"Care plan" from $40/m** (first 2 weeks free · fixes within 2–4 hours · small edits monthly)                                                                                                                       | Ask                                                                                  |
| Contact subline      | "…from $500…"                                                                                                     | same                                                                                                                                                                                                                                | – (it conflicts with Webflow's $1000 if that price wins)                             |
| Footer contacts      | mavpy_agency@gmail.com · +380 99 320 84 54 · @mavpy_agency                                                        | mavpy.studio@gmail.com · +38 (099) 220 83 43 · @mavpy_agency                                                                                                                                                                        | **Ask, since these are real contact details**                                        |
| Copyright            | 2022-2026, MAVPY DESIGN STUDIO                                                                                    | 2021-2026, MAVPY design & development studio                                                                                                                                                                                        | Ask                                                                                  |

The pattern: **Figma tells a one-founder agency story, while Webflow tells a two-founder "design & dev" story.** Most of the rows above follow from that one decision.

### Sections

- Webflow has a **tech-stack strip** (UX / UI · Figma · Next.js · GSAP · Automation) after the team section. Figma doesn't have it.
- Webflow has a **two-person team section**; Figma has a single founder card.
- Webflow has 6 testimonials; Figma has 4.
- Nothing in Figma is missing from Webflow.

### Interactions and behaviour (from the Webflow source)

- **Animations:** there are no Webflow IX2 interactions and no scroll-reveal animations. GSAP 3.12 is loaded, but only for the cases accordion.
- **Cases accordion:**
  - Only one item is open at a time, and the first is open by default.
  - Clicking an open item does nothing; you close it by opening another one.
  - The height animates `0 → auto` over 0.3 s with `power1.inOut`.
  - The chevron rotates 180°, and the screenshot on the right swaps to the active case.
  - ARIA is set: `aria-expanded` and `aria-controls`.
  - → Rebuild with `<details name="cases">` (native exclusive accordion) plus CSS `interpolate-size`/grid-rows for the animation. No GSAP needed.
- **Testimonials:** a Webflow slider (`w-slider`) with ‹ › arrows and dots, one slide step at a time. → Rebuild as a CSS scroll-snap row with two small arrow buttons. That needs only a few lines of JS for the arrows, and it's swipeable and keyboard-scrollable for free.
- **Mobile nav:** Webflow's hamburger. → Our own accessible menu button (M3).
- **Hovers:**
  - Buttons go to `--orange-dark` with a 0.3 s transition.
  - Nav links change colour over 0.3 s with `cubic-bezier(.165,.84,.44,1)`.
  - Exact values come in M7.
- **Focus:** Webflow uses a `#4d65ff` 2 px outline. We'll use a brand-coloured focus ring instead.
- **Form:** Webflow's native form handler, "Please wait..." while submitting, then a generic success or failure message.
- **SEO on Webflow is effectively missing:** the title is just "MAVPY", there's no description, all 34 images have empty `alt`, and there are two h1s. Nothing to carry over.

## 3. Contact form

| Field      | Figma label | Webflow (name, placeholder)      | Type                                                           | Rules (client + server, Zod)                                                                                                                                                              |
| ---------- | ----------- | -------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name       | Your Name   | `First-name`, "John Doe"         | `text`, `autocomplete="name"`                                  | Required; trimmed; 2–100 characters                                                                                                                                                       |
| Email      | Your E-mail | `Email`, "johnsmith@example.com" | `email`, `autocomplete="email"`                                | Required; valid email; max 254                                                                                                                                                            |
| Goal       | Your goal   | `The-reason-for-your-contact`    | `select`                                                       | Required, default "Attract new clients". Options follow the pricing cards plus **Other**. Webflow's options are Attract new clients / Launch a new service / Revamp your website / Other. |
| Honeypot   | –           | –                                | hidden `text` (`name="company"`, `tabindex=-1`, `aria-hidden`) | Must be empty                                                                                                                                                                             |
| Time check | –           | –                                | hidden timestamp                                               | Submitted ≥ 3 s after render                                                                                                                                                              |
| Locale     | –           | –                                | hidden `en`/`uk`                                               | Enum; picks the language of the reply and messages                                                                                                                                        |

- There's no message or phone field in either source. Keep it that minimal.
- Button: "Get my estimate" in Figma, "Get an estimate" on Webflow. Loading text replaces Webflow's "Please wait...".
- States: field errors inline under each input, plus one message for the whole form (success or failure), in both languages. Values are kept on error.
- **Small addition:** the "Get my estimate" buttons on the pricing cards could pre-select their goal in the form (`#contact` plus a tiny script). Webflow doesn't do this. It's cheap, so I'll do it in M5 unless you object.

## 4. Assets

All exported into `src/assets/` at about 2x their display size. Astro's `<Image>` produces the final sizes and formats.

| File                                                                                               | Source                    | Notes                                                                                                                                         |
| -------------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `logos/logo.svg`                                                                                   | Figma `1:529`             | Dark "DESIGN AGENCY" logo for the header. Background rects stripped.                                                                          |
| `logos/logo-white.svg`                                                                             | Webflow footer SVG        | White logo for the footer. Matches Figma `1:647`.                                                                                             |
| `logos/logo-mark.svg`, `logo-mark.png`                                                             | Figma, and Serhii's Drive | Monkey mark only                                                                                                                              |
| `logos/logo.png`                                                                                   | Drive                     | Old "DESIGN & DEV" version. Can be deleted once the logo text is decided.                                                                     |
| `images/mascot.png`                                                                                | Figma `1:512`             | Monkey in a beanie (process section)                                                                                                          |
| `images/team/serhii.png`                                                                           | Figma `1:379`             | Cut-out photo, white T-shirt (as in Figma)                                                                                                    |
| `images/team/serhii-blazer.png`, `team/cofounder-cto.png`                                          | Drive / Webflow           | Team photos for the Webflow two-founder version. Only used if that version wins.                                                              |
| `images/cases/medical-clinic.png`, `massage-studio.png`, `english-school.png`, `solar-company.png` | Figma originals           | Full-page screenshots. The UI crops them.                                                                                                     |
| `images/cases/crypto-company-strip.png`                                                            | Figma `1:558` (2x)        | **Only the cropped strip.** In Figma this case is built from vector layers, not a screenshot. A full screenshot is needed for the open state. |
| `images/avatars/bram.png`, `ivan.jpg`                                                              | Figma originals           | The Bram original has two people; crop to the left one in M4.                                                                                 |
| `images/avatars/natalia.png`                                                                       | Webflow CDN               | **Only 95 px**, because the Figma export hit the rate limit. Re-export `1:341` later.                                                         |
| `images/avatars/placeholder.svg`                                                                   | Figma                     | Dmytro has no photo in Figma (grey silhouette).                                                                                               |
| `og/og-source.jpg`                                                                                 | Figma `6:9`               | Yellow brand thumbnail. Crop it to 1200 × 630 in M7.                                                                                          |
| `icons/*`                                                                                          | Drive                     | Phosphor "thin" icons, plus the arrow sets used for "View live site"                                                                          |

Still missing:

- A full crypto case screenshot
- A larger Natalia avatar
- Dmytro's photo (if he has one)
- A Ukrainian OG variant, if we want one
