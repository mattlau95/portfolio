# CONTENT.md — site content as data

> Source of truth for everything the markup renders. Edit copy here, not in
> `index.html`. Anything in `[brackets]` is a slot only I can fill — replace
> before launch. Keep voice plain, active, user-side (no jargon-as-decoration).

---

## Identity

- **Name:** Matthew C. Lau
- **Role:** Design Engineer
- **Email:** mattlau95@gmail.com
- **Site:** matthewclau.com
- **Location:** Mount Laurel, NJ
- **Socials:**
  - GitHub — github.com/mattlau95
  - LinkedIn — linkedin.com/in/matthew-lau
  - `[other? CodePen / X / Ko-fi once live]`
- **Résumé:** `/assets/resume.pdf`

### Tagline (pick one, or use as a starting point — make it mine, not Brittany's)

1. "I design and build accessible web apps — end to end."
2. "Designer who ships. I take products from Figma to deploy."
3. "I work where design meets engineering: whole products, hand-built."
4. "Design Engineer. I design, build, and ship small products under MCL Studio."

> Keep it to one honest line. The About page carries the longer story.

---

## About

> Narrative form, MCL-Studio-as-publisher framing. Draft below — tighten in my
> own voice. The goal: "designs *and* builds, ships real things, runs a small
> studio." 2–3 short paragraphs max.

I'm a designer with a computer science degree who builds the things I design.
I spent two years as a UX/UI designer shaping design systems and shipping
features for enterprise products, and these days I work end to end — research and
interface through to the code that ships.

I publish my independent work under **MCL Studio**, a small studio where I design,
build, and ship products. Most of them start as a tool for a community I'm
actually part of — an RSVP app for Thursday volleyball (ollae), a photocard
generator I built because I was tired of fighting Canva (pocalab), a worship-slide
generator for retreats, a few tools for the VBS kids this summer. I care about
the details that make software feel trustworthy — accessibility, performance, and
interfaces that tell you what's happening.

`[Optional line: what I'm looking for / open to — DE roles, freelance, etc.]`

> Worth weaving in somewhere: Rutgers B.A. Computer Science; currently
> sharpening the engineering side (Boot.dev, Anthropic Academy); Mandarin as a
> long game.

---

## How I Work

> 2026 portfolios are expected to show your AI stack — and for me it's a real
> system, not a buzzword. Keep this a compact section (or a few lines); don't let
> process narration crowd out the actual work.

I run a lightweight, spec-driven workflow built around Claude Code and Linear:

- **Capture, then triage — separately.** A `/capture` command drops quick ideas,
  bugs, and feature notes into an `INBOX.md` so nothing breaks focus. A `/triage`
  command later turns those into properly written Linear issues, with a
  confirmation step. Capturing and refining are different jobs; splitting them
  removed my biggest source of workflow friction.
- **Spec before code.** Each project starts as a `PROJECT.md` (the build plan)
  and, when it needs one, a `CONTENT.md` (content as data) — version-controlled,
  so the plan and the build stay in sync. This site was built that way.
- **Linear as the backbone.** One project per app, mood-aware labels
  (Deep Work / Quick Win) so I can match work to energy, weekly cycles as
  sprints, and a devlog in each repo. Plan first, build in small steps, commit and
  log each one.
- **UX as tooling.** I encoded my UX + WCAG 2.2 standards into a repeatable
  `/audit` command, so quality checks stay consistent across projects instead of
  living in my head.

The point isn't the tools — it's that I treat my own process like a product:
spot the friction, build the system, ship faster. (Same instinct as the
projects themselves.)

---

## Experience

> Chronological — this is the one section where dated markers are justified.
> Each entry: dates · role · org · 1–2 line summary · tech/skill tags ·
> optional metric badge.

### 2022–2024 · UX/UI Designer · Collette Vacations
Designed and shipped marketing and booking-flow features, and built the
foundation other designers and engineers worked from.
- **Badges:** handoff time −30% · task completion +20% · 200+ usability tests
- Architected an atomic Figma design system and led the company's first Dev Mode
  rollout, standardizing UI across 4+ product lines.
- Drove a data-informed redesign from 200+ usability tests; presented findings to
  executive stakeholders.
- Tags: `Figma` `Design Systems` `Dev Mode` `Usability Testing` `Atomic Design`

### 2025–Present · Administrative Assistant · Kumon Learning Center
Run daily operations for 70+ students weekly — and automated the part that didn't
need a human.
- **Badge:** ~96% time cut · 10–13 hrs → ~25 min
- Built a JavaScript bookmarklet that clears the grading-correction backlog on
  Kumon Connect, turning a full day of manual administrative work into an
  unattended ~25-minute run so students aren't blocked from progressing.
