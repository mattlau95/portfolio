# MAT-425 — Section Order Recommendation

**Date:** 2026-06-19  
**Status:** Ready for review

---

## Current order

About → How I Work → Experience → Projects

---

## Recommended order

**About (trimmed) → Projects → Experience → How I Work**

---

## Analysis

### Problem 1 — Projects is buried

Projects is the strongest proof that "design engineer who ships" is a true claim: 6 live tools, a featured case study, measurable impact. In the current order a recruiter hits it only after About (~130 words) + How I Work (4 workflow cards) + Experience (5 timeline entries). That's ~1,000 words and significant scroll before the evidence appears. Attention and trust drop before they get there.

### Problem 2 — About does three jobs, none completely

The current About has three paragraphs doing three different things:

| Para | Job | Problem |
|------|-----|---------|
| 1 | Professional identity + trajectory | Good — keep, minor trim |
| 2 | MCL Studio + project preview | Redundant — previews work the reader hasn't seen yet, then re-presents the same projects in full cards |
| 3 | Rutgers, Boot.dev, Mandarin | Dangling — Rutgers is already in Experience; Boot.dev/Anthropic Academy appear naturally in How I Work context |

Para 2 is the main offender. It names ollae, pocalab, worship-slides, and VBS tools in passing — weaker than the cards themselves — and creates the impression that About is "the whole story" before the real portfolio page is reached. Move that narrative energy into the Projects section intro (which already carries this: *"I build small, real tools for the communities I'm part of."*).

### Problem 3 — How I Work has no foundation when it appears second

Workflow cards land flat before the reader has seen the work they describe. "Spec before code" and "/audit as tooling" mean more when the reader already has a mental image of what gets built. Moving How I Work to the close turns it into a satisfying explanation of *how the projects happened*, not an abstract methodology claim.

---

## Recommended changes

### 1. Trim About to one paragraph

Cut paras 2 and 3. Fold education to a brief clause in para 1:

> I'm a designer with a computer science degree who builds the things I design — Rutgers CS, now working end to end from research and interface through to the code that ships.

~40 words. The MCL Studio story lives in the Projects intro. Boot.dev/Anthropic Academy can stay in How I Work or be dropped from the page entirely.

### 2. Move Projects to second

No copy changes required; the existing Projects intro ("I build small, real tools for the communities I'm part of") now also inherits the MCL Studio framing that was cut from About.

### 3. Keep Experience in third

Experience validates the story — it confirms professional context for the claims in About and the projects. Stays where it is relative to How I Work.

### 4. Move How I Work to last

Becomes the site's closer: "here's the work, here's the institutional history, here's how the process runs." Earns its place as a differentiator rather than a preamble. Most portfolios stop at experience + projects; ending on process is the distinctive beat.

---

## Sidebar nav change

The nav order follows content order:

```
About
Projects        ← was "How I Work"
Experience
How I Work      ← was "Projects"
```

The `skip-link` target (`href="#about"`) stays unchanged.

---

## Expected effect

| Metric | Before | After |
|--------|--------|-------|
| Words before Projects | ~1,000 | ~40 (About para only) |
| About word count | ~130 | ~40 |
| How I Work context | no prior evidence | reader has seen 6 projects |
| Scroll to first project card | ~4 viewport heights | ~1 viewport height |

---

## What this does NOT change

- No copy changes to Projects, Experience, or How I Work sections
- Featured card (Edison Dental) stays last in the Projects list (it closes strongest)
- Footer unchanged
- Sidebar identity + tagline unchanged
- All section IDs (`#about`, `#process`, `#experience`, `#projects`) unchanged

---

## Implementation scope

This is a reorder of `<section>` blocks in `index.html` and a matching nav `<li>` swap — approximately 10 lines changed total. About para trim is a separate sub-task. Low risk, fully reversible.
