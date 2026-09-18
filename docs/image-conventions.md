# Image conventions

> How images work on this site: widths, captions, spacing, zoom, and
> accessibility. The CSS lives in `styles/style.css` under "Figures — one
> system for every image on the site" and `--figure-*` in `styles/tokens.css`.
> Applies to case-study pages (`projects/*.html`) and the graphic-design
> archive (`gfx/projects/*.html`), which share one figure system.

---

## 1. The one rule that matters

**An image is bounded by its height, not its width.**

```css
.media-figure img {
  width: auto;
  max-width: 100%;                    /* never wider than the text column */
  max-height: var(--figure-max-h);    /* never taller than one screen */
  margin-inline: auto;
}
```

`--figure-max-h` is `clamp(18rem, 70vh, 32rem)` — 512px on a normal screen,
less on a short one, with a floor so the image stays usable at 400% zoom where
`70vh` would otherwise collapse to nothing.

This is what makes portrait work. Everything on this site used to be
`width: 100%`, which is correct for a 16:9 board and catastrophic for an iPhone
screenshot: a 486×1054 screenshot in the 692px text column rendered **724px
tall**, and a 768×1024 handoff diagram rendered **922px tall** — taller than
the viewport it was being read in. Capping the height instead lets CSS derive
the width from the intrinsic ratio, so a portrait image just gets narrower.

No orientation classes. No per-image bookkeeping. One rule covers landscape,
square, portrait, and the 2.4:1 crop.

### Two gotchas, both load-bearing

**`width` must stay `auto`.** A definite `width: 100%` gives the box a
definite width, so `max-height` clamps the *height alone* and squashes the
image. The handoff diagram rendered 692×512 from a 768×1024 source — 80%
distortion — until `width` went back to `auto`. If you ever reintroduce
`width: 100%` here, portrait images silently start lying about their
proportions.

**Images are never upscaled.** `width: auto` means a source narrower than the
column renders at its natural size, centred, rather than being stretched. The
400×400 Doughmain GIFs were being blown up 1.7× to fill the column; now they
render sharp at 400px. If you want a figure to fill the column, **export it
wider** — at least 1400px for a 692px slot at 2× DPR. That is the fix, not CSS.

---

## 2. Figure widths

Three tracks. The class sets the width; the height cap in §1 still applies.

| Track | Class | Width | Use |
|---|---|---|---|
| Column | `.media-figure` (default) | `fit-content`, capped at the 692px text column | everything |
| Wide | `.media-figure figure--wide` | column × `--figure-wide-scale` (1.4) = 969px | one hero plate per page |
| Pair | `.media-pair` inside a figure | two capped images side by side | before/after comparisons |

`.figure--wide` is a reusable outdent, not a per-image one-off:

```css
.figure--wide {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: max(
    100%,
    min(calc(100% * var(--figure-wide-scale)), calc(100vw - 2 * var(--space-8)))
  );
}
```

The outer `max(100%, …)` is a guard: on a page whose gutter is narrower than
`--space-8`, the viewport clamp could otherwise resolve *below* the column and
make the "wide" figure narrower than the text beside it. With the current 2rem
gutter it never binds — the hero measures exactly 1.0× the column at both
390px (326px) and 360px (296px).

**A wide figure must re-derive its `sizes`.** Solving the rule above gives
969px once the viewport clears 1033px, and `100vw - 4rem` below that:

```html
sizes="(min-width: 1033px) 969px, calc(100vw - 4rem)"
```

Getting this wrong is silent — the browser just downloads a larger file than it
paints. At 1440px/1× the hero now picks the 1000w candidate (41KB) where the
old 1336px track picked 1600w (85KB).

---

## 3. Caption alignment

**Every caption's left edge matches its image's left edge. No exceptions.**

Figures come in three widths relative to the text column — narrower and centred,
equal, and wider — so a caption pinned to the column only looks correct in the
middle case. The figure shrinks to its content instead:

```css
.media-figure              { width: fit-content; max-width: 100%; margin: var(--figure-gap) auto; }
.media-figure > figcaption { contain: inline-size; max-width: 60ch; }
```

