import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { WELCOME } from '../content/site.js';
import './Welcome.css';

/** how long each photograph is held before the next one fades up */
const HOLD = 10000;

const WIDTHS = [640, 960, 1280];
const srcsetFor = (base, widths = WIDTHS) =>
  widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
/* the largest cut a photograph has, for the plain src */
const largest = (widths = WIDTHS) => widths[widths.length - 1];

export default function Welcome() {
  /* The frame holds more than one photograph, so they take turns in it. Two
     stacked prints, only opacity ever animating, the same as the seasons on
     the road above. */
  const [shown, setShown] = useState(0);
  const count = WELCOME.photos.length;

  useEffect(() => {
    if (count < 2) return undefined;
    const timer = window.setInterval(
      () => setShown((i) => (i + 1) % count),
      HOLD,
    );
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <section id="welcome" className="welcome section grain">
      <div className="shell welcome__grid">
        <div className="welcome__copy">
          <Reveal as="p" className="eyebrow">
            {WELCOME.eyebrow}
          </Reveal>

          <Reveal as="h2" className="welcome__title" delay={90}>
            {WELCOME.title}
          </Reveal>

          <Reveal as="p" className="welcome__lines" delay={170}>
            {WELCOME.lines.map((line, i) => (
              <span key={line}>
                {line}
                {i < WELCOME.lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </Reveal>

          <Reveal as="p" className="welcome__closing" delay={250}>
            {WELCOME.closing}
          </Reveal>

          <Reveal delay={330} className="welcome__cta">
            <Link to={WELCOME.cta.to} className="textlink">
              <span className="textlink__row">
                {WELCOME.cta.label}
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
              </span>
              <span className="textlink__rule" />
            </Link>
          </Reveal>
        </div>

        <Reveal className="welcome__aside" delay={220}>
          <figure className="collage">
            <div className="collage__stage">
              <div className="collage__note" aria-hidden="true">
                <p className="hand collage__note-text">{WELCOME.note}</p>
                <p className="hand collage__note-sign">{WELCOME.noteAttribution}</p>
              </div>

              <div className="collage__photo">
                <div className="collage__print">
                  {WELCOME.photos.map((photo, i) => (
                    <img
                      key={photo.src}
                      className={`collage__shot${i === shown ? ' is-shown' : ''}`}
                      src={`${photo.src}-${Math.min(960, largest(photo.widths))}.webp`}
                      srcSet={srcsetFor(photo.src, photo.widths)}
                      sizes="(max-width: 900px) 84vw, 25rem"
                      width="1280"
                      height="960"
                      alt={photo.alt}
                      aria-hidden={i === shown ? undefined : 'true'}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
                <span className="collage__aged" aria-hidden="true" />
              </div>

              <img
                className="collage__leaf"
                src="/images/leaf.webp"
                width="480"
                height="484"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>

            <figcaption className="collage__annotation">
              <span className="hand">{WELCOME.annotation}</span>
              <svg
                className="collage__underline"
                viewBox="0 0 200 10"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7C36 3 74 1.5 112 2.2c30 .6 58 2.4 86 5.1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
