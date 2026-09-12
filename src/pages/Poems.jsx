import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal.jsx';
import PageBackground from '../components/PageBackground.jsx';
import PoemSheet from '../components/PoemSheet.jsx';
import Sheet from '../components/Sheet.jsx';
import ReturnNote from '../components/ReturnNote.jsx';
import { glideTo } from '../lib/momentum.js';
import { PAGES, POEMS, formatDate } from '../content/site.js';
import './Page.css';
import './Poems.css';

const BY_SLUG = Object.fromEntries(POEMS.map((poem) => [poem.slug, poem]));

/* Each leaf lies at its own angle and its own small drop below the row, so
   six of them read as put down by hand rather than dealt. Fixed rather than
   hashed: they were chosen so that no two neighbours lean the same way. */
const LEAN = [-1.4, 1.1, -0.7, 1.5, -1.1, 0.8];
const DROP = [0, 0.55, 0.15, 0.35, 0, 0.7];

/** the poem named in the address, if there is one */
const fromHash = () => {
  if (typeof window === 'undefined') return null;
  const slug = window.location.hash.replace(/^#/, '');
  return BY_SLUG[slug] ? slug : null;
};

/** where an element's top should come to rest, allowing for the navigation */
const restingTop = (el) => {
  const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return el.getBoundingClientRect().top + window.scrollY - offset;
};

/**
 * The poems — six leaves laid out on the desk, and one of them, whichever
 * the reader picks up, opened out underneath.
 *
 * Each leaf carries a poem's title, its first line and the date it was
 * written, and is a sheet in its own right: the same paper, weathered from
 * the same seed as the poem's full page, so the leaf and the sheet it opens
 * into are recognisably the same piece of paper. Choosing one draws a pencil
 * ring round its title, the light comes off the others, and the whole poem
 * rises below it, its lines arriving as they are read down to. The address
 * carries the choice, so a poem picked up here can be passed on as
 * /poems#<slug>.
 */
export default function Poems() {
  const page = PAGES.poems;

  const [chosen, setChosen] = useState(null);
  const readingRef = useRef(null);
  const leavesRef = useRef(null);
  /* only a choice made here moves the page — arriving on an address does not */
  const glideNext = useRef(false);

  useEffect(() => {
    document.title = `${page.eyebrow} — Austin Davis`;
  }, [page.eyebrow]);

  /* the address can name a poem — on arrival, or if the hash changes under
     us — and it is opened and brought up the page */
  useEffect(() => {
    const open = () => {
      const slug = fromHash();
      if (!slug) return;
      glideNext.current = true;
      setChosen(slug);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  /* once the sheet is on the page, glide down to it */
  useEffect(() => {
    if (!chosen || !glideNext.current) return;
    glideNext.current = false;
    if (readingRef.current) glideTo(restingTop(readingRef.current));
  }, [chosen]);

  const choose = useCallback((slug) => {
    glideNext.current = true;
    setChosen(slug);
    /* the router's own state is kept — only the hash changes */
    window.history.replaceState(window.history.state, '', `#${slug}`);
  }, []);

  const backToLeaves = useCallback(() => {
    if (leavesRef.current) glideTo(restingTop(leavesRef.current));
  }, []);

  const poem = chosen ? BY_SLUG[chosen] : null;
  const index = poem ? POEMS.indexOf(poem) : -1;
  const previous = index > 0 ? POEMS[index - 1] : null;
  const next = index >= 0 ? POEMS[index + 1] : null;

  return (
    <article className="page grain page--scene poems">
      <PageBackground scene={page.scene} />

      <div className="shell page__inner">
        <Reveal as="p" className="eyebrow">
          {page.eyebrow}
        </Reveal>

        <Reveal as="h1" className="page__title" delay={90}>
          {page.title}
        </Reveal>

        <Reveal as="p" className="page__intro" delay={170}>
          {page.intro}
        </Reveal>

        <Reveal className="rule-draw page__rule" delay={240} />
      </div>

      {/* ---------- the leaves ---------- */}
      <div
        id="leaves"
        ref={leavesRef}
        className={`shell poems__leaves${poem ? ' has-choice' : ''}`}
      >
        <ul className="poems__row" aria-label="Choose a poem">
          {POEMS.map((entry, i) => {
            const when = entry.date ? formatDate(entry.date) : null;
            const isChosen = entry.slug === chosen;

            return (
              <Reveal
                as="li"
                key={entry.slug}
                className="poems__slot"
                delay={300 + i * 70}
                style={{
                  '--lean': `${LEAN[i % LEAN.length]}deg`,
                  '--drop': `${DROP[i % DROP.length]}rem`,
                }}
              >
                <button
                  type="button"
                  className={`leaf${isChosen ? ' is-chosen' : ''}`}
                  aria-pressed={isChosen}
                  onClick={() => choose(entry.slug)}
                >
                  <Sheet seed={entry.slug} className="leaf__paper">
                    <span className="leaf__head">
                      <span className="leaf__title">{entry.title}</span>
                      {/* the pencil ring, drawn round the title once it is chosen */}
                      <svg
                        className="leaf__ring"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          pathLength="1"
                          d="M8 54C5 26 28 7 52 7c25 0 45 15 44 43-1 27-22 44-48 44C24 94 8 79 7 58c-.4-4 1-7 5-8"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </span>

                    <span className="leaf__first">{entry.stanzas[0][0]}</span>

                    <span className="hand leaf__date">
                      {when ? `${when.month} ${when.year}` : 'undated'}
                    </span>
                  </Sheet>
                </button>
              </Reveal>
            );
          })}
        </ul>

        <p
          className={`hand poems__hint${poem ? ' is-away' : ''}`}
          aria-hidden={poem ? 'true' : undefined}
        >
          {page.hint}
        </p>
      </div>

      {/* ---------- the one picked up ---------- */}
      {poem ? (
        <div
          id="reading"
          key={poem.slug}
          ref={readingRef}
          className="shell poems__desk poems__reading"
        >
          <Reveal className="poems__leaf poems__leaf--single">
            <PoemSheet poem={poem} linked written />
          </Reveal>

          <nav className="page__inner poem-page__nav" aria-label="Other poems">
            {previous ? (
              <button
                type="button"
                className="story-page__back"
                onClick={() => choose(previous.slug)}
              >
                <svg className="arrow" width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
                  <path d="M24 4H3M6.5 1 3 4l3.5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {previous.title}
              </button>
            ) : (
              <span />
            )}

            <button
              type="button"
              className="story-page__back poem-page__all"
              onClick={backToLeaves}
            >
              {page.back}
            </button>

            {next ? (
              <button
                type="button"
                className="story-page__back poem-page__next"
                onClick={() => choose(next.slug)}
              >
                {next.title}
                <svg className="arrow" width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
                  <path d="M0 4h21M17.5 1 21 4l-3.5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <span />
            )}
          </nav>
        </div>
      ) : null}

      <ReturnNote of={readingRef} resetKey={chosen} />

      <div className="shell page__inner">
        <Reveal as="p" className="page__empty poems__closing">
          {page.closing}
        </Reveal>
      </div>
    </article>
  );
}
