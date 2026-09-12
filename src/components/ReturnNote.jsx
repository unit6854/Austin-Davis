import { useEffect, useState } from 'react';
import { glideTo } from '../lib/momentum.js';
import './ReturnNote.css';

/**
 * A note that appears once the reader is halfway through a piece, asking
 * whether they want to go back to the top of the page.
 *
 * It pins a marker to the lower half of `of` (a ref to the piece's
 * container, which is given position: relative here) and watches for it in
 * the upper half of the window: the two overlap exactly when the piece's
 * midpoint has risen past the middle of the screen. The marker runs on a
 * window's height below the piece, so the note stays for the way on and
 * the way back that follow it. It is the same pinned scrap as the copy
 * note, pinned in the other corner so the two never sit on each other.
 *
 * `resetKey` — change it and a dismissed note is allowed back, which is how
 * the poems page gives each poem its own.
 */
export default function ReturnNote({ of, resetKey, label = 'Back to the top?' }) {
  const [passed, setPassed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => setDismissed(false), [resetKey]);

  useEffect(() => {
    const host = of?.current;
    if (!host || typeof IntersectionObserver === 'undefined') return undefined;

    /* The pin is made here rather than rendered, because it has to live
       inside the piece and not in this component's own markup. The piece
       is what it is measured against, so the piece has to be positioned. */
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const sentinel = document.createElement('span');
    sentinel.className = 'return-note__mark';
    sentinel.setAttribute('aria-hidden', 'true');
    host.appendChild(sentinel);

    /* The root is the top half of the window; the marker is the lower half
       of the piece. A marker with height, rather than a single pin, so that
       a jump down the page — a key, an anchor, a dragged scrollbar — cannot
       step over it without the observer noticing. */
    const io = new IntersectionObserver(
      ([entry]) => setPassed(entry.isIntersecting),
      { rootMargin: '0px 0px -50% 0px', threshold: 0 },
    );
    io.observe(sentinel);

    return () => {
      io.disconnect();
      sentinel.remove();
      setPassed(false);
    };
  }, [of, resetKey]);

  const shown = passed && !dismissed;

  const up = () => {
    setDismissed(true);
    glideTo(0);
  };

  return (
    <div
      className={`return-note${shown ? ' is-shown' : ''}`}
      aria-hidden={shown ? undefined : 'true'}
      inert={shown ? undefined : true}
    >
      <button type="button" className="return-note__up" onClick={up}>
        <span className="return-note__text">{label}</span>
        <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
          <path
            d="M7 21V2M1 8l6-6 6 6"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        type="button"
        className="return-note__stay"
        aria-label="No, keep reading"
        title="Keep reading"
        onClick={() => setDismissed(true)}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
