# devlog.md — build log

> One entry per phase. Newest at the top.

---

## 2026-06-16 — Inbox triage: content fixes & polish

Captured via `/capture` into `docs/INBOX.md`, triaged via `/triage`. Quick
wins done directly below; the rest became Linear issues (parented under a
new tracking structure, not phase milestones, since these are post-Phase-4
polish/content items rather than build-plan phases).

- **Fix Edison Dental cost figure ($50/yr, not $50/mo).** The Elementor
  subscription was actually $50/*year*, not $50/month — the
  "$50/mo (~$600/yr)" figure used everywhere was wrong (the $600/yr was
  incorrectly derived by multiplying by 12). Corrected all 9 mentions across
  `CONTENT.md`, the featured project card on `index.html`, and the Edison
  Dental case study page (meta description, problem statement, what-I-built
  list, impact framing). Verified on both rendered pages, zero console
  errors.
- **Redesign How I Work as compact horizontal cards.** Replaced the 4-item
  bulleted list (long sentences, big vertical footprint) with an auto-fit
  grid of 4 compact cards that collapses to a single column on mobile.
  Condensed each item to one short line while keeping the specific proof
  details (`/capture`, `/triage`, `/audit`). Synced `CONTENT.md`'s How I
  Work section to match the new condensed per-card copy.
- **Resize featured Edison card.** Was `grid-column: 1 / -1` (full row,
  however many columns existed); changed to `span 2` so it reads as a
  bigger card rather than a banner dominating the row. Gave its thumbnail
  `aspect-ratio: 8/3` (double the standard 4/3 ratio) so at ~2x the width
  its rendered height lands within 7px of a standard thumbnail's height —
  measured directly via Playwright, not eyeballed.

---

## 2026-06-16 — Phase 4: A11y + perf pass

Tracked as Linear MAT-346, broken into sub-tickets MAT-365, 360–364 (run
audit → fix P0 → fix P1 → re-audit → badge → final verification). All 6
sub-tickets done.

- **MAT-365 — Run `/audit` against the local static server.** Full
  Lighthouse + axe-core + pa11y pass against both pages (root + Edison
  Dental case study), plus a manual Part B code review and exhaustive
  Playwright-verified checks (touch targets measured directly at 375px/1440px,
  focus-not-obscured checked across all 6 main-content links × 5 scroll
  positions = 30 combinations, zero violations). Report: `audit-2026-06-16.md`.
  **Result: 2 P0s, 3 P1s, 1 P2.**
  - P0: `index.html` has no `<h1>` (axe-core `page-has-heading-one` violation).
  - P0: social links (GitHub/LinkedIn) measure 21-22px tall, under the WCAG
    2.2 Target Size 24px floor — confirmed by direct measurement, not
    speculation (nav links and résumé link already pass).
  - P1: missing favicon causes a 404 console error, docking Best Practices
    on both pages.
  - P1: group-hover-dim's opacity transition (Phase 3) has no
    `prefers-reduced-motion` guard, unlike the spotlight.
  - P1: Edison Dental's LCP measures 2.6s, just over the 2.5s threshold
    (partly a cold-localhost measurement artifact, but a real preload
    opportunity exists).
  - P2: Consistent-Help judgment call (case study page lacks socials/résumé)
    — likely fine as-is given the back-link escape hatch, no action planned.
  - Contrast was independently re-confirmed via the actual axe-core/Lighthouse
    runs (100/100 accessibility both pages) on top of the earlier manual
    calculation — not a finding.
- **MAT-360 — Fix all P0 findings.** Promoted `.identity-name` to a real
  `<h1>`, with explicit `font-size`/`font-weight` added so it doesn't pick
  up the browser's default bold/large `h1` styling (no visual regression —
  screenshot-confirmed). Added `padding-block` to `.socials a` — GitHub/
  LinkedIn went from 21-22px tall to 33.5px, clearing the WCAG 2.2 24px
  Target Size floor. Re-ran axe-core: 0 violations (was 1).
- **MAT-361 — Fix P1 findings.** Added an inline-SVG favicon (zero-asset,
  no build step) to both pages so the browser stops auto-requesting
  `/favicon.ico` and logging a 404. Guarded group-hover-dim's opacity
  transition behind `prefers-reduced-motion: no-preference` — the dim
  itself still applies instantly under reduced motion, only the animated
  transition is removed (verified: `transition-duration` is `0s` under
  reduced motion vs `0.2s` normally, opacity still correctly reaches 0.5
  either way). Marked the Google Fonts stylesheet link
  `fetchpriority="high"` on both pages as a lightweight LCP lever for
  Edison Dental's 2.6s reading — didn't hardcode Google's dynamic gstatic
  font URLs for a direct `rel=preload`, since those aren't stable enough
  to link directly. Re-measuring the real LCP impact is MAT-362's job.
- **MAT-362 — Re-run audit, capture final CWV numbers.** Zero P0s confirmed
  (axe-core + pa11y both clean on both pages — satisfies PROJECT.md §12's
  literal done-criterion). Best Practices hit 100/100 on both pages (was
  96/96). Edison Dental's LCP dropped 2.6s → **1.4s** — the font
  `fetchpriority` hint + removing the failed favicon request together
  overshot expectations; index.html held flat at ~2.2-2.3s (no LCP-specific
  fix was needed there). Final numbers feed the MAT-363 badge.
- **MAT-363 — Add the CWV/Lighthouse badge to the footer.** Reused the
  existing `.badges` pill component as-is (no new CSS) — each page shows
  its own real post-fix numbers (index.html: 96/100/100, LCP 2.3s;
  edison-dental.html: 99/100/100, LCP 1.4s), with a caption line making the
  dogfooding explicit. Screenshot-confirmed clean rendering on both footers,
  zero console errors.
- **MAT-364 — Final verification + devlog close-out.** Comprehensive
  Playwright pass tying everything together: zero console errors on both
  pages; touch targets re-measured at 375px (GitHub/LinkedIn now 32px,
  holding well clear of the 24px floor); `<h1>` confirmed present;
  reduced-motion correctly removes only the spotlight while scroll-spy
  still functions; both footers' badges render the correct real numbers;
  sticky sidebar regression-checked (still pins at y=0 after a 1500px
  scroll). PROJECT.md §12's Phase 4 done-criteria are met: `/audit` shows
  zero P0s, CWV is in the green and shown on the page.

**Open gaps carried forward (pre-launch, not phase-blocking):** all the
same asset/content gaps from Phase 2 (`resume.pdf`, project repo links,
thumbnails, pocalab's stack, studio hub URL) — none of this phase's fixes
touched those. The P2 Consistent-Help judgment call (Edison Dental page
lacking socials/résumé) was left as-is.

**Next:** Phase 5 — SEO + deploy. Meta/OG/schema, build `og.png`, deploy,
point Porkbun DNS, verify live.

---

## 2026-06-16 — Phase 3: Interactions

Tracked as Linear MAT-345, broken into sub-tickets MAT-356–359 (spotlight →
scroll-spy → group-hover-dim → final verification). All 4 sub-tickets done.

- **MAT-356 — Cursor-following spotlight.** `position: fixed` div with a
  `radial-gradient` tracking `--x`/`--y` CSS vars (added to `tokens.css`,
  defaulted to `50vw`/`50vh` to avoid a flash before the first
  `mousemove`). `main.js` updates the vars on `mousemove` and outright
  removes the spotlight element on touch devices or
  `prefers-reduced-motion: reduce` — belt-and-suspenders with the CSS
  `@media (prefers-reduced-motion: reduce) { display: none }` guard.
  `.layout`/`.case-study` got `position: relative; z-index: 1` so real
  content stays visually above the glow (`.spotlight` itself is `z-index: 0`).
  Verified via Playwright: CSS vars update on mousemove, element is absent
  under touch emulation and reduced-motion emulation, zero console errors.
- **MAT-357 — Scroll-spy nav with indicator line-grow.** `IntersectionObserver`
  with `rootMargin: '-40% 0px -40% 0px'` watches each `main section[id]`;
  whichever section crosses the resulting thin band at the viewport's
  vertical center gets `.is-active` added to its nav link. CSS grows the
  `.nav-indicator` line `2rem → 4rem` and brightens the link color on
  transition. Verified by wrapping `IntersectionObserver` to log every
  callback the production code receives — confirmed correct section
  detection on load and after scrolling to each anchor. One timing nuance
  worth noting: the very first callback can occasionally fire before
  Google Fonts swap in and settle layout, so the initial highlight can lag
  by a fraction of a second on first paint — resolves on any scroll/resize,
  not a functional issue.
- **MAT-358 — Group-hover dim.** Pure CSS, no JS: `.timeline:hover >
  .experience-entry` and `.project-cards:hover > .project-card` fade
  siblings to 0.5 opacity, with `:hover` on the entry itself restoring full
  opacity. Gated behind `@media (hover: hover)` so touch devices (no real
  hover) are unaffected. Verified opacity values directly via computed
  style and confirmed `(hover: hover)` correctly evaluates false in a touch
  context.
- **MAT-359 — Verify all interactions + sticky-layout regression.** Full
  end-to-end pass now that all three interactions exist together:
  - **Phase 1's known limitation is resolved.** With real content, the page
    now has 4348px of scroll room (was 0px against placeholder content) —
    anchor-jump to `#projects` lands at y≈0, confirming the mechanism was
    always correct and just needed real content height.
  - Sticky sidebar stays pinned at y=0 scrolling 1500px down.
  - Focus on a project's "Live demo" link is not obscured by the sidebar
    (focused link x=584 vs. sidebar's right edge at x=520).
  - Reduced-motion removes only the spotlight — scroll-spy and hover-dim
    are unaffected, as intended (they're discrete state changes, not
    continuous motion).
  - Zero console errors throughout.

**Next:** Phase 4 — A11y + perf pass. Run `/audit`, fix every P0 then P1,
add the CWV/Lighthouse badge.

---

## 2026-06-16 — Phase 2: Content

Tracked as Linear MAT-344, broken into sub-tickets MAT-348–355 (identity →
About → How I Work → Experience → Projects cards → Edison case study →
footer → Writing decision). All 8 sub-tickets done.

- **MAT-348 — Wire identity (sidebar).** Real name and tagline ("I design and
  build accessible web apps — end to end.") replace the Phase 1 bracket
  placeholders. Added a `.sidebar-bottom` group (Résumé link + GitHub/LinkedIn,
  laid out horizontally) mirroring the existing `.sidebar-top` pattern — no
  CSS changes needed beyond that since `.sidebar`'s `space-between` already
  pins it to the bottom. Social links and the résumé link open in a new tab.
  **Known gap:** `/assets/resume.pdf` doesn't exist yet — the link is wired
  but will 404 until the file is added. "Other" social (CodePen/X/Ko-fi)
  skipped per CONTENT.md's own placeholder, pending a platform/URL decision.
- **MAT-349 — Wire About section.** Three short paragraphs from CONTENT.md's
  About block. Added the first real content-section typography rules (65ch
  measure, DM Serif Display `h2`, paragraph spacing, `var(--space-24)` between
  sections). Since `#about` now has a visible `h2`, removed its Phase 1
  `aria-label` — the heading provides the accessible name instead (per the
  Phase 1 plan's own follow-up note). "What I'm looking for" optional line
  skipped for now per user decision.
- **MAT-350 — Wire How I Work (process) section.** Compact section from
  CONTENT.md's How I Work block: capture/triage split, spec-before-code,
  Linear as backbone, UX-as-tooling `/audit` command. Trimmed the "mood-aware
  labels" detail and closing parenthetical for compactness per CONTENT.md's
  own note not to let process narration crowd out the work. Added list/code
  styling shared by all content sections.
- **MAT-351 — Wire Experience timeline.** Semantic `<ol>` with 4 role entries
  + education, each using `<time>` for dates, metric badges (Kumon ~96% /
  10–13 hrs → 25 min, Collette −30% / +20% / 200+ tests), and skill tags as
  pill lists. Tightened the over-broad `main section li` spacing rule from
  MAT-350 to `main section ul:not([role="list"]) > li` so it only touches
  plain bullet lists, not the new pill lists or the timeline `<ol>` itself.
  Dated markers used here only — per PROJECT.md's "structure encodes
  meaning" rule, no other section gets this treatment.
- **MAT-352 — Wire Projects section (5 standard cards).** ollae, pocalab,
  Worship Slides Generator, VBS Scheduler, Kumon Grading Automation. Auto-fit
  grid (`minmax(240px, 1fr)`), `#projects` opts out of the 65ch reading-width
  cap since thumbnail cards need more room. Each card gets a fixed
  `aspect-ratio: 4/3` placeholder div (no real thumbnails exist yet — locking
  the ratio now means no layout shift once real images drop in). Missing repo
  links render as plain `.link-pending` text rather than dead anchors that go
  nowhere. Only VBS Scheduler's repo is confirmed/real. pocalab's two
  unconfirmed stack tags omitted rather than shown as visible brackets.
  Edison Dental intentionally excluded — separate featured-case-study ticket
  (MAT-353).
- **MAT-353 — Build Edison Dental featured case study.** Decided a dedicated
  page over an inline expandable view (user call) — new
  `/projects/edison-dental.html`, reusing `tokens.css`/`style.css` and the
  existing content-section typography (it inherits `main section`'s
  rules for free since it nests `<section>`s inside `<main>` too). Added a
  full-width featured card to the main Projects grid (accent border,
  "Featured case study" label) linking to it, kept in CONTENT.md's original
  source position between Worship Slides and VBS Scheduler rather than
  promoted to the front. Updated PROJECT.md §10 to document the new
  `/projects` directory — the one deviation from "single page, anchored
  sections."
  **Known gaps:** Lighthouse/CWV/SEO before-after scores not yet captured
  (flagged inline as a pending note — CONTENT.md calls this the single best
  proof point); framework tag and thumbnail still missing.
- **MAT-354 — Wire footer.** Added the build-credit line (Claude Code, plain
  HTML/CSS/JS, no framework — reinforces PROJECT.md §6's "surface the
  AI-augmented workflow" proof point) and a last-updated date to both
  `index.html` and the case study page's footers. Studio attribution stays
  plain text rather than a dead link, per user decision — no real studio hub
  URL yet.
- **MAT-355 — Hide Writing section.** Zero "Shipped by Design" posts exist,
  so the `#writing` nav link and empty section are removed rather than left
  as a visibly dead stub (user decision) — trivial to re-add once there's
  content. Also removed the Phase 1 `min-height: 10vh` debug rule on `main
  section`, now dead weight since every remaining section has real content
  with natural height.

**Open gaps carried forward (pre-launch, not phase-blocking):** `/assets/resume.pdf`
missing; "other" social platform undecided; most project repo links not yet
public; pocalab framework/PDF-lib unconfirmed; all thumbnails missing;
Edison Dental Lighthouse/CWV/SEO before-after scores + framework tag +
thumbnail missing; studio hub URL undecided.

**Next:** Phase 3 — Interactions (spotlight, scroll-spy, hover-dim,
line-grow, reduced-motion/touch guards).

---

## 2026-06-16 — Phase 1: Layout shell

- Built the body structure: `<header class="sidebar">` (identity placeholders,
  section nav, socials) and `<main>` (five section anchors —
  `#about`/`#process`/`#experience`/`#projects`/`#writing` — plus a nested
  `<footer>` carrying the "an MCL Studio project" attribution). Semantic
  landmarks throughout (`header`/`nav`/`main`/`section`/`footer`); only
  `.layout`/`.sidebar-top` are bare `<div>`s used purely for flex grouping.
- Left-column identity (Name/Tagline/GitHub/LinkedIn) uses bracket
  placeholders (`[Name]`, `[Tagline]`, etc.) consistent with `CONTENT.md`'s own
  convention — real identity content is Phase 2's job.
- Added the layout CSS to `style.css`: flex parent, sticky sidebar
  (`position: sticky; top: 0; align-self: flex-start`, with `overflow-y: auto`
  as a safety guard against content ever exceeding `100vh`), `space-between`
  split so socials pin to the bottom of the sidebar, and a `max-width: 1024px`
  media query that collapses to a single stacked column with sticky disabled.
- Both optional IA sections (`#process`, `#writing`) scaffolded now rather
  than deferred — trivial to remove later if unneeded.
- Verified with a headless-Chromium (Playwright) script against a local
  static server: sticky sidebar stays pinned while scrolling, layout collapses
  cleanly at the 1024px breakpoint, no horizontal overflow at 375px, zero
  console errors, and keyboard Tab order matches DOM order through all 7
  focusable elements (5 nav links, then 2 social links). Confirmed visually via
  screenshots at desktop/tablet/mobile widths.
- **Known Phase 1 limitation (expected, not a bug):** anchor-jump-to-section
  couldn't be fully exercised — Phase 1's placeholder sections (`min-height:
  10vh` each) don't add up to more than one viewport height yet, so there's
  literally no scroll distance available (confirmed `scrollHeight - innerHeight
  === 0`). This resolves naturally once Phase 2 adds real content tall enough
  to scroll.

**Next:** Phase 2 — Content. Wire markup to `CONTENT.md`: identity, About,
Experience, Projects, Writing, footer.

---

## 2026-06-16 — Phase 0: Scaffold

- Initialized git repo, added `.gitignore` (OS/editor cruft only — no build
  tooling).
- Created file structure: `index.html`, `styles/tokens.css`, `styles/style.css`,
  `scripts/main.js`, `assets/thumbnails/`. `PROJECT.md`/`CONTENT.md` stay in
  `docs/` rather than root.
- Locked `tokens.css`: palette (near-black `#0f0f0e` bg, warm off-white
  `#e8e8e2` text, sky `#60c8f0` as the single committed accent), type families
  (DM Serif Display / DM Sans / DM Mono), a fluid clamp-based type scale, and a
  4px spacing scale.
- Wired font loading in `index.html` via Google Fonts (`preconnect` +
  `display=swap`).
- Wrote a minimal modern reset in `style.css`: box-sizing, margin reset,
  img/video defaults, `:focus-visible` baseline kept visible (not stripped).
- No layout, content, or interactions yet — those are Phases 1–3.

**Next:** Phase 1 — sticky split-column layout shell, responsive collapse,
empty section anchors.
