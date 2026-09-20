# devlog.md — build log

> One entry per phase. Newest at the top.

---

## 2026-09-19 — New case study: ATM Hack, with a playable embed

Eighth case study, built from `docs/case-study-atm-hack.md` and the five
sources in `dev/gta-atm-media/`. First page on the site to embed a third-party
product rather than one of mine.

**Page.** `site/projects/atm-hack.html`, standard build-case-study shape —
header, seven sections, `dl.key-decisions`, four figures. Three deviations from
the standard shape: the `build-credit` line reads "Designed and directed by me;
analysis and code by Claude", the header links are "Play it on itch.io" and an
in-page anchor rather than Live demo / Repo (there is no repo to link), and the
third section is **Role**, not "Role & constraints" — [C] constraints were cut
from this page, so the heading no longer promises them.

**The embed.** The itch.io frame sits directly after the header, outside any
`<section>`, on the `.figure--wide` track. It reuses the Ollae `.embed` stage —
poster screenshot, hidden button, nothing requested from itch until someone
asks — via a new `scripts/atm-embed.js` (~25 lines, no postMessage protocol;
itch serves at a fixed 1280×820 so the stage carries that ratio in CSS).
`.embed--game` also had to restate the lead/note type rules, because the block
sits outside `main section` and inherits none of them.

**Small screens hand off instead of embedding.** The wide track is 326px at
390, and 1280×820 scaled into that is unplayable. Under 700px the button is
replaced by a real `<a>` to itch.io, which also covers the JS-off case — the
button only ever appears if the script ran.

**Assets.** No ImageMagick, cwebp, sharp or PIL on this machine, so the five
PNGs were converted with the Chrome that ships with `dev/checks`'s Puppeteer
(`canvas.toDataURL('image/webp', q)`), including the two crops: the gameplay
ring plate (1280×720 out of a 2043×1208 screenshot that is mostly empty
background) and the 800×600 card thumbnail. Six files, 7.8–36.7 KB each.

**Verified.**

- `check-links`: 15 pages, 210 local references, all resolving.
- `sweep`: atm-hack clean at 1440/1024/390/360 — no overflow, no axe
  violations, no over-cap images. The 3 problems the sweep reports are
  pre-existing and on other pages: `skybluefc` `frame-title(3)` (the three
  YouTube iframes do carry `title`, so this is nested cross-origin frames) and
  `edison-dental` horizontal scroll at 390 and 360 (`553>390`). Neither page
  changed here beyond its `?v=` bump.
- `figures`: all 4 captions aligned at every viewport.
- `lightbox`: 14/14 on the three zoomable figures.
- Clicked the button headless: the poster is replaced by an iframe at
  969×620 with the itch src and `is-live` set.

**Registered.** Card added to `site/index.html` after pocalab; entry appended
to `docs/portfolio-cards-content.md`; `/projects/atm-hack.html` added to
`dev/checks/lib.js` so it is swept from now on. `style.css` bumped to `?v=10`
across all 15 pages.

**Spectrogram added (same day).** The draft's third figure landed as
`atm-double-click` (800×450 and @2x 1600×900, WebP + PNG), placed after
*Tested it on myself* as a zoomable `.media-figure` with a `<picture>` and a
800w/1600w `srcset`. It went on the **column** track, not `figure--wide`:
`.media-figure figure--wide` puts a height-capped image in a 969px box, so the
image centres at 909px while the caption stays at the box's left edge — a 26px
drift that `figures.js` catches and §3 forbids. The wide track on this page
belongs to the embed anyway. Also gave the embed poster `fetchpriority="high"`;
it is the LCP element and carried no loading hint at all.

[C] Proposed trimming *Tested it on myself* so the prose stopped repeating the
51 ms / 87 presses / 177 clicks the figure already states — **declined, copy
kept as written**. The numbers appear in both the paragraph and the figure, and
they agree; the repetition is deliberate.

**Open.** One figure the draft asks for still does not exist — the "Everyone's
attempts" tally with the leaderboard. That section is written without it.
No `@2x` exists for the other five images on the page: each was exported at
its final size, so a 2x would be an upscale. The two analysis
charts label Garek by his RP character name, "Gloryon", which the shipped game
and the page prose do not use. Glossed in two places rather than regenerating
the charts: the first chart's caption states it outright, and *Checked it*
carries the inline "Garek's (Gloryon)". The caption is what a reader hits
first, alongside the legend that prints the name.

---

## 2026-09-18 — Shipped: 18 commits to production

Pushed `12a1edc..1543913` to `origin/main`. Cloudflare Pages built from `site/`
and the deploy is live on both apexes.

**What went out**

| Area | Change |
|---|---|
| Homepage | MAT-732 restructure — ollae featured, Collette in the strip, Edison to Experience |
| Homepage | Copy pass on Experience, project cards and How I Build; Experience now strict reverse chronology |
| Homepage | Tier 3 "Also built" built as thumbnail rows, then rebuilt as a hairline ledger |
| Collette | Token table gained colour swatches and token chips |
| Edison | Stopped calling itself the featured case study |
| Ollae | Copy update plus the manifest — 12 new images |

**Verified live, not assumed.** Checked the deployed HTML rather than trusting a
green build:

- Homepage serves `also-built-list`, `Kumon Grading Tools`,
  `Design system · Collette Vacations`, and the ghosted row. The strings the
  update removed — `Kumon Grading Automation`, `Six projects` — are gone.
- `projects/edison-dental` serves `case-study-label">Case study`, so the
  featured claim is off the page it no longer belongs to.
- `projects/ollae` serves the kicker, the Korean 올래, the `One Claude call,
  two jobs` heading, and references to every new asset.
- Two new assets fetched directly: `ollae-unfurl-discord.webp` returns 200 as
  `image/webp` at 41,594 bytes, `ollae-emoji-card.webp` 200 at 13,588 bytes.
  The images are genuinely on the CDN, not just referenced in markup.

**Pre-push gate.** All 8 pages: **0 axe violations, 0 console errors**.
196 local references, all resolving. Lighthouse locally: accessibility 100,
best practices 100, CLS 0.002.

**MAT-734 raised as Urgent.** The footer badge still reads
`99 / 100 / 100 / LCP 1.8s`, dated June 2026, on a site that has changed
substantially underneath it. Nothing measured this session can confirm or
refute it — every local run used a bare static server with no compression and
none of the `_headers` cache rules, which is why local performance sat at
89–90 with LCP ~2.9s on both the old and new builds alike. The gap is the
harness, not a regression, but the badge is a public numeric claim and needs a
production run to stay honest. The ticket also carries the phone spot-check for
the ollae figure strips, which wrap differently at 375px.

**One deliberate non-change.** The ollae `<meta name="description">` and
`og:description` still carry the old, longer deck after the copy update
shortened the visible one to a single line. Left alone on purpose: a meta
description is a standalone summary for search results and social cards, where
~150 characters is the target and the new 56-character deck would be thin. The
existing text is still accurate about the rewritten page, so matching them
would have been symmetry for its own sake.

**Loose end.** An empty `scripts/checks/` tree at the repo root, left by
MAT-716, cannot be deleted — a process holds it open. Untracked and empty, so
it affects neither the repo nor the deploy. It will clear on the next reboot.

---

## 2026-09-18 — Ollae case study: copy update, then the manifest

Two passes over `projects/ollae.html`, applied in that order because the second
overwrites part of the first.

**Pass 1 — the copy update** (`docs/ollae-case-study-sep-18-copy-update.md`).
Overview, The problem, Role & constraints, Design, Engineering, Key decisions,
Outcome and Reflection all take the new wording. Role & constraints gains
`<h3>Role</h3>` and `<h3>Constraints</h3>`; Engineering gains
`<h4>One Claude call, two jobs</h4>` and `<h4>Link previews</h4>`. The heading
outline stays properly nested — H1 → H2 → H3 → H4, no skipped levels.

**Pass 2 — the manifest** (`docs/ollae-case-study-sep-18-manifest.md`). Seven
images and three copy edits: the Korean kicker under the H1, the 올래 sentence
closing the Role paragraph, and the preview-cards line narrowed from
"iMessage, WhatsApp, Telegram, and WeChat" to the four that are actually
shown and verified.

**The Claude implementation images.** The copy update has one image placeholder
in the engineering section, for the emoji in its three contexts; that is now a
three-up strip. The create-event screenshots had no placeholder, so they became
a second strip after the paragraph that describes them — input, parse preview,
finished event. That figure is an addition, not something the copy asked for,
and it is one block to delete if it reads as redundant next to the live create
embed directly below it.

**`[Confirm: tapping it asks for an email address]`** was a marker in the copy,
and the assets settled it: `ollae-remindme-expanded` shows the email field, a
Remind me button, and the note that the address is used once and deleted. The
sentence ships as fact on that evidence rather than as a bracket.

**Six alt texts were wrong on the first pass and are fixed.** I wrote them from
the surrounding prose instead of from the images. The body copy's example is
volleyball; the actual screenshots are a "Pickup Basketball" event at Sonny
Werlin Gym, and the emoji Claude picked is a basketball. Every alt on the six
new images is now written from what is on screen. The manifest's own seven alts
were supplied with the assets and were already accurate — checked against the
renders, not assumed.

**Two layout problems, both fixed by the system that already existed**
- Every strip collapsed into a stack. `--figure-max-h` is 512px, which is right
  for a single figure and far too tall for a row: three 900px-wide screenshots
  came to 1187px inside a 692px column. `.cs-states img` now caps at 20rem.
  Images smaller than that are untouched, so the Kumon popup row is unaffected.
- The Remind me pair still wrapped at 1440px. The cause is the one
  `docs/image-conventions.md` §3 documents: `contain: inline-size` was only on
  the *outer* caption, so a sentence-length inner caption drove the figure's
  `fit-content` width instead of the image. Inner captions now contain too.

No new layout primitives were needed — `.media-figure`, `.cs-states` and
`.figure--wide` already covered a pair, two trios and a four-up.

**Where things sit now.** Remind me pair and the parse trio are one row from
768px up. The emoji trio takes two lines, because a 375×307 crop, a 375×667
phone screen and a 519×398 card cannot share a row without the portrait one
becoming unreadably narrow. The four unfurls render as a 2×2 in the wide track
from 1024px up; a literal row of four would put each at about 225px, which is
the size at which a screenshot stops saying anything.

**Checks** — Lighthouse on this page before and after: performance 90 → 90,
LCP 2.9s → 2.9s, CLS 0.002 → 0.002, accessibility 100, best practices 100.
Total transfer 196 → 208 KiB: twelve new images cost 12 KiB up front because
all of them are lazy and below the fold. axe 0 violations. 196 local
references, all resolving.

**Still open**
- The `<meta name="description">` and `og:description` still carry the old
  longer deck. The copy update shortened the visible deck to one line; the meta
  was not in scope and is now out of step with it.
- Key decisions kept its `<dl>` rather than the markdown's bold-led paragraphs.
  The `<dt>`/`<dd>` pair is the better semantic fit and is already styled.
- The manifest anchors the Messenger screenshot to "the second paragraph, the
  one ending '…except a name'". The copy update rewrote that paragraph out of
  existence, so it sits at the end of The problem instead — the same place, in
  the new text.

