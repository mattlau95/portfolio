// lightbox.js — keyboard and behaviour contract for the [data-zoom] lightbox.
//
//   node scripts/checks/lightbox.js /projects/collette.html [baseUrl]
//
// Each assertion here corresponds to a rule in docs/image-conventions.md §6.
// The Space check is the counter-intuitive one: Space must NOT open the
// dialog, because the trigger is a link and Space belongs to page scrolling.

const puppeteer = require('puppeteer');
const { resolveUrl } = require('./lib');

const results = [];
const check = (name, pass, detail = '') => {
  results.push({ check: name, result: pass ? 'PASS' : 'FAIL', detail });
};

(async () => {
  const path = process.argv[2] || '/projects/collette.html';
  const url = resolveUrl(path, process.argv[3]);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const requested = [];
  page.on('request', (r) => { if (/\.(webp|jpe?g|png|mp4)$/i.test(r.url())) requested.push(r.url().split('/').pop()); });

  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  const trigger = await page.$('a[data-zoom]');
  if (!trigger) {
    console.log(`No [data-zoom] triggers on ${path} — nothing to check.`);
    await browser.close();
    return;
  }

  const zoomTarget = await page.evaluate(() => document.querySelector('a[data-zoom]').href.split('/').pop());
  check('full-size file not fetched on page load', !requested.includes(zoomTarget), zoomTarget);

  const state = () => page.evaluate(() => {
    const d = document.querySelector('dialog.lightbox');
    const a = document.activeElement;
    return {
      open: d?.open ?? false,
      src: d?.querySelector('img')?.getAttribute('src')?.split('/').pop() ?? null,
      label: d?.getAttribute('aria-label') ?? null,
      focus: a ? a.tagName + (a.className ? '.' + String(a.className).split(' ')[0] : '') : 'none',
    };
  });

  // Accessible name should say where the link goes, not just repeat the alt.
  const name = await page.accessibility.snapshot({ root: trigger });
  check('trigger accessible name states the destination', /full[- ]size/i.test(name?.name || ''), (name?.name || '').slice(0, 60) + '…');

  await page.evaluate(() => document.querySelector('a[data-zoom]').focus());
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 400));
  let s = await state();
  check('Enter opens the dialog', s.open);
  check('dialog has an aria-label', !!s.label, s.label);
  check('full-size file fetched only on open', requested.includes(zoomTarget), zoomTarget);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 400));
  s = await state();
  check('Esc closes', !s.open);
  check('focus returns to the trigger', s.focus.startsWith('A'), s.focus);
  check('src released on close', s.src === null);

  // Space must scroll, not open.
  const before = await page.evaluate(() => scrollY);
  await page.evaluate(() => document.querySelector('a[data-zoom]').focus());
  await page.keyboard.press('Space');
  await new Promise((r) => setTimeout(r, 400));
  s = await state();
  const after = await page.evaluate(() => scrollY);
  check('Space does NOT open the dialog', !s.open);
  check('Space still scrolls the page', after > before, `${before} -> ${after}`);

  // Backdrop click.
  await page.evaluate(() => document.querySelector('a[data-zoom]').focus());
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const d = document.querySelector('dialog.lightbox');
    d.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 300));
  check('backdrop click closes', !(await state()).open);

  // Close button.
  await page.evaluate(() => document.querySelector('a[data-zoom]').focus());
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => document.querySelector('.lightbox-close').click());
  await new Promise((r) => setTimeout(r, 300));
  check('close button closes', !(await state()).open);

  // Modified clicks must reach the browser so open-in-new-tab works.
  const modified = await page.evaluate(() => {
    const a = document.querySelector('a[data-zoom]');
    const e = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 });
    a.dispatchEvent(e);
    return e.defaultPrevented;
  });
  check('ctrl+click is not intercepted', modified === false);

  const plain = await page.evaluate(() => {
    const a = document.querySelector('a[data-zoom]');
    const e = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    a.dispatchEvent(e);
    return e.defaultPrevented;
  });
  check('plain click is intercepted', plain === true);

  console.table(results);
  const failed = results.filter((r) => r.result === 'FAIL').length;
  console.log(failed ? `\n!! ${failed} failed` : `\nAll ${results.length} lightbox checks passed.`);
  if (failed) process.exitCode = 1;
  await browser.close();
})();
