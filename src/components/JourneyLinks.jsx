import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import JourneyIcon from './JourneyIcon.jsx';
import { JOURNEY } from '../content/site.js';
import './JourneyLinks.css';

export default function JourneyLinks() {
  return (
    <section className="journey grain" aria-label="The rest of the writing">
      <div className="shell">
        <Reveal className="rule-draw journey__rule" />

        <ul className="journey__list">
          {JOURNEY.map((item, i) => (
            <Reveal as="li" key={item.to} className="journey__item" delay={i * 110}>
              <Link to={item.to} className="journey__link">
                <span className="journey__glow" aria-hidden="true" />

                <JourneyIcon name={item.icon} className="journey__icon" />

                <span className="journey__text">
                  <span className="journey__label">{item.label}</span>
                  <span className="journey__description">{item.description}</span>

                  <span className="journey__more">
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
                    <span className="journey__more-rule" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
