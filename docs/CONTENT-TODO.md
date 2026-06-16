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

- [ ] **ollae** — `https://github.com/___`
- [ ] **pocalab** — `https://github.com/___`
- [ ] **Worship Slides Generator** — `https://github.com/___`
- [x] **VBS Scheduler** — `https://github.com/mattlau95/vbs-scheduler` *(already public, confirmed)*
- [ ] **Kumon Grading Automation** — `https://github.com/___`
- [ ] **Edison Dental 27** — no repo link currently planned (client project — confirm whether to omit or link a private/portfolio-only repo)

---

## 2. Other content gaps

- [ ] **Tech stack — pocalab.** Framework + PDF library still unconfirmed in `CONTENT.md` (`[framework?]`, `[PDF lib — pdf-lib / jsPDF?]`).
- [ ] **Tech stack — Edison Dental.** Framework tag still unconfirmed (`[framework — Vercel deploy]` — Next.js? Plain static?).
- [ ] **Résumé file.** `/assets/resume.pdf` is linked from the sidebar but the file doesn't exist yet — add it at that exact path.
- [ ] **"Other" social link.** CodePen / X / Ko-fi — pick a platform and provide the URL, or leave permanently skipped.
- [ ] **Studio hub URL.** The footer's "an MCL Studio project" line is plain text, not a link, until this exists.
- [ ] **Edison Dental Lighthouse before/after.** Old-site vs. new-site Lighthouse/CWV/SEO scores — `CONTENT.md` calls this "the single best proof point" for the case study; currently a `.pending-note` placeholder on the case study page.

---

## 3. Project metrics

`CONTENT.md` mentions you already have metrics for some of these — drop them
in below and they'll get wired into `.badges` pills on the project cards
(same visual treatment as the Kumon/Collette badges already live in
Experience and on the Kumon Grading Automation card).

- **ollae** — metric(s): `___`
- **pocalab** — metric(s): `___`
- **Worship Slides Generator** — metric(s): `___`
- **VBS Scheduler** — metric(s): `___`
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

- [ ] `/assets/thumbnails/ollae.webp` (4:3)
- [ ] `/assets/thumbnails/pocalab.webp` (4:3)
- [ ] `/assets/thumbnails/worship-slides.webp` (4:3)
- [ ] `/assets/thumbnails/vbs-scheduler.webp` (4:3)
- [ ] `/assets/thumbnails/kumon-automation.webp` (4:3)
- [ ] `/assets/thumbnails/edison-dental.webp` (8:3 — wider)

---

## 5. og.png (Phase 5 — SEO + deploy, not blocking yet)

Not needed until Phase 5, listed here so it doesn't get lost: `/assets/og.png`
for Open Graph / Twitter card previews. Recommended 1200×630px.

- [ ] `/assets/og.png`
