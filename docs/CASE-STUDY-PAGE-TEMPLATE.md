# Case-study page template

How a `site/projects/*.html` page is actually built today, written by reading the
seven that exist: `ollae`, `pocalab`, `kumon-automation`, `edison-dental`,
`vbs-scheduler`, `worship-slides`, `collette`.

These pages are hand-authored static HTML. There is no build step and no
generator, so consistency is a discipline, not something a renderer enforces.
This doc is the enforcement.

**Related docs, and who owns what:**

| Doc | Owns |
| --- | --- |
| this file | page shell, section order, markup, voice |
| `image-conventions.md` | everything about figures — widths, captions, zoom, accessibility. **Do not restate it here; follow it.** |
| `CASE-STUDY-TEMPLATE.md` | the prose draft (`docs/case-study-<slug>.md`) that a page is written *from* |
| `portfolio-cards-content.md` | the homepage card copy that has to agree with the page |

> Note on `CASE-STUDY-TEMPLATE.md`: its section order still matches the live
> pages, but its front-matter block describes a render pipeline that does not
> exist, and its `thumbnail:` path (`/assets/cases/…`) is wrong — thumbnails
> live at `/assets/thumbnails/<slug>.webp`. Treat that file as a drafting aid
> for the markdown source only. This file is the page contract.

---

## 1. The shell is invariant

Lines 1–24 of all seven pages are **byte-identical** except for `<title>`,
`<meta name="description">`, `og:title`, and `og:description`. Copy an existing
page; do not retype the head.

That means:

- Same font preload block, same inline SVG favicon, same
  `tokens.css?v=2` + `style.css?v=9`.
- **Cache-bust versions move together.** If you bump `style.css?v=9`, bump it on
  all seven pages and on `index.html`/`404.html` in the same commit. A page left
  on an old `?v=` is the most likely way this site ships a visual bug.
- **The same rule applies to every script, and it is easier to forget.** Editing
  `scripts/foo.js` without bumping its `?v=` ships the edit to the origin while
  the CDN keeps serving the old file to the URL the page actually requests —
  the deploy looks green and the feature is simply dead. Caught exactly this
  way once: `atm-embed.js` gained the Reddit loader, kept `?v=1`, and the
  button never un-hid in production. To check a live one, fetch it twice, once
  as the page requests it and once with a throwaway query string; different
  byte counts mean a stale `?v=`.
- `<html lang="en">`. Foreign-language runs get their own `lang` — Ollae uses
  `<span lang="ko">올래</span>`.

Body chrome, also invariant:

```html
<body>
  <div class="spotlight" aria-hidden="true"></div>
  <main class="case-study">
    <a class="back-link" href="/#projects">← Back to projects</a>
    …
  </main>
  <script src="/scripts/main.js?v=1" defer></script>
</body>
```

`main.js` is on every page (it builds the lightbox and the spotlight). Extra
scripts are added only by pages that use the matching component — see §6.

The back-link points at the homepage section the page is listed in:
`/#projects` for builds, `/#experience` for Collette.

### Footer

```html
<footer>
  <p>an MCL Studio project</p>
  <p class="build-credit">Designed and built by hand with Claude Code — plain HTML, CSS, and vanilla JS, no framework.</p>
  <p class="footer-date">Last updated September 2026</p>
</footer>
```

All three lines, that order, every page. `footer-date` is `Month YYYY` and is
updated whenever the page's copy changes — not when a stylesheet does.

Edison Dental adds a `ul.badges.cwv-badge` Lighthouse strip plus a second
`footer-date` naming the standard it was scored against. That is a **one-page
exception**, and the CSS comment says so. Don't spread it: only add it to a page
whose Outcome is itself a performance claim, and only with real numbers.

---

## 2. Header block

Fixed order. Omit what doesn't apply; never reorder what's there.

```html
<header class="case-study-header">
  <p class="case-study-label">Case study</p>          <!-- always, verbatim -->
  <h1>Ollae</h1>                                      <!-- always, one per page -->
  <p class="case-study-kicker">…</p>                  <!-- optional gloss -->
  <p class="case-study-deck">…</p>                    <!-- always -->
  <p class="case-study-meta-row">Role: … · … · Shipped</p>  <!-- always -->
  <ul role="list" class="case-study-metrics">…</ul>   <!-- optional -->
  <ul role="list" class="tags" aria-label="Tech stack">…</ul>
  <p class="case-study-links">…</p>
</header>
```

