import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { FIRST_STORY } from '../content/site.js';
import './Page.css';

export default function SectionPage({
  eyebrow,
  title,
  intro,
  empty,
  showFirstStory = false,
}) {
  useEffect(() => {
    document.title = `${eyebrow} — Austin Davis`;
  }, [eyebrow]);

  return (
    <article className="page grain">
      <div className="shell page__inner">
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>

        <Reveal as="h1" className="page__title" delay={90}>
          {title}
        </Reveal>

        <Reveal as="p" className="page__intro" delay={170}>
          {intro}
        </Reveal>

        <Reveal className="rule-draw page__rule" delay={240} />

        {showFirstStory ? (
          <Reveal className="page__list" delay={300}>
            <Link
              to={`/stories/${FIRST_STORY.slug}`}
              className="entry"
            >
              <p className="entry__eyebrow">{FIRST_STORY.eyebrow}</p>
              <h2 className="entry__title">{FIRST_STORY.title}</h2>
              <p className="entry__description">{FIRST_STORY.description}</p>
              <span className="entry__more">
                {FIRST_STORY.cta}
                <svg
                  className="arrow"
                  width="24"
                  height="8"
                  viewBox="0 0 24 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 4h21M17.5 1 21 4l-3.5 3"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </Reveal>
        ) : null}

        <Reveal as="p" className="page__empty" delay={showFirstStory ? 380 : 300}>
          {empty}
        </Reveal>
      </div>
    </article>
  );
}