- Troubleshoot Kumon Connect workflows; produce print + digital marketing assets.
- Tags: `JavaScript` `Automation` `Bookmarklet`

### 2018–2022 · Freelance UX/UI Designer
- Consulted with EY Design Studio; delivered high-fidelity prototypes for internal
  Morgan Stanley tools.
- Designed Forecastagility, a data-viz tool, in a Vue.js/Vuetify environment with
  Infinite Corporation.
- Led the end-to-end redesign and front-end build of Edison Dental 27 (WordPress /
  Elementor).
- Tags: `Prototyping` `Vue.js` `WordPress` `Data Viz`

### 2017–2022 · Freelance Graphic Designer
- Curated Amazon product imagery for Aduro Products (100+ products, Photoshop).
- Produced on-air graphics for News 12 New Jersey.
- Tags: `Photoshop` `Brand` `Production`

### Education
B.A. Computer Science · Rutgers University · 2013–2017

---

## Projects

> Thumbnail-forward. Each needs: title · 1-line what-it-is · tech tags ·
> **live demo link** · **repo link** · optional metric/note · thumbnail image
> (consistent dimensions across all of them — see PROJECT.md §3).
> Lead with the strongest. Quality over count — only ship a card once its
> demo, repo, and thumbnail are all real.

> Through-line worth surfacing (About, or a one-line intro to this section):
> **I build small, real tools for the communities I'm part of — usually to
> replace something paywalled, limited, or annoying.** ollae (no-account RSVP for
> Thursday volleyball), pocalab (instead of fighting Canva), worship-slides (for
> retreats), VBS Scheduler (replaced paywalled Doodle), Edison (killed a $50/mo
> Elementor sub). That's a sharper, truer story than a pile of unrelated demos —
> it says "this person spots friction and ships the fix."

### ollae — ollae.app
RSVP collection for casual events — no accounts, shareable across any chat
platform. Built it for Thursday volleyball; works for anything informal.
- Tags: `Go` `PostgreSQL` `React 19`
- Demo: https://ollae.app  ·  Repo: `[https://github.com/...]`
- Thumbnail: `[/assets/thumbnails/ollae.webp]`
- Note: the no-account, drop-a-link flow is the point — friction is the thing it
  removes.

### pocalab — pocalab.com
Crop photocards to spec and generate print-ready, double-sided US Letter PDFs —
with two-hole duplex calibration so they line up when you print and cut. Built it
to replace the manual Canva workflow I used to fight every time I printed a sheet.
- Tags: `Client-side web app` `[framework? — fill in]` `[PDF lib — pdf-lib / jsPDF?]`
- Demo: https://pocalab.com  ·  Repo: `[https://github.com/...]`
- Thumbnail: `[/assets/thumbnails/pocalab.webp]`
- Note: a real personal-pain-point tool, and a nice engineering detail — the
  locked print spec (bleed/trim/safe, 300 DPI, duplex calibration) is exactly the
  kind of precision worth one sentence in the case study.

### Worship Slides Generator
Drag in a Planning Center PDF export, it parses the content, you reorder/edit the
slides, and it exports a PPTX ready to drop into Google Slides. Made for small
groups, quick events, and retreats.
- Tags: `Node.js` `Express` `pdf-parse` `PptxGenJS` `Vanilla JS`
- Demo: https://worship-slides-mattlau.fly.dev  ·  Repo: `[https://github.com/...]`
- Thumbnail: `[/assets/thumbnails/worship-slides.webp]`
- Note: PDF parsing → editable slide phase → file export. The pipeline is the
  interesting engineering part — worth a sentence on the case study.

### ⭐ Edison Dental 27 — client redesign + local SEO  [FEATURED CASE STUDY]
> This is the one project that proves design + engineering + business impact at
> once. Give it a deeper treatment than the other cards — a real case study with
> before/after, not just a thumbnail. Built in **2 days**.

Rebuilt a real local dental practice's site from the ground up. I'd built them a
rough WordPress/Elementor site ~8 years ago (edisondental27.com); this is the
modern rebuild — cleaner, faster, and actually findable on Google.
- Tags: `[framework — Vercel deploy]` `Schema.org / JSON-LD` `Google Places API`
  `Auth'd admin` `Local SEO` `Responsive`
- New: https://edison-dental-27.vercel.app  ·  Old (the "before"): edisondental27.com
- Thumbnail: `[/assets/thumbnails/edison-dental.webp]`

