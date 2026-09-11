/**
 * Austin's writing is meant to be passed on, so it can be selected and copied.
 * This is what happens when someone does.
 *
 * Copying a passage puts the passage on the clipboard and a credit under it —
 * the line, the piece it came from, and the address of the page. A quote that
 * travels without its author is a quote that gets lost; this way it arrives
 * with both. Nothing is added when the selection is a single word or two: an
 * eight-word credit under a two-word quote is noise, not attribution.
 *
 * It also lets the page know, so it can say quietly that the credit went with
 * it — see components/CopyNote.
 */

const GUARDED = '.writing';

/** shortest selection that gets a credit, in characters */
const WORTH_CREDITING = 40;

export const COPY_EVENT = 'writing:copied';

const inWriting = (node) => {
  const el = node?.nodeType === 1 ? node : node?.parentElement;
  return Boolean(el?.closest?.(GUARDED));
};

/** the piece a selection came out of, if the page says what it is */
function sourceOf(selection) {
  const node = selection.anchorNode;
  const el = node?.nodeType === 1 ? node : node?.parentElement;
  const block = el?.closest?.(GUARDED);
  return block?.dataset?.piece || document.title.split(' — ')[0] || '';
}

export function initQuoting() {
  if (typeof document === 'undefined') return () => {};

  function onCopy(event) {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed) return;
    if (!inWriting(selection.anchorNode) && !inWriting(selection.focusNode)) return;

    const passage = selection.toString().trim();
    if (!passage || passage.length < WORTH_CREDITING) return;

    const title = sourceOf(selection);
    const credit = title
      ? `\n\n— Austin Davis, “${title}”\n${window.location.href}`
      : `\n\n— Austin Davis\n${window.location.href}`;

    event.clipboardData?.setData('text/plain', passage + credit);
    event.preventDefault();

    document.dispatchEvent(new CustomEvent(COPY_EVENT));
  }

  document.addEventListener('copy', onCopy);
  return () => document.removeEventListener('copy', onCopy);
}
