# PROJECT.md — matthewclau.com portfolio rebuild

> Build spec for Claude Code. Read this first, then `CONTENT.md`. Plan before
> coding, build in small steps, commit + devlog each step, run `/audit` before
> shipping. P0 gates the ship; P1/P2 don't.

---

## 1. Goal

Replace the Webflow portfolio with a **hand-coded, self-hosted** site. The
hand-coding is not incidental — it *is* the Design Engineer proof point. A
polished, accessible, hand-built site demonstrates the skill more credibly than
any case study claiming it.

**Dual audience.** Reviewers may be design-leaning (want to *see* visual
deliverables) or engineering-leaning (want code, live demos, GitHub, and the
site-as-proof). The site must do both: **show the work** (real project visuals)
*and* **be the work** (the build itself).

Success = a reviewer who lands cold can, within ~30 seconds, tell what I do,
see proof I can build it, and have an obvious next click.

---

## 2. Stack decision

- **Plain HTML + CSS + vanilla JS. No framework, no build step.**
  Rationale: nothing on this site needs React/Next. A zero-dependency static
  site is the most direct evidence of front-end craft, loads instantly, and is
  trivial to host. The framework would only obscure the proof.
  > **This supersedes the earlier Astro / `simple-portfolio` template plan.** A
  > template undercuts the one thing this site exists to prove — and Astro adds
  > build-step complexity for no benefit here. Hand-coded is both simpler and the
  > point.
- Single page, anchored sections. Progressive enhancement: it works with JS off;
  JS adds the interactions.
- Deploy: static host (Cloudflare Pages / Netlify / Vercel — any). Domain
  `matthewclau.com` already on Porkbun → point DNS at the host.

---

## 3. Design direction

Borrow the **form** of the Brittany Chiang archetype, fix it with the **lesson**
from the UXfolio cover-page research, and make the surface unmistakably *mine*,
not a clone.

**Form to borrow (the skeleton):**
- Sticky split-column on desktop: left half = identity, tagline, nav, socials
  (pinned); right half = scrolling narrative (About → Experience → Projects →
  Writing). Collapses to a single stacked column on mobile.
- Restrained, type-led, generous whitespace, one committed accent.

