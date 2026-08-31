import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Sprig from './Sprig.jsx';
import { FIRST_STORY } from '../content/site.js';
import './StoryFeature.css';

export default function StoryFeature() {
  return (
    <section className="story section grain" aria-labelledby="first-story-title">
      <div className="shell">
        <Reveal className="story__card">
          <div className="story__body">
            <p className="eyebrow story__eyebrow">{FIRST_STORY.eyebrow}</p>

            <h2 id="first-story-title" className="story__title">
              {FIRST_STORY.title}
            </h2>

            <p className="story__description">{FIRST_STORY.description}</p>

            <blockquote className="story__excerpt">
              {FIRST_STORY.excerpt.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </blockquote>

            <Link
              to={`/stories/${FIRST_STORY.slug}`}
              className="btn btn--ink story__cta"
            >
              {FIRST_STORY.cta}
              <svg
                className="arrow"
                width="26"
                height="8"
                viewBox="0 0 26 8"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 4h24M20.5 1 24 4l-3.5 3"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <Sprig className="story__sprig" />
        </Reveal>
      </div>
    </section>
  );
}
