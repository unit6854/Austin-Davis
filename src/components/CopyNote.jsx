import { useEffect, useState } from 'react';
import { COPY_EVENT } from '../lib/quote.js';
import './CopyNote.css';

/** how long the note stays up */
const DWELL = 2600;

/**
 * A quiet line that appears when someone copies a passage, to say that the
 * credit went with it. It sits at the foot of the window, in the same hand as
 * the notes pinned around the photographs, and takes itself away.
 */
export default function CopyNote() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let timer = null;

    const onCopied = () => {
      setShown(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShown(false), DWELL);
    };

    document.addEventListener(COPY_EVENT, onCopied);
    return () => {
      document.removeEventListener(COPY_EVENT, onCopied);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <p
      className={`copy-note${shown ? ' is-shown' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="copy-note__mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M4 9.4 7.4 13 14 5.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {shown ? 'Copied, with the credit and the link.' : ''}
    </p>
  );
}
