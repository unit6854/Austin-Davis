import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import NotFound from './NotFound.jsx';
import { FIRST_STORY } from '../content/site.js';
import './Page.css';

const STORIES = { [FIRST_STORY.slug]: FIRST_STORY };

export default function Story() {
  const { slug } = useParams();
  const story = STORIES[slug];

  useEffect(() => {
    if (story) document.title = `${story.title} — Austin Davis`;
  }, [story]);

  if (!story) return <NotFound />;

  return (
    <article className="page grain">
      <div className="shell page__inner">
        <Reveal as="p" className="story-page__meta">
          {story.eyebrow}
        </Reveal>

        <Reveal as="h1" className="story-page__title" delay={90}>
          {story.title}
        </Reveal>

        <Reveal as="p" className="story-page__standfirst" delay={170}>
          {story.description}
        </Reveal>

        <Reveal className="rule-draw page__rule" delay={240} />

        <Reveal className="story-page__body" delay={300}>
          {story.excerpt.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Reveal>

        <Reveal className="story-page__continuation" delay={380}>
          <svg
            className="story-page__ornament"
            width="46"
            height="10"
            viewBox="0 0 46 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 5h17M29 5h17"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="23" cy="5" r="2.2" stroke="currentColor" strokeWidth="1" />
          </svg>
          <p>{story.continuation}</p>
        </Reveal>

        <Link to="/stories" className="story-page__back">
          <svg
            className="arrow"
            width="24"
            height="8"
            viewBox="0 0 24 8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M24 4H3M6.5 1 3 4l3.5 3"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All stories
        </Link>
      </div>
    </article>
  );
}
