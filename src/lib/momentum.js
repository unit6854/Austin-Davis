/**
 * Momentum scrolling.
 *
 * The page still scrolls natively — we intercept the wheel and the scrolling
 * keys, keep our own target position, and ease the real scroll toward it every
 * frame. Nothing is virtualised, no wrapper is transformed, so anchors, focus,
 * find-in-page and the scrollbar all keep working.
 *
 * Off for touch pointers (which already have momentum of their own) and for
 * anyone who asked for reduced motion.
 */

/* smaller = heavier. 0.062 settles in roughly a second. */
const LERP = 0.062;
const WHEEL = 1;
const KEY_STEP = 96;

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

const TYPING = /^(INPUT|TEXTAREA|SELECT)$/;

export function initMomentumScroll() {
  if (typeof window === 'undefined') return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || coarse) return () => {};

  const root = document.documentElement;
  root.classList.add('has-momentum');

  let target = window.scrollY;
  let current = target;
  let frameId = null;
  let lastTime = 0;

  /* Reading scrollHeight forces the browser to lay the page out, and a wheel
     gesture fires many events a second. The document's height only changes on
     a resize or a route change, so it is measured once and refreshed when
     something could actually have moved it. */
  let maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
  const measure = () => {
    maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    return maxScroll;
  };
  const limit = () => maxScroll;

  /* the mobile menu locks the body; leave the page alone while it is open */
  const locked = () => document.body.style.overflow === 'hidden';

  function frame(now) {
    const dt = Math.min(now - lastTime, 64) || 16.667;
    lastTime = now;

    if (locked()) {
      frameId = null;
      return;
    }

    const ease = 1 - (1 - LERP) ** (dt / 16.667);
    current += (target - current) * ease;

    if (Math.abs(target - current) < 0.08) current = target;

    window.scrollTo(0, current);

    frameId = current === target ? null : requestAnimationFrame(frame);
  }

  function run() {
    if (frameId !== null) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(frame);
  }

  /* Between gestures the page is still, so re-measuring costs nothing; during
     one the cached height is used and no layout is forced. */
  function push(delta) {
    if (frameId === null) measure();
    target = clamp(target + delta, 0, limit());
    run();
  }

  function goTo(position) {
    if (frameId === null) measure();
    target = clamp(position, 0, limit());
    run();
  }

  function onWheel(event) {
    if (locked() || event.ctrlKey) return;   // leave pinch-zoom alone
    event.preventDefault();

    const unit =
      event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;

    push(event.deltaY * unit * WHEEL);
  }

  function onKeyDown(event) {
    if (locked() || event.metaKey || event.ctrlKey || event.altKey) return;

    const el = document.activeElement;
    if (el && (TYPING.test(el.tagName) || el.isContentEditable)) return;

    const page = window.innerHeight * 0.88;

    switch (event.key) {
      case 'ArrowDown': push(KEY_STEP); break;
      case 'ArrowUp': push(-KEY_STEP); break;
      case 'PageDown': push(page); break;
      case 'PageUp': push(-page); break;
      case ' ': push(event.shiftKey ? -page : page); break;
      case 'Home': goTo(0); break;
      case 'End': goTo(measure()); break;
      default: return;
    }

    event.preventDefault();
  }

  /* in-page anchors glide instead of jumping */
  function onClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;

    const link = event.target.closest?.('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const destination = id ? document.getElementById(id) : null;
    if (!destination) return;

    event.preventDefault();

    const offset = parseFloat(getComputedStyle(destination).scrollMarginTop) || 0;
    goTo(destination.getBoundingClientRect().top + window.scrollY - offset);

    // keep the router's own history state — only the hash changes
    if (id) window.history.replaceState(window.history.state, '', `#${id}`);
  }

  /* anything that moved the page without us — scrollbar drag, route change */
  function onScroll() {
    if (Math.abs(window.scrollY - current) < 2) return;
    current = window.scrollY;
    target = current;
  }

  function onResize() {
    target = clamp(target, 0, measure());
    current = window.scrollY;
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  document.addEventListener('click', onClick);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    root.classList.remove('has-momentum');
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('click', onClick);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
