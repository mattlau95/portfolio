// case-study-video.js — plays case-study clips only while they are on screen.
//
// Loaded per-page (not from main.js) since only case studies with video need
// it. Each clip: picks the <source> whose media query matches, sets the right
// poster and intrinsic size *before* anything loads so nothing shifts, starts
// paused under prefers-reduced-motion, and carries a Pause/Play button —
// WCAG 2.2.2 requires one for moving content longer than 5s.

(() => {
  const videos = document.querySelectorAll('.js-cs-video');
  if (!videos.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  videos.forEach((video) => {
    const btn = video.parentElement.querySelector('.cs-video__toggle');
    if (!btn) return;

    let userPaused = reduce.matches;   // reduced motion: start paused, user presses Play
    let loaded = false;

    const matching = () => [...video.querySelectorAll('source')]
      .find((s) => !s.media || window.matchMedia(s.media).matches);

    const sync = () => {
      btn.textContent = video.paused ? 'Play' : 'Pause';
      btn.setAttribute('aria-label', (video.paused ? 'Play' : 'Pause') + ' video');
    };

    const load = () => {
      if (loaded) return;
      const pick = matching();
      if (pick) {
        // Only override native source selection when the clip is responsive,
        // i.e. the <source> carries a media query. Setting video.src pins one
        // file and discards the <source> children, so for plain codec
        // alternates — webm first, mp4 fallback — leave the choice to the
        // browser; otherwise a decoder that can't read the first one gets
        // nothing at all.
        if (pick.media) video.src = pick.src;
        const d = pick.dataset;
        if (d.poster) video.poster = d.poster;
        if (d.width) { video.width = +d.width; video.height = +d.height; }
      }
      video.preload = 'auto';
      loaded = true;
    };

    const play = () => { load(); video.play().catch(() => {}); };

    // Poster and size before first paint, so the stacked clip on a phone
    // reserves its own box rather than the landscape one's.
    const first = matching();
    if (first && first.dataset.poster) {
      video.poster = first.dataset.poster;
      video.width = +first.dataset.width;
      video.height = +first.dataset.height;
    }

    btn.hidden = false;
    sync();
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);

    btn.addEventListener('click', () => {
      if (video.paused) { userPaused = false; play(); }
      else { userPaused = true; video.pause(); }
    });

    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        load();
        if (!userPaused) play();
      } else if (!video.paused) {
        video.pause();
      }
    }, { threshold: 0.4 }).observe(video);
  });
})();
