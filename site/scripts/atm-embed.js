// atm-embed.js — the playable itch.io frame on /projects/atm-hack.
//
// Same click-to-load idea as ollae-embeds.js: the stage is a screenshot with
// a hidden button until tapped, so nothing is requested from itch.io until
// someone asks to play. No postMessage protocol here — itch serves the game
// at a fixed 1280×820, so the stage carries that ratio in CSS and the frame
// just fills it.

(() => {
  const stage = document.querySelector('.embed--game .embed__stage');
  if (!stage) return;

  const btn = stage.querySelector('.embed__load');
  if (!btn) return;

  btn.hidden = false;
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.className = 'embed__frame';
    iframe.title = stage.dataset.title;
    iframe.allowFullscreen = true;
    iframe.src = stage.dataset.src;

    stage.replaceChildren(iframe);
    stage.classList.add('is-live');
    // The game reads key presses, so the frame has to hold focus to be
    // playable at all — without this the first mash goes to the page.
    iframe.focus({ preventScroll: true });
  });
})();

// The Reddit post in Outcome. The blockquote is real content — a titled link
// to the thread, its author and its subreddit — so with JS off, or before the
// button is pressed, it still reads and still links out. Only on a press does
// embed.reddit.com's widgets.js get fetched and turn it into a live card, so
// the page costs nothing to a reader who never asks for it.
(() => {
  const btn = document.querySelector('[data-reddit-load]');
  if (!btn) return;

  btn.hidden = false;
  btn.addEventListener('click', () => {
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'UTF-8';
    script.src = 'https://embed.reddit.com/widgets.js';
    document.body.appendChild(script);
    btn.disabled = true;
    btn.textContent = 'Loading…';
  }, { once: true });
})();
