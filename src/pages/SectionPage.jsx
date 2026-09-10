import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { STORIES, formatDate } from '../content/site.js';
import './Page.css';

export default function SectionPage({
  eyebrow,
  title,
  intro,
  empty,
  showStories = false,
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

        {showStories
          ? STORIES.map((story, index) => {
              const when = formatDate(story.date);

              return (
                <Reveal
                  key={story.slug}
                  className="page__list"
                  delay={300 + index * 80}
                >
                  <Link to={`/stories/${story.slug}`} className="entry">
                    <p className="entry__eyebrow">
                      {story.eyebrow}
                      <span aria-hidden="true"> · </span>
                      <time dateTime={story.date}>
                        {when.month} {when.year}
                      </time>
                    </p>
                    <h2 className="entry__title">{story.title}</h2>
                    <p className="entry__description">{story.description}</p>
                    <span className="entry__more">
                      {story.cta}
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
              );
            })
          : null}

        <Reveal
          as="p"
          className="page__empty"
          delay={showStories ? 380 + STORIES.length * 80 : 300}
        >
          {empty}
        </Reveal>
      </div>
    </article>
  );
}
