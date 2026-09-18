# UX Audit Report — matthewclau.com homepage (copy update)

> **Date:** 2026-09-18 · **Reviewed:** `/` (homepage) after the Experience / project-card / How I Build copy update, measured against the pre-change build at `54c33d8` · **Tools run:** Lighthouse 13.4.1 (3 runs per build), axe-core 4.13.0, computed-contrast probe, `dev/checks/check-links.js`, manual source pass

---

## Executive summary

A copy-and-order change with no layout, class or component edits, and it measures that way: nothing moved. Zero axe violations, accessibility and best-practices both hold at 100, CLS flat, every badge row far past AA. **0 blockers, 0 important, 2 polish.**

**Snapshot**

- Core Web Vitals: LCP **3.08s** · INP **n/a (no interaction; TBT 0ms)** · CLS **0.0037** *(2026 thresholds: <2.5s / <200ms / <0.1)*
- Accessibility (axe): **0** violations across **39** passing checks · 1 `incomplete` (pre-existing, identical before and after)
- Local references resolving: **169 / 169**

### Performance, measured against the pre-change build

Same caveat as the previous two audits: this is a bare local static server with no compression and none of the `_headers` cache rules, so **it is not comparable to the footer's 99 / LCP 1.8s**. Three runs per build, medians:

| Metric | BEFORE (`54c33d8`) | AFTER | Verdict |
|---|---|---|---|
| Performance | 90 *(90, 90, 89)* | 89 *(89, 99, 89)* | No change |
| LCP | 2.92s | 3.08s | No change |
| **CLS** | **0.0036** | **0.0037** | Flat |
| TBT | 0 ms | 0 ms | No change |
| Accessibility | 100 | 100 | Held |
| Best Practices | 100 | 100 | Held |
| axe violations | 0 | 0 | Held |

The `99` in the AFTER column is the same run-to-run outlier seen in the earlier audits — a run that caught a fast Google Fonts fetch. Medians are within noise of each other. No performance consequence, which is expected: this change adds no images, no scripts and no markup beyond one extra `<li>`-free paragraph and one link.

### Badge row contrast — explicitly confirmed

Measured from computed styles against the real page background `rgb(15, 15, 14)`:

| Element | Size | Ratio | AA needs |
|---|---|---|---|
| Every `ul.tags` row (9 rows: Tech stack + Skills) | 12.64px | **15.59:1** | 4.5:1 |
| `.also-built` body text | 15px | **8.03:1** | 4.5:1 |
| `.also-built` links, incl. the new ghosted `repo` | 15px | **8.03:1** | 4.5:1 |

All nine badge rows pass at 15.59:1 — more than triple the requirement. The trimmed Kumon badge row (`JavaScript`, `Chrome Extension MV3`) uses the same tokens as every other row, so removing two chips changed nothing about contrast.

The `.also-built` links render in the muted body colour rather than the accent, but carry `text-decoration: underline`, so they are distinguishable without relying on colour (WCAG 1.4.1). Verified identical before and after — the new `repo` link inherits the same treatment as the two that were already there.

---

## Severity tiers

| Tier | Meaning | When to fix |
|------|---------|-------------|
| 🔴 **P0 — Blocker** | Makes the app feel broken or untrustworthy, loses user data, or is a WCAG 2.2 AA violation | Before you ship |
| 🟡 **P1 — Important** | Real friction or a clear standards miss, but the app still works | This week |
| 🟢 **P2 — Polish** | Refinement that raises quality — nothing is actually wrong | When you have room |

---

## 🔴 P0 — Blockers

**None.** Nothing to fix before shipping.

## 🟡 P1 — Important

**None.**

## 🟢 P2 — Polish

| # | Finding | Checklist ref | Evidence | Fix | Effort |
|---|---------|---------------|----------|-----|--------|
| 1 | ✅ **Fixed before commit.** The Kumon card's thumbnail alt text read "Kumon Grading Automation — browser extension popup" while the heading now reads "Kumon Grading Tools". SWITCH 1 was scoped to heading text only, so it was flagged rather than changed; approved and applied in the same commit. | §7 — alt text | `site/index.html:124` | Now reads "Kumon Grading Tools — browser extension popup". | ⚡ |
| 2 | ✅ **Fixed in follow-up.** Entry-internal ordering was inconsistent: MCL Studio ran intro → Read Case Study → bullets, Collette ran Read Case Study → intro → bullets. Pre-existing and outside the copy brief, so flagged rather than changed; approved and applied immediately after. | §10 — affordances / consistency | `#experience` entries 1 and 3 | Collette's `p.project-links` now sits below its intro. Both entries that carry a case study link read h3 → intro → link → bullets. | ⚡ |

---

## Manual accessibility pass

- **Heading structure** unchanged — `h2` per section, `h3` per entry and card. The Rutgers entry gains a `<p>`, not a heading, so the outline is untouched.
- **Keyboard operability** — one new interactive element, the ghosted `repo` link in `.also-built`. Real `<a>`, in DOM order, `target="_blank"` with `rel="noopener noreferrer"` matching every other external link on the page.
- **List semantics** — the Kumon entry keeps three `<li>` in its bullet `<ul>`; Collette goes from two to three. Both remain plain `<ul>`, unchanged structurally.
- **`<strong>` usage** — the two bold metrics (Kumon card, Kumon entry bullet 1) are real `<strong>` inside existing `<p>`/`<li>` with unchanged font metrics, which is why CLS held. Weight 700 is already in the preloaded DM Sans request.
- **Content-only change** — no CSS was touched, so no focus, motion, or reduced-motion behaviour could have regressed.

## Part B — §1–6 (feedback, destructive actions, errors, forms, AI UX, data safety)

Not applicable. The homepage remains a static document with no async actions, network calls, forms, destructive operations, or user work to lose. Unchanged by this edit.

---

## Priority action plan

1. ~~**[P2 ⚡]** Decide whether the Kumon thumbnail alt should follow the heading rename.~~ — done, applied before commit.
2. ~~**[P2 ⚡]** Align Collette's case study link position with MCL Studio's.~~ — done, applied in follow-up.

Neither gated the ship, and both are now closed. No findings remain open from this audit.

---

## What passed

- **0 axe violations, 39 passes**, identical before and after.
- **Accessibility 100 / Best Practices 100**, both held.
- **CLS flat at 0.0037** — two new `<strong>` spans inside body copy produced no measurable shift.
- **All nine badge rows at 15.59:1**, explicitly re-confirmed after the Kumon row was trimmed to two chips.
- **169 / 169 local references resolve**; the three external links in scope (ghosted repo, ollae live demo, ollae repo) all return 200.
- **No leftover fragments** of the replaced Kumon copy: "Leveraged", "Eliminated operational bottlenecks", "Audited and troubleshooted", "Manifest V3", "Kumon Connect platform", "Workflow Automation", "Internal Tools" all return 0 matches.
- **Switch discipline held**: no "My parents' center" string (SWITCH 2 OFF), no physician/diagnostics/Supabase content (SWITCH 3 OFF).
