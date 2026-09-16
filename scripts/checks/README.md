# scripts/checks

Verification scripts for the figure system and the page audits. Node + Puppeteer,
run by hand — **not** part of the site, not loaded by any page, no build step.

## Setup

These need three dev-only packages. The repo deliberately has no `package.json`
(see `docs/PROJECT.md` §2 — plain HTML/CSS/JS, no build step), so install them
outside it and point Node at them:

```bash
mkdir -p ~/.portfolio-checks && cd ~/.portfolio-checks
npm install puppeteer axe-core lighthouse
export NODE_PATH=~/.portfolio-checks/node_modules    # PowerShell: $env:NODE_PATH="$HOME\.portfolio-checks\node_modules"
```

If you would rather install in-repo, `node_modules/` is gitignored — but check
your Cloudflare Pages build settings first, since adding a `package.json` to the
root can change what Pages auto-detects.

Then serve the site and run against it:

```bash
npx serve -l 4321 .
```

## The checks

| Script | What it answers |
|---|---|
| `sweep.js` | Is anything broken anywhere? All 13 pages × 4 viewports: distorted images, images over the height cap, horizontal overflow, axe violations. |
| `figures.js` | Does every caption's left edge match its image, and is each figure on the width track it should be? |
| `lightbox.js` | Does the `[data-zoom]` lightbox honour its keyboard contract? |
| `perf.js` | Lighthouse LCP/CLS/Performance medians, mobile and desktop. |

```bash
node scripts/checks/sweep.js
node scripts/checks/figures.js  /projects/collette.html
node scripts/checks/lightbox.js /projects/collette.html
node scripts/checks/perf.js     /projects/kumon-automation.html 3
```

All four take an optional trailing base URL (default `http://localhost:4321`).
`sweep.js`, `figures.js` and `lightbox.js` exit non-zero on failure, so they can
gate a commit if you ever want that.

**On Git Bash (Windows), pass the full URL instead of a path.** MSYS rewrites a
leading `/projects/...` argument into `C:/Program Files/Git/projects/...` before
Node ever sees it:

```bash
node scripts/checks/figures.js http://localhost:4321/projects/collette.html
```

`resolveUrl()` strips the mangled prefix as a fallback, but the full-URL form
avoids the problem outright. PowerShell and Linux are unaffected.

## Two things that will mislead you

**Lazy images.** In a headless run nothing scrolls, so `loading="lazy"` images
never load and every measurement reads a 0×0 placeholder. `lib.js` forces them
eager and waits for `decode()`. Any new check must do the same — this is why the
80% squash on the Collette handoff diagram was invisible for a whole round.

**`perf.js` numbers are not production numbers.** This harness is bimodal — the
same page lands ~1.8s or ~3.1s on LCP run to run, which is why it reports a
median over N runs and prints the raw spread. `npx serve` also sends CSS
uncompressed where Cloudflare Pages applies Brotli, and redirects `/foo.html` to
`/foo` (~600ms). Use these for before/after deltas on the same harness. For an
absolute number, measure production.

To get a baseline for a before/after, stash and re-run:

```bash
git stash push -u && node scripts/checks/perf.js /projects/collette.html 5; git stash pop
```

## Known standing results

So these do not get re-investigated every time:

- `projects/edison-dental.html` overflows horizontally at 390/360 (553px in a
  390px viewport). Pre-existing, no images on that page — MAT-713.
- `gfx/projects/skybluefc.html` reports `frame-title`: three untitled iframes
  injected by Instagram's embed script. The page's own embeds are all titled.
- `color-contrast` shows as *incomplete* (not a violation) site-wide — axe cannot
  resolve the background behind text through the `.spotlight` gradient.
- Mobile CLS is over threshold on pages with a `.case-study-metrics` strip, from
  the font swap. Deferred since `audit-2026-09-15` P2.2.