**Deck** — one or two sentences, the page's thesis. Two shapes that work:

- *A claim about the product*: "Converts church worship PDF setlists into
  presentation-ready .pptx decks in seconds…"
- *A sentence that states the insight*: "The right tool for a pickup game or
  team lunch is a link." Prefer this when the project has a real point of view.

**Meta row** — `Role: <role> · <timeframe> · <status>`, separated by ` · `.
Observed roles: `Design + Engineering (solo, full-stack)`,
`Design + Engineering (full stack)`, `Design + Engineering (solo)`,
`Design + Engineering`, `Engineering`. Timeframe is `2026`, `2025–2026`, or
`May–June 2026` (en dash). Status is `Shipped`. The employed-work variant drops
the `Role:` prefix and the status, and names tools instead:
`UX/UI Designer · 2022–2024 · Figma, Dev Mode, UserTesting.com`.

**Metrics** — two or three, or none at all. Each is a `<li>` holding
`<span class="metric-value">` + `<span class="metric-label">`. The comparison
lives in the label, not in prose: `~45 min` / `→ <1 min per full set
(estimated)`. Ollae and pocalab ship without a metrics strip, and that is a
valid choice — a strip full of soft numbers is worse than no strip. If a number
is an estimate or a target, the label says so.

**Tags** — `role="list"` and `aria-label="Tech stack"` are both required (the
list markers are stripped, so the role has to be restored). Rough order:
language → datastore → framework → styling → build → hosting → services →
design tool.

**Links** — `Live demo`, `Repo`, then any in-page anchor (`Try it here ↓`).
External links always carry `target="_blank" rel="noopener noreferrer"`. Omit a
link rather than pointing it at something private.

---

## 3. Section order

Seven `<section>`s, in this order, each opening with an `<h2>` whose text is
used verbatim:

1. **Overview** — one paragraph. The whole story for someone who reads nothing
   else. Ollae's opens with the Thursday volleyball game; it earns the page.
2. **The problem** — what was broken and for whom, then *the alternatives you
   actually evaluated and why each fell short* (Ollae names Google Calendar,
   Partiful, Meetup, Eventbrite; VBS names Doodle). A problem section with no
   named alternative reads as if you never looked.
3. **Role &amp; constraints** — note the `&amp;`. What you owned, then what
   boxed you in. Constraints can be a `<ul>` of bolded lead-ins (VBS), prose
   (worship-slides), or split under `<h3>Role</h3>` / `<h3>Constraints</h3>`
   when both need room (Ollae).
4. **Approach** — `<section class="case-study-section--approach">`, with
   `<h3>Design</h3>` then `<h3>Engineering</h3>`. Both, always. This split is
   the point of the whole page. `<h4>` is available inside Engineering for named
   sub-problems (Ollae: "One Claude call, two jobs", "Link previews").
5. **Key decisions &amp; tradeoffs** — `<dl class="key-decisions">`, two to four
   pairs. See §4.
6. **Outcome** — prose (Ollae, worship-slides), a `<ul>` of bolded results
   (VBS), or a `<table class="lighthouse-table">` with a `<caption>` and
   `scope=` on every header cell (Edison).
7. **Reflection** — one or two paragraphs. Present on every build page.

---

## 4. The two sections that carry the page

**Key decisions.** Each `<dt>` is the decision as a short phrase, not a
question: "Store the time as typed", "Server-side generation over client-side",
"Capitalization deferred to pass 3". Each `<dd>` states the choice, the
alternative, and **what it cost** — the cost clause is what makes the section
worth reading:

> Because the token sits in a URL, it shows up in browser history. For a
> pickup-game tool, the tappable link is worth that tradeoff…

> The tradeoff is verbosity — no component model, no reactivity system — which
> became real friction as the editor grew across five iterations.

At least one entry must be a genuine loss you accepted. If every decision was
free, they weren't decisions.

**Reflection.** Name the mistake, then the transferable lesson, in that order,
and keep it short:

> The naming cost most of a day. The trademark search should have been step one.

> I spent two sessions on image and font optimization before running a Chrome
> trace to confirm what the actual LCP element was. Measure before optimizing.

---

## 5. Voice

Rules that hold across all seven pages:

- **First person, past tense, direct.** "I looked at what already exists."
- **Specific over superlative.** No "robust", "seamless", "powerful". These
  pages contain zero marketing adjectives; keep it that way.
