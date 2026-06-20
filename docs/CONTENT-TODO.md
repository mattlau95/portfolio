# CONTENT-TODO.md — fill-in sheet for launch-blocking content gaps

> Tracks every piece of real data the site is still waiting on. Fill in a
> value, check the box, and the corresponding `[bracket placeholder]` in
> `CONTENT.md` (and the markup it's wired to) can be replaced. Nothing here
> needs code — just information only you can supply.

---

## 1. Repo links

Every project card needs a public repo with a real README before launch
(`CONTENT.md`'s own rule). Add the URL, then check it off once the repo is
actually public.

- [x] **ollae** — `https://github.com/mattlau95/ollae`
- [x] **pocalab** — `https://github.com/mattlau95/pocalab`
- [x] **Worship Slides Generator** — `https://github.com/mattlau95/worship-slides-generator`
- [x] **VBS Scheduler** — `https://github.com/mattlau95/vbs-scheduler` *(already public, confirmed)*
- [x] **Kumon Grading Automation** — `https://github.com/mattlau95/kumon-connect-automation-tool-extension`
- [x] **Edison Dental 27** — `https://github.com/mattlau95/edison-dental-27`

---

## 2. Other content gaps

- [x] **Tech stack — pocalab.** React 19 + TypeScript + Vite, pdf-lib (client-side PDF), react-easy-crop, deployed on Vercel.
- [x] **Tech stack — Edison Dental.** Next.js 16 (App Router) + TypeScript + React 19, Shadcn/ui + Radix UI, Tailwind CSS v4, Resend (email), Upstash Redis (data/state), React Compiler, Vercel.
- [x] **Résumé file.** `/assets/resume.pdf` — file added.
- [x] **"Other" social link.** Permanently skipped — GitHub + LinkedIn only.
- [ ] **Studio hub URL.** TBD — footer stays as plain text until the studio hub exists.
- [x] **Edison Dental Lighthouse before/after** (mobile):
  - Old (edisondental27.com): Performance 61 · Accessibility 88 · Best Practices 96 · SEO 100
  - New (edison-dental-27.vercel.app): Performance 95 · Accessibility 100 · Best Practices 100 · SEO 100

---

## 3. Project metrics

`CONTENT.md` mentions you already have metrics for some of these — drop them
in below and they'll get wired into `.badges` pills on the project cards
(same visual treatment as the Kumon/Collette badges already live in
Experience and on the Kumon Grading Automation card).

- **ollae** — 100+ RSVPs collected in personal use (Thursday volleyball + casual events)
- **pocalab** — 45 min → 12 min per sheet (~70% faster, ~30 min saved); ~26 hrs/yr back at one sheet/week. Gluing step eliminated entirely via front/back registration.
- **Worship Slides Generator** — 96% reduction in slide prep time; 4-song set ~1.5–2 hrs → ~4 min; 8-song night ~3–4 hrs → ~8 min
- **VBS Scheduler** — 8-person team, 70 availability responses collected across the full summer. Replaced Doodle (which capped at 1 month at a time); results view designed to match the team's own schedule sheet.
- **Kumon Grading Automation** — already has a badge (~96% time cut · 10–13 hrs → ~25 min). Additional metric(s) if any: `___`
- **Edison Dental 27** — already covered via the case study's "what I built" + impact framing; the Lighthouse before/after (see §2) is the one still-missing metric here.

---

## 4. Thumbnails

**Directory:** `/assets/thumbnails/` (already exists in the repo).

**Recommended format:** WebP, same aspect ratio per card type so the grid stays
visually consistent (PROJECT.md §3):
- Standard cards: **4:3**, e.g. 800×600px
- Featured Edison Dental card: **8:3** (wider/shorter), e.g. 1600×600px

Drop each file in at the exact filename below — `CONTENT.md` and the markup
already reference these paths, so no code changes needed once they exist.
Check the box once the real file is in place.

- [x] `/assets/thumbnails/ollae.webp` (4:3)
- [x] `/assets/thumbnails/pocalab.webp` (4:3)
- [x] `/assets/thumbnails/worship-slides.webp` (4:3)
- [x] `/assets/thumbnails/vbs-scheduler.webp` (4:3)
- [x] `/assets/thumbnails/kumon-automation.webp` (4:3)
- [x] `/assets/thumbnails/edison-dental.webp` — portrait crop of hero section (450×600)

---

## 5. og.png (Phase 5 — SEO + deploy, not blocking yet)

Not needed until Phase 5, listed here so it doesn't get lost: `/assets/og.png`
for Open Graph / Twitter card previews. Recommended 1200×630px.

- [ ] `/assets/og.png`