---

## 2026-09-18 — Tier 3 drops the thumbnails (1c → 1a)

The tier-3 rows shipped earlier today with a 64×44 thumbnail per row, direction
1c from the Claude Design file. **The thumbnail column is gone.** The list is
now direction **1a**, the hairline ledger: title and description share a line,
a rule between rows, no images.

**Why.** At 64×44 a 4:3 screenshot crops to something unreadable — it was two
image requests buying no information. ghosted, which has no thumbnail at all,
rendered an empty framed box, which made the point plainly: the column existed
to hold the column. Sizing up was not the answer either. A thumbnail readable
enough to earn its place needs roughly 120px or more, and at that size these
rows start reading as small cards, which defeats the reason the third tier
exists at all.

**What changed with it**
- The title now carries a standing 1px accent underline. Under 1c the whole
  row was the link and the underline only appeared on hover; with no thumbnail
  and no button, the title is the only thing marking a row as a link, so it
  should not need a mouse to reveal it.
- Hover now brightens the description as well as the title's underline.
- The mobile branch got simpler: no thumbnail to resize, so the 480px rule that
  stepped it 64×44 → 48×36 is gone. The description just wraps under the title
  when the row is too narrow to hold both, which is 1a's own behaviour.
- The external-link arrow still has to be moved off the `<a>` onto the title.
  1c made the `<a>` a grid container, 1a makes it a flex container; either way
  the global `a[target="_blank"]::after` rule would otherwise become a layout
  item of its own.

**Rows got shorter,** which is the point: 53px against 77px at 1440, so the
tier now reads as clearly subordinate to the cards above it instead of
competing with them.

**Four thumbnails are now unreferenced** — `edison-dental.webp`,
`edison-dental-thm.webp`, `vbs-scheduler.webp`, `worship-slides.webp`, about
122 KB together. Two of those (`edison-dental-thm`, `vbs-scheduler`) were
already unused before today. They are left in place deliberately rather than
deleted: any of them comes straight back if a project returns to a card.

**[C] Confirmed keep, 2026-09-18.** Raised and kept on purpose. Not dead weight
to be swept on a later pass — the projects they belong to may return to cards,
and regenerating a thumbnail costs more than 122 KB of repo.

**Checks** — no page overflow at any width from 320 to 1440, axe 0 violations
and 39 passes, all local references resolve. The title underline was verified
by computed style rather than by eye, since at phone scale a 1px line at 0.4
alpha is easy to miss in a screenshot: 1px `rgba(96, 200, 240, 0.4)` on all
three rows at both 375px and 1440px.

---

## 2026-09-18 — Edison stops calling itself the featured case study

`projects/edison-dental.html` still opened with "★ Featured case study". It
has not been the featured case study since MAT-732 moved ollae into that slot,
so two pages claimed it and only one was backed by the homepage. It now reads
**"Case study"**, which is what every other project page in `site/projects/`
already says — Collette, Kumon, ollae, pocalab, VBS and Worship Slides are all
plain "Case study". Edison was the only outlier.

The star stays exactly one place: `index.html`, on the ollae featured card.
`.case-study-label` needed no change — it is a generic eyebrow rule with
nothing featured-specific in it, so this is a text swap and nothing more.

Carried as a P1 in `audit-2026-09-18.md` since MAT-732, left alone at the
time because it was a copy decision on a page that ticket had scoped out.

axe on the Edison page: 0 violations, 39 passes. All local references resolve.

---

## 2026-09-18 — Tier 3 becomes thumbnail rows (Claude Design import)

> **Superseded the same day** — the thumbnail column was removed and the list
> moved to direction 1a. See "Tier 3 drops the thumbnails" above. Everything
> below still describes what shipped first, including the thumbnail sizing.

Imported the **Project Tier 3** design from the Claude Design project "Design
table for matthewclau.com". It offered four directions for the third-tier list
— 1a hairline ledger, 1b numbered index, 1c thumbnail rows, 1d indented prose.
Took **1c**. Its sample data was placeholder church content, not the real list.

The "Also built" sentence becomes a list of three rows: thumbnail, title, one
line of description, whole row is the link.

