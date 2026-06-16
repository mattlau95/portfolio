# devlog.md — build log

> One entry per phase. Newest at the top.

---

## 2026-06-16 — Phase 2: Content (in progress)

Tracked as Linear MAT-344, broken into sub-tickets MAT-348–355 (identity →
About → How I Work → Experience → Projects cards → Edison case study →
footer → Writing decision). Logging each sub-step here as it lands.

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
