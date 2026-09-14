---
slug: worship-slides
title: Worship Slides Generator
blurb: >
  Converts church worship PDF setlists into presentation-ready .pptx decks in
  seconds, with a drag-and-drop editor, auto lyric cleanup, and full multi-song
  set support.

thumbnail: /assets/cases/worship-slides.webp

metrics:
  - value: "~45 min → <1 min"
    label: "per full set (estimated)"
  - value: "4-pass"
    label: "lyric cleaning pipeline"
  - value: "1 click"
    label: "full multi-song set export"

stack: [Node.js, Express, JavaScript, pdf-parse, pdfjs-dist, PptxGenJS]

links:
  repo: https://github.com/mattlau95/worship-slides-generator

role: "Design + engineering (solo, full-stack)"
timeframe: "2025–2026"
status: shipped
featured: false
---

## Overview

Worship Slides Generator is a web tool that turns church worship PDF lyric exports into presentation-ready PowerPoint decks. A worship leader uploads one or more PDFs, reviews and reorders sections in a drag-and-drop editor, and downloads a fully formatted `.pptx` in seconds — instead of building slides manually, song by song.

## The Problem

My church uses Planning Center Services to manage its worship sets. Lyrics are available as PDF exports, but when the team needs slides for smaller events — or situations where the usual presentation software isn't set up — someone has to copy lyrics into Google Slides by hand. For a typical four-song set, that's 30–45 minutes of work: creating title slides, splitting choruses across multiple slides, cleaning up line breaks, and repeating the whole structure per song.

The PDFs themselves add another layer of friction. Planning Center formats lyrics in a two-column layout with embedded stage directions, syllable breaks baked into the text (`majes - ty`), and alternate lyric variants printed inline. None of that belongs on a slide. A naive PDF-to-text extraction produces noise-filled output that would need as much manual cleanup as just building the slides from scratch.

## Role & Constraints

Solo project. I owned the product decisions, the backend parsing and generation logic, and the frontend editor. The main constraint was the source material: Planning Center PDFs are not clean text files. The two-column layout, inline noise, and inconsistent section header formatting meant the tool had to handle real, messy files — not idealized input.

## Approach

**Design**

The editor is built around the real workflow: upload, review, reorder, generate. After a PDF is parsed, the tool presents a drag-and-drop chip interface for reordering song sections — verses in blue, choruses in green, bridges in amber, pre-choruses in pink. The color coding makes the structure scannable at a glance. Users can add repeats by clicking a section pill, remove entries with ×, and open a full lyrics review panel to edit individual lines or delete slides before export.

For multi-song sets, each song lives in a queue. Any queued song can be reopened and edited without losing changes made to others. The generate step produces one combined `.pptx` with a blank black separator slide between songs — matching how worship teams typically advance through a set.

**Engineering**

The backend is Node.js + Express. PDF parsing uses `pdfjs-dist` to extract word-level position data — each word's `x`, `y` coordinates — rather than raw text. Planning Center PDFs use a two-column layout where main lyrics run down the left and secondary sections run in parallel on the right. Extracting text without position data mixes both columns in reading order, breaking section detection entirely. The fix: group words by row using the `y` coordinate, split each row at the natural x-axis gap into left and right columns, reconstruct lines from each column independently, then concatenate. Bold font (`item.fontName`) flags section headers even when they don't contain keywords like "Verse" or "Chorus."

Lyric cleaning runs in four ordered passes:

1. **Strip noise** — parenthetical lead-ins, syllable break hyphens, navigation cues like `(To Br.)`, repeat markers, copyright lines.
2. **Join continuations** — lines starting with a lowercase letter under 20 characters are joined to the previous line. Lowercase signals a visual line-wrap in the PDF, not a new lyric thought. Capitalization is intentionally deferred to pass 3; running it earlier turned `"satisfied"` into `"Satisfied"` and broke join detection.
3. **Capitalize** — first letter of every line, after joining is complete.
4. **Split long lines** — lines over 45 characters split at the comma nearest the midpoint. Lines with no clean split point render at a reduced font size (26pt vs 32pt normal).

Slide chunking uses a `smartChunk` algorithm rather than a fixed four-lines-per-slide split. A fixed split produces orphan slides: a five-line section becomes 4 + 1. `smartChunk` splits at `ceil(n/2)`, capped at four, and recurses — so a five-line section becomes 3 + 2, and no chunk is ever fewer than two lines.

`.pptx` generation runs server-side via PptxGenJS: black background, white Arial, and a small gray section tag (e.g. `Chorus 1/2`) in the top-right corner of each slide.

## Key Decisions & Tradeoffs

**Server-side generation over client-side.** PptxGenJS can run in the browser, but loading it reliably from a CDN inside a sandboxed environment proved brittle. Moving generation to Express meant the library runs in a stable Node environment and the frontend stays dependency-free — at the cost of a network round-trip on generate.

**Vanilla JS, no build step.** The frontend is plain JavaScript with no framework or bundler. For a single-page tool with no routing, a build step adds complexity without adding value. The tradeoff is verbosity — no component model, no reactivity system — which became real friction as the editor grew across five iterations.

**Capitalization deferred to pass 3.** Moving the capitalize step out of pass 1 fixed a genuine bug: early capitalization masked the lowercase signals used to detect continuation lines, causing two-part lyric phrases to be split across separate slides. The ordering is non-obvious but load-bearing.

**Numbered alternate deduplication before the pipeline.** Planning Center sometimes prints `(1.)` and `(2.)` variant lines for the same lyric. The dedup step strips these before the cleaning pipeline runs — otherwise the noise-strip pass would consume the markers before the dedup logic could detect them.

## Outcome

What used to take 30–45 minutes of manual slide building now takes under a minute: upload the PDFs, review the auto-ordered sections, click generate. That estimate is based on firsthand experience with the manual process — the tool hasn't been formally benchmarked. A full four-to-six song worship set exports as a single `.pptx` with title slides, formatted lyric slides, and blank separators between songs, ready to use without further editing on clean source PDFs.

## Reflection

Vanilla JS was the right call at v1 and a liability by v5. The editor grew into something that genuinely wanted a component model — per-song edit state, the queue, and the lyrics review panel all ended up managed with a mix of global variables and DOM reads. If I built this again, I'd use React from the start, even for a one-page tool.

The four-pass pipeline took more iteration than I expected. The pass ordering isn't arbitrary — each pass depends on state the previous one either preserves or destroys. Documenting *why* each pass must come when it does, not just what it does, saved real time when edge cases surfaced.
