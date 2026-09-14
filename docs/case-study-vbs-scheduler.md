---
slug: vbs-scheduler
title: VBS Band Scheduler
blurb: >
  Replaced Doodle for a church band — cross-references Google Form availability
  from 10+ members to surface shared free windows, with live sync and a built-in practice calendar.
thumbnail: /assets/cases/vbs-scheduler.webp

metrics:
  - value: "Replaces Doodle"
    label: "no account, no paywall"
  - value: "10+"
    label: "members scheduled"
  - value: "95+"
    label: "Lighthouse score"
  - value: "3 hrs → 10 min"
    label: "per audit cycle"

stack: [Vanilla JS, Google Apps Script, Google Sheets CSV, GitHub Pages, localStorage]

links:
  live: null
  repo: https://github.com/mattlau95/vbs-scheduler

role: "Design + Engineering"
timeframe: "2026"
status: shipped
featured: false
---

## Overview

VBS Band Scheduler is a single-page tool that finds open rehearsal windows for the VBS Praise 2026 band. Members submit availability through a Google Form; the app cross-references every response against already-scheduled practices and surfaces the slots where everyone — or enough people — can make it. It replaced the team's prior ad-hoc Doodle polls with something purpose-built, zero-cost, and always up to date.

---

## The problem

Every few weeks, coordinating a rehearsal meant someone posting a Doodle link, chasing down the six people who hadn't responded, manually checking it against practices already on the calendar, and then messaging a time — only to find out one key person had a conflict that wasn't in Doodle. The tools available were generic; none of them knew about existing commitments, and none held the band's roster.

The friction wasn't technical — it was the repeated, manual assembly of information that already existed in three places (a Google Form, a calendar, and someone's memory).

---

## Role & constraints

I owned the full stack: form design, the Google Apps Script backend, the front-end UI, and hosting. The constraints shaped most of the decisions:

- **Zero ongoing cost.** No servers, no paid services, nothing to maintain.
- **Non-technical team.** Updating the schedule had to mean editing a Google Sheet, not touching code.
- **No logins.** The link gets shared in a group chat; requiring auth would kill adoption.
- **The data already lived in Google Drive.** Meeting people where the data was meant less migration friction.

---

## Approach

### Design

The UI is organized around a single question: *when can we all meet?* The finder defaults to showing every slot where the full roster is free, with a segmented control to relax that down to "most people." Chips let you filter by person or time-of-day without navigating away.

A second tab shows the practice calendar as a plain chronological list — upcoming entries are full opacity, past ones are dimmed, and the next practice gets a "Next" badge. No calendar grid, no hover states to learn. The point was readability in a quick glance, not a feature-complete calendar widget.

The status pill in the corner — **Live**, **Cached**, or **Snapshot** — makes the data freshness visible without interrupting the flow. Clicking it retries the live fetch and shows a pulsing "Fetching…" state so the user knows something is happening.

Accessibility was treated as a first-class constraint, not an afterthought. A full audit (axe-core, pa11y, Lighthouse) surfaced 24 violations and 12 actionable findings. All 12 were fixed in the same session: contrast ratios, ARIA labeling, landmark structure, LCP image, and focus management.

### Engineering

The backend is a Google Apps Script endpoint that reads a folder of Form response sheets and returns a normalized JSON payload — no database, no auth layer, no deployment pipeline. The front-end fetches it on load.

The schedule data comes from a published Google Sheets CSV. The URL is entered once into a text input and saved to `localStorage`; from then on it loads automatically. The CSV parser handles quoted fields with embedded commas, human-readable date strings (`"Sunday, May 31"`), and flexible column names (`label`, `name`, `event`, `location`, etc.) — because the sheet format isn't something I controlled.

Offline resilience has three layers: live fetch → `localStorage` rolling cache → a hardcoded snapshot. If the script endpoint is down or slow (9s timeout), the app falls back gracefully and tells the user exactly which layer it's showing.

Filtering is done client-side at the `normalize()` layer — before data ever reaches the component state — so excluded members are invisible regardless of which data source is active.

---

## Key decisions & tradeoffs

**Plain HTML/CSS/JS over a framework.** The app has no build step, no `node_modules`, no CI pipeline. It loads in one request and runs on GitHub Pages for free. The tradeoff is that any real state complexity would become painful fast — but for a tool this focused, it never got there.

**Google Sheets as the schedule source, not the Apps Script.** Routing the practice calendar through the same script endpoint would have been cleaner architecturally — one data source instead of two. But it would have made updating the schedule dependent on someone editing a Drive folder structure rather than a spreadsheet row. Non-technical users edit cells; they don't think in terms of Drive folders. I traded a cleaner data model for a workflow that matched how the team actually operates.

**Client-side filtering over server-side.** Excluding a person from all views could have been done at the Apps Script layer, but that would mean deploying a script change every time the roster shifts. Keeping the filter list in the front-end JS means the script stays generic and the app owns its own roster.

**No accounts, ever.** The tool is intentionally opaque to anonymous usage. There's no way to know how many people are using it at any moment, and no persistent state per user. That's a real limitation if the team ever wanted to track attendance or send reminders — but it also meant there was nothing to maintain and nothing to break.

---

## Outcome

- **Replaced Doodle** entirely — the team links directly to the app rather than creating a new poll each cycle.
- **10+ members** across the roster, with availability cross-referenced automatically.
- **Lighthouse score 95+** after the UX audit pass — from a starting point that had 24 accessibility violations.
- A full audit cycle (running tools, triaging findings, writing the report, filing issues) went from roughly **3 hours manually to under 10 minutes** with tooling — the leverage came from structured issue creation, which is the part that normally gets skipped.

---

## Reflection

The multi-layer fallback (Live → Cached → Snapshot) was worth building. The Apps Script endpoint occasionally times out, and without it the app would just show a blank state. That said, if I rebuilt this, I'd probably move the schedule data into the same script endpoint rather than a separate Sheets CSV — the two-source architecture creates a subtle state mismatch that I papered over with client-side merging logic.

The accessibility audit was the most surprising part of the build. A tool that looked finished had 24 violations. Running the audit as an explicit step rather than relying on "looks fine" was the only reason those got caught.
