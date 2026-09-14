---
slug: edison-dental-27
title: Edison Dental 27
blurb: >
  Rebuilt a dental practice's web presence from scratch — replacing a slow
  WordPress site with a Next.js app that shows live open/closed status and
  lets staff edit hours without touching code.
thumbnail: /assets/cases/edison-dental-27.webp

metrics:
  - value: "94"
    label: "Lighthouse score (mobile)"
  - value: "100"
    label: "Accessibility — 0 axe violations"
  - value: "79%"
    label: "hero image size reduction"

stack: [Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Upstash Redis, Resend, Vercel]

links:
  live: null
  repo: null

role: "Design + Engineering (full stack)"
timeframe: "2026"
status: shipped
featured: true
---

## Overview

Edison Dental 27 is a full patient-facing website for a New Jersey dental practice. The old site ran on WordPress with a page-builder plugin — slow, hard to update, and invisible to Google's local search results. I rebuilt it from scratch: a statically-generated Next.js site with a live open/closed call-to-action, a password-protected admin panel the receptionist can use to update hours, and Schema.org structured data that had never existed on the old site.

---

## The Problem

The practice had two real problems. The first was the website itself: the WordPress/Elementor build loaded slowly and the client had no way to update their own hours without asking for help. Office hours change — holidays, staff schedules, seasonal adjustments — and every change meant a developer login or a stale listing.

The second was discoverability. Local search ranks dental practices partly on structured data: machine-readable markup that tells Google exactly when a business is open, where it is, and what it does. The old site had none. The practice was invisible in ways that didn't show up on any metric the client could see.

---

## Role & Constraints

I owned everything end-to-end: information architecture, visual design, component engineering, data layer, and deployment. The client is not technical, so "non-technical staff must be able to change hours" was a hard requirement, not a nice-to-have.

Two constraints shaped the build significantly. First, real practice photos were unavailable at the start — the design had to work with placeholders and make adding the real images a one-line swap. Second, the appointment form sits in HIPAA territory: a patient sending their name, phone, and preferred appointment time is regulated data. I scoped an appointment *request* form that collects only non-PHI fields for now, and documented the intake form path (HIPAAtizer) for a future phase.

---

## Approach

### Design

The core UX decision was the call-to-action. A static "Call us" button is honest when the office is open and misleading when it isn't. I replaced it with a live open/closed indicator: a pulsing green dot labeled "We're Open · Call Now" when the office is reachable, and a quiet "Request an Appointment" link when it's closed. Patients calling at 11 PM now have a useful path instead of a phone that rings out.

For the appointment request form, I capped it at five fields — name, phone, email, reason, and preferred time. Research from Baymard Institute puts the completion cost of each additional field at 10–15%. Insurance number and date of birth belong on an intake form at the practice; the request form's only job is to get the patient's callback info.

The reviews section was placed above the practice's own value-proposition copy. Social proof from real patients earns more trust than self-description. Each review card shows the full text (truncated at 220 characters, expandable) and the owner's response inline — 88% of patients say they prefer practices that respond to reviews.

The admin hours panel uses native `<input type="time">` controls with 15-minute steps. The alternative — a dropdown for every 15-minute increment — would have been 96 rows per day, 14 inputs. The native picker handles the UI entirely and works on mobile without any library.

### Engineering

The live open/closed feature required a careful split. The hours data lives in Upstash Redis. Redis can't be imported in a client bundle — the SDK uses Node.js APIs. I extracted the open/closed logic into `computeIsOpen.ts`, a pure function with no server dependencies, callable by both server components and client-side hooks. The server pre-computes the initial state and passes it as a prop; the client hydrates with that value immediately (no flash) and then re-checks every 60 seconds via a lightweight hook.

The Schema.org JSON-LD block is a server component that fetches live hours from Redis at render time and builds `openingHoursSpecification` dynamically. The old site had a static JSON blob that reflected whatever someone had typed there years ago. The new one is always accurate.

For the appointment form I used React 19's `useActionState` rather than the older `useFormStatus` pattern. It's cleaner: `isPending` is in scope directly, and the success/error state returned from the server action drives the UI without extra `useState` calls. The server re-checks open/closed at submission time — if the office closed between when the patient loaded the page and when they submitted, the auto-reply says "first thing next business morning" instead of "within 1 business hour."

---

## Key Decisions & Tradeoffs

**Phone CTA instead of an online booking link.** The practice books by phone. Shipping a "Book Appointment" button on day one that went nowhere would have been worse than nothing. The tel: link works on every device and reflects how the practice actually operates.

**Upstash Redis directly, not Vercel KV.** The hours CMS was originally built on Vercel KV. Vercel deprecated that product mid-project. I swapped to `@upstash/redis` directly — same REST API, no wrapper layer, and no longer tied to a platform product that might change again.

**Service sub-pages instead of modals.** The old site opened service details in modals. I built individual routes (`/services/general`, `/services/cosmetic`, etc.) instead. They're SEO-indexable, shareable, and give room for a real image gallery when the practice provides photos. The tradeoff is a slightly more complex routing setup; the gain is that every service page can be discovered independently in search.

**Research before building the intake form.** Building a fully HIPAA-compliant form stack — Vercel's HIPAA add-on, a transactional email provider with a BAA, correct data handling — would have taken 20–40 hours and introduced ongoing compliance responsibility. A purpose-built service (HIPAAtizer, $29/mo) includes a BAA on every plan and can be embedded in a few hours. I documented that decision in a spike and deferred the work rather than guessing.

---

## Outcome

Lighthouse on mobile in production: **94 performance**, **100 accessibility**, 0 axe violations across all pages. TBT dropped from 60ms to 30ms. The hero image shrank from 1.2 MB to 248 KB (79%) after replacing an oversized placeholder with a correctly-sized and compressed real photo.

LCP sits at 2.9s, still short of the 2.5s target. After optimizing the image and reducing the Playfair Display font from four weights to two, the LCP node on mobile is likely the h1 heading — not the image — which means image work won't move it further. A Chrome DevTools trace is the logical next step. I'm reporting that plainly: the gap is identified, the next action is defined, and the prior work was still worthwhile.

The Schema.org block now passes Google's Rich Results Test. The old site had no structured data at all.

---

## Reflection

The HIPAA research probably should have happened at the start of the project, not after the contact page was already designed. Knowing early that a compliant intake form required either a third-party service or significant custom infrastructure would have shaped the contact page layout from the beginning rather than requiring a scoped workaround.

On the LCP: I spent two sessions on image and font optimization before running a Chrome trace to confirm what the actual LCP element was. Fifteen minutes with DevTools earlier would have redirected that effort. Measure before optimizing.
