---
slug: ollae
title: Ollae
blurb: >
  A zero-friction group RSVP tool — share one link in the group chat, see who's
  in. No accounts, no apps, no friction. Named after the Korean phrase for
  "wanna come?"

thumbnail: /assets/cases/ollae.webp

metrics:
  - value: "8"
    label: "RSVPs on launch day"
  - value: "21"
    label: "dev sessions, zero to live"
  - value: "5"
    label: "messaging platforms with OG previews"

stack: [Go, PostgreSQL, React, TypeScript, Tailwind CSS, Vite, Vercel, Fly.io, Claude API, Resend, Figma]

links:
  live: https://ollae.app

role: "Design + engineering (solo, full-stack)"
timeframe: "May–June 2026"
status: shipped
featured: true
---

## Overview

Ollae is a group RSVP tool built for informal events — pickup games, team lunches, karaoke nights. The organizer creates an event and shares a single URL; participants tap it, enter their name, and RSVP. No accounts, no app to download. It went from zero to live with real users in one week, with eight RSVPs on the day it first hit a group chat.

## The Problem

Every recurring group event has the same coordination problem: someone floats the idea, replies scatter across a thread, and the organizer is left manually counting heads. Existing tools either require everyone to create an account — a real barrier in a casual group context — or are buried inside another platform that not everyone uses.

The right tool for this problem is a link. Share it the way you'd share a YouTube video. The person on the other end shouldn't need to do anything before they can interact with it.

## Role & constraints

I owned the whole thing: product decisions, Figma designs, backend, frontend, deployment, and the naming when a trademark search forced a rebrand mid-project. The original name — Showup.gg — had a pending trademark registration in Class 042 (SaaS) from another company, discovered the day before launch.

The no-accounts constraint was a product decision, not a technical limitation. It shaped every other decision that followed: how identity works, how editing works, how organizer access works. The entire system had to be link-based or it wasn't worth building.

## Approach

**Design**

The RSVP flow has three states — default, selected, and success — all designed in Figma before a line of frontend code was written. Every interactive element sits in the lower half of the screen, matching the thumb zone for single-handed phone use. The dark-first UI was designed that way from the start, not adapted from light.

The most considered UX decision was "Remind Me." The original design had three equal buttons: In, Out, Maybe. Three equal choices invite hedging — "maybe" gives people permission not to decide. I reframed it: two clear primary buttons (I'm in / Can't make it), with "Remind me closer to the date" as a small text link below. Forcing a real binary first, with an escape hatch for genuine indecision, is a different product surface. The data model reflects this — `remind_me` is a distinct RSVP status that triggers a 24-hour email reminder via Resend, not a soft maybe.

The design system uses Figma Variables (colors, spacing, radius) with the same token names as the Tailwind config. `status/in` in Figma is `status-in` in CSS — zero translation cost between design and code.

**Engineering**

The backend is Go (chi router) on Fly.io; the frontend is React 19 + TypeScript on Vercel. The interesting problems weren't in the stack — they were in the edge cases.

iMessage fetches link previews from the device using a regular browser User-Agent, not a bot UA, so the usual "detect crawler, serve different HTML" pattern doesn't trigger. The fix: every `/events/:slug` URL routes through a Go handler that returns a server-rendered HTML page with full OG meta tags, then immediately redirects real users to the React SPA via a JavaScript `location.replace()`. iMessage reads the tags and stops; users get the app. Facebook's crawler (`facebookexternalhit`) and WeChat's (`MicroMessenger`) both execute JavaScript, so they followed the redirect and landed on the bare SPA with no tags. A `isCrawlerUA()` check in the handler conditionally omits the redirect script for known JS-executing scrapers.

The OG image itself is a 1200×630 PNG rendered server-side in Go using `fogleman/gg`. Each event gets a Claude-generated emoji that appears faded in the card background and as a small badge in the corner — personality at zero extra cost, because the emoji is picked in the same API call that parses the event description.

The event creation flow uses Claude Haiku to parse a freeform description ("Volleyball Saturday 2pm · Venice Beach Court 4") into structured fields shown in an editable preview. The API call fires on submit, not on keystroke — streaming autocomplete would have the same payoff at ten times the complexity.

Organizer edit access works without accounts: a 24-char token is generated at creation and returned alongside the share link. `PATCH /events/:slug` validates it with a single `WHERE slug = $1 AND admin_token = $2` query — wrong or missing token returns 403.

## Key decisions & tradeoffs

**Submit-and-parse over streaming.** Streaming the Claude response on every keystroke would have felt more alive, but required continuous API calls for a 10–15 word input. One call on submit is fast enough to feel instant and costs a fraction. The tradeoff is that there's no real-time feedback as you type — acceptable here.

**Wall-clock time, not UTC conversion.** Ollae events are in-person and local. Storing the time as entered (without timezone conversion) and displaying it as entered is what organizers expect. A user who types "7pm" wants to see "7pm" on the RSVP page — not the UTC-converted equivalent for other time zones. This required actively stripping the `Z` suffix before constructing Date objects in the display layer.

**No accounts, ever — until an admin token in the URL.** The organizer's edit link contains their token as a query parameter (`?admin=TOKEN`). This exposes the token in the URL, which means it can appear in browser history. The tradeoff was accepted: for a casual group event tool, the convenience of a tappable link outweighs the risk, and it's consistent with the no-accounts model everywhere else.

**fogleman/gg over Satori for OG images.** Satori is a popular choice for dynamic OG cards but runs in Node. The backend is Go — adding a separate Node service for one endpoint would have doubled the infrastructure. `fogleman/gg` is a Go 2D graphics library with enough capability for this layout. The tradeoff: no CSS, so layout math had to be explicit (computing Y positions with `space-between` logic rather than flexbox).

## Outcome

Launched May 19, 2026. Eight RSVPs came in on the first day — including one participant who RSVPed on behalf of eight players from another group, which surfaced group RSVP as an edge case within hours and directly shaped the guest count feature shipped a week later. OG preview cards work across iMessage, Facebook Messenger, WeChat, WhatsApp, and Telegram.

## Reflection

The timezone bug appeared twice, in different forms. Both times the root cause was the same: treating a naive datetime string as UTC somewhere in the pipeline. The lesson — decide your time semantics once, at the schema level, and enforce them everywhere — is easy to state and apparently hard to remember.

The naming process cost most of a session. In hindsight, the trademark search should have been the first step, not something discovered the day before launch. "Ollae" turned out to be a better name anyway.