- **Numbers carry their own provenance.** "That estimate is based on firsthand
  experience with the manual process — the tool hasn't been formally
  benchmarked." "LCP sits at 2.9s, still short of the 2.5s target." Stating the
  gap plainly is the house style, not a weakness.
- **Dates are real dates.** "went into the volleyball group's chats on May 19,
  2026".
- **Explain the mechanism, not just the outcome.** Worship-slides explains *why*
  pass 3 has to follow pass 2. That paragraph is the case study.
- **Identifiers in `<code>`** — `remind_me`, `smartChunk`, `localStorage`,
  `.pptx`, `item.fontName`.
- **Typography**: `·` between meta items, `—` em dash for asides, `–` en dash in
  ranges, `&ldquo;…&rdquo;` around quoted UI copy, `&amp;` in headings.
- **Length**: 500–900 words of body for a standard page. Ollae runs longer
  because it carries live embeds; that is the ceiling, not the target.

---

## 6. Component inventory

Use the class that already exists. Every one of these is styled in
`site/styles/style.css`; inventing a new pattern means writing new CSS, which is
a bigger decision than it looks.

| Need | Markup | Used by |
| --- | --- | --- |
| Hero, full-bleed single image | `figure.hero-figure.figure--wide` | collette |
| Hero, three phone screens | `figure.shots` | ollae |
| Any inline image | `figure.media-figure` | all |
| Wider than the text column | add `figure--wide` | ollae, kumon |
| Two images compared | `div.media-pair` inside `.media-figure` | collette |
| A row of 2–4 states | `div.cs-states` inside `.media-figure` | ollae, kumon, pocalab |
| Click-to-enlarge | `a.figure-zoom[data-zoom]` wrapping the image, with `<span class="sr-only">View full-size: </span>` | ollae, collette, kumon |
| Video | `.cs-video` + `<script src="/scripts/case-study-video.js?v=2" defer>` | kumon, pocalab |
| Before/after race widget | `.race.js-race` + `race-comparison.js` | kumon only |
| Live product embed | `.embed` + `ollae-embeds.js` | ollae only |
| Score table | `table.lighthouse-table` with a `<caption>` | edison |
| Deeper pages not built yet | `section.spokes`, with an HTML comment holding the future href | collette |

Hero placement varies by page and that is fine: after the header (ollae,
collette), inside Overview (pocalab), or as the race widget before Overview
(kumon). Pick the one the story needs.

Figures follow `image-conventions.md` without exception: explicit `width` and
`height` on every `<img>`, `loading="lazy"` below the fold and
`fetchpriority="high"` above it, `<picture>` with a WebP `<source>` and a raster
fallback, and alt text that **describes what is on the screen**, not what it is
for. The alt text on these pages is long and literal — match that.

---

## 7. The two page shapes

**Build case study** (six of seven) — everything above, as written.

**Experience case study** (Collette) — employed work, so it diverges
deliberately: no tags, no links, no metrics strip, no seven-section skeleton. It
runs one `<section class="case-study-body">` of narrative with figures and
tables inline, `<h2>`s that name the work rather than the template, and closes
with `section.spokes` pointing at deeper pages that aren't built yet. Back-link
goes to `/#experience`.

Reach for this shape only when there is no repo and no live URL to link, and the
story is a period of work rather than a product.

---

## 8. Publishing checklist

- [ ] Drafted as `docs/case-study-<slug>.md` first (`CASE-STUDY-TEMPLATE.md`).
- [ ] Head copied from an existing page; only title/description/og changed.
- [ ] Stylesheet `?v=` matches every other page.
- [ ] Header block in order; `Role: … · … · Shipped` filled in.
- [ ] Both `<h3>Design</h3>` and `<h3>Engineering</h3>` present and substantive.
- [ ] At least one entry in `key-decisions` names what it cost.
- [ ] Every number is measured, or labeled as an estimate or a target.
- [ ] Figures follow `image-conventions.md`; every `<img>` has `width`/`height`.
- [ ] Footer: three lines, `Last updated <Month YYYY>` current.
- [ ] Homepage card added to `site/index.html` with
      `/assets/thumbnails/<slug>.webp`, and its copy agrees with the deck.
- [ ] `cd dev/checks && npm run sweep` — plus `npm run figures` and
      `npm run lightbox` if the page adds images.
- [ ] Devlog entry in `docs/devlog.md`.
