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