**Contents changed too.** Edison Dental 27 joins the list — it had been in the
Projects section as the featured card until MAT-732 moved it into Experience.
It now appears in **both** places: the MCL Studio entry describes the client
relationship, this row points at the artifact. That partially softens MAT-732's
reasoning ("as a project it reads as web work; as client experience it reads as
a paying client who came back"), which is worth knowing if it ever gets
revisited. Removing it from Experience was not an option — both bullets in that
entry are about Edison, so the entry would have been empty.

**VBS Scheduler came off the list**, leaving Edison, ghosted, Worship Slides.

> **`projects/vbs-scheduler.html` is now linked from nowhere on the site.** The
> "Also built" line was added in MAT-732 for exactly this reason — to keep it
> and Worship Slides reachable after their cards were removed. The page is
> still live and still resolves by direct URL, and there is no sitemap for it
> to fall out of, but nothing on the site points at it any more.
>
> **[C] Confirmed deliberate, 2026-09-18.** Raised and kept out on purpose —
> not an oversight, and not something to re-flag on the next audit. Restoring
> it is one `<li>` in the list whenever it earns a reason to come back.

**ghosted is marked In progress**, as a small mono chip next to the title in
the site accent. Neither the chip nor its wording came from the design — the
design has no status affordance — so it is a draft.

**All three descriptions are drafts.** The design's were placeholder, and no
copy was supplied for the real items:
- Edison Dental 27 — "Patient-facing rebuild for a returning client, WordPress
  to Next.js."
- ghosted — "Job-discovery pipeline: pulls Greenhouse, Lever, and Ashby
  postings, scores them with Claude Haiku, and emails a Monday digest."
  Condensed from the sentence it replaced, which was too long for a row.
- Worship Slides Generator — "Turns PDF setlists into PowerPoint decks, with
  drag-and-drop reordering so a last-minute set change does not mean rebuilding
  the deck." The first half is kept from the old sentence; the reordering half
  was added because the drag-and-drop editor is the thing the tool is actually
  used for week to week, and the one-clause version undersold it. Verified
  against the case study, which frames the whole workflow as upload, review,
  reorder, generate.

**Ported by hand, as always.** `support.js` is a 70 KB generated runtime whose
own header says "GENERATED from dc-runtime/src/*.ts — do not edit", and it
throws unless `window.React` and `window.ReactDOM` exist. A React dependency
cannot go into a site whose premise is no framework and no build step. The
design's Source Serif 4 titles map to DM Sans, matching `.project-card h3`
(only `.identity-name` and section `h2` use the display face), and its rose
accent maps to the site accent.

**One bug the port surfaced.** The global `a[target="_blank"]::after { content:
" ↗" }` rule hangs the external-link arrow off the `<a>` — which here is a grid
container, so the arrow became a third grid item and opened a second row. The
ghosted row measured 119px against 77px for its neighbours. The arrow now
attaches to the title instead, where it reads as part of the link text.

**Checks** — no page overflow and no multi-row rows at any width from 320 to
1440; the thumbnail steps 64×44 → 48×36 at the 480px breakpoint and the row
never wraps, which is the behaviour the design specified. axe 0 violations, 40
passes (up from 39 — the new list adds a passing check). 171 local references
resolve. Thumbnails are `alt=""`: the title sits immediately beside them.

---

## 2026-09-18 — Homepage copy pass: Experience, cards, How I Build

Copy and order only. No classes, components, links, badge styles or layout
changed, and no case study page was touched.

**Switches as run:** SWITCH 1 **ON** (Kumon card heading renamed), SWITCH 2
**OFF** (default Kumon intro, no "my parents' center"), SWITCH 3 **OFF**
(physician startup entry not added; its copy stays in the brief's appendix
until approved).

**Experience now reads in strict reverse chronology** — MCL Studio → Kumon →
Collette → Freelance UX/UI → Freelance Graphic → Rutgers. Only Kumon and
Collette swapped; the other four moved as whole blocks, untouched. The point
is that the two 2025–Present roles now sit together instead of being split by
a 2022–2024 entry.

**Kumon entry rewritten.** Intro, all three bullets and the badge row. The old
copy was résumé-voice ("Leveraged custom automation to optimize daily learning
center workflows") and carried a factual error: it said the backlog extension
ran on Kumon Connect. It runs on **Class-Navi**. The new copy names the right
platform, says marking stays with the instructor, and gives the mechanism —
a synthetic-event helper so Angular's change detection accepts scripted clicks,
and a bulk mode that re-scans the gradebook so it survives re-renders. Badges
trimmed to `JavaScript` and `Chrome Extension MV3`; `Workflow Automation`,
`Scripting` and `Internal Tools` are category tags, and this badge system is
stack only.

**Collette entry** got a lighter pass: new intro and three bullets in place of
two, splitting the old run-on second bullet so the 200+ UserTesting sessions
get their own line with the buyer demographic and the nine head-to-head
studies. Heading, dates, case study link and badge row all kept.

**Rutgers** gains one intro-style line about three years on the university's
Sakai LMS help desk. A `<p>`, not a bullet and not a heading, so the document
outline is unchanged.

**Cards.** ollae's description now says the link unfurls as an event card and
that Claude picks the preview emoji, and ends on the thing that actually
matters — it still runs the games every week. The Kumon card becomes **Kumon
Grading Tools**, plural, because it is two extensions, not one; its copy now
says so and keeps exactly one bold metric. Collette and pocalab untouched.

**"Also built"** gains ghosted, with a repo link rather than a case study link
since it has no case study yet. Three links in the line now.

**How I Build** — two blurbs. /capture+/triage now says the triage pass drafts
issues and creates only the ones I approve, which is what it actually does.
/audit now names what the command checks against: WCAG 2.2 AA, Core Web
Vitals, and the AI-output rules, tiered P0–P2. The other three rows unchanged.

**One thing the brief asked for that does not exist:** it opens with "read
`system.md` (the build plan)". There is no `system.md` in this repo — it is a
label in the How I Build section (`index.html:172`), the token standing for
"Spec before code". The actual build plan is `docs/PROJECT.md`, which is what
was read. Worth knowing before someone goes looking for the file.

**Audit** — `audit-2026-09-18-copy.md`. 0 P0, 0 P1, 2 P2. Zero axe violations,
accessibility and best-practices held at 100, CLS flat at 0.0037, 169/169
local references resolve. Badge contrast explicitly re-confirmed after the
Kumon row was trimmed: all nine `ul.tags` rows at 15.59:1 against a 4.5:1
requirement, and the "Also built" line and its links at 8.03:1 with underlines
carrying the link affordance rather than colour.

Two P2s came out of it. The Kumon thumbnail's alt text still said "Kumon
Grading Automation" — SWITCH 1 was scoped to heading text only, so it was
flagged rather than changed, then approved and fixed in this same commit; the
alt now matches the heading. The other was that Collette put its case study
link above its intro where MCL Studio puts it below — pre-existing and
outside the copy brief, so flagged rather than changed, then approved and
fixed too. Both entries that carry a case study link now read heading,
intro, link, bullets. Nothing from this audit is left open.

---

## 2026-09-18 — Token table gets swatches (Claude Design import)

Imported the **Token Table** design from the Claude Design project "Design
table for matthewclau.com" into `projects/collette.html`. The design offered
two treatments: **1a** hairline rows with a header row and a swatch per value,
and **1b** swatch-led cards with no header. Took 1a, so the real `<table>`,
its `<caption>` and its `<th scope="col">` all survive — 1b would have traded
those for divs, and the Sept 15 audit specifically recorded that table's
semantics as passing.

**What actually changed**
- Each Value cell gains a 15px rounded swatch beside the hex. It is
  `aria-hidden`: the hex sitting next to it already names the colour.
- Code names become chips — `<ul role="list" class="token-chips">` of `<li><code>`,
  the same idiom as `ul.tags` elsewhere on the site.
- `thead th` picks up the design's uppercase/letterspaced treatment, scoped to
  `.token-table` so `.lighthouse-table` keeps sentence case. Verified identical
  before and after on `edison-dental.html`.

**The brief said the header row was missing. It wasn't.** The table has had a
real `<thead>` with four `<th scope="col">` since it was built. The variant
with no header row is 1b, in the design file — not the site. Only the swatch
was genuinely absent.

**`support.js` is not shipped**, same call as the Kumon race comparison
(2026-09-16/17). The design's `<sc-for>` / `{{ }}` / `DCLogic` runtime stays in
the design tool; the five rows are plain markup here.

**The chips use the site accent, not the design's.** The design draws them in
rose `#E9A7AE`. `PROJECT.md` §7 commits this palette to a single accent, so
they use `--color-accent` and the `--color-accent-wash` that already existed.
The layout was imported; the palette wasn't.

**Three width regressions found and fixed before commit**, all caught by
sweeping 320–1440 against the pre-change build rather than eyeballing desktop:

1. **481px scrolled by 5px.** Just above the breakpoint the chip box returns
   while the column is still narrow, and `background-cool_strong` pushed
   `.table-wrap` over. Fixed with `overflow-wrap: anywhere` on the chip, which
   only bites when the column genuinely cannot hold the token.
2. **320–340px scrolled**, widths that fitted before the swatch existed. A
   flex Value cell pins swatch and hex to one line, which adds both to the
   column's min-content. Fixed by dropping to inline layout under 480px only —
   doing it at every width backfired, because the table's auto layout then
   hands the Value column its smaller min-content and stacks the pair on
   desktop with room to spare.
3. **Chips read badly at 390px**, breaking to `backgroun / d-cool_str / ong`
   with a border round each fragment. Under 480px the cell now goes back to the
   comma-separated run of `<code>` it was before — the rendering P2.1 tuned in
   `audit-2026-09-15` — with the commas drawn by `li::after`, so the `<li>`
   elements keep their list semantics for a screen reader. The chip box is a
   wider-viewport affordance only.

That last one retired the old `.token-table td:nth-child(3)` overflow rule;
the break target is the chip now, and it is documented in place.

**Checks** — `.table-wrap` fits with no horizontal scroll at every width from
320 to 1440, matching the pre-change build exactly. axe 0 violations, 35
passes. All 169 local references resolve. `.lighthouse-table` unchanged.

Note the design project is read-only from here: it is `PROJECT_TYPE_PROJECT`,
not a design system, so DesignSync can import from it but cannot write back.

---

## 2026-09-18 — Collette card drops its date (MAT-732 follow-up)

The Collette strip card was titled "Collette Vacations · 2022–2024". It is now
**"Design system · Collette Vacations"**.

The date was there to stop the card reading as a side project, but it was the
only date on any card on the page, so it drew the eye for the wrong reason.
The company name plus a description that opens "Design system and booking-flow
work across four brands" already does that job. Leading with the discipline
rather than the years also matches what the card is there to prove — Collette
is the only team-scale design-system evidence on the homepage.

The years live in the Experience entry, which still reads
`2022–2024 · UX/UI Designer · Collette Vacations`. Nothing else on the card
changed: description, the **200+ usability tests** metric, the case study link
and the "Also built" line are all as shipped.

Note for the open P2 in `audit-2026-09-18.md`: this does **not** fix the ragged
card heights. The new title is 34 characters against the old 30, so it still
wraps to two lines at every width from 375px to 1440px while Kumon and pocalab
take one. Link check still clean at 169 references.

---

## 2026-09-18 — Homepage restructure (MAT-732)

Reordered Projects around what a hiring manager actually checks first. Final
lineup is **ollae (featured) → Collette → Kumon → pocalab**. Worship Slides
Generator and VBS Scheduler come off the homepage; Edison Dental leaves Projects
entirely and reappears under Experience in a new MCL Studio entry.

**Badge rule for the whole page:** no stat badges on cards or timeline entries.
One metric per item, folded into the description as a real `<strong>`. Stack
badges stay.

**Changes**
- ollae takes the featured slot, which also moves from the bottom of the strip
  to the top. Claude API joins its stack badges. No bold metric, per the ticket.
- Collette gets a strip card in second position, labelled
  "Collette Vacations · 2022–2024" so it reads as client work rather than a side
  project. Its thumbnail moved here from the Experience entry.
- New Experience entry: Freelance Design Engineer · MCL Studio, 2025–Present.
  Edison's rebuild lives here with its case study link, trimmed from ten stack
  badges to five. It also closes the gap after Collette, where Kumon had been
  the only Present-dated entry.
- Kumon's Experience badges are gone. They said "10–13 hrs → ~25 min" where the
  project card says multi-day; the bullets already carry the numbers, so
  deleting the badges removed the contradiction rather than papering over it.
- Projects intro loses its count. A sentence with no number in it never falls
  out of date when the lineup changes again.

**Three things the ticket assumed that turned out not to be true**

1. **There is no content data layer.** The instruction was to edit the data, not
   the rendered markup. There is no data to edit — every card, entry, badge and
   tag is a literal `<li>` in `site/index.html`, and there is no build step
   (`wrangler.toml` points Pages at `site/` and serves it as-is). `docs/CONTENT.md`
   and `docs/portfolio-cards-content.md` look like the source but nothing reads
   them; they had drifted far enough to still call Worship Slides "Praise Slides".
   Worth knowing before someone goes looking for the JSON again.
2. **There is no `sitemap.xml`,** and no `robots.txt` either. The ticket's
   "remove both from sitemap.xml" was a no-op. Nothing to remove, nothing to keep.
   What actually keeps the two dropped pages reachable is the new one-line
   "Also built" under the strip, which links both.
3. **The class is `.badges`, not `.stat-badge`,** and it could not be deleted.
   It is shared with the footer Lighthouse strip on this page *and* on
   `projects/edison-dental.html`, where `.cwv-badge` is a naming hook with no
   rules of its own. So the markup came off the cards and the two rules that
   only ever served card badges were deleted, but `ul.badges` and `.badges li`
   stay for the footers. Commented in `style.css` so the next person doesn't
   assume it's dead code.

**pocalab's 45 → 12 metric was cut, not bolded.** The case study says "about 45
minutes to about 12 ... that's my own measurement of my own workflow, so read it
as what it is" — self-measured and hedged twice, so not a timed run. Per the
ticket's own conditional the sentence comes out entirely and the card ships with
no bold metric. The number still lives in the case study with its caveat
attached, which is the right place for it.

**The featured card kept the existing Create Event thumbnail**, not the
three-screen strip the ticket asked for. No composite asset exists, and the
three case study shots are 393×852 portrait — they do not fit the featured
card's ⅓-width cover slot without new CSS and a new mobile rule. Deferred rather
than bodged.

**The pocalab live-demo "bug" was already fixed on the site.** `index.html` and
the case study page both pointed at pocalab.app. The stale `.com` was in the two
content docs, which is where it got fixed.

**Audit** — `audit-2026-09-18.md`. Zero axe violations, accessibility and
best-practices held at 100, all 169 local references resolve, page weight down
73 KiB. CLS was the specific worry, since bolding inside body copy can shift
layout: it went **down**, 0.0036 → 0.0024 (medians of three runs), about 40×
clear of the 0.1 threshold. It doesn't shift because every `<strong>` sits inside
an existing `<p>` with unchanged metrics, and DM Sans 700 is already in the
preloaded font request — no second fetch, no synthesized-bold reflow.

Performance was measured on a bare local server with no compression and none of
the `_headers` cache rules, so **it is not comparable to the footer's 99 / LCP
1.8s**. Measuring the pre-change commit on the same harness gave the same
numbers (89 vs 90 median), so there's no regression — but the footer badge still
needs a re-run against the deployed URL, and it's now dated June 2026 against a
page that has changed. Filed as P1 in the audit.

Also filed as P1: `projects/edison-dental.html` still calls itself
"★ Featured case study" when ollae holds that slot now. Out of scope for
MAT-732 and it's a copy decision, so it's flagged rather than silently changed.

**Next:** decide Edison's case study label, re-run Lighthouse against production
and reconcile the footer badge, and build the ollae three-screen composite.

---

## 2026-09-18 — Only site/ ships (MAT-716)

Cloudflare Pages deploys this repo from the root with no build step, which
means `docs/`, `scripts/`, `tools/` and `.claude/` were all being served.
`docs/` alone is 18 working files — case-study drafts, the content TODO, this
log. The `_headers` file had a `/tools/*` noindex rule with a comment
admitting a header was "the lever available"; the actual lever was to stop
deploying the folder.

**Change**
- Everything public moved under `site/`: `index.html`, `404.html`, `_headers`,
  `styles/`, `projects/`, `gfx/`, `assets/`, and the four site scripts. All
  `git mv`, so history follows.
- Dev-only tooling is now `dev/`: `dev/checks/` and `dev/kumon-media/`, the
  latter from `tools/`. Both `tools/` and the root `scripts/` are gone.
- Loose site-wide files in `assets/` (`photo-primary`, `photo-secondary`,
  `resume.pdf`) → `assets/shared/`, so every file in `assets/` is now in a
  folder that says what it is for.
- `gfx/img/` and `gfx/thumbnails/` → `site/gfx/assets/`, matching the main
  site's layout. gfx had been the odd one out since it was imported.
- The four `gfx/*.md` source notes → `docs/gfx/`. They were being served.
- `_headers` loses the `/tools/*` block, now redundant.
- `wrangler.toml` sets `pages_build_output_dir = "site"`. It overrides the
  dashboard setting, which is the point: the deploy root lives in the repo,
  next to the tree it describes.

**The Pages build config now lives in `wrangler.toml`, not the dashboard.**
Worth knowing before it costs you twenty minutes: `pages_build_output_dir`
in that file *overrides* the Build output directory in the Cloudflare Pages
project settings. Change the dashboard value and nothing happens — the build
keeps using `site` and the dashboard field just sits there looking
authoritative. To move the deploy root, edit `wrangler.toml` and commit it.

**`scripts/` became `dev/`, because the first pass left the name meaning two
things.** MAT-716's target tree had no `site/scripts/` at all, but every page
loads `/scripts/main.js` plus three case-study scripts, so leaving `scripts/`
at the root as dev-only would have 404'd all four. Splitting it — site JS in
`site/scripts/`, tooling in the root `scripts/` — fixed the 404s and left one
name covering both deployed and dev-only code, which is the exact ambiguity
this restructure existed to remove. `dev/` is unambiguous, and nothing public
ever referenced the root folder. The other departure from the target tree
stands: `gfx/projects/` holds HTML pages, not images, so it stayed
`site/gfx/projects/` rather than folding into `assets/`.

**Public URLs did not change.** `site/` is the server root, so
`/projects/...`, `/styles/...`, `/scripts/...` and `/assets/<project>/...`
resolve exactly as before. Only the two intra-site moves needed rewriting:
`/assets/shared/...` and `/gfx/assets/...`.

**How that was shown rather than asserted.** `dev/checks/check-links.js` went
in first, before any move, and took a baseline of the old tree: 14 pages, 3
stylesheets, 159 local references, zero broken. Immediately after the moves it
reported 23 broken — exactly the two relocations and nothing else. After the
rewrite it reports the same 14 / 3 / 159 / zero, and still does after the
`dev/` rename. It strips HTML comments, because `kumon-automation.html` keeps
a `<figure>` commented out so its unbuilt bulk-run poster does not 404, and
scanning it would invent a break.

Served `site/` and walked all 13 pages over HTTP: every page, stylesheet,
script and asset 200s; `/docs/...`, `/dev/...`, `/scripts/...`, `/tools/...`,
`/.claude/...`, the root `audit-*.md` and `/gfx/aduro.md` all 404. `sweep.js`
across 52 page/viewport combinations found 3 problems, all three already in
the README's known standing results (skybluefc's injected Instagram iframes,
edison-dental's overflow at 390/360 — MAT-713). No new regressions.

**gfx is now unlinked as well as unindexed.** All five gfx pages already
carried `noindex, nofollow`, and there is no `robots.txt` or `sitemap.xml` in
the repo to leak it. The one remaining path in was `404.html`, which offered
"the graphic design archive" next to the homepage and projects links — a 404
page being exactly where a curious visitor pokes around. That link is gone;
the rest of the page is untouched. gfx is reachable by being handed the URL.

**`gfx/styles/gfx.css` was already clean too.** It consumes `tokens.css`
variables rather than redefining them, so there was nothing to dedupe. Left
untouched.

---

## 2026-09-17 — Ollae create demo: the example carries a date (MAT-720)

Follow-up to the embeds entry below. The example button read "Board game
night @ Alexander Library at 12:30pm" — no date — so the parse it showed off
was the one case the parser has to guess at. Claude picks tomorrow and says
so in a warning. Correct behaviour, wrong thing to lead with.

**Change**
- The button is now "Board game night @ Alexander Library Saturday at
  12:30pm", with a fourth `.embed-part` (`--date`, `data-part="Saturday"`)
  between place and time. A weekday rather than a calendar date: it never
  goes stale, and it is how people type it in the chat the parser is
  imitating.
- `.embed-part--date` shares the mono rule with `--time`. Date and time are
  the same kind of token, so they read the same; title stays bold, place
  stays dotted-underline.
- No JS. `ollae-embeds.js` collects every `.embed-part` and `allMatched()`
  counts whatever is in the list, so the fourth part wired itself.
- `style.css` → `?v=9` on all 14 pages.

**Kept: the no-date warning.** With the example carrying a date, the guess
only fires on freehand input that genuinely omits one, which is what it was
written for. It is real shipped behaviour — guessing tomorrow and saying so
out loud is the right call for a one-box parser — and removing it would make
the demo show something the app does not do.

**Side effect:** four parts is a higher bar than three, so freehand input
lands on "That works too. Your event is live." more often than the
all-matched line. The prefill button still hits all four exactly.

**Not re-verified:** no Puppeteer run, no sweep, no Lighthouse on this one.
The new span is structurally identical to the three beside it and the matcher
is generic, but the `ollae:input` → four-matched path has not been exercised
against the stub, and nothing has been checked in production since the push.

---

## 2026-09-17 — Ollae: live guestbook and create demo embeds (MAT-720)

Two live ollae.app frames on `projects/ollae.html`, commit `3ff367e`. The Ollae
side (framing allowlist, `embed=1`, message protocol) shipped separately; see
`ollae/backend/docs/session-24-portfolio-embeds.md`.

**What's on the page**
- **Guestbook** (`id="try-it"`) under Approach > Design, after "Remind me":
  `ollae.app/events/wssrfd7v?_src=app&embed=1`. "This event is pretend. The
  list is real." A "Try it here ↓" link in the header row jumps to it.
- **Create demo** under Approach > Engineering, after "one text box":
  `ollae.app/create?embed=1`. The example button "Board game night @ Alexander
  Library at 12:30pm" prefills the box; its three parts turn green with a check
  and hidden "(matched)" text as the typed text contains them (case and
  whitespace ignored). An `aria-live` line reports "Your event is live." or
  "That works too. Your event is live." on `ollae:created`.
- Outcome gains "The list under Design is live. The names on it are people who
  read this page."

**How it loads**
- Each spot is a 2x screenshot (390px wide, WebP + PNG in `assets/ollae/`) with
  a dimmed overlay and a "Try it live" button that starts `hidden` and is
  revealed by `scripts/ollae-embeds.js`. Nothing requests ollae.app until a
  tap. Without JS: screenshot plus the always-visible "Open in a new tab" link
  (the " ↗" comes from the site's `target="_blank"` rule).
- On tap the iframe replaces the screenshot at the same height, then takes
  focus with `preventScroll`. The iframe is `content-box`, so the height Ollae
  posts is the height inside the 1px border; border-box ate 2px and scrolled.
- Messages are accepted only from origin `https://ollae.app` *and* that
  iframe's `contentWindow`; heights must be numbers, clamped 200–4000; posts go
  only to `https://ollae.app`. One pending prefill at most, sent on
  `ollae:ready`.

**Decisions and findings**
- No `_headers` or meta change: there is no CSP or Permissions-Policy, and
  Cloudflare's default `Referrer-Policy: strict-origin-when-cross-origin` still
  gives Firefox the origin.
- The place part was italic first. That pulled a fifth font file (DM Sans
  italic) and cost ~150ms of mobile LCP on every run, so it's a dotted
  underline instead. Mobile LCP is back to the before numbers.
- The example button wraps as a block on phones (buttons can't be truly
  inline), so it's `text-align: start`.
- At 390 the column is 326px, so the live guestbook is ~244px taller than its
  390px-wide screenshot. The frame top stays put; the page below grows.
- `style.css` → `?v=8` on all 14 pages.

**Verification**
- Puppeteer at 1280 and 390, 98 checks: no requests before a tap, keyboard
  Tab/Enter into each frame, no scroll jump, no inner scroll, page-posted and
  wrong-source messages ignored, axe clean with both frames loaded. Prefill and
  matching ran against a stub served at `https://ollae.app/create` (request
  interception), including `ollae:input` "board game night @ alexander library
  at 12:30 PM" → all three matched.
- One real create call off-script ("That works too."); one more parse was
  spent on a preview step the first script didn't click through. No guestbook
  RSVP. "Show all" untested: the list has one name, so the button isn't shown.
- Firefox 155 (Puppeteer's, in `scripts/checks/.cache`): load, heights,
  prefill, matching.
- Sweep: the same 3 known problems. Lighthouse before/after on the page: no
  regression.
- Production after push: both frames render and size on
  `www.matthewclau.com/projects/ollae` at 1280 and 390; the create frame shows
  the Board game night placeholder. iPhone checklist still to do.

**Local gotcha:** another session's test bench also listened on
`[::1]:4321`, and Chrome resolves `localhost` there first. Sweep and Lighthouse
ran against `127.0.0.1:4321`; frame tests mapped `localhost` to 127.0.0.1.

**Filed:** MAT-727. Desktop CLS 0.177 and mobile LCP 2.76s on this page predate
the embeds; both trace to Google Fonts (`.case-study { max-width: 65ch }`
resizes when DM Sans loads, and Lighthouse's simulated first paint counts the
two fonts origins).

---

## 2026-09-17 — Kumon: copy follows the race clip (MAT-714 §1)

Resolved the three content calls flagged in MAT-714 and `audit-2026-09-16`,
on `projects/kumon-automation.html` and the spec doc.

- **"multi-day" → "hours".** The clip shows 50.7 s per set by hand, so the
  meta and og descriptions, deck, metric value, Overview and Outcome now say
  hours of clicking at about 50 seconds a set. The 25-minute unattended figure
  is unchanged.
- **Default threshold 14 → 10 days**, matching `popup-gradebook.webp` and its
  alt text.
- **Student count split:** 70+ students at the centre overall, 10+ on the
  online program whose worksheets go through Class-Navi. The Problem states
  both; Outcome scopes the backlog to the 10+.

Deferred to a later pass: the homepage card and experience bullets
(`index.html:177–180, 312–313`) still say "multi-day" and "70+ students
tracked weekly", so the homepage and case study disagree until then.

---

## 2026-09-17 — Ollae: case study copy rewrite, stats block removed

Copy-only pass on `projects/ollae.html` from
`docs/ollae-case-study-copy-final.md` (everything below its `---`). All eight
body sections replaced, keeping the existing headings, markup and classes.
Header, deck, meta tags and hero strip untouched.

**What the copy changed**
- Overview opens on the real origin (the weekly volleyball game) instead of a
  product description.
- Engineering drops the implementation detail (iMessage UA, `location.replace()`,
  `isCrawlerUA()`, `fogleman/gg`, the admin-token SQL) and points to the repo
  write-up. Inline `<code>` now only wraps `status/in` / `status-in`.
- Key decisions go from four to three: the fogleman/gg-over-Satori entry is
  gone. The file's bold lead-ins became the `<dt>` terms, without trailing
  periods, to match the terms they replaced.
- Outcome drops the RSVP count and Facebook Messenger. Guest-counts sentence
  rewritten as "The first day surfaced a use case I hadn't planned for: groups
  RSVPing as a unit. Guest counts shipped a week later."
- The two optional lines (weekly use, Claude Code implementation) were not
  filled in, so neither was added.

**Stats block removed**
The `case-study-metrics` list (8 RSVPs / 21 sessions / 5 platforms) is gone
from the header. Its CSS stays: six other pages still use it (edison-dental,
kumon-automation, pocalab, vbs-scheduler, worship-slides, gfx/aduro), so
`style.css` is unchanged and stays at `?v=7`. The meta row's own
`margin-bottom` now sets the gap to the tech tags: 24px at 1280 and 390, the
same as the gap above the role line, with nothing left over.

**Verification**
`npm run sweep` before and after: the same 3 known problems both times
(skybluefc `frame-title` at 1440, Edison Dental overflow at 390/360). Ollae
clean at all four viewports.

---

## 2026-09-16/17 — Kumon race comparison hero

Replaced the single race clip on `projects/kumon-automation.html` with the
Race Comparison design from Claude Design, ported to plain HTML/CSS/JS in
`scripts/race-comparison.js` (the design tool's `support.js` runtime is not
shipped). Three commits: `d12c315`, `5f12903`, `020a5bd`.

**One clip, two panels, one clock**
The 1424×648 side-by-side clip is loaded twice and cropped into two panels.
The left `<video>` leads; the right follows and is re-synced whenever it
drifts more than 0.12 s. Timers, lane fills, the Done overlay, the idle count
and the "×N" ticks are all derived from the left video's `currentTime`, so
the seekable track (click, arrows, Home/End) drives everything. Same contract
as `case-study-video.js`: loads and plays only on screen, starts paused under
`prefers-reduced-motion`, Pause/Play button for WCAG 2.2.2.

**Extension side edited, and the copy says so**
- **5.4 s** (`5f12903`): the 2.2 s before the icon click are cut and
  2.2–4.9 s (popup open, moving to the button) plays at 4×:
  9.6 − 2.2 − 2.7 × ¾ = 5.375. The eyebrow and caption stopped claiming
  "real time" / "end to end".
- **2.3 s** (`020a5bd`): frame-checked at 1.9 / 2.1 / 2.2 / 2.3 / 2.4 / 2.6 s.
  The "C II 181–185 has been marked" bar is up by 1.9 s and the page is
  blank with a spinner by ~2.1 s; everything after is the extension
  reloading the home page, which isn't part of the task. No re-encode — only
  `data-right-finish` moved. The timer stops and Done shows at 2.3 s while
  the video plays on under the idle count. Unedited equivalent is 6.5 s
  (4.9 + 2.3 − 0.675); the measured 9.6 s includes the reload.

Stats are clip numbers and labelled that way: **9.4× / 45.3 s / 9 sets** →
**22× / 48.4 s / 22 sets**.

**Tick labels thin out**
At 2.3 s there are 21 ticks instead of 8, spaced ~13px apart at 360px.
Labels now go on every 1st, 2nd, 5th or 10th run, whichever keeps them ≥32px
apart, and still skip anything under the "BY HAND" label. Result: ×3–×22 all
labelled at 1280, ×10 / ×15 / ×20 at 360.

**Cache naming (MAT-715)**
`/assets/*` is served `immutable` and the old URL had a poisoned edge entry,
so every rebuild gets a new filename: `race-side.mp4` → `-2` → `-3`.
`style.css` went `?v=4` → `?v=6` on every page and `race-comparison.js` is
at `?v=3`. `tools/kumon-media/README.md` has the ffmpeg edit recipe and the
current numbers. `race-stacked.mp4` and its poster are unreferenced but left
in place.

**Verification**
Puppeteer via `scripts/checks` at 1280 and 360, seeking to 2.0 / 12 / 50 s:
the timer runs before 2.3 s; after it the badge reads "Done 2.3 s", the foot
reads "Finished at 2.3 s · idle for the remaining 48.4 s", and the idle count
tracks the clock. No label overlap at either width.

---

## 2026-09-16 — Verification scripts committed and pinned

Commits `8d65357`, `e31fa96`. The checks used for the figure system lived in a
session scratchpad, so they couldn't be re-run on another machine and
`docs/image-conventions.md` §7 pointed at nothing. Cut ~30 ad-hoc files down
to four in `scripts/checks/`:

| Script | Checks |
|---|---|
| `sweep.js` | 13 pages × 4 viewports: distortion, over-cap images, horizontal overflow, axe |
| `figures.js` | caption alignment (§3) and each figure's width track |
| `lightbox.js` | the `[data-zoom]` keyboard contract (§6), 14 assertions |
| `perf.js` | Lighthouse LCP/CLS/Performance medians, mobile + desktop |

**Two bugs found by running the committed versions** rather than assuming the
scratchpad copies ported cleanly: `baseUrl()` fell back to `argv[2]`, which in
the path-taking scripts *is* the page path, so the URL came out doubled; and
Git Bash (MSYS) rewrites a leading `/projects/...` argument into
`C:/Program Files/Git/projects/...` before Node sees it. `resolveUrl()` now
takes a full URL and strips the mangled prefix as a fallback.

**Pinned, but still no root `package.json`** — adding one can change what
Cloudflare Pages auto-detects as a build, and the repo has no build step by
design. `scripts/checks/` has its own `package.json` + lockfile (axe-core
4.13.0, lighthouse 13.4.1, puppeteer 25.11.0, exact versions) and a
`.puppeteerrc.cjs` that downloads Chrome into `scripts/checks/.cache/`
instead of `~/.cache/puppeteer`. `node_modules/` and `.cache/` are gitignored.
The README splits quick checks (`npx`, any URL) from site checks
(`npm ci` + `npm run`), and lists the standing known results (Edison Dental
mobile overflow, skybluefc's Instagram iframes, site-wide color-contrast
"incomplete", font-swap CLS) so they aren't re-investigated every run.

---

## 2026-09-16 — Ollae: three-screen hero strip

Commit `b570a3b`, stage 1 of the Ollae media. Three separate phone screenshots
under the header — Create Event, the RSVP page, the success screen — as a
`.shots` figure, with the caption "Describe the event, share the link, tap to
answer. The whole product is these three screens."

Three images rather than one baked composite, so each keeps its own alt text
(written out in full: prompt copy, event details, button states) and the strip
can stack. WebP in `<picture>` with a PNG fallback, 393×852 attributes to
reserve space, `fetchpriority="high"` since they're above the fold. CSS is a
3-column grid (`minmax(0, 1fr)`, 16px gap) that goes to one column at a max
of 320px under 600px; images take the shared 1px border and radius, with the
app's own `#0f172a` behind them so the corners never flash. The caption joins
the shared `figcaption` rule instead of getting its own.

Also in the same commit: deck, meta description and `og:description`
rewritten around "the right tool for a pickup game or team lunch is a link";
footer date → September 2026; `style.css?v=6` → `?v=7` on all 14 pages.

---

## 2026-09-16 — Edge caching: 404 page, versioned filenames (MAT-715)

Commits `2efd034`, `16aee77`, `a5dd82b`. One root cause surfaced three ways:
`/assets/*`, `/styles/*` and `/scripts/*` are served `max-age=31536000, immutable`, so
whatever the edge caches under a URL is what that URL serves for a year.

**Missing paths returned 200.** With no `404.html`, Cloudflare Pages served
`index.html` for every unmatched path — combined with the immutable rule, a
missing asset was cached as a success:

```
GET /assets/kumon-automation/does-not-exist-xyz.mp4
200 · Content-Type: text/html · Cache-Control: max-age=31536000, immutable
```

Hit for real: a request for `race-side.mp4` made before the file shipped
cached the HTML fallback at the edge, and the edge kept serving HTML after
the real file (video/mp4, 880,417 bytes) was live at origin. Added
`404.html` on the existing shell and tokens, `noindex`, 0 axe violations, no
horizontal scroll at 1440/390. Pages serves it with a real 404, which isn't
cached as success, so later deploys can't be poisoned the same way. It also
means "does the URL return 200?" had proved nothing on this site until now.
The entry that already existed needed a manual purge.

**Replacing a file in place doesn't work either.** The Kumon audit's P2.4
said the Done-toast re-capture could keep its filename with no markup change.
Under immutable caching, warm caches keep the old bytes; corrected to ship
under a new name. Rule since then: new content → new filename (`-2`, `-3`)
or a new `?v=`.

**Stale `tokens.css` live.** Cloudflare was still serving a `tokens.css` from
before `35c825e` (`Age` ~2 days, `cf-cache-status: HIT`), so
`--figure-gap`, `--figure-max-h` and `--figure-wide-scale` were undefined on
the live site and every figure had lost its vertical margin. `tokens.css` had
never been versioned; now `?v=2` on all 14 pages.

---

## 2026-09-16 — Kumon page audit (Part A)

Commit `0009644`, `audit-2026-09-16.md`. Lighthouse 13.4.1 (3-run medians),
axe-core 4.13.0, pa11y, Puppeteer viewport and keyboard checks from 360 to
1440px, against the page with its new media.
**0 blockers, 1 important, 5 polish.**

0 axe violations, 0 pa11y issues, Accessibility and Best Practices 100 on
both presets. Three of four Core Web Vitals pass:

| Metric | Before media | Final |
|---|---|---|
| LCP mobile | 2.8s | **1.96s** ✓ |
| CLS mobile | 0.24 | **0.171** ✗ |
| LCP desktop | 0.7s | **0.48s** ✓ |
| CLS desktop | 0.144 | **0.051** ✓ |

The gain came from removing a metric tile, not the media (see the next
entry). Mobile CLS is the one miss — noisy on this harness (0.152 / 0.171 /
0.253) and the same font-swap cause deferred since `audit-2026-09-15`.

P2s: both race posters download on mobile; the worksheet's `sizes` was
inherited from the embed's 960px preview page; popup states wrap 2+1; the
Done toast screenshot breaks mid-word; desktop pulls the 860KB clip on first
view. Content flagged but not changed: "multi-day" against the 50.7 s the clip
shows, "default: 14 days" against the screenshot's 10, and 70+ students still
in body copy.

---

## 2026-09-16 — Kumon case study media

Commits `dc10e5f`, `9b1191e`. Five figures on `projects/kumon-automation.html`
from the kumon-media drop: the race clip, the annotated worksheet, three popup
states, four status bars, and a commented-out bulk-run figure at the top of
Outcome (the clip doesn't exist yet). Superseded as the hero by the race
comparison above.

**Race clip on the wide track** (`.figure--wide`, 969px), swapping to a
stacked 720×1312 portrait cut at 700px, with poster and intrinsic size
swapped before load so the box never shifts. The worksheet uses the lightbox
to reach its @2x file. Popup states and status bars are flex rows that wrap.

**`.figure--wide` was silently a no-op on `.media-figure`** (`9b1191e`). It set
`width` but not `max-width`, and `.media-figure` caps at `max-width: 100%`, so
the wide track clamped straight back to the column with no error anywhere.
Collette never hit it because `.hero-figure` has no max-width. Added
`max-width: none`; the viewport term in the width expression already prevents
overflow. Collette hero re-verified at 969px at 1440 and 1024.

**No `.cs-fig` class.** `.media-figure` already supplies margin, caption voice,
image treatment and height cap, so only arrangement classes are new
(`.cs-video`, `.cs-video__toggle`, `.cs-states`, `.cs-status`). Embed colours
mapped to tokens; focus ring is the site's `:focus-visible`.

**Video script is per page** (`scripts/case-study-video.js`), not `main.js`, so
the twelve pages without video don't carry it: plays only on screen, starts
paused under `prefers-reduced-motion`, 44×44 Pause/Play button.

**Removed the "70+ students tracked weekly" tile.** The shorter header cut the
font-swap reflow enough to move three Core Web Vitals across the line: mobile
LCP 2.8s → 1.96s, desktop CLS 0.144 → 0.051, desktop LCP 0.7s → 0.48s.

**Build tooling in `tools/kumon-media/`** so it travels between machines, with
`X-Robots-Tag: noindex` in `_headers`. Pages serves whatever is committed and
there's no build step, so the files are reachable by direct URL — a header is
the lever available.

Verified 360–1440px: no horizontal scroll, captions aligned, 0 axe violations,
0 pa11y issues.

---

## 2026-09-16 — Figure widths, caption alignment, lightbox

Follow-up to the figure system earlier the same day. That change fixed how big
images are; this one fixes where they sit and what sits under them.

**Captions align to their image, not the text column**
Figures come in three widths relative to the 692px column — narrower and
centred (handoff diagram 385px, phone pair 537px), equal (QA crop), and wider
(hero) — so a caption pinned to the column only looked right in the middle
case. Measured before: hero caption **322px** left of its image, handoff
**154px**, pair **39px**. Now `.media-figure` is `width: fit-content` and the
caption is `contain: inline-size; max-width: 60ch`, which stops the caption's
longest line from driving the figure's max-content width. All 16 image/caption
pairs align at 1440 / 1024 / 390 / 360.

Two things fell out of it. The hero's outdent moved from `.hero-figure > a`
onto the figure itself, so the caption sits inside the wide box instead of on
the text column. And `.media-pair` went `justify-content: center` →
`flex-start`: at desktop the figure is `fit-content` so the line has no slack
and it reads as centred anyway, but once it wraps on a phone the slack pushed
each image 44px off the caption's left edge.

**Hero 1.93× → 1.4× the column, as a reusable track**
`--figure-wide-scale: 1.4` plus a `.figure--wide` class; 1336px → **969px**.
The width rule is wrapped in `max(100%, …)` so a page with a gutter narrower
than `--space-8` can never resolve the "wide" track below the column — it
doesn't bind today (hero is exactly 1.0× the column at 390 and 360) but the
failure would be silent.

`sizes` re-derived from the new rule to `(min-width: 1033px) 969px,
calc(100vw - 4rem)` — 1033px is where the viewport clamp takes over from the
1.4× term. Desktop @1× now picks the 1000w candidate (41KB) instead of 1600w
(85KB); mobile is unchanged at 1000w.

**Lightbox** — `scripts/main.js`, fourth IIFE, no library
Native `<dialog>` built lazily on first open. The trigger stays a real
`<a href>` so it still works with JS off. Deliberately **no Space handler** —
links activate on Enter and Space should keep scrolling. Modified clicks
(meta/ctrl/shift/alt, non-primary button) pass through untouched so
open-in-new-tab still works. Accessible name is `"View full-size: " + alt`;
the dialog has its own `aria-label`. `src` is assigned at open and removed on
close, so the 199KB 2× board is never fetched on page load — verified.

One real bug caught in review: `.lightbox` had no `position: relative`, so the
close button's `position: absolute` resolved against the initial containing
block and rendered off-screen above a viewport-height image.

**Consistency**
One treatment for every image — same `--radius`, same 1px `--color-border`, no
padding — folded into a single selector covering both `.media-figure img` and
`.hero-figure img`. Worth recording that the rule was *already* identical; what
looked inconsistent was content. The hero's white surround is the asset's own
background and the handoff's hairline disappears against its dark chrome.
Neither is CSS; both need new assets.

Phone pair gets a nested `<figure>` per image with its own label ("Design ·
Adobe XD", "Build · live site" — placeholder copy, flagged), so the label binds
to one image instead of leaving the reader to infer left-from-right. Inner
figure margins zeroed explicitly against both the UA default and `--figure-gap`.

Token table left alone: it uses `<caption>` inside `<table>`, which is the
correct element, and `caption-side: bottom` already matches the figures.

**Verification**
13 pages × 4 viewports: no distortion, nothing over the height cap, no
horizontal overflow. axe-core 0 violations on all 13. Caption contrast measured
at **8.03:1** (`#a8a8a2` on `#0f0f0e`) against a 4.5:1 bar — no token change.
Lightbox keyboard walkthrough: Tab → Enter opens, Esc closes and returns focus,
Space scrolls without opening, ✕ and backdrop both close, ctrl+click not
intercepted. All pass.

**LCP: measured, and the honest version is complicated.** Localhost medians
over 5 runs went **1.81s → 1.96s**. But the harness is bimodal — *both* states
produce a ~3.15s cluster (2 of 5 before, 2 of 5 after) alongside the fast one,
so the medians sit inside a ±1.35s band. The real signal is the fast cluster
shifting 1.76–1.81 → 1.96, which traces to style.css growing 18.0KB → 22.4KB of
render-blocking CSS. Gzipped that delta is only **+1.6KB**, and `npx serve`
sends CSS uncompressed where Cloudflare Pages applies Brotli — so localhost
overstates the production cost roughly 3×. The audit's 1.7s is a production
number and is not comparable to either figure here.

**Deferred**
Hero white ground and a tighter board crop (new assets, not MAT-713, which is
the mobile crop); three untitled Instagram-injected iframes on
`gfx/projects/skybluefc.html`; the pair label copy pending confirmation.

---


## 2026-09-16 — Site-wide figure system

The Collette page shipped with images that had no shared rules: every figure
was `width: 100%`, which is right for a 16:9 board and wrong for everything
taller than it is wide. Measured at 1440px, the March 2023 phone screenshot
rendered **334×724** (near life-size, taller than the hero) and the February
2024 handoff diagram rendered **692×922** — taller than the viewport. Replaced
with one rule that covers every orientation. Written up in
`docs/image-conventions.md`.

**Height cap instead of width fill**
`--figure-max-h: clamp(18rem, 70vh, 32rem)` and `--figure-gap` added to
`tokens.css`. `.media-figure img` is now `width: auto; max-width: 100%;
max-height: var(--figure-max-h)`, so CSS derives the width from the intrinsic
ratio and a portrait image gets narrower rather than taller. Handoff diagram
692×922 → **385×512**; the pair 334×724 / 334×620 → **237×512 / 276×512**,
which also lines their tops and bottoms up for free. The `clamp` floor keeps
the image at 288 CSS px under 400% zoom, where a bare `70vh` would collapse.

`width` has to stay `auto`: with a definite `width: 100%`, `max-height` clamps
the height alone and squashes the image — the handoff diagram rendered
692×512 from a 768×1024 source (80% distortion) on the first attempt. Caught
by a ratio check across all 13 pages, not by eye. Side effect of `auto`:
images are no longer upscaled past their natural size, so the 400×400
Doughmain GIFs and 600×363 Aduro GIFs render sharp at source size instead of
being stretched to 692.

**Hero caption moved onto the body measure**
The breakout now applies to `.hero-figure > a`, not to the figure, so the
caption starts at the same left edge as the prose instead of 322px to its
left. That was most of why it read as a stray opening line.

**Captions take the metadata voice**
`--font-mono` / `--text-xs` / `--color-text-muted`, `max-width: 68ch`,
`margin-top` 8px → 16px; figure margins 32px → 48px against 16px paragraph
gaps. Was DM Sans 15px against DM Sans 17px body — same typeface, one step
down, so it parsed as body copy. Changing the family does what size and colour
could not.

**`.media-pair` grid → flex**
Once the height cap sets each image's width, two equal `1fr` columns leave
uneven gutters. Flex with `justify-content: center` and `flex-wrap` keeps the
gutter even and drops the explicit 480px stacking breakpoint.

**One system, not two**
`gfx/styles/gfx.css` carried a duplicate copy of `.media-figure`, its `img`,
and `figcaption`; deleted, so the archive inherits `style.css`. Its
`.video-caption` had `margin-top: calc(…) 0 var(--space-8)` — three values on
a longhand, so the whole declaration was being dropped. Fixed (rule is not yet
used in any page). `style.css?v=3` → `?v=4` on all 13 pages.

**Verification**
All 13 pages at 1440 / 390 / 360: no distorted images, none over the cap, no
horizontal overflow. axe-core 0 violations on the Collette page, both gfx
pages checked, and the homepage. Collette CLS 0.056 (was 0.063; still the
deferred font-swap shift). Pre-existing and untouched:
`projects/edison-dental.html` overflows horizontally on mobile (553px in a
390px viewport) — no images on that page.

---


## 2026-09-15 — Collette Vacations hub page

**New page: `projects/collette.html`**
Case-study page for the Collette Vacations role, copy verbatim from `docs/collette-hub-v6.md` ("Page copy" section). Follows the existing case-study head/header/footer pattern. No metrics strip, no tags, no JSON-LD, no `og:image` — consistent with the other case studies. Three spoke entries (Air booking, Reviews, Compare Tours) render as headed paragraphs with an HTML comment marking each future link; those pages don't exist yet.

**Hero as a breakout figure**
The 1600×900 component-library board would render ~700px inside the 65ch column and its 11px labels would be unreadable, so `.hero-figure` breaks out to the site's `--max-width` (1400px minus the page's 2rem inline padding = 1336px), centered with `left: 50%; transform: translateX(-50%)`. `sizes="(min-width: 1400px) 1336px, calc(100vw - 4rem)"` matches the real rendered widths. The `<img>` is wrapped in a link to the 2x file so it can be opened full size. First `srcset` on the site.

**Body figures**
Four Confluence artifacts converted to WebP (Pillow, q82) into `assets/collette/`, native dimensions except the Aug 2024 QA screenshot which is cropped to callouts D–F. Each is a `<figure class="media-figure">` with `<figcaption>` from the v6 Images table, placed directly after the paragraph containing the sentence it proves. The March 2023 design/build pair sits side by side in `.media-pair` (stacks under 480px). `.media-figure` rules are now in `style.css`; `gfx/styles/gfx.css` still carries its identical copy, untouched.

**Close table**
Real `<table class="token-table">` with `<caption>`, `<th scope="col">`, `<code>` on hex values and code names, inside `.table-wrap` (`overflow-x: auto`). Shares the `.lighthouse-table` rules without the last-row accent.

**Homepage**
Collette experience entry gets a linked 800×600 thumbnail (crop of the hero board, `assets/thumbnails/collette.webp`, capped at 360px in the timeline) and a "Read Case Study" link using the `.project-card-media` / `.project-links` pattern. Badges: dropped "handoff time −30%" and "task completion +20%" (v6 decision 4), kept "200+ usability tests", added "first Dev Mode rollout" and "4 brands". No seventh project card.

**Cache + docs**
`style.css?v=2` → `?v=3` on all 13 HTML pages in one commit (`/styles` is immutable-cached). `docs/CONTENT.md` "two years" → "two and a half years". `docs/collette-hub-v6.md` stays local (gitignored) — its sources appendix names the partner brands the page leaves unnamed.

**Experience copy (same day, follow-up)**
Collette entry bullets rewritten to the countable claims: first Figma design system + Dev Mode for a 6–8 person dev team (replacing Zeplin exports and hand-made diagrams); tour/pricing/booking flows across 4 brands, Compare Tours shipped 2023, 200+ UserTesting sessions, nine competitive studies. Kumon entry: badge "~96% Latency Reduction" → "~96% time reduction", "over 70+" → "70+". Footer "Last updated" → September 2026 (Lighthouse badge and its June label left as measured). Collette page gains an italic "Three deeper pages are in progress." above the first spoke heading. `docs/CONTENT.md` and `docs/update_kumon_experience.md` synced to match.

**Audit + close-out (same day)** — see `audit-2026-09-15.md`
0 blockers, 1 important, 4 polish. Fixed: mobile LCP 3.0s → 1.7s by adding a 1000w hero candidate (`collette-hero-board-1000.webp`, 41 KB) to the `srcset`; token table fits a 360px column with the caption visible (`--text-xs`, tighter padding, `overflow-wrap: anywhere` on the code-names column only, `code { font-size: inherit }`); hero link gets an sr-only "Open the full-size board". Deferred: desktop CLS 0.063 from font swap (site-wide font-metrics work). Left as is: the homepage double tab stop (existing card pattern).

---

## 2026-06-24 — Sidebar identity polish + Email Me button (MAT-484–488)

Five quick-wins to sharpen the sidebar identity and footer.

**"DESIGN ENGINEER" label (MAT-486)**
Added `<p class="profile-role">DESIGN ENGINEER</p>` between the name and the Email Me / Résumé buttons. New `.profile-role` rule: `font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-muted); letter-spacing: 0.12em`.

**Email Me button (MAT-484)**
Replaced the plain `Email` anchor with `<a class="resume-link" href="mailto:…">Email Me</a>` so it's visually identical to the Résumé button. Arrow added via `a[href^="mailto"]::after { content: " ↗"; }` — piggybacking the existing `a[target="_blank"]::after` rule (combined selector) so both link types get consistent treatment.

**Profile header gap**
Increased `.profile-header` gap from `--space-3` to `--space-6` for more breathing room between the photo and the name/label/buttons column.

**Identity copy (MAT-487, MAT-488)**
- Hook (`identity-tagline`): "I build free tools that replace the paywalled and the broken."
- Bio (`identity-bio`): "A designer with a CS degree, shipping them end to end — accessible by default." — new `.identity-bio` rule applies `color: var(--color-text-muted)` and `font-size: var(--text-sm)` to visually subordinate it to the hook.

**Footer CTA (MAT-485)**
Added `<p class="footer-cta">Want something built? Contact me at <a href="mailto:hello@matthewclau.com">hello@matthewclau.com</a>.</p>` as the second line in the footer.

---

## 2026-06-22 — Sidebar layout polish + resume, icons, font loading

**Résumé link (MAT-440)**
Added `assets/resume.pdf` and swapped the pending placeholder span for a live `<a>`. Cleaned up orphaned `.resume-link--pending` CSS → `.resume-link`.

**Profile header restructure**
Wrapped `identity-name` + `profile-contacts` (Email / Résumé) in a `.profile-info` div. Profile photo set to 96px. Layout is flex row at ≥1366px (photo left, info right), flex column below that (info stacks under photo). Single `@media (max-width: 1365px)` breakpoint handles the switch. Removed the intermediate 1280px/1155px breakpoints added during iteration.

**Social links**
GitHub and LinkedIn replaced with inline SVG icons + `aria-label` + `.sr-only` text. Added `.sr-only` utility class to `style.css`. Icons live in `sidebar-bottom` so they anchor to the bottom of the sidebar; Email and Résumé sit in `.profile-info` under the name.

**Font loading**
Switched all pages from `display=optional` back to `display=swap`. `optional` was chosen during the June 20 audit to suppress Speed Index inflation, but the tradeoff (system fonts on every first load) is wrong for a portfolio where first impressions matter. Updated `index.html` and all 6 case study pages.

**Email alias**
Updated sidebar email from `contact@matthewclau.com` → `hello@matthewclau.com`.

**"Matthew C Lau" — no period**
Removed the period after C across title, OG tags, h1, and alt text.

---

## 2026-06-21 — Case study pages, card updates, and site polish (MAT-440 through MAT-449)

Major content push across the whole site.

**Case study pages**
Created 5 new case study pages (`projects/ollae.html`, `projects/pocalab.html`, `projects/worship-slides.html`, `projects/kumon-automation.html`, `projects/vbs-scheduler.html`) and rewrote `projects/edison-dental.html` from scratch. All 6 follow the full template structure: Overview → Problem → Role & Constraints → Approach (Design + Engineering) → Key Decisions → Outcome → Reflection. All include OG meta tags for shareable unfurls.

**CSS additions for case study layout**
Added `.case-study-deck`, `.case-study-meta-row`, `.case-study-metrics` (impact strip with big numbers), `.case-study-section--approach h3` (cyan left-border accent for Design/Engineering subsections), `.key-decisions` (dl layout), and `.lighthouse-table` (bordered mono table, last-row accent).

**Homepage card updates (MAT-443, MAT-444, MAT-445)**
- All 6 cards now link to their case study pages with consistent "Case study" text.
- Edison Dental featured card: description rewritten to lead with capability (live open/closed CTA, receptionist-editable CMS, Schema.org structured data); metrics badges added to footer.
- Pocalab: card metrics backed by real measurements (45 min → 12 min, ~70% faster); case study Outcome section rewritten with the full sourced breakdown including the gluing-eliminated and mirroring-handled details.
- Worship Slides: metrics updated to ~45 min → <1 min.
- VBS Scheduler: metrics updated to "Replaces Doodle / 3 hrs → 10 min per audit cycle".
- Kumon: description fixed from "bookmarklet" to Chrome Extension MV3 throughout card, experience entry, and case study.

**Consistency fixes (MAT-442, MAT-446)**
- Kumon experience bullet updated to "Chrome extension (Manifest V3)".
- Freelance experience Edison Dental entry clarified to "original site build (WordPress/Elementor) — later rebuilt from scratch in Next.js".

**Contact + OG (MAT-441, MAT-447)**
- Set up Cloudflare Email Routing: `contact@matthewclau.com` forwards to personal Gmail.
- Added `mailto:contact@matthewclau.com` as "Email" link in sidebar socials.
- Added OG meta tags (`og:title`, `og:description`, `og:type`) to homepage.

**Page structure + How I Build (MAT-449)**
- Swapped section order: Projects → How I Build → Experience (was Projects → Experience → How I Build). Process is now visible before a reader drops off.
- Nav updated: "How I Work" → "How I Build", order matches new page order.
- Intro sentence updated to name all three tools: Claude Code, Linear, Figma.
- Added fifth workflow row: "Design when the UI demands it" (Figma + MCP).
- All three inline-token logos updated to brand colors: Claude Code `#D97757`, Linear `#5E6AD2`, Figma multicolor (5-shape logo with correct per-path fills).

**Copy (MAT-448)**
- Projects section intro rewritten: "Six projects across community tools, client work, and internal automation — built to replace what was paywalled, clunky, or missing entirely." Differentiates from bio copy.

---

## 2026-06-20 — Audit sweep: all 8 findings from 2026-06-19

Closed every open item from the 2026-06-19 audit (1 P0, 3 P1, 4 P2). Six were quick wins done first; two were deep-work items done in a follow-up pass.

**P0 — Touch targets (WCAG 2.2 SC 2.5.8)**
`nav a` and `.socials a` had `padding-block` only. Added `padding-inline: var(--space-3)` to both rules. The added horizontal padding widens the clickable zone to satisfy the 24px circle clearance requirement without affecting visual layout.

**P1 — h1 name too small**
`.identity-name` was `font-size: var(--text-lg)`. Bumped to `var(--text-xl)` so the name is visually dominant over the nav and body copy below it.

**P1 — Wrong initial active nav item**
`setActive('about')` on line 36 of `main.js` referred to a section that no longer exists (removed in MAT-425). Changed to `setActive('projects')` — the first real section in DOM order — so a nav item is highlighted on fresh page load instead of nothing.

**P2 — Image fetch hints**
Added `fetchpriority="high"` to the primary profile photo (the probable LCP element) and `loading="lazy"` to the secondary photo (hidden by default, no reason to fetch eagerly).

**P2 — Footer badge**
Updated Performance from 96 to 94 to match the actual Lighthouse reading from the audit. Accessibility stays at 100 (expected to hold after the touch-target fix); Best Practices stays at 100 (96 seen locally was a network-error artifact that doesn't appear in production).

**P2 — Period check**
Audit noted a period after "Matthew C. Lau" that appeared missing on live. Checked source — no period in `index.html:31` either. No change needed; already resolved.

**P1 — Font loading / Speed Index**
The `display=swap` parameter on the Google Fonts URL caused text to swap in after FCP, inflating Speed Index to 6.6s locally. Changed to `display=optional` in both the preload `href` and the `<noscript>` fallback. With `optional`, the browser uses the web font only if it arrives before FCP; otherwise it commits to the system fallback for that visit — no swap, no Speed Index inflation. Tradeoff: on very slow connections users may see system fonts permanently for a given visit.

**P2 — External link indicators**
Added one CSS rule after the base `a {}` block: `a[target="_blank"]::after { content: " ↗"; font-size: 0.75em; }`. Covers all 13 external links across both pages (social links, Live demo, Repo) automatically without touching each anchor.

---

## 2026-06-19 — Featured card: image window padding

Iterated on the `.project-card--featured` image layout to get the image window correctly padded and filling.

**What didn't work:** `inset: var(--space-6)` on the absolutely-positioned `.project-thumb` shrank the image — it floated inside the wrap with card background visible around it. That's a floating image, not a padded window.

**What works:** `margin: var(--space-6) 0 var(--space-6) var(--space-6)` on `.project-thumb-wrap` itself. The wrap is the "window" — margined away from the card edges to match `.project-card-body`'s `padding: var(--space-6)`. The image fills the wrap with `inset: 0; width: 100%; height: 100%`. Added `border-radius: var(--radius)` to the wrap (clipped by existing `overflow: hidden`). Right margin is 0 because the body column's own `padding-left: space-6` already provides the gap between image and text.

Mobile override (`≤580px`): `width: auto` instead of `width: 100%` so horizontal margins don't overflow, `margin: var(--space-6) var(--space-6) 0 var(--space-6)` for symmetric inset.

---

## 2026-06-19 — MAT-428: `.badges` and `.tags` — vertical padding to tighten inter-list gap

Three rounds of iteration to land the correct fix.

**Root cause discovered mid-fix:** `ul[role="list"]` in the CSS reset has specificity (0,1,1) — one element + one attribute selector — which beats `.badges, .tags` at (0,1,0). Every `padding-block` and `margin` set in the shared rule was silently overridden to 0, leaving the lists literally touching. Fixed by changing the selectors to `ul.badges, ul.tags` (specificity (0,1,1), wins by source order since it comes after the reset).

**Final state:**
- `ul.badges, ul.tags`: `padding-block: var(--space-2)` for internal breathing room; `margin-top: var(--space-2)`; `margin-bottom: var(--space-4)`.
- `ul.badges + ul.tags { margin-top: 0 }`: eliminates the doubled margin-top when tags directly follows badges (project cards, Kumon entry). Cases where a plain `<ul>` sits between them (Collette, Freelance UX) are unaffected.

---

## 2026-06-19 — MAT-425: Section order research spike + implementation

Research spike concluded the current order (About → How I Work → Experience → Projects) buried Projects — the strongest proof of "design engineer who ships" — behind ~1,000 words of narrative. Recommendation written to `docs/MAT-425-section-order-recommendation.md`.

A planning discussion also surfaced that the proposed trimmed About (one sentence) was nearly identical to the sidebar tagline already on the page, making About redundant. Decision: absorb the bio into the sidebar and remove About from main entirely.

**Implementation:**
- **Removed `#about` section** from `<main>` and its nav item.
- **Added `<p class="identity-bio">`** to the sidebar below the tagline: "Designer with a CS degree. 2 years building enterprise UX at Collette, now shipping under MCL Studio." Sidebar now carries the full identity story (tagline + credential).
- **Reordered sections** to Projects → Experience → How I Work. Projects opens the scroll immediately after the sidebar; How I Work closes as a process differentiator after the reader has seen the work.
- **Updated skip-link** target from `#about` to `#projects`.
- **Nav updated** to 3 items in new order (Projects / Experience / How I Work).

Scroll-spy JS and CSS were confirmed order-agnostic (ID-based, no `nth-child` or sibling dependencies) before touching anything.

---

## 2026-06-19 — MAT-422 + MAT-423 + MAT-424: Sidebar polish — spacing, photo, name font

Three quick-wins to make the sidebar feel more intentional.

- **MAT-422** — Changed `main` `padding-block` from `--space-16` to `--space-12` to match the sidebar, resolving the uneven vertical offset between the two columns.
- **MAT-423** — Profile photo: `border-radius` → `50%`, added `box-shadow: 0 0 0 2px var(--color-accent)` ring. Replaced the old placeholder-div CSS on `.profile-photo-img` (flex centering, padding, mono font, border background) with `object-fit: cover` + full `width`/`height` so the real photo fills the circle edge-to-edge. Added 4px `margin-inline-start` to offset the photo from the sidebar's left wall.
- **MAT-424** — `.identity-name` now uses `var(--font-display)` (DM Serif Display) at `--text-lg` with `line-height: var(--leading-tight)`, making the name typographically distinct from the body copy nav links below it.

---

## 2026-06-19 — MAT-426: Featured card — two-column top + full-width footer

Redesigned `.project-card--featured` from a single horizontal flex row into a two-zone layout:

- **Top:** `.featured-card-top` — `flex-direction: row`; image fills left column (1/3 width, `position: absolute; inset: 0; object-fit: cover` so it fills whatever height the text drives); label + h3 + description + project links in `.project-card-body` on the right.
- **Footer:** `.featured-card-footer` — full-width strip below a `border-top` separator, holds the tech stack badges only.
- **Image:** switched from the old placeholder crop (`edison-dental.webp`) to a full-page hero screenshot (`edison-dental-thm.webp`).
- **Mobile (≤580px):** `.featured-card-top` stacks to column, `.project-thumb-wrap` gets `aspect-ratio: 16/9` so the absolutely-positioned image has a defined height to fill.

Removed the old `position: relative` + absolute-fill approach on `.project-thumb-wrap` that was specific to the previous layout and replaced it with an equivalent pattern scoped to `.project-card--featured .project-thumb`.

---

## 2026-06-17 — MAT-391: "How I Work" — asymmetric command-list layout

Replaced the horizontal 4-card grid (`.process-cards`) with a scannable vertical stack. Each row splits into a fixed 140px left column (muted mono command token) and a flex-1 right column (bold h3 + body copy). Removed the old `.process-cards`, `.process-card`, `.process-card h3`, `.process-card p` rules entirely.

- **Intro sentence** — `Claude Code` and `Linear` wrapped in `<code class="inline-token">`, styled with `border: 1px solid var(--color-border)` and mono font to match the existing tag pill language. No colored backgrounds — strictly monochromatic per spec.
- **Four workflow rows** — `/_ capture`, `system.md`, `↳ linear`, `/_ audit` as left-column tokens; updated copy for all four rows; removed the old trailing paragraph ("The point isn't the tools…").
- **Responsive** — `flex-direction: column` below 768px, command token drops cleanly above its h3.
- **Group-hover-dim** — extended the existing `.timeline` / `.project-cards` opacity pattern to cover `.workflow-list` / `.workflow-row`, consistent with site-wide interaction language.

Verified at 1440px and 375px via Playwright — 2-col layout holds on desktop, collapses correctly on mobile. `↳` glyph renders cleanly in DM Mono.

---

## 2026-06-17 — MAT-390: Kumon experience block reframe

Pure copy swap, no CSS or layout changes. Reframed the role around workflow optimization and internal tooling to match a Design Engineer portfolio framing.

- **Title** — `Administrative Assistant` → `Operations & Tooling Assistant`
- **Summary** — replaced one-liner with "Leveraged custom automation to optimize daily learning center workflows and student progress pipelines."
- **Badge 1** — `~96% time cut` → `~96% Latency Reduction`
- **Bullets** — replaced 2 bullets with 3: automation engineering, student pipeline impact, platform/asset work
- **Tags** — `JavaScript`, `Automation`, `Bookmarklet` → `JavaScript`, `Workflow Automation`, `Scripting`, `Internal Tools`

Verified the parallel Kumon Grading Automation project card in `#projects` was untouched — still shows original badge text and `Bookmarklet` tag as expected.

---

## 2026-06-16 — Projects grid redesign + audit sweep

**Projects section (`#projects > ul`):** The `auto-fit` grid with `grid-column: span 2` on the featured card was creating a phantom gap next to Worship Slides — the featured card couldn't start at column 2, so it forced a new row and left column 2 empty. Fixed by switching to an explicit `repeat(3, 1fr)` grid and moving the featured Edison Dental card to the last position (`grid-column: 1 / -1`, always full-width regardless of column count). The featured card also got a horizontal layout (`flex-direction: row`) — thumbnail fills the left 38%, body fills the right — which gives it a visually distinct "case study" feel rather than just a stretched version of the regular cards. Responsive: 2-col at ≤900px, 1-col at ≤580px; featured card flips to vertical column layout on mobile.

**`/audit` run (Lighthouse 12 / axe-core 4.11.4 / pa11y):** Full results in `audit-2026-06-16.md` (re-audit section appended). Scores: Performance 94, Accessibility 100, Best Practices 100. INP 20ms, CLS 0.002 — both excellent. Two P0s, two P1s, three P2s found. All seven fixed this session.

**P0 fixes:**
- **Skip-to-main-content link** (WCAG 2.4.1 Level A) — `<a class="skip-link" href="#about">` added as first child of `<body>`, visually hidden off-screen, slides into view on `:focus-visible`. Keyboard users can now bypass the 7-element sidebar with one Tab.
- **Résumé link 404** — `/assets/resume.pdf` doesn't exist. Converted the `<a>` to `<span aria-disabled="true" class="resume-link--pending">` with muted mono styling matching the `link-pending` pattern used in the projects section. Swap back to a real link when the PDF is ready.

**P1 fixes:**
- **Async font loading** — Google Fonts CSS was render-blocking at 796ms wasted, holding LCP at exactly 2.5s. Changed `<link rel="stylesheet">` to `<link rel="preload" as="style" onload="…">` + `<noscript>` fallback. Body text falls back to system font during load; `display=swap` was already in the URL so the swap is clean.
- **Touch targets** — nav links, social links, and project links were 26–34px tall (pass WCAG 2.2's 24px minimum but miss the 44px comfortable guideline). Bumped all three from `padding-block: --space-1` to `--space-2`.

**P2 fixes:**
- **Scroll-spy initial state** — added `setActive('about')` before the IntersectionObserver initializes so About is active on fresh page load instead of no item being active until the first scroll.
- **Cache headers** — created `vercel.json` with `Cache-Control: public, max-age=31536000, immutable` on `/styles/*`, `/scripts/*`, `/assets/*`.

---

## 2026-06-16 — MAT-372: Featured card alignment (research spike)

Diagnosed by direct Playwright measurement before touching any CSS:
`.project-card--featured`'s `padding: var(--space-6)` inset its thumbnail
25px below the grid row's top edge while the standard neighbor card's
thumbnail sat flush — a visible top-edge mismatch. The same padding also
made the two cards' natural heights diverge (647px vs 683px) despite the
grid's default stretch behavior.

**Fix (spike option 1 — chosen over a redesigned visual treatment or
accepting the "card within a card" look):** moved the padding off the
card itself onto a new `.project-card-body` wrapper around everything
except `.project-thumb`. The card now uses `overflow: hidden` +
`border-radius` so the thumbnail bleeds flush to the card edges exactly
like standard cards do, with the accent border framing the whole card
(thumbnail included) rather than just the text content.

Re-measured after the fix: thumbnail tops align within 1px (the border
width) across the row, and the two cards' heights now match exactly
(647px both, down from a 36px gap) — resolved as a side effect of the
same change, not a separate fix. Verified at mobile width too (375px) —
clean stack, no regression. Zero console errors.

---

## 2026-06-16 — MAT-370: Profile photo placeholder

Both MAT-370 and MAT-371 were data-blocked (no real photos in `assets/`;
`CONTENT-TODO.md` §3 metrics still blank). Asked the user how to proceed:
build MAT-370's mechanism now with placeholders (2-image hover swap,
pure CSS); leave MAT-371 untouched since there's no real metric data yet
and the ticket itself forbids fabricating placeholder numbers.

- **MAT-370 — profile photo placeholder with 2-image hover swap.** Added
  `.profile-photo` as the first child of `.sidebar-top` (above the name) —
  two stacked placeholder divs, hovering cross-fades from "Photo 1" to
  "Photo 2." 96px box (`var(--space-24)`) with `var(--radius)` corners,
  matching the site's existing soft-rounded-square thumbnail/badge
  language rather than introducing a circular avatar. Hover gated behind
  `@media (hover: hover)` (same guard as group-hover-dim) and the
  transition gated behind `prefers-reduced-motion: no-preference` (same
  fix pattern as MAT-361) — verified the opacity state still swaps
  instantly under reduced motion, only the animated cross-fade is removed.
  Not `aria-hidden`, matching how `.project-thumb`'s pending-state
  placeholders are already handled. Blocked on real photos to swap in;
  the mechanism itself is fully built and verified.
- **MAT-371 — left untouched in Backlog.** No real metrics exist yet for
  ollae/pocalab/Worship Slides/VBS Scheduler; nothing changed.

---

## 2026-06-16 — Inbox triage: content fixes & polish

Captured via `/capture` into `docs/INBOX.md`, triaged via `/triage`. Quick
wins done directly below; the rest became standalone Linear issues (no
milestone — these are post-Phase-4 polish/content items, not part of the
phase build plan).

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
- **Add `docs/CONTENT-TODO.md`.** A single fill-in checklist for every
  remaining content gap needing real data: repo links per project,
  pocalab/Edison tech-stack tags, `resume.pdf`, the "other" social, the
  studio hub URL, Edison's Lighthouse before/after, project metrics, and
  thumbnail files (recommended filenames already match what `CONTENT.md`
  references, plus recommended aspect ratios and checkboxes). Noted in
  `PROJECT.md` §10's file structure for consistency.

**Linear issues created for the rest:** MAT-368 (strengthen Edison Dental
hook/metrics + SEO copy, High/Deep Work — ties into Phase 5), MAT-369
(update About section, Medium — flagged too vague to act on without
clarification), MAT-370 (profile picture placeholder + hover-cycling,
Medium/Deep Work — blocked on real photos), MAT-371 (add metric badges to
more projects, Medium/Quick Win — blocked on `CONTENT-TODO.md` §3's data).
`docs/INBOX.md` cleared back to just the header — all 8 captured items
triaged.

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