**Lesson to apply (don't bury the work):** Brittany lists projects as text
because her audience is dev-first and her visual craft shows in the site chrome.
I'm half design — so the **Projects section is thumbnail-forward**: real visual
previews of ollae and the generators, treated as a *cohesive group* (same aspect
ratio, same corner radius, harmonized backgrounds). Consistency across thumbnails
matters more than any single one being clever.

**One featured case study.** Edison Dental gets deeper treatment than the other
cards — it's the only project proving design + engineering + business impact
together (local SEO via structured data, an auth'd admin, a time-aware CTA, a
reviews integration, a real client, a killed cost). Support either a dedicated
case-study page/route or an expandable detail view for it, with a before→after
structure and room for the Lighthouse/SEO score deltas. The other projects stay
as cards; this one earns a story. See `CONTENT.md` for the full write-up.

**Make it mine, not a default.** Note that Brittany's actual palette
(near-black + bright cyan) is one of the current AI-generated default looks —
copying it reads as templated. Avoid that trap:
- **Palette:** derive from the MCL brand, not from Brittany. Commit to one
  accent and use it sparingly. Starting point (already my visual language from
  prior work, tune freely): near-black ground `#0f0f0e`, warm off-white text
  `#e8e8e2`, and a single committed accent — pick *one* of lime `#c8f060` /
  sky `#60c8f0` / amber `#f0a060` as primary rather than scattering all three.
- **Type:** don't default to Inter. Lean on the DM family I already use and like
  — **DM Serif Display** for the hero/display, **DM Sans** for body, **DM Mono**
  for tags, labels, dates, and metrics. The serif display + mono-for-data pairing
  is more characteristic than a single neutral sans.
- **Structure encodes meaning.** Numbered/dated markers are justified *only* on
  the Experience timeline (it's a real chronological sequence). Don't decorate
  other sections with sequence markers that aren't sequences.
- **Spend boldness in one place.** Let one signature element be memorable; keep
  everything around it quiet.

---

## 4. Signature interactions

Implement these four (all vanilla — no framework needed). Treat them as the
orchestrated moments; don't scatter extra effects beyond them.

1. **Sticky split-column layout** — flex parent; left column `position: sticky;
   top: 0; max-height: 100vh`; right column normal flow. Single column < ~1024px.
2. **Cursor-following spotlight** — one `position: fixed` div with a
   `radial-gradient` background centered on `--x`/`--y` CSS vars updated by a
   `mousemove` listener. **Disable on touch devices and when
   `prefers-reduced-motion: reduce`.**
3. **Scroll-spy nav** — `IntersectionObserver` watches each `<section>`; the
   active section's nav item highlights and its little indicator line grows
   (e.g. `width: 2rem → 4rem`) via CSS transition.
4. **Group-hover dim** — hovering one Experience/Project entry fades its siblings
   to ~50% opacity so focus pops. Pure CSS: `ul:hover li { opacity:.5 }` +
   `ul li:hover { opacity:1 }`. Desktop/hover-capable pointers only.

---

## 5. Information architecture

```
[ left, sticky ]            [ right, scrolling ]
  Name                        About            #about
  Tagline                     How I work       #process   (compact — optional)
  Section nav  ───────────▶   Experience       #experience
  Socials                     Projects         #projects
                              Writing (opt)    #writing
                              Footer / contact
```

How-I-work is a *short* section (or fold into About) — it surfaces the
AI-augmented workflow without turning into process navel-gazing. Content in
`CONTENT.md`.

Footer carries the studio attribution: **"an MCL Studio project"** linking to the
studio hub. Same line should drop into the footer of the apps (ollae, etc.) so
the publisher layer is consistent.

---

## 6. Proof layer (the differentiators)

The research is blunt: the 2026 market is full of identical portfolios. These are
what make this one not that.

- **Every project:** live demo link **+** GitHub repo link **+** tech tags.
  A project with no working demo is a weak signal — deploy everything.
- **Metric badges** where they exist (pull exact figures from `CONTENT.md`):
  Kumon automation (~96% / 10–13 hrs → 25 min), Collette (handoff −30%, task
  completion +20%, 200+ usability tests).
- **Dogfood the audit kit.** Run my own `ux-fundamentals` audit against the
  finished site and show the Lighthouse / Core Web Vitals scores on the page.
  Demonstrating the standard on my own site is the cleanest possible proof.
- **Surface the AI-augmented workflow.** A short, honest note on how the work
  gets built — Claude Code, Linear, devlogs. 2026 portfolios are expected to show
  the AI stack; mine is a genuine differentiator, not a checkbox.

---

## 7. Accessibility — WCAG 2.2 AA (non-negotiable)

This is from my own checklist; the site must pass it.
- Semantic HTML (`<nav> <main> <section> <a> <button>` — no div soup).
- Fully keyboard navigable; visible focus states never stripped.
- Contrast AA (4.5:1 text, 3:1 large text / UI). Verify the accent on the dark
  ground actually passes.
- Meaning never by color alone.
- `prefers-reduced-motion` respected (spotlight + any reveal off when set).
- Touch targets ≥ 24×24 CSS px (aim 44+).
- Alt text on meaningful images; labels on icon-only social buttons.
- Focus never obscured by the sticky column.

---

## 8. Performance — Core Web Vitals (2026 thresholds)

- LCP < 2.5s · INP < 200ms · CLS < 0.1.
- Preload the display font; `font-display: swap`.
- Explicit width/height on every image/thumbnail (no layout shift).
- Compress thumbnails (WebP/AVIF), lazy-load below the fold.
- No render-blocking JS; defer the interaction scripts.

---

## 9. SEO basics (fold in from day one — 20-minute job)

- `<title>` and meta description.
- Open Graph + Twitter card tags + an `og.png`.
- `Person` JSON-LD structured data (name, role, url, sameAs socials).
- One `<h1>`, logical heading order, `sitemap.xml`, `robots.txt`.

---

## 10. File structure

```
/
  index.html
  /styles
    tokens.css        # color, type scale, spacing — single source of truth
    style.css
  /scripts
    main.js           # spotlight, scroll-spy, nav
  /assets
    /thumbnails       # project previews, consistent dimensions
    og.png
    resume.pdf
  CONTENT.md          # content as data — wire the markup to this
  PROJECT.md
```

---

## 11. Build plan (small steps — commit + devlog each)

- **Phase 0 — Scaffold.** File structure, `tokens.css` (lock palette + type
  scale here first), font loading, reset. Commit.
- **Phase 1 — Layout shell.** Sticky split-column, responsive collapse, empty
  section anchors. Commit.
- **Phase 2 — Content.** Wire markup to `CONTENT.md`: identity, About,
  Experience, Projects (with demo/repo/tag/metric slots), Writing, footer. Commit.
- **Phase 3 — Interactions.** Spotlight, scroll-spy, hover-dim, line-grow.
  Reduced-motion + touch guards. Commit.
- **Phase 4 — A11y + perf pass.** Run `/audit`. Fix every P0, then P1.
  Add the CWV/Lighthouse badge. Commit.
- **Phase 5 — SEO + deploy.** Meta/OG/schema, build `og.png`, deploy, point
  Porkbun DNS, verify live. Commit + devlog the launch.

---

## 12. Definition of done (MVP)

- [ ] Loads with zero console errors; works with JS disabled.
- [ ] Sticky split on desktop, clean single column on mobile.
- [ ] All four signature interactions working, with reduced-motion/touch guards.
- [ ] Every project has a live demo + repo link + tech tags.
- [ ] At least the Kumon + Collette metric badges present.
- [ ] `/audit` shows zero P0s; CWV in the green and shown on the page.
- [ ] OG card renders correctly when the URL is shared.
- [ ] Footer reads "an MCL Studio project" → links to the studio hub.

---

## 13. Working agreement for Claude Code

Plan first and show the plan before writing code. Build one phase at a time,
smallest viable step. Commit with a clear message and append a devlog entry after
each phase. Run `/audit` before declaring done. Don't gold-plate: P0 blocks the
ship, P1/P2 are post-launch. Ask before adding any dependency — the no-build-step
constraint is deliberate.
