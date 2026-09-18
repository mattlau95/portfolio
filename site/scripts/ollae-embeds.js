// ollae-embeds.js — the two live Ollae frames on /projects/ollae.
//
// Each .embed__stage starts as a screenshot with a hidden "Try it live"
// button. The script reveals the button; a tap swaps in the iframe at the
// screenshot's height, so nothing requests ollae.app until then. Ollae posts
// its height (and, on the create screen, ready/input/created) back to us.
// Protocol: ollae/backend/docs/session-24-portfolio-embeds.md.

(() => {
  const ORIGIN = 'https://ollae.app';
  const MIN_H = 200;
  const MAX_H = 4000;

  const stages = document.querySelectorAll('.embed__stage');
  if (!stages.length) return;

  const frames = new Map();   // iframe -> { ready }

  const load = (stage) => {
    const existing = stage.querySelector('iframe');
    if (existing) return existing;

    const iframe = document.createElement('iframe');
    iframe.className = 'embed__frame';
    iframe.title = stage.dataset.title;
    iframe.allow = 'clipboard-write';
    // The frame is content-box, so its height is the screenshot's inside the border.
    const img = stage.querySelector('img');
    iframe.style.height = (img ? img.clientHeight : stage.offsetHeight) + 'px';
    iframe.src = stage.dataset.src;
    frames.set(iframe, { ready: false });

    stage.replaceChildren(iframe);
    stage.classList.add('is-live');
    iframe.focus({ preventScroll: true });
    return iframe;
  };

  stages.forEach((stage) => {
    const btn = stage.querySelector('.embed__load');
    if (!btn) return;
    btn.hidden = false;
    btn.addEventListener('click', () => load(stage));
  });

  // Create demo: the example button prefills the box once the frame is ready.
  const create = document.querySelector('[data-embed="create"]');
  const createStage = create && create.querySelector('.embed__stage');
  const example = create && create.querySelector('.embed-example');
  const parts = create ? [...create.querySelectorAll('.embed-part')] : [];
  const status = create && create.querySelector('.embed__status');
  let pendingPrefill = null;

  const squash = (text) => text.toLowerCase().replace(/\s+/g, '');

  const send = (iframe, message) => iframe.contentWindow.postMessage(message, ORIGIN);

  if (example && createStage) {
    const text = example.dataset.prefill;   // not textContent: that includes the "(matched)" spans
    example.addEventListener('click', () => {
      const iframe = load(createStage);
      if (frames.get(iframe).ready) {
        send(iframe, { type: 'ollae:prefill', text });
      } else {
        pendingPrefill = text;   // only ever one pending
      }
    });
  }

  const allMatched = () => parts.length > 0 && parts.every((p) => p.classList.contains('is-matched'));

  window.addEventListener('message', (event) => {
    if (event.origin !== ORIGIN) return;
    let iframe = null;
    for (const f of frames.keys()) {
      if (f.contentWindow === event.source) { iframe = f; break; }
    }
    if (!iframe) return;

    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'ollae:height': {
        const h = data.height;
        if (typeof h !== 'number' || !Number.isFinite(h)) return;
        iframe.style.height = Math.min(MAX_H, Math.max(MIN_H, Math.ceil(h))) + 'px';
        break;
      }
      case 'ollae:ready': {
        if (!createStage || !createStage.contains(iframe)) return;
        frames.get(iframe).ready = true;
        if (pendingPrefill !== null) {
          send(iframe, { type: 'ollae:prefill', text: pendingPrefill });
          pendingPrefill = null;
        }
        break;
      }
      case 'ollae:input': {
        if (!createStage || !createStage.contains(iframe)) return;
        if (typeof data.text !== 'string') return;
        const typed = squash(data.text);
        parts.forEach((p) => {
          p.classList.toggle('is-matched', typed.includes(squash(p.dataset.part)));
        });
        break;
      }
      case 'ollae:created': {
        if (!createStage || !createStage.contains(iframe) || !status) return;
        status.textContent = allMatched()
          ? 'Your event is live.'
          : 'That works too. Your event is live.';
        break;
      }
    }
  });
})();
