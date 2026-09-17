# Ollae case study — copy final

Paste-ready, section for section, same headings as the live page.

Three things to confirm before pasting:

1. Outcome: whether the volleyball group has used Ollae every week since launch. (Keep the current phrasing or confirm you want to update it.)
2. Role & constraints: whether to add one sentence saying Claude Code did the implementation from your specs and Figma files. (Currently omitted; add if you want it.)
3. Stats block: delete it entirely from the live page.

Header changes: delete the stats block. Keep the kicker, H1, subhead, role line, stack tags, Live demo / Repo links, and the hero strip as they are.

---

## Overview

I run a weekly pickup volleyball game. Getting a headcount meant posting the same message in three group chats and a few DMs, counting thumbs-up reactions, and trying to remember who was in. Ollae is what I built to stop doing that. The organizer describes the event in a sentence and gets a link; everyone who opens it sees who's already coming and adds their name, or a plus-one.

## The problem

Every recurring group event has this problem. Someone floats the idea, replies scatter across threads, and whoever is organizing counts heads by hand. The tools that exist don't fit a casual group: most need an account, which is a real barrier when half the players are friends of friends, and the rest live inside one platform when the group is spread across three.

So the whole product follows one rule: it has to be a link. You share it the way you'd share a video, and the person on the other end can answer before the page has asked them for anything except a name.

## Role & constraints

I owned all of it: product decisions, the Figma designs, the Go backend, the React frontend, deployment, and the naming, which had to happen twice. The original name, Showup.gg, turned out to have a pending trademark from another company, found the day before launch.

The no-accounts rule was a product decision, and it decided everything downstream: how identity works, how editing works, how the organizer gets back in. If any part of it needed an account, the product wasn't worth building.

## Approach

### Design

The RSVP flow has three states: default, selected, and success, and all three were designed in Figma before any frontend code. Every control sits in the lower half of the screen, where a thumb reaches one-handed. The UI was designed dark from the start.

The decision I'd defend hardest is "Remind me." The first design had three equal buttons: In, Out, Maybe. Three equal choices invite hedging, and "maybe" gives people permission to never decide. The shipped version has two buttons, I'm in and Can't make it, with "Not sure yet, remind me closer to the date" as a small text link underneath. That's a different question: are you coming, with an honest option for people who need a day. In the data, remind_me is its own RSVP status, and it sends a reminder email 24 hours before the event.

Figma and the Tailwind config share one set of token names. `status/in` in Figma is `status-in` in code, so nothing gets translated at handoff.

### Engineering

Go and Postgres on Fly.io for the API, React 19 and TypeScript on Vercel for the app. The stack was the easy part; the work was in the edge cases.

Link previews were the first edge case. The handler serves preview tags to crawlers and the React app to real browsers.

Each event gets its own preview card, a 1200×630 image rendered in Go. The emoji on it comes from Claude in the same call that parses the description, so it costs nothing extra: "volleyball at Johnson Park" gets a volleyball, "Valorant with the boys" gets a game controller.

Creating an event is one text box. The organizer types the plan the way they'd type it in the chat, Claude Haiku turns it into a title, date, time, and place, and an editable preview shows what it understood, with a plain form as the fallback.

The full write-up, including the crawler detection and the query behind the organizer token, is in the repo.

## Key decisions & tradeoffs

**One parse call, on submit.** One Claude call when the organizer hits Create is fast enough to feel instant. Streaming on every keystroke would feel more alive and cost about ten times as much for a 15-word input, and nobody needs live feedback while typing "volleyball Saturday 2pm."

**Store the time as typed.** Events are in person and local. A 7pm event should read 7pm to everyone, so the time is stored and displayed exactly as entered, with no timezone conversion anywhere in the pipeline.

**Organizer access is a link, too.** Creating an event returns an edit link with a random token in it, and the API accepts changes only when the token matches. The token sits in a URL, so it shows up in browser history; for a pickup-game tool the tappable link is worth that, and it keeps the no-accounts rule intact.

## Outcome

It went into the volleyball group's chats on May 19, 2026, and the group used it that day. The first day surfaced a real use case I hadn't planned for — groups RSVPing as a unit — and I shipped guest counts a week later. Preview cards work reliably in iMessage, WhatsApp, Telegram, and WeChat.

## Reflection

The timezone bug showed up twice, in different forms, and both times the cause was the same: somewhere in the pipeline a naive datetime string was being treated as UTC. The lesson is easy to state and apparently hard to remember. Decide your time semantics once, at the schema, and enforce them everywhere.

The naming cost most of a session. The trademark search should have been step one; instead it happened the day before launch. Ollae turned out to be the better name anyway.
