import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Sheet from './Sheet.jsx';
import { FIRST_STORY, formatDate } from '../content/site.js';
import './StoryFeature.css';

const WHEN = formatDate(FIRST_STORY.date);

export default function StoryFeature() {
  return (
    <section className="story section grain" aria-labelledby="first-story-title">
      <div className="shell">
        <Reveal className="story__card">
          {/* The sheet is drawn rather than downloaded — the same generated
              paper a story is written on, so it stays sharp at any size and
              never has to be stretched to fit the card. See Sheet.jsx. */}
          <Sheet seed="first-story" className="story__sheet">
            <div className="story__grid">
              <div className="story__body">
                <p className="eyebrow story__eyebrow">
                  {FIRST_STORY.eyebrow}
                  <span className="story__dot" aria-hidden="true">·</span>
                  <time dateTime={FIRST_STORY.date}>
                    {WHEN.month} {WHEN.year}
                  </time>
                </p>

                <h2 id="first-story-title" className="story__title">
                  {FIRST_STORY.title}
                </h2>

                <p className="story__description">{FIRST_STORY.description}</p>

                <blockquote className="writing story__excerpt">
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

              <img
                className="story__plant"
                src="/images/tomato.webp"
                width="940"
                height="1234"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Sheet>
        </Reveal>
      </div>
    </section>
  );
}
