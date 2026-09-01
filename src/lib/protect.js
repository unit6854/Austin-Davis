/**
 * Austin's writing is not selectable, copyable or draggable.
 *
 * `user-select: none` in CSS handles selection; this closes the routes around
 * it — a selection dragged in from outside the piece, keyboard select-all,
 * right-click, and image drag. Everything else on the site stays selectable,
 * so titles, links and the newsletter behave normally.
 */

const GUARDED = '.writing';

const inWriting = (node) => {
  const el = node?.nodeType === 1 ? node : node?.parentElement;
  return Boolean(el?.closest?.(GUARDED));
};

/** true when any part of the current selection touches a protected block */
function selectionTouchesWriting() {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;

  for (let i = 0; i < selection.rangeCount; i += 1) {
    const range = selection.getRangeAt(i);
    if (inWriting(range.startContainer) || inWriting(range.endContainer)) return true;

    const guarded = document.querySelectorAll(GUARDED);
    for (const block of guarded) {
      if (range.intersectsNode?.(block)) return true;
    }
  }

  return false;
}

export function initTextProtection() {
  if (typeof document === 'undefined') return () => {};

  const block = (event) => {
    if (inWriting(event.target) || selectionTouchesWriting()) {
      event.preventDefault();
      // leave the clipboard untouched rather than replacing what is on it
      event.stopPropagation();
    }
  };

  const blockInside = (event) => {
    if (inWriting(event.target)) event.preventDefault();
  };

  document.addEventListener('copy', block);
  document.addEventListener('cut', block);
  document.addEventListener('contextmenu', blockInside);
  document.addEventListener('dragstart', blockInside);

  return () => {
    document.removeEventListener('copy', block);
    document.removeEventListener('cut', block);
    document.removeEventListener('contextmenu', blockInside);
    document.removeEventListener('dragstart', blockInside);
  };
}
