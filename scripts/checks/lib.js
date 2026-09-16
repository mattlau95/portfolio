// lib.js — shared setup for the check scripts.

const PAGES = [
  '/',
  '/projects/collette.html',
  '/projects/edison-dental.html',
  '/projects/kumon-automation.html',
  '/projects/ollae.html',
  '/projects/pocalab.html',
  '/projects/vbs-scheduler.html',
  '/projects/worship-slides.html',
  '/gfx/',
  '/gfx/projects/aduro.html',
  '/gfx/projects/doughmain.html',
  '/gfx/projects/news12nj.html',
  '/gfx/projects/skybluefc.html',
];

// Widest first — sweep.js runs axe only on the first entry.
const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: '1024', width: 1024, height: 768, deviceScaleFactor: 1 },
  { name: '390', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
  { name: '360', width: 360, height: 740, deviceScaleFactor: 2, isMobile: true },
];

const DEFAULT_BASE = 'http://localhost:4321';

// No argv fallback here on purpose: in the scripts that take a page path,
// argv[2] IS the path, and defaulting to it produced base+path doubled.
const baseUrl = (explicit) => (explicit || DEFAULT_BASE).replace(/\/$/, '');

// Accepts either "/projects/x.html" or a full URL. The full-URL form is the
// way out of Git Bash's MSYS path conversion, which rewrites a leading
// "/projects/..." argument into "C:/Program Files/Git/projects/...".
const resolveUrl = (pathOrUrl, explicitBase) => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.replace(/^.*?(?=\/(?:projects|gfx|assets|styles|scripts)\/)/i, '');
  return baseUrl(explicitBase) + (path.startsWith('/') ? path : '/' + path);
};

// Lazy images never enter the viewport in a headless run, so force them in and
// wait for decode. Without this every measurement reads a 0x0 placeholder.
const loadAllImages = async () => {
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
};

module.exports = { PAGES, VIEWPORTS, baseUrl, resolveUrl, loadAllImages };
