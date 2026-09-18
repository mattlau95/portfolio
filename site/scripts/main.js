// main.js — spotlight, scroll-spy, and group-hover-dim interactions.

(() => {
  const spotlight = document.querySelector('.spotlight');
  if (!spotlight) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (prefersReducedMotion || isTouch) {
    spotlight.remove();
    return;
  }

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--y', `${e.clientY}px`);
  });
})();

(() => {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const linkForSection = new Map();
  navLinks.forEach((link) => {
    linkForSection.set(link.getAttribute('href').slice(1), link);
  });

  const setActive = (id) => {
    navLinks.forEach((link) => link.classList.remove('is-active'));
    linkForSection.get(id)?.classList.add('is-active');
  };

  setActive('projects');

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length > 0) {
        setActive(visible[0].target.id);
      }
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* Lightbox — click-to-zoom for links marked [data-zoom].

   The trigger stays a real <a> to the full-size file: with JS off it
   still opens the image, and Enter activates it natively (links do not
   activate on Space, and we deliberately leave Space to scroll). The
   large file is fetched on open, never on page load. */

(() => {
  const triggers = document.querySelectorAll('a[data-zoom]');
  if (!triggers.length) return;

  let dialog;
  let dialogImg;
  let lastTrigger = null;

  const build = () => {
    dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Full-size image');

    dialogImg = document.createElement('img');

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox-close';
    close.setAttribute('aria-label', 'Close full-size image');
    close.textContent = '✕';
    close.addEventListener('click', () => dialog.close());

    dialog.append(dialogImg, close);

    // A click that lands on the dialog itself came from the backdrop.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });

    // showModal() gives Esc and the focus trap for free; focus return is
    // explicit because browsers disagree about restoring it.
    dialog.addEventListener('close', () => {
      dialogImg.removeAttribute('src');
      lastTrigger?.focus();
    });

    document.body.append(dialog);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      // Leave open-in-new-tab, open-in-window and download to the browser.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();

      if (!dialog) build();

      const img = trigger.querySelector('img');
      lastTrigger = trigger;
      dialogImg.src = trigger.href;
      dialogImg.alt = img ? img.alt : '';
      dialog.showModal();
    });
  });
})();
