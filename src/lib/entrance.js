/**
 * The entrance sequence is driven by a single class on <html>, so the
 * navigation, hero copy and scroll cue can stagger off one shared moment
 * without any of them re-rendering.
 */

let entered = false;

export function markEntered() {
  if (entered || typeof document === 'undefined') return;
  entered = true;
  document.documentElement.classList.add('is-entered');
}

export function hasEntered() {
  return entered;
}
