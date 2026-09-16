// perf.js — Lighthouse medians for one page, mobile and desktop.
//
//   node scripts/checks/perf.js /projects/kumon-automation.html [runs] [baseUrl]
//
// Runs N times (default 3) and reports the median, because this harness is
// bimodal: the same page can land ~1.8s or ~3.1s on LCP from one run to the
// next. A single run is not evidence. The raw runs are printed so the spread
// stays visible rather than hidden behind the median.
//
// Absolute numbers here are NOT comparable to production: `npx serve` sends no
// compression and no cache headers, and redirects `/foo.html` to `/foo`. Use
// this for before/after deltas on the same harness, not for grading the site.

const puppeteer = require('puppeteer');
const { resolveUrl } = require('./lib');

const PRESETS = {
  mobile: {
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 2.625, disabled: false },
  },
  desktop: {
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
  },
};

const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

(async () => {
  const lighthouse = (await import('lighthouse')).default;
  const path = process.argv[2] || '/';
  const runs = Number(process.argv[3]) || 3;
  const url = resolveUrl(path, process.argv[4]);

  console.log(`${url} — ${runs} run(s) per preset\n`);

  for (const [label, preset] of Object.entries(PRESETS)) {
    const lcp = [], cls = [], perf = [];
    let culprit = '';

    for (let i = 0; i < runs; i++) {
      const port = 9400 + i;
      const browser = await puppeteer.launch({ headless: 'new', args: [`--remote-debugging-port=${port}`] });
      const r = await lighthouse(url, {
        port, output: 'json', logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices'],
        ...preset,
      });
      const a = r.lhr.audits;
      lcp.push(a['largest-contentful-paint'].numericValue / 1000);
      cls.push(a['cumulative-layout-shift'].numericValue);
      perf.push(Math.round(r.lhr.categories.performance.score * 100));
      const shift = a['layout-shifts']?.details?.items?.[0];
      if (shift?.node?.selector) culprit = shift.node.selector;
      if (i === runs - 1) {
        console.log(`${label.toUpperCase()}  a11y ${Math.round(r.lhr.categories.accessibility.score * 100)} · best-practices ${Math.round(r.lhr.categories['best-practices'].score * 100)}`);
      }
      await browser.close();
    }

    const flag = (v, limit) => (v > limit ? 'OVER' : 'ok');
    console.log(`  LCP  ${lcp.map((x) => x.toFixed(2)).join(' ')}  median ${median(lcp).toFixed(2)}s  (${flag(median(lcp), 2.5)}, threshold 2.5s)`);
    console.log(`  CLS  ${cls.map((x) => x.toFixed(3)).join(' ')}  median ${median(cls).toFixed(3)}  (${flag(median(cls), 0.1)}, threshold 0.1)`);
    console.log(`  Perf ${perf.join(' ')}  median ${median(perf)}`);
    if (culprit) console.log(`  CLS culprit: ${culprit}`);
    console.log('');
  }
})();
