import { useEffect } from 'react';
import Reveal from '../components/Reveal.jsx';
import PageBackground from '../components/PageBackground.jsx';
import PoemSheet from '../components/PoemSheet.jsx';
import { PAGES, POEMS } from '../content/site.js';
import './Page.css';
import './Poems.css';

/**
 * The poems, all of them, laid out one after another — each on a sheet of its
 * own, oldest first. A poem is short enough to be read where it lies, so the
 * page does not make anyone click through a list to get to one. Each sheet's
 * title still leads to the poem's own page, for passing it on.
 */
export default function Poems() {
  const page = PAGES.poems;

  useEffect(() => {
    document.title = `${page.eyebrow} — Austin Davis`;
  }, [page.eyebrow]);

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

      {/* The desk. Sheets are laid down alternately a little left and a little
          right of centre, each with its own tilt, so they read as leaves put
          down one at a time rather than a stack of identical cards. */}
      <div className="shell poems__desk">
        {POEMS.map((poem, index) => (
          <Reveal
            key={poem.slug}
            className={`poems__leaf poems__leaf--${index % 2 ? 'right' : 'left'}`}
            delay={index === 0 ? 320 : 0}
          >
            <PoemSheet poem={poem} linked />
          </Reveal>
        ))}
      </div>

      <div className="shell page__inner">
        <Reveal as="p" className="page__empty poems__closing">
          {page.closing}
        </Reveal>
      </div>
    </article>
  );
}
