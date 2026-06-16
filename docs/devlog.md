# devlog.md — build log

> One entry per phase. Newest at the top.

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
