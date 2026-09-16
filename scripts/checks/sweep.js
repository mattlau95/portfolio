// sweep.js — every page, every viewport: distorted images, images over the
// height cap, horizontal overflow, and axe-core violations.
//
//   node scripts/checks/sweep.js [baseUrl]
//
// This is the one to run before shipping anything that touches the figure
// system. It is what caught the 80% squash on the Collette handoff diagram,
// which was invisible by eye.

const puppeteer = require('puppeteer');
const axePath = require.resolve('axe-core/axe.min.js');
const { PAGES, VIEWPORTS, baseUrl, loadAllImages } = require('./lib');

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

(async () => {
  const base = baseUrl(process.argv[2]);
  const browser = await puppeteer.launch({ headless: 'new' });
  const problems = [];

  for (const vp of VIEWPORTS) {
    for (const path of PAGES) {
      const page = await browser.newPage();
      await page.setViewport(vp);
      await page.goto(base + path, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(loadAllImages);

      const found = await page.evaluate(() => {
        const bad = [];
        for (const img of document.images) {
          const r = img.getBoundingClientRect();
          if (!img.naturalWidth || !r.width) continue;
          // object-fit: cover is a deliberate crop, not a distortion
          if (getComputedStyle(img).objectFit !== 'fill') continue;
          const natural = img.naturalWidth / img.naturalHeight;
          const drift = Math.abs(natural - r.width / r.height) / natural * 100;
          if (drift > 2) {
            bad.push(`DISTORT ${drift.toFixed(0)}% ${img.currentSrc.split('/').pop()}`);
          }
          const cap = parseFloat(getComputedStyle(img).maxHeight);
          if (img.closest('.media-figure') && cap && r.height > cap + 2) {
            bad.push(`OVER-CAP ${img.currentSrc.split('/').pop()} ${Math.round(r.height)}>${cap}`);
          }
        }
        const de = document.documentElement;
        return {
          bad,
          hscroll: de.scrollWidth > de.clientWidth ? `${de.scrollWidth}>${de.clientWidth}` : '',
        };
      });

      // axe once per page, at the widest viewport only
      let axeIssues = '';
      if (vp.name === VIEWPORTS[0].name) {
        await page.addScriptTag({ path: axePath });
        const res = await page.evaluate(
          async (tags) => await axe.run(document, { runOnly: { type: 'tag', values: tags } }),
          AXE_TAGS
        );
        axeIssues = res.violations.map((v) => `${v.id}(${v.nodes.length})`).join(', ');
      }

      if (found.bad.length || found.hscroll || axeIssues) {
        problems.push({
          viewport: vp.name,
          page: path,
          hscroll: found.hscroll,
          axe: axeIssues,
          issues: found.bad.join(' | '),
        });
      }
      await page.close();
    }
  }

  const runs = PAGES.length * VIEWPORTS.length;
  if (problems.length) {
    console.log(`\n!! ${problems.length} problem(s) across ${runs} page/viewport combinations\n`);
    console.table(problems);
    process.exitCode = 1;
  } else {
    console.log(`\nClean: ${PAGES.length} pages x ${VIEWPORTS.length} viewports.`);
    console.log('No distorted images, none over the height cap, no horizontal scroll, 0 axe violations.');
  }

  await browser.close();
})();
