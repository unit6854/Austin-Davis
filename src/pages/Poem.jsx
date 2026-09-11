import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Dateline from '../components/Dateline.jsx';
import PageBackground from '../components/PageBackground.jsx';
import PoemSheet from '../components/PoemSheet.jsx';
import NotFound from './NotFound.jsx';
import { POEMS } from '../content/site.js';
import './Page.css';
import './Poems.css';

const BY_SLUG = Object.fromEntries(POEMS.map((poem) => [poem.slug, poem]));

/**
 * One poem, on a page of its own — the address a poem is passed on by. The
 * sheet is the same one it lies on in the poems page; only the room around it
 * is different.
 */
export default function Poem() {
  const { slug } = useParams();
  const poem = BY_SLUG[slug];

  useEffect(() => {
    if (poem) document.title = `${poem.title} — Austin Davis`;
  }, [poem]);

  if (!poem) return <NotFound />;

  const index = POEMS.indexOf(poem);
  const previous = POEMS[index - 1];
  const next = POEMS[index + 1];

  return (
    <article className="page grain page--scene poems">
      <PageBackground scene="poems" />

      <div className="shell page__inner">
        <Reveal as="p" className="story-page__meta">
          A poem
        </Reveal>

        <Reveal as="h1" className="story-page__title" delay={90}>
          {poem.title}
        </Reveal>

        {poem.date ? (
          <Reveal delay={170}>
            <Dateline iso={poem.date} />
          </Reveal>
        ) : null}
      </div>

      <div className="shell poems__desk">
        <Reveal className="poems__leaf poems__leaf--single" delay={260}>
          <PoemSheet poem={poem} headingLevel={2} />
        </Reveal>
      </div>

      <nav className="shell page__inner poem-page__nav" aria-label="Other poems">
        {previous ? (
          <Link to={`/poems/${previous.slug}`} className="story-page__back">
            <svg className="arrow" width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
              <path d="M24 4H3M6.5 1 3 4l3.5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {previous.title}
          </Link>
        ) : (
          <span />
        )}

        <Link to="/poems" className="story-page__back poem-page__all">
          All poems
        </Link>

        {next ? (
          <Link to={`/poems/${next.slug}`} className="story-page__back poem-page__next">
            {next.title}
            <svg className="arrow" width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden="true">
              <path d="M0 4h21M17.5 1 21 4l-3.5 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
