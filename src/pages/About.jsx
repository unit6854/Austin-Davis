import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Ground from '../components/Ground.jsx';
import SeasonalBackground from '../components/SeasonalBackground.jsx';
import Newsletter from '../components/Newsletter.jsx';
import { ABOUT, PAGES } from '../content/site.js';
import { observeLines } from '../lib/reveal.js';
import './About.css';

/**
 * The wood, through the year. The same camera as the road on the homepage,
 * and the year goes round in the same order; there is no night frame here,
 * so dusk is left out. Each frame is served at the one size it was made at.
 */
const wood = (file, alt) => ({
  src: `/images/pages/about-${file}-1867.webp`,
  width: 1867,
  height: 842,
  light: false,
  alt,
});

export const WOOD = {
  summer: wood('summer', 'Sunlight coming through the trees at the edge of a wood, mist over a clearing and a creek running past the rocks.'),
  autumn: wood('autumn', 'The same wood in autumn, the leaves turned red and gold and the ground covered in them.'),
  winter: wood('winter', 'The same wood in winter, snow on every branch and along the creek.'),
  spring: wood('spring', 'The same wood in spring, in new leaf, with blossom along the path.'),
};

const WOOD_CYCLE = [
  { season: 'summer', hold: 5000, fade: 4000 },
  { season: 'autumn', hold: 5000, fade: 5000 },
  { season: 'winter', hold: 5000, fade: 4000 },
  { season: 'spring', hold: 5000, fade: 4000 },
];

/** the first frame — what the address preloads and previews as */
export const ABOUT_SCENE = WOOD[WOOD_CYCLE[0].season];

