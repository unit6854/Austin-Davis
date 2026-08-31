/**
 * One shared IntersectionObserver for every reveal on the page.
 * Elements are unobserved as soon as they appear, so nothing keeps ticking.
 */

let observer = null;
const pending = new Set();

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
        pending.delete(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  return observer;
}

export function observeReveal(el) {
  if (!el) return () => {};

  const io = ensureObserver();

  // No IntersectionObserver (or reduced motion) — show it immediately.
  if (!io) {
    el.classList.add('is-visible');
    return () => {};
  }

  io.observe(el);
  pending.add(el);

  return () => {
    io.unobserve(el);
    pending.delete(el);
  };
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
