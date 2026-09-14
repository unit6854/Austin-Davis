import { useCallback, useEffect, useRef } from 'react';
import { HERO } from '../content/site.js';
import { prefersReducedMotion } from '../lib/reveal.js';
import { markEntered } from '../lib/entrance.js';
import SeasonalBackground from './SeasonalBackground.jsx';
import './Hero.css';
import '../styles/hero-tear.css';

export default function Hero() {
  const heroRef = useRef(null);

  /* --- entrance: hold the sequence until the road is actually painted --- */
  const markReady = useCallback(() => {
    window.setTimeout(markEntered, 60);
  }, []);

  useEffect(() => {
    // Never let a slow network hold the page hostage.
    const safety = window.setTimeout(markEntered, 2200);
    return () => window.clearTimeout(safety);
  }, []);

  /* --- scroll-linked parallax, only while the hero is on screen --- */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;

    /* Where the browser can drive the four scroll-linked moves itself, it
       does — off the main thread, from CSS. Writing --p as well would put
       the style recalculation and the repaint it costs straight back.
       See the view-timeline block in Hero.css. */
    const driveFromCss =
      typeof CSS !== 'undefined' &&
      CSS.supports?.('animation-timeline: view()');

    let ticking = false;
    let active = false;

    /* Measured here rather than inside update(): reading offsetHeight forces
       the browser to lay the page out, and update() runs on every scrolled
       frame. The hero is a viewport tall, so the only thing that changes it
       is a resize. */
    let height = hero.offsetHeight || 1;
    const measure = () => {
      height = hero.offsetHeight || 1;
    };

    const update = () => {
      ticking = false;
      const p = Math.min(Math.max(window.scrollY / height, 0), 1);
      hero.style.setProperty('--p', p.toFixed(4));
    };

    /* The observer still runs either way: it is what stops the road breathing
       and the light drifting once the hero has gone by. */
    const watchScroll = !driveFromCss;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === active) return;
        active = entry.isIntersecting;

        /* Nothing is looking at the road once the page has moved past it:
           its two long animations, and the layer they keep alive, stop
           until it comes back. */
        hero.classList.toggle('is-away', !active);

        if (!watchScroll) return;

        if (active) {
          window.addEventListener('scroll', onScroll, { passive: true });
          measure();
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { threshold: 0 },
    );

    io.observe(hero);
    if (watchScroll) window.addEventListener('resize', measure, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="Introduction">
      <div className="hero__media">
        <div className="hero__frame">
          <div className="hero__parallax">
            <SeasonalBackground onReady={markReady} />
          </div>
        </div>
        <div className="hero__veil" aria-hidden="true" />
        <div className="hero__light" aria-hidden="true" />
        <div className="hero__vignette" aria-hidden="true" />
      </div>

      <div className="hero__content">
        <p className="eyebrow hero__eyebrow">{HERO.eyebrow}</p>

        <h1 className="hero__title display">
          <span className="hero__line hero__line--1">{HERO.titleTop}</span>
          <em className="hero__line hero__line--2">{HERO.titleItalic}</em>
        </h1>

        <p className="hero__supporting">{HERO.supporting}</p>
      </div>

      <div className="hero__cue-slot">
        <a className="hero__cue" href="#welcome">
          <span className="hero__cue-label">{HERO.cue}</span>
          <svg
            className="hero__cue-arrow"
            width="16"
            height="34"
            viewBox="0 0 16 34"
            fill="none"
            aria-hidden="true"
          >
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
    </section>
  );
}