const Arrow = ({ flip = false }) => (
  <svg className="arrow" width="26" height="8" viewBox="0 0 26 8" fill="none" aria-hidden="true">
    <path
      d={flip ? 'M26 4H2M5.5 1 2 4l3.5 3' : 'M0 4h24M20.5 1 24 4l-3.5 3'}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * About — not a biography. A wood at first light, a short account of where
 * the writing came from, and then the reason the site exists, said plainly
 * and one line at a time.
 *
 * The hero is the same shape as the road on the homepage — a photograph
 * that fills the window, breathes, and darkens as the reader walks on — but
 * the copy stands to one side, in the clearing to the right of the big tree,
 * rather than in the middle of the frame. Below it the page goes into the
 * same drawn dark the homepage stands on, and comes out at the foot of it
 * onto Join the Journey.
 */
export default function About() {
  const linesRef = useRef(null);
  const heroRef = useRef(null);

  /* nobody is looking at the wood once the page has moved past it: its two
     long animations stop until it comes back, as the road's do */
  const [away, setAway] = useState(false);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setAway(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  /* the copy waits for the wood to be painted, as the road's does — but
     never for long, if the network is slow */
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => {
    window.setTimeout(() => setReady(true), 60);
  }, []);
  useEffect(() => {
    const safety = window.setTimeout(() => setReady(true), 2200);
    return () => window.clearTimeout(safety);
  }, []);

  useEffect(() => {
    document.title = `${PAGES.about.eyebrow} — Austin Davis`;
  }, []);

  /* the few things arrive a line at a time, as they are read down to */
  useEffect(() => observeLines(linesRef.current), []);

  const { hero, start, reason, lines, close } = ABOUT;

  return (
    <article className="about">
      {/* ---------- the wood ---------- */}
      <section
        ref={heroRef}
        className={`about-hero${ready ? ' is-ready' : ''}${away ? ' is-away' : ''}`}
        aria-label="Introduction"
      >
        <div className="about-hero__media">
          <div className="about-hero__frame">
            <div className="about-hero__parallax">
              <SeasonalBackground
                cycle={WOOD_CYCLE}
                scenes={WOOD}
                className="about-hero__seasons"
                onReady={onReady}
              />
            </div>
          </div>
          <div className="about-hero__veil" aria-hidden="true" />
          <div className="about-hero__light" aria-hidden="true" />
          <div className="about-hero__vignette" aria-hidden="true" />
          <div className="about-hero__grain" aria-hidden="true" />
        </div>

        <div className="about-hero__content">
          <p className="eyebrow about-hero__eyebrow">{hero.eyebrow}</p>

          <h1 className="about-hero__title display">
            <span className="about-hero__line about-hero__line--1">{hero.titleTop}</span>
            <em className="about-hero__line about-hero__line--2">{hero.titleItalic}</em>
          </h1>

          <p className="about-hero__supporting">{hero.supporting}</p>

          <a className="about-hero__cue" href="#where-this-started">
            <span className="about-hero__cue-label">{hero.cue}</span>
            <svg width="16" height="34" viewBox="0 0 16 34" fill="none" aria-hidden="true">
              <path
                d="M8 0v31M1 24l7 8 7-8"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* the light runs out at the foot of the frame and the page walks
            on into the dark */}
        <div className="about-hero__dusk" aria-hidden="true" />
      </section>

      <Ground>
        {/* ---------- where this started ---------- */}
        <section id="where-this-started" className="about-start section grain">
          <div className="shell about-start__grid">
            <Reveal className="about-start__aside" delay={80}>
              <figure className="print">
                <div className="print__frame">
                  <div className="print__paper">
                    <img
                      className="print__photo"
                      src={`${start.photo.src}-${start.photo.widths[0]}.webp`}
                      width="600"
                      height="405"
                      alt={start.photo.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="print__aged" aria-hidden="true" />
                </div>
                <figcaption className="hand print__note">{start.photo.note}</figcaption>
              </figure>
            </Reveal>

            <div className="about-start__copy">
              <Reveal as="p" className="eyebrow">
                {start.eyebrow}
              </Reveal>

              <Reveal as="h2" className="about-start__title" delay={90}>
                {start.title}
              </Reveal>

              {start.paragraphs.map((paragraph, i) => (
                <Reveal
                  as="p"
                  key={paragraph.slice(0, 24)}
                  className="about-start__para"
                  delay={170 + i * 80}
                >
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- why this exists ---------- */}
        <section className="about-reason section grain" aria-labelledby="why-this-exists">
          <div className="shell">
            <div className="about-reason__inner">
              <Reveal as="p" className="eyebrow" id="why-this-exists">
                {reason.eyebrow}
              </Reveal>

              <Reveal as="p" className="about-reason__statement" delay={120}>
                {reason.statement}
              </Reveal>

              <Reveal as="p" className="about-reason__follow" delay={260}>
                {reason.follow}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- the few things ---------- */}
        <section className="about-lines section grain" aria-label="A few things">
          <div className="shell">
            <div className="about-lines__inner" ref={linesRef}>
              {lines.map((item, i) => (
                <div className="about-lines__item" key={item.line}>
                  <Reveal className="rule-draw about-lines__rule" />
                  <p className="about-lines__line">
                    <span data-line="">{item.line}</span>
                  </p>
                  <p className="about-lines__words">
                    <span data-line="">{item.words}</span>
                  </p>
                  <span className="about-lines__count hand" aria-hidden="true">
                    {i + 1}
                  </span>
                </div>
              ))}
              <Reveal className="rule-draw about-lines__rule" />
            </div>
          </div>
        </section>

        {/* ---------- the hand ---------- */}
        <section className="about-close section grain" aria-label="In closing">
          <div className="shell">
            <div className="about-close__inner">
              {close.lines.map((line, i) => (
                <Reveal
                  as="p"
                  key={line.slice(0, 24)}
                  className={`about-close__line${i === 1 ? ' about-close__line--held' : ''}`}
                  delay={i * 140}
                >
                  {line}
                </Reveal>
              ))}

              <Reveal as="p" className="signature about-close__sign" delay={460}>
                {close.signature}
              </Reveal>

              <Reveal as="nav" className="about-close__ways" aria-label="Ways on" delay={560}>
                {close.ways.map((way) =>
                  way.to.startsWith('#') ? (
                    <a key={way.to} href={way.to} className="textlink">
                      <span className="textlink__row">
                        {way.label}
                        <Arrow />
                      </span>
                      <span className="textlink__rule" />
                    </a>
                  ) : (
                    <Link key={way.to} to={way.to} className="textlink">
                      <span className="textlink__row">
                        {way.label}
                        <Arrow />
                      </span>
                      <span className="textlink__rule" />
                    </Link>
                  ),
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* the band lies on the wall rather than after it, so the wall runs
            unbroken down to the footer's torn edge */}
        <Newsletter ground />
      </Ground>
    </article>
  );
}
