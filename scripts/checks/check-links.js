#!/usr/bin/env node
/* check-links.js — zero-dependency local link checker.

   Walks a site root, pulls every local href/src/srcset/poster/url() out of the
   HTML and CSS, and reports the ones that resolve to nothing on disk. Also
   checks that in-site `#fragment` links point at an id that exists.

   Usage:
     node check-links.js [root]      # root defaults to ../../site

   Exits non-zero if anything is broken, so it can gate a commit.

   Two deliberate behaviours, both load-bearing:
   - HTML comments are stripped before scanning. kumon-automation.html keeps a
     whole <figure> commented out precisely so its not-yet-built poster does not
     404; scanning it would report a break that does not exist.
   - Extensionless paths resolve the way Cloudflare Pages serves them: `/foo`
     matches `foo.html` or `foo/index.html`, and a trailing slash matches
     `index.html`. The site links to `/projects/collette.html` today, but this
     keeps the checker honest if those ever become clean URLs.
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'site'));

if (!fs.existsSync(ROOT)) {
  console.error(`check-links: no such root: ${ROOT}`);
  process.exit(2);
}

// ---------------------------------------------------------------- walk

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const pages = files.filter((f) => f.endsWith('.html'));
const sheets = files.filter((f) => f.endsWith('.css'));

// ---------------------------------------------------------------- extract

const EXTERNAL = /^(https?:)?\/\/|^(mailto|tel|data|javascript):/i;

// One reference found in one file.
const refs = [];

function addRef(file, line, raw) {
  const value = raw.trim();
  if (!value || EXTERNAL.test(value)) return;
  refs.push({ file, line, value });
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function scanHtml(file) {
  const raw = fs.readFileSync(file, 'utf8');
  // Blank out comments but keep the byte count, so line numbers stay true.
  const text = raw.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));

  const attr = /\b(href|src|poster|data-zoom)\s*=\s*"([^"]*)"/gi;
  for (let m; (m = attr.exec(text)); ) addRef(file, lineOf(text, m.index), m[2]);

  const srcset = /\bsrcset\s*=\s*"([^"]*)"/gi;
  for (let m; (m = srcset.exec(text)); ) {
    const line = lineOf(text, m.index);
    for (const candidate of m[1].split(',')) {
      addRef(file, line, candidate.trim().split(/\s+/)[0]);
    }
  }

  const cssUrl = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  for (let m; (m = cssUrl.exec(text)); ) addRef(file, lineOf(text, m.index), m[1]);
}

function scanCss(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

  const cssUrl = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  for (let m; (m = cssUrl.exec(text)); ) addRef(file, lineOf(text, m.index), m[1]);

  const imports = /@import\s+['"]([^'"]+)['"]/gi;
  for (let m; (m = imports.exec(text)); ) addRef(file, lineOf(text, m.index), m[1]);
}

pages.forEach(scanHtml);
sheets.forEach(scanCss);

// ---------------------------------------------------------------- resolve

// Returns the file on disk a URL path resolves to, or null.
function resolveTarget(file, value) {
  const [noHash] = value.split('#');
  const [clean] = noHash.split('?');
  if (!clean) return { target: file, kind: 'self' }; // bare "#frag"

  const base = clean.startsWith('/')
    ? path.join(ROOT, clean)
    : path.resolve(path.dirname(file), clean);

  // Never let a link escape the site root.
  if (!base.startsWith(ROOT)) return { target: null, kind: 'escape' };

  const candidates = clean.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, `${base}.html`, path.join(base, 'index.html')];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return { target: candidate, kind: 'file' };
    }
  }
  return { target: null, kind: 'missing' };
}

// ids/names declared in a page, cached
const idCache = new Map();
function idsIn(file) {
  if (idCache.has(file)) return idCache.get(file);
  const text = fs.readFileSync(file, 'utf8');
  const ids = new Set();
  const attr = /\b(?:id|name)\s*=\s*"([^"]+)"/gi;
  for (let m; (m = attr.exec(text)); ) ids.add(m[1]);
  idCache.set(file, ids);
  return ids;
}

const brokenPaths = [];
const brokenAnchors = [];

for (const ref of refs) {
  const { target, kind } = resolveTarget(ref.file, ref.value);

  if (kind === 'escape') {
    brokenPaths.push({ ...ref, why: 'resolves outside the site root' });
    continue;
  }
  if (!target) {
    brokenPaths.push({ ...ref, why: 'no such file' });
    continue;
  }

  const hash = ref.value.includes('#') ? ref.value.split('#').slice(1).join('#') : '';
  if (hash && target.endsWith('.html')) {
    const fragment = decodeURIComponent(hash);
    if (fragment !== 'top' && !idsIn(target).has(fragment)) {
      brokenAnchors.push({ ...ref, why: `no #${fragment} in ${path.relative(ROOT, target)}` });
    }
  }
}

// ---------------------------------------------------------------- report

const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');

function report(title, rows) {
  if (!rows.length) return;
  console.log(`\n${title} (${rows.length})`);
  for (const r of rows) {
    console.log(`  ${rel(r.file)}:${r.line}  ${r.value}  — ${r.why}`);
  }
}

console.log(`check-links: ${rel(ROOT) || ROOT}`);
console.log(`  ${pages.length} pages, ${sheets.length} stylesheets, ${refs.length} local references`);

report('BROKEN PATHS', brokenPaths);
report('BROKEN ANCHORS', brokenAnchors);

const total = brokenPaths.length + brokenAnchors.length;
console.log(total ? `\n${total} broken.` : '\nAll local references resolve.');
process.exit(total ? 1 : 0);