`contain: inline-size` is load-bearing. Without it the caption's longest line
contributes to the figure's max-content width, so `fit-content` sizes to the
*caption* rather than the image and the alignment collapses.

Three consequences worth knowing:

- **The hero carries `.figure--wide` on the `<figure>`, not on the inner `<a>`.**
  With the outdent on the link, the caption stayed on the text column and started
  322px to the left of the image it described.
- **`.media-pair` uses `justify-content: flex-start`.** At desktop the figure is
  `fit-content`, so the flex line has no slack and the pair reads as centred
  anyway. Once it wraps at phone widths slack appears — centring it would push
  each image 44px off the caption's left edge.
- **Child selectors (`> figcaption`), not descendant.** The pair nests a `<figure>`
  per image so each label belongs to its own image; a descendant selector would
  style those inner labels as outer captions.

Captions under a narrow figure wrap to 2–3 lines (the handoff diagram is 385px
wide at 1440×900, and 216px at its narrowest, where the `18rem` clamp floor stops
it). Accepted rather than special-cased — the lightbox covers readability, and an
exception would cost the rule above.

---

## 4. Markup

```html
<!-- Column width: the default -->
<figure class="media-figure">
  <img src="/assets/project/thing.webp" alt="What the image shows."
       width="768" height="1024" loading="lazy">
  <figcaption>What the reader should take from it, and when.</figcaption>
</figure>

<!-- Wide: one hero plate per page, zoomable -->
<figure class="hero-figure figure--wide">
  <a class="figure-zoom" href="/assets/project/board-2x.webp" data-zoom>
    <span class="sr-only">View full-size: </span>
    <img src="…" srcset="… 1000w, … 1600w, … 3200w"
         sizes="(min-width: 1033px) 969px, calc(100vw - 4rem)"
         width="1600" height="900" fetchpriority="high" alt="…">
  </a>
  <figcaption>…</figcaption>
</figure>

<!-- Pair: nested figures so each label belongs to its own image -->
<figure class="media-figure">
  <div class="media-pair">
    <figure>
      <img …>                          <!-- alt self-identifies as the design -->
      <figcaption>Design · Adobe XD</figcaption>
    </figure>
    <figure>
      <img …>                          <!-- alt self-identifies as the build -->
      <figcaption>Build · live site</figcaption>
    </figure>
  </div>
  <figcaption>Design and build of the same view, March 2023.</figcaption>
</figure>
```

Nested `<figure>` is valid HTML and is the right structure here: it ties each
label to one image instead of leaving the reader to infer left-from-right. The
inner figures get `margin: 0` explicitly — they must pick up neither the UA
default (`1em 40px`) nor `.media-figure`'s vertical gap.

**Required on every `<img>`:**

| Attribute | Why |
|---|---|
| `width` / `height` | Intrinsic ratio reserves the box before load. Without it the height cap has nothing to work from and the page shifts. These are the *source* pixel dimensions, not display size. |
| `alt` | See §6. |
| `loading="lazy"` | Everything except the hero. |
| `fetchpriority="high"` | Hero only — it is the LCP element. |

---

## 5. Captions and spacing

Captions use the site's **metadata voice** — `--font-mono`, `--text-xs`,
`--color-text-muted` — the same register as `.case-study-meta-row`, the
back-link, and the footer date.

This is the fix for the Collette hero caption reading as body copy. It was
DM Sans 15px against DM Sans 17px body: same typeface, one step down, so it
parsed as a lead sentence rather than apparatus. A different *family* does in
one move what size and colour alone could not.

| Property | Value | Why |
|---|---|---|
| family | `--font-mono` | separates caption from prose at a glance |
| size | `--text-xs` | subordinate; contrast measured at 8.03:1 (§6) |
| `max-width` | `60ch` | ~455px. Small type needs a short measure. |
| `margin-top` | `--space-4` (16px) | was 8px — too tight under a 500px image |
| figure margin | `--figure-gap` (48px) | paragraphs are 16px apart; figures need to read as interruptions, not as another paragraph |

