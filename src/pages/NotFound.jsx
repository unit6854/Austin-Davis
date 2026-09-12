import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import PageBackground from '../components/PageBackground.jsx';
import './Page.css';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not here — Austin Davis';
  }, []);

  return (
    <article className="page grain page--scene">
      <PageBackground scene="road" />

      <div className="shell page__inner">
        <Reveal as="p" className="eyebrow">
          Nothing here
        </Reveal>

        <Reveal as="h1" className="page__title" delay={90}>
          This road doesn’t go anywhere yet.
        </Reveal>

        <Reveal as="p" className="page__intro" delay={170}>
          Whatever you were looking for isn’t at this address. The way back is
          just below.
        </Reveal>

        <Link to="/" className="story-page__back">
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
          Back to the beginning
        </Link>
      </div>
    </article>
  );
}
