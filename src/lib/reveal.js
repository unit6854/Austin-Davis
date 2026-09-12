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

/* ==========================================================================
   Lines, one at a time.

   A piece of writing marks each authored line with data-line, and the lines
   come up as they are scrolled to rather than all at once with the sheet.
   The lines that cross into view in the same frame are given a small
   stagger between them, so a stanza arriving together is written down the
   page rather than switched on — and a single line arriving on its own
   simply appears, with no wait it did not earn.
   ========================================================================== */

/** the gap between two lines that arrive together */
const LINE_STAGGER = 42;

let lineObserver = null;

function ensureLineObserver() {
  if (lineObserver || typeof IntersectionObserver === 'undefined') return lineObserver;

  lineObserver = new IntersectionObserver(
    (entries) => {
      /* top to bottom, so the stagger runs down the page whatever order the
         browser reported them in */
      const arriving = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      arriving.forEach((entry, i) => {
        entry.target.style.transitionDelay = i ? `${i * LINE_STAGGER}ms` : '';
        entry.target.classList.add('is-visible');
        lineObserver.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );

  return lineObserver;
}

/**
 * Watch every [data-line] inside `root`. Returns a function that stops
 * watching; lines already shown stay shown.
 */
export function observeLines(root) {
  if (!root) return () => {};

  const lines = root.querySelectorAll('[data-line]');
  const io = ensureLineObserver();

  if (!io || prefersReducedMotion()) {
    lines.forEach((line) => line.classList.add('is-visible'));
    return () => {};
  }

  lines.forEach((line) => io.observe(line));

  return () => {
    lines.forEach((line) => io.unobserve(line));
  };
}