**A caption is not alt text.** Alt describes what is *in* the image for someone
who cannot see it; the caption says what to *take from* it and when it happened.
They should not repeat each other — a screen reader announces both.

**The token table is the one exception, and correctly so.** It uses `<caption>`
inside `<table>`, not `<figcaption>` — `<caption>` is the right element for a
table, and `caption-side: bottom` puts it below to match the figures. It already
inherits mono/xs/muted from `.token-table`, so it matches without sharing rules.

---

## 6. Zoom (lightbox)

Figures worth inspecting get `data-zoom`. `scripts/main.js` builds one native
`<dialog>` lazily and reuses it.

```html
<a class="figure-zoom" href="{full-size file}" data-zoom>
  <span class="sr-only">View full-size: </span>
  <img …>
</a>
```

The rules that make it accessible, each of which is a thing that goes wrong if
you change it:

- **The trigger stays a real `<a href>`.** With JS off it still opens the image.
  A `<button>` would be dead without JS; a click handler on a bare `<img>` would
  be unreachable by keyboard entirely.
- **Enter only — no Space handler.** Links activate on Enter; Space scrolls the
  page, and hijacking it breaks a reflex. Enter fires a synthetic `click`, so the
  click handler covers it.
- **Modified clicks pass through.** `metaKey`, `ctrlKey`, `shiftKey`, `altKey` or
  `button !== 0` return before `preventDefault()`, so open-in-new-tab, open-in-
  window and download keep working.
- **The accessible name is `"View full-size: " + alt`** via the leading `.sr-only`
  span, so the link says where it goes instead of just re-reading the alt. The
  dialog carries its own `aria-label`.
- **`showModal()`, not `show()`** — it supplies Esc and the focus trap. Focus
  return on close is still explicit; browsers disagree about restoring it.
- **`src` is set at open time and removed on close.** The 199KB 2× board must
  never be fetched on page load, only when someone asks for it.
- **`prefers-reduced-motion`** gates the fade; the dialog still opens.
- **`.lightbox` needs `position: relative`.** Without it the close button's
  `position: absolute` resolves against the initial containing block and lands
  off-screen above a full-height image.

---

## 7. Accessibility

- **Alt text** describes what the image shows that the prose does not. Long is
  fine for a dense diagram — the QA screenshot's alt names the callouts and what
  they point at. If the image is pure decoration, `alt=""`, and then it probably
  should not be a `<figure>` at all.
- **Both alt and figcaption are announced.** Write them as complements.
- **In a `.media-pair`, each alt must self-identify.** The labels help sighted
  readers, but the alts still open "Adobe XD design of…" and "The built mobile
  tour page…".
- **The height cap respects zoom.** The `18rem` clamp floor means at 400% browser
  zoom the image is still 288 CSS px instead of collapsing with `70vh`.
  WCAG 1.4.4 / 1.4.10.
- **Caption contrast: 8.03:1** (`#a8a8a2` on `#0f0f0e`), against a 4.5:1
  requirement. No token change needed.
- **Verify, don't assume.** `node dev/checks/sweep.js` checks all 13 pages at
  1440/1024/390/360 for distortion, over-cap images and horizontal overflow, and
  runs axe-core on each; `figures.js` checks the caption-alignment rule in §3 and
  `lightbox.js` the keyboard contract in §6. See `dev/checks/README.md` for
  setup and the standing known results. As of 2026-09-16: 0 axe violations on all
  13 pages, all captions aligned, 14/14 lightbox checks passing.

---

## 8. Known gaps

- **The hero board is unreadable on mobile** (326×184). Art direction, not CSS —
  needs a cropped mobile source via `<picture>`. Tracked in MAT-713.
- **The hero board's white ground** fights the dark page, and the board would
  read better cropped tighter. Both need a new asset.
- **`projects/edison-dental.html` scrolls horizontally on mobile** (553px in a
  390px viewport). Not an image bug — that page has no images. Tracked in MAT-713.
- **`gfx/projects/skybluefc.html` has three untitled iframes** injected by
  Instagram's embed script (`frame-title`). The page's own YouTube and Twitter
  embeds are all titled; these are third-party.
