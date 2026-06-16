# devlog.md — build log

> One entry per phase. Newest at the top.

---

## 2026-06-16 — Phase 0: Scaffold

- Initialized git repo, added `.gitignore` (OS/editor cruft only — no build
  tooling).
- Created file structure: `index.html`, `styles/tokens.css`, `styles/style.css`,
  `scripts/main.js`, `assets/thumbnails/`. `PROJECT.md`/`CONTENT.md` stay in
  `docs/` rather than root.
- Locked `tokens.css`: palette (near-black `#0f0f0e` bg, warm off-white
  `#e8e8e2` text, sky `#60c8f0` as the single committed accent), type families
  (DM Serif Display / DM Sans / DM Mono), a fluid clamp-based type scale, and a
  4px spacing scale.
- Wired font loading in `index.html` via Google Fonts (`preconnect` +
  `display=swap`).
- Wrote a minimal modern reset in `style.css`: box-sizing, margin reset,
  img/video defaults, `:focus-visible` baseline kept visible (not stripped).
- No layout, content, or interactions yet — those are Phases 1–3.

**Next:** Phase 1 — sticky split-column layout shell, responsive collapse,
empty section anchors.
