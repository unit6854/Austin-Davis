import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Sheet from './Sheet.jsx';
import { STORIES, FEATURE_HOLD, formatDate } from '../content/site.js';
import './StoryFeature.css';

const WHEN = STORIES.map((story) => formatDate(story.date));

export default function StoryFeature() {
  /* The sheet holds one story at a time and turns to the next every twenty
     seconds. Both are in the same grid cell, so the paper is always as tall
     as the longer of them and nothing moves underneath when they change. */
  const [shown, setShown] = useState(0);
  const count = STORIES.length;

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = window.setInterval(
      () => setShown((i) => (i + 1) % count),
      FEATURE_HOLD,
    );
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <section className="story section grain" aria-label="From the writing">
      <div className="shell">
        <Reveal className="story__card">
          {/* The sheet is drawn rather than downloaded — the same generated
              paper a story is written on, so it stays sharp at any size and
              never has to be stretched to fit the card. See Sheet.jsx. */}
          <Sheet seed="first-story" className="story__sheet">
            <div className="story__stack">
              {STORIES.map((story, i) => (
                <div
                  key={story.slug}
                  className={`story__grid${i === shown ? ' is-shown' : ''}`}
                  aria-hidden={i === shown ? undefined : 'true'}
                  inert={i !== shown}
                >
                  <div className="story__body">
                    <p className="eyebrow story__eyebrow">
                      {story.eyebrow}
                      <span className="story__dot" aria-hidden="true">·</span>
                      <time dateTime={story.date}>
                        {WHEN[i].month} {WHEN[i].year}
                      </time>
                    </p>

                    <h2 className="story__title">{story.title}</h2>

                    <p className="story__description">{story.description}</p>

                    <blockquote
                      className="writing story__excerpt"
                      data-piece={story.title}
                    >
                      {/* a line can repeat — "I miss him." opens and closes
                          the second story's excerpt — so the key carries the
                          position as well as the words */}
                      {story.excerpt.map((line, n) => (
                        <p key={line + n}>{line}</p>
                      ))}
                    </blockquote>

                    <Link
                      to={`/stories/${story.slug}`}
                      className="btn btn--ink story__cta"
                    >
                      {story.cta}
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
                    src={story.art.src}
                    width={story.art.width}
                    height={story.art.height}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </Sheet>
        </Reveal>
      </div>
    </section>
  );
}
