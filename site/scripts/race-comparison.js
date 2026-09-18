// race-comparison.js — the Kumon hero: one side-by-side clip shown as two
// cropped panels, driven by one shared clock.
//
// The left <video> leads; the right one follows it and is corrected whenever
// it drifts. Everything else (timers, lanes, Done overlay, idle count) is
// derived from the left video's currentTime. Like case-study-video.js it
// only loads and plays while on screen, starts paused under
// prefers-reduced-motion, and has a Pause/Play button (WCAG 2.2.2).

(() => {
  const fig = document.querySelector('.js-race');
  if (!fig) return;

  const $ = (sel) => fig.querySelector(sel);
  const $$ = (sel) => fig.querySelectorAll(sel);

  const left = $('.js-race-left');
  const right = $('.js-race-right');
  const leftDone = parseFloat(fig.dataset.leftFinish);
  const rightDone = parseFloat(fig.dataset.rightFinish);

  const toggleBtn = $('.js-race-toggle');
  const track = $('.js-race-track');
  const overlays = $$('.js-race-overlay');
  const doneEl = $('.js-race-done');
  const ticksEl = $('.js-race-ticks');
  const rightLabel = $('.js-race-right-label');
  const byHandLabel = $('.race__lane .race__lane-label');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fmt = (v) => v.toFixed(1);

  let userPaused = reduce.matches;
  let loaded = false;
  let raf = 0;
  let tickCount = -1;

  const load = () => {
    if (loaded) return;
    left.preload = right.preload = 'auto';
    left.load();
    right.load();
    loaded = true;
  };

  const safePlay = (v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };

  const play = () => {
    load();
    right.currentTime = left.currentTime;
    safePlay(left);
    safePlay(right);
  };

  const pause = () => { left.pause(); right.pause(); };

  const seek = (t) => {
    load();
    left.currentTime = t;
    right.currentTime = t;
    render();
  };

  const render = () => {
    const t = left.currentTime;
    const lt = Math.min(t, leftDone);
    const rt = Math.min(t, rightDone);
    const rightIsDone = t >= rightDone;
    const idle = Math.max(0, lt - rightDone);
    const playing = !left.paused && !left.ended;

    $('.js-race-left-time').textContent = fmt(lt) + ' s';
    $('.js-race-right-time').textContent = fmt(rt) + ' s';
    $('.js-race-clock').textContent = fmt(t);
    $('.js-race-waited').textContent = '+' + fmt(idle) + ' s';
    doneEl.hidden = !rightIsDone;

    $('.js-race-left-foot').textContent = t >= leftDone
      ? 'Finished at ' + fmt(leftDone) + ' s · 10 pages, one click at a time'
      : 'Clearing marks by hand…';
    $('.js-race-right-foot').textContent = rightIsDone
      ? 'Finished at ' + fmt(rightDone) + ' s · idle for the remaining ' + fmt(leftDone - rightDone) + ' s'
      : 'One click, then unattended…';

    const lPct = (lt / leftDone) * 100;
    const rPct = (rt / leftDone) * 100;
    $('.js-race-left-fill').style.width = lPct + '%';
    $('.js-race-right-fill').style.width = rPct + '%';
    $('.js-race-hatch').style.left = rPct + '%';
    // The idle note starts after whichever ends later: the fill or the label.
    const saved = $('.js-race-saved');
    const fillPx = (rPct / 100) * track.clientWidth;
    const labelEnd = rightLabel.offsetLeft + rightLabel.offsetWidth;
    saved.style.left = Math.max(fillPx, labelEnd) + 'px';
    saved.textContent = rightIsDone ? 'idle +' + fmt(idle) + ' s' : '';

    // One tick per extra run the extension would have finished so far.
    const byHandEnd = byHandLabel.offsetLeft + byHandLabel.offsetWidth;
    let n = 0;
    for (let k = 1; k * rightDone < leftDone && k * rightDone <= lt; k++) n = k;
    if (n !== tickCount) {
      tickCount = n;
      // Label every 1st, 2nd, 5th or 10th run, whichever keeps labels ~32px apart.
      const gapPx = (rightDone / leftDone) * track.clientWidth;
      const every = [1, 2, 5, 10].find((s) => s * gapPx >= 32) || 10;
      ticksEl.replaceChildren(...Array.from({ length: n }, (_, i) => {
        const tick = document.createElement('span');
        tick.className = 'race__tick';
        const frac = ((i + 1) * rightDone) / leftDone;
        tick.style.left = frac * 100 + '%';
        // Unlabelled where the mark would sit on the lane's own label.
        if ((i + 2) % every === 0 && frac * track.clientWidth > byHandEnd + 4) {
          const label = document.createElement('span');
          label.textContent = '×' + (i + 2);
          tick.append(label);
        }
        return tick;
      }));
    }

    overlays.forEach((o) => { o.hidden = playing || rightIsDone; });
    toggleBtn.textContent = playing ? 'Pause' : 'Play';
    toggleBtn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' video');
    track.setAttribute('aria-valuenow', fmt(lt));
    track.setAttribute('aria-valuetext', fmt(lt) + ' seconds');
  };

  const frame = () => {
    if (right.readyState >= 1 && Math.abs(right.currentTime - left.currentTime) > 0.12) {
      right.currentTime = left.currentTime;
    }
    if (!left.paused && right.paused && right.readyState >= 1) safePlay(right);
    render();
    raf = left.paused ? 0 : requestAnimationFrame(frame);
  };

  left.addEventListener('play', () => { if (!raf) raf = requestAnimationFrame(frame); render(); });
  left.addEventListener('pause', () => { right.pause(); render(); });
  left.addEventListener('seeked', render);

  const toggle = () => {
    if (left.paused) { userPaused = false; play(); }
    else { userPaused = true; pause(); }
  };

  $('.race__controls').hidden = false;
  toggleBtn.addEventListener('click', toggle);
  $('.js-race-restart').addEventListener('click', () => { userPaused = false; seek(0); play(); });
  overlays.forEach((o) => o.addEventListener('click', toggle));

  track.tabIndex = 0;
  track.addEventListener('click', (e) => {
    const r = track.getBoundingClientRect();
    seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * leftDone);
  });
  track.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
    let to;
    if (step) to = Math.min(left.currentTime, leftDone) + step;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = leftDone;
    else return;
    e.preventDefault();
    seek(Math.max(0, Math.min(leftDone, to)));
  });

  render();

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      load();
      if (!userPaused) play();
    } else if (!left.paused) {
      pause();
    }
  }, { threshold: 0.4 }).observe(left);
})();
