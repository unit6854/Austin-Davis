import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { WELCOME } from '../content/site.js';
import './Welcome.css';

export default function Welcome() {
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
                <img
                  src="/images/pop.webp"
                  width="820"
                  height="985"
                  alt={WELCOME.photoAlt}
                  loading="lazy"
                  decoding="async"
                />
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
