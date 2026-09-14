---
slug: pocalab
title: pocalab
blurb: >
  A browser tool for printing K-pop photocards exactly right — crop to spec,
  set copy counts, and export a print-ready duplex PDF. No account, no backend.

thumbnail: /assets/cases/pocalab.webp

metrics:
  - value: "6"
    label: "paper size presets"
  - value: "300 DPI"
    label: "print-accurate output"
  - value: "0"
    label: "backend or login required"

stack: [React 19, TypeScript, Vite, pdf-lib, react-easy-crop]

links:
  live: https://pocalab.app

role: "Design + engineering (solo)"
timeframe: "June 2026"
status: shipped
featured: false
---

## Overview

pocalab is a browser tool for making and printing K-pop photocards — the 55×85 mm trading cards packaged with albums and fan merch. Upload your images, crop them to the official spec with bleed and safe-zone guides, set per-card copy counts, and export a print-ready duplex PDF. No account, no backend, nothing to install.

## The Problem

K-pop fans who make custom photocards have one realistic option: a manual workflow in Canva. The problem isn't that Canva can't do it — I had a template with bleed zones, cut lines, and alignment guides — the problem is that it never gets faster. Every batch means finding source images, dragging each one onto the canvas, nudging it into the guides, repeating for the back, repeating for every card in the set, exporting, checking the duplex alignment, sometimes reprinting. If you want two copies of one card and one of another, you duplicate and reposition by hand. The process is identical every time. That's what software is for.

## Role & Constraints

I built the whole thing: product decisions, all UI design, all front-end code. Client-side only was both a constraint and a deliberate product call — no backend means no accounts, no onboarding, no infrastructure to maintain, and nothing standing between a user and their first PDF. That constraint set the ceiling for persistence (localStorage), image processing (Canvas API), and PDF generation (a pure-JS library that runs in the browser).

## Approach

**Design**

The crop editor is the heart of the tool, and its main challenge is showing three overlapping zones — bleed, trim, and safe area — without overwhelming a user who's never printed photocards before. The solution is a key panel beside the crop frame that shows a color swatch, the zone name and its exact dimensions, and a plain-English description of what it means. The zones themselves are color-coded (cyan, red, green), 2 px solid, and pointer-events: none so they never interfere with panning.

On desktop, the key sits in a second column beside the crop frame. On mobile, it collapses below the controls. No DOM duplication — just CSS Grid reassigning areas via a media query.

Empty-state copy came from in-person testing. A new user assumed the tool made a single card. Adding one line — "Build a deck of up to 9 photocards — then export as a print-ready PDF" — above the upload zone fixed it. The hint disappeared after the first card was added.

The mobile layout required its own pass. A sticky header that works on desktop breaks on iOS during momentum scroll; swapping it to `position: fixed` with compensating padding solved it. The deck action bar, previously two rows totaling 130 px, was collapsed to a single `flex-direction: row` bar at ~64 px.

**Engineering**

The most precise problem in the project is units. The PDF works in points (72 pt/inch). The crop canvas works in pixels (300 DPI). The layout math works in mm. A 55 mm card has to be exactly 55 mm out of the printer — which means the conversion chain can't accumulate rounding errors. The solution is a single source of truth: `dimensions.ts` owns `mmToPx()` and all card constants; `pdf.ts` owns `mmToPt()`. Nothing hardcodes a dimension — every number derives from one of those two functions.

Duplex alignment is the other precise problem. For long-edge flip, the back page has to be x-mirrored: `backSlot.x = sheetWidth − slot.x − slot.w`. Get it wrong and every card comes out with the back offset by however far the layout math drifted.

pdf-lib weighs ~200 KB gzipped. It's imported dynamically — `const { createPhotocardPdf } = await import('./utils/pdf')` — so the chunk is only fetched when the user clicks "Download PDF." Initial load doesn't pay for it.

The multi-deck model (`Project { preset, decks[] }`) was the largest structural change. Photo paper presets (4×6, 5×7) fit 2–4 cards per sheet, so users printing 9 cards need multiple sheets. The `SET_PRESET` action auto-splits cards across new decks and fires a toast only when the split is caused by a preset switch, not when the user manually adds a sheet — a `justSwitchedPreset` ref tracks the difference.

## Key Decisions & Tradeoffs

**pdf-lib over jsPDF.** jsPDF's main selling point is rendering HTML to PDF — irrelevant when compositing programmatic image data. pdf-lib is TypeScript-native and gives exact point coordinates. The tradeoff: it operates in points, not mm, which required an explicit conversion layer.

**Client-side only.** No backend means zero friction to start and zero infrastructure cost. The ceiling is localStorage — no cross-device sync, no user accounts. Acceptable for this use case, and avoids the onboarding tax that kills free tools.

**Static SPA with a crawler lede.** A React SPA with no SSR is invisible to search crawlers. Rather than adding a rendering layer, a visually hidden section in `index.html` (the standard `position: absolute; width: 1px` clip pattern) gives crawlers indexable text directly. Simple and maintainable — no server needed.

**Lazy PDF chunk.** The 200 KB bundle is only needed at export time. Splitting it saves ~200 KB on initial load at the cost of a small delay on the first download. The delay is invisible in practice because generating the PDF takes a moment anyway.

## Outcome

pocalab shipped with six paper size presets: US Letter and A4 (3×3, nine cards per sheet) and four photo paper layouts (4×6 and 5×7 in 2-up, 3-up, and 4-up configurations). All output is 300 DPI. The tool is live at pocalab.app with no account required.

There are no before/after time measurements — I didn't clock the Canva workflow. The honest claim is that a correctly-spec'd 9-card PDF now takes a single session of uploads and crops, with no Canva nudging, no manual grid positioning, and no eyeballed duplex alignment.

## Reflection

The `Deck → Project` data model refactor should have happened earlier. The original single-deck model was fine for letter and A4, but adding photo paper presets required threading a new concept — multiple sheets — through every crop confirmation, copy count, move control, and download button. If multi-sheet had been in scope from day one, the architecture would have been cleaner.

The lesson: build what you know you need now, but don't design around a fake constraint you know will break. I knew from the start that photo paper was coming. I just didn't prioritize modeling it correctly up front.
