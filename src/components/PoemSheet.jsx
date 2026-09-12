import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sheet from './Sheet.jsx';
import { formatDate } from '../content/site.js';
import { observeLines } from '../lib/reveal.js';
import './PoemSheet.css';

/**
 * A poem on a sheet of its own.
 *
 * Narrower than the sheet a story is written on, because a poem's lines are
 * short and a wide page would leave them stranded on the left. The title is
 * set in the italic, the way the second line of the hero is; the date is
 * written by hand in the corner, the way a date goes on the back of a
 * photograph; and the sheet takes its own tilt and weathering from its slug,
 * so six of them laid down together never look like six copies.
 *
 * `linked` makes the title a link to the poem's own page — on the poems page,
 * where it is one of several.
 *
 * `written` has the lines arrive one at a time as the reader scrolls to
 * them — see observeLines — instead of all together with the sheet.
 */
export default function PoemSheet({
  poem,
  linked = false,
  written = false,
  headingLevel = 2,
}) {
  const Heading = `h${headingLevel}`;
  const when = poem.date ? formatDate(poem.date) : null;
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!written) return undefined;
    return observeLines(bodyRef.current);
  }, [written, poem.slug]);

  return (
    <Sheet seed={poem.slug} className="poem-sheet">
      <header className="poem-sheet__head">
        <Heading className="poem-sheet__title">
          {linked ? (
            <Link to={`/poems/${poem.slug}`} className="poem-sheet__link">
              {poem.title}
            </Link>
          ) : (
            poem.title
          )}
        </Heading>
      </header>

      {/* data-piece names the source on anything copied out of it — lib/quote.js */}
      <div className="writing poem-prose" data-piece={poem.title} ref={bodyRef}>
        {poem.stanzas.map((stanza, index) => (
          <p className="poem-prose__stanza" key={stanza[0] + index}>
            {stanza.map((line, i) => (
              <span
                className="line"
                key={line + i}
                data-line={written ? '' : undefined}
              >
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>

      <footer className="poem-sheet__foot">
        {when ? (
          <time className="hand poem-sheet__date" dateTime={poem.date}>
            {when.month} {when.year}
          </time>
        ) : (
          <span className="hand poem-sheet__date poem-sheet__date--none">
            undated
          </span>
        )}
      </footer>
    </Sheet>
  );
}
