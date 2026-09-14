# Case Study Template

A reusable structure for every case study page on matthewclau.com. Copy this file,
rename it `case-study-<slug>.md`, and fill it in — or hand it to Claude with the
project's devlog and ask it to draft against this structure.

The goal is **consistency**: every case study has the same front matter and the
same section order, so the page template can render them identically and a reader
always knows where to find the problem, the decisions, and the outcome.

---

## How to draft one (instructions for Claude)

- **Distill, never paste.** The devlog is raw source material, not copy. Rewrite it.
- **Dual audience.** A designer should see the thinking and the craft; an engineer
  should see the real technical decisions. Most sections should speak to both;
  the *Approach* section is explicitly split so neither audience is shortchanged.
- **Plain and jargon-light.** Short sentences. Explain a term the first time it
  appears. No filler adjectives ("robust", "seamless", "cutting-edge").
- **One specific number beats three vague claims.** "Cut a full day of grading to
  under 30 minutes" lands; "dramatically improved efficiency" doesn't.
- **Lead with the problem, not the tech.** The stack is interesting *because* of
  what it solved, not on its own.
- **Length target:** 500–900 words of body. A case study is a story, not a README.
  If a section has nothing real to say, cut it rather than padding it.
- **Voice:** first person, past tense, direct. Honest about tradeoffs and what
  didn't work — that reads as more credible than a flawless narrative.

---

## Front matter — shared with the homepage card

This block is the single source of truth. The same fields feed the homepage
thumbnail card *and* the header of this page, so they can never disagree.

```yaml
---
slug: edison-dental-27          # URL + filename. lowercase, hyphenated.
title: Edison Dental 27         # card title + page H1
blurb: >                        # one sentence. the card subtitle + page deck.
  Rebuilt a dental practice's site and local SEO from scratch, killing a
  $600/yr subscription in the process.
thumbnail: /assets/cases/edison-dental.webp   # card image (set width/height!)

# Metrics: the 2–3 numbers on the card, repeated as the impact strip on the page.
metrics:
  - value: "$600/yr"
    label: "subscription eliminated"
  - value: "100%"
    label: "hand-built, no page builder"
  - value: "Top 3"
    label: "local map pack (target)"

stack: [WordPress, Structured Data, Local SEO, JavaScript]   # the tech-stack chips

links:
  live: https://...            # live site (omit or null if private)
  repo: https://github.com/mattlau95/...   # omit if closed-source

role: "Design + front-end + SEO"   # what you owned
timeframe: "2025"                  # when
status: shipped                    # shipped | in-progress
featured: true                     # surfaces it as the featured case study
---
```

---

## Page body — fixed section order

Render these in this order every time. Sections marked *(optional)* can be omitted
per project; everything else should always be present.

### 1. Overview

Two or three sentences. The whole story for someone who will only read this much:
what it is, who it's for, and the single most important outcome. This is the
expanded version of the card blurb.

### 2. The problem

What was broken, frustrating, or paywalled — and for whom. This is the hook.
Most of your work replaces a tool a real community was stuck with, so name that:
who was affected, what the friction cost them, why the existing option fell short.

### 3. Role & constraints

What you owned end-to-end vs. what you inherited or worked around. The constraints
matter as much as the freedoms — budget, an existing CMS, a non-technical client,
a deadline, "must work with zero ongoing cost." Constraints make the decisions
that follow legible.

### 4. Approach

The core of the case study. Split it so both audiences are served:

**Design** — the experience and interface decisions. The flows, the hierarchy,
the states, the accessibility calls. Why the UI is shaped the way it is.

**Engineering** — the build decisions. Stack and why, the architecture, the
interesting technical problem and how you solved it. Where the design and the
code had to negotiate (e.g. a layout that drove a data-structure choice).

For a Design Engineer this dual section *is* the differentiator — it's the proof
you operate across the seam, not on one side of it.

### 5. Key decisions & tradeoffs

Two to four of the most interesting forks: "I chose X over Y because…". Include at
least one genuine tradeoff — something you gave up to get something else. This is
the section that signals judgment rather than just output.

### 6. Outcome

The metrics from the front matter, restated with context. Before/after where you
have it. If a number is an estimate or a target rather than a measured result, say
so plainly — surfaced uncertainty reads as more trustworthy than a confident guess.

### 7. Reflection *(optional but recommended)*

What you learned, and what you'd do differently. Short. One honest "if I rebuilt
this" beats a paragraph of self-congratulation.

### 8. Gallery / artifacts *(optional)*

Before/after shots, a key screen, a diagram, a short clip. Each image needs alt
text and explicit `width`/`height` (no layout shift). Pull quote optional.

---

## Minimum bar to publish

A case study is ready when it has, at minimum: filled front matter, an Overview,
a Problem, an Approach with *both* sub-sections, and an Outcome with at least one
real number. Everything else strengthens it; those five are non-negotiable.