**The problem.** The old Elementor site was buggy and fragile, invisible to Google
(it didn't even register as a *dentist*), and locked behind a ~$50/mo subscription.

**What I built:**
- **Local SEO foundation** — `Dentist`/`LocalBusiness` structured data (JSON-LD)
  for name/address/phone + hours, so rich results populate; per-service landing
  pages to rank for local-intent searches ("dental implants Edison NJ"); live
  Google reviews pulled in + embedded Maps (fresh reviews = strong local signal).
- **Self-service admin** — a password-protected page where the front desk edits
  hours and saves; the site (and the structured data) updates instantly, no
  redeploy, no calling me.
- **Time-aware lead capture** — the homepage CTA switches on business hours:
  "We're Open — Call Now" when open, an appointment-request form when closed, so
  no overnight lead is lost.
- **Proper Open Graph** so links shared by text/Facebook/email unfurl with the
  practice name and photo instead of a broken card.
- **Killed a dependency** — eliminated the ~$50/mo (~$600/yr) Elementor cost.

**Honest framing for impact:** the site is a recent rebuild, so lead with
*capabilities delivered* (built in 2 days, ~$600/yr cost removed, full local-SEO
foundation where there was none, non-technical staff unblocked) rather than
traffic numbers you don't have yet. Then quantify what you *can*:
- **Capture Lighthouse / CWV + SEO scores, old vs. new** — a real "before 4X /
  after 9X" pair on a paying client's site is the single best proof point here.
- Once it's the live domain, track search impressions, ranking for "dentist
  Edison NJ," and form submissions over time — that's the follow-up metric.

### VBS Scheduler — vbs-scheduler
Availability scheduler for planning the VBS team's meetings and practices. Each
team member fills a shared response form; a Google Apps Script endpoint reads
those responses live from a Drive folder, and the app shows me real availability
to plan around.
- Tags: `JavaScript` `Google Apps Script` `Static / GitHub Pages`
- Demo: https://mattlau95.github.io/vbs-scheduler  ·  Repo: github.com/mattlau95/vbs-scheduler
- Thumbnail: `[/assets/thumbnails/vbs-scheduler.webp]`
- Note: replaced **Doodle** (paywalled + limited) with something free and tailored
  to the team. A static front end + an Apps Script endpoint as the data layer is a
  clean, zero-cost architecture worth a sentence — no server, no subscription.

### Kumon Grading Automation
JavaScript bookmarklet that clears the old grading-correction logs on Kumon
Connect automatically, so students aren't blocked from progressing.
- Tags: `JavaScript` `Automation` `Bookmarklet`
- **Badge:** ~96% time cut · 10–13 hrs → ~25 min
- Repo: `[https://github.com/...]`  ·  No public demo — link a short writeup / GIF
- Thumbnail: `[/assets/thumbnails/kumon-automation.webp]`

> **Also built (optional "archive" line, not a full card):** a links / schedule /
> lyrics hub for the VBS kids' praise team. Reinforces the "tools for my
> communities" thread — list it as text, or leave off until it's shareable.

> **Stacks status:** ✅ ollae (Go / Postgres / React 19), worship-slides
> (Node/Express/pdf-parse/PptxGenJS), VBS Scheduler (static + Apps Script), Kumon
> (JS bookmarklet). ❓ Still need: **pocalab** (framework + which PDF lib) and
> **Edison rebuild** (framework — likely Next.js on Vercel?). **Repos:** every
> card wants a GitHub link — make each repo public with a real README before
> launch (that's what earns the credibility, per the stars conversation). Only the
> VBS Scheduler repo link is confirmed today.
>
> **Source for the gaps:** each repo has a devlog. The unknown stacks, the
> build-story, and the decision-level detail (esp. for the Edison case study) are
> almost certainly already written there — Claude Code can extract them from the
> devlog instead of asking. **Rule: distill, never paste.** The devlog is the
> source; the card/README is the tight version. Some devlogs are long-winded —
> pull the problem, the key decision, the stack, and one insight; leave the
> play-by-play in the repo.

---

## Writing `[optional — turn on once the "Shipped by Design" series has posts]`

> Brittany surfaces a few links; you can too once there's content. Each: title ·
> year · link. Buffer a few posts before turning this section on so it doesn't
> look abandoned.

- `[Post title]` · `[year]` · `[link]`

---

## Footer

- Studio line: **"an MCL Studio project"** → `[studio hub URL]`
- Build credit (optional, Brittany-style): designed and built by hand with
  `[tools]`; type set in DM Serif Display + DM Sans.
- `[Last-updated date or year]`
