// figures.js — figure widths and caption alignment on one page.
//
//   node dev/checks/figures.js /projects/collette.html [baseUrl]
//
// The rule being checked (docs/image-conventions.md §3): every caption's left
// edge matches its image's left edge, at every width, with no exceptions. Also
// reports each figure's width as a multiple of the text column, so a
// .figure--wide track can be confirmed at 1.4x rather than assumed.

const puppeteer = require('puppeteer');
const { VIEWPORTS, resolveUrl, loadAllImages } = require('./lib');

(async () => {
  const path = process.argv[2] || '/projects/collette.html';
  const url = resolveUrl(path, process.argv[3]);
  const browser = await puppeteer.launch({ headless: 'new' });
  let misaligned = 0;

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(loadAllImages);

    const data = await page.evaluate(() => {
      const probe = document.querySelector('.case-study-body p, main section p');
      const column = probe ? probe.getBoundingClientRect().width : 0;
      const rows = [];
      document.querySelectorAll('figure.media-figure, figure.hero-figure').forEach((fig) => {
        const caption = fig.querySelector(':scope > figcaption');
        const media = fig.querySelector('img, video');
        if (!caption || !media) return;
        const m = media.getBoundingClientRect();
        const c = caption.getBoundingClientRect();
        const f = fig.getBoundingClientRect();
        rows.push({
          figure: fig.className,
          track: column ? +(f.width / column).toFixed(2) : null,
          mediaLeft: Math.round(m.left),
          mediaW: Math.round(m.width),
          capLeft: Math.round(c.left),
          drift: Math.round(c.left - m.left),
        });
      });
      const de = document.documentElement;
      return {
        column: Math.round(column),
        rows,
        hscroll: de.scrollWidth > de.clientWidth ? `${de.scrollWidth}>${de.clientWidth}` : 'none',
      };
    });

    console.log(`\n=== ${vp.name}px ===  column ${data.column}  h-scroll: ${data.hscroll}`);
    console.table(
      data.rows.map((r) => {
        if (Math.abs(r.drift) >= 2) misaligned++;
        return { ...r, aligned: Math.abs(r.drift) < 2 ? 'yes' : `NO (${r.drift}px)` };
      })
    );
    await page.close();
  }

  console.log(misaligned ? `\n!! ${misaligned} caption(s) misaligned` : '\nAll captions aligned to their media.');
  if (misaligned) process.exitCode = 1;
  await browser.close();
})();
