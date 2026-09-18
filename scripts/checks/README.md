# scripts/checks

Verification scripts for the figure system and the page audits. Node + Puppeteer,
run by hand — **not** part of the site, not loaded by any page, no build step.

## Two kinds of check

| Kind | Tools | How it runs |
|---|---|---|
| **Quick checks** — any URL, no setup | Lighthouse, axe, pa11y | `npx`, as in Part A of `~/ux-audit-kit/AUDIT.md` |
| **Site checks** — this repo's figure system | `sweep.js`, `figures.js`, `lightbox.js`, `perf.js` | `npm ci` in this folder, then `npm run` |
| **Link check** — no browser, no install | `check-links.js` | `node scripts/checks/check-links.js`, any time |

Nothing is installed globally or in the home directory. The site checks'
dependencies live in `scripts/checks/node_modules/`, pinned by `package.json`
and `package-lock.json` in this folder, and Puppeteer's Chrome downloads to
`scripts/checks/.cache/puppeteer/` (set in `.puppeteerrc.cjs`). Both folders are
gitignored. The repo root still has no `package.json` (`docs/PROJECT.md` §2), so
Cloudflare Pages' build detection is unaffected.

## Link check (no setup)

`check-links.js` reads files off disk — no browser, no server, no dependencies,
so it runs before `npm ci` and in a clean clone:

```bash
node scripts/checks/check-links.js          # defaults to site/
node scripts/checks/check-links.js site
```

It reports local `href`/`src`/`srcset`/`poster`/`url()` references that resolve
to nothing, and in-site `#fragment` links pointing at an id no page declares.
Exits non-zero when something is broken.

It strips HTML comments before scanning, on purpose: `kumon-automation.html`
keeps a whole `<figure>` commented out so its unbuilt poster does not 404, and
scanning commented markup would report a break that is not there.

A clean run on `site/` today is 14 pages, 3 stylesheets, 159 references, zero
broken — the same numbers the pre-`site/` tree gave before MAT-716, which is how
that restructure was shown to change nothing.

## Quick checks (npx)

```bash
npx lighthouse https://www.matthewclau.com/projects/ollae --only-categories=performance,accessibility,best-practices --output=json --output-path=./lighthouse-report.json
npx @axe-core/cli https://www.matthewclau.com/projects/ollae
npx pa11y https://www.matthewclau.com/projects/ollae
```

`@axe-core/cli` and `pa11y` are npx-only: they aren't in this folder's
`package.json`, so npx fetches the latest into npm's cache wherever you run
them. `lighthouse` is also a pinned dependency here (for `perf.js`), so
`npx lighthouse` run from `scripts/checks/` after `npm ci` uses that pinned
version; run anywhere else, it fetches the latest.

## Site checks (npm ci)

One-time setup, and again whenever `package-lock.json` changes:

```bash
cd scripts/checks
npm ci
```

Then serve the site in another terminal. Serve `site/`, not the repo root —
that is what Cloudflare Pages deploys:

```bash
npx serve -l 4321 site
```

## The checks

| Script | What it answers |
|---|---|
| `sweep.js` | Is anything broken anywhere? All 13 pages × 4 viewports: distorted images, images over the height cap, horizontal overflow, axe violations. |
| `figures.js` | Does every caption's left edge match its image, and is each figure on the width track it should be? |
| `lightbox.js` | Does the `[data-zoom]` lightbox honour its keyboard contract? |
| `perf.js` | Lighthouse LCP/CLS/Performance medians, mobile and desktop. |

Run them through `npm run` from `scripts/checks/`, so Puppeteer finds
`.puppeteerrc.cjs` and its Chrome. A bare `node sweep.js` from the repo root
looks in `~/.cache/puppeteer` instead and fails to launch.

```bash
npm run sweep
npm run figures  -- /projects/collette.html
npm run lightbox -- /projects/collette.html
npm run perf     -- /projects/kumon-automation.html 3
```

From the repo root, add `--prefix scripts/checks`:
`npm --prefix scripts/checks run figures -- /projects/collette.html`.

All four take an optional trailing base URL (default `http://localhost:4321`).
`sweep`, `figures` and `lightbox` exit non-zero on failure, so they can gate a
commit if you ever want that.

**On Git Bash (Windows), pass the full URL instead of a path.** MSYS rewrites a
leading `/projects/...` argument into `C:/Program Files/Git/projects/...` before
Node ever sees it:

```bash
npm run figures -- http://localhost:4321/projects/collette.html
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
git stash push -u && npm --prefix scripts/checks run perf -- /projects/collette.html 5; git stash pop
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
