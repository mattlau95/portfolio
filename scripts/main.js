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
