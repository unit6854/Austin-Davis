import { useEffect, useRef } from 'react';
import { HERO } from '../content/site.js';
import { prefersReducedMotion } from '../lib/reveal.js';
import { markEntered } from '../lib/entrance.js';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  /* --- entrance: hold the sequence until the road is actually painted --- */
  useEffect(() => {
    const img = imgRef.current;
    let timer;

    const start = () => {
      timer = window.setTimeout(markEntered, 60);
    };

    if (img?.complete) {
      start();
    } else {
      img?.addEventListener('load', start, { once: true });
      img?.addEventListener('error', start, { once: true });
    }

    // Never let a slow network hold the page hostage.
    const safety = window.setTimeout(markEntered, 2200);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safety);
      img?.removeEventListener('load', start);
      img?.removeEventListener('error', start);
    };
  }, []);

  /* --- scroll-linked parallax, only while the hero is on screen --- */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion()) return;

    let ticking = false;
    let active = false;

    const update = () => {
      ticking = false;
      const height = hero.offsetHeight || 1;
      const p = Math.min(Math.max(window.scrollY / height, 0), 1);
      hero.style.setProperty('--p', p.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === active) return;
        active = entry.isIntersecting;

        if (active) {
          window.addEventListener('scroll', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { threshold: 0 },
    );

    io.observe(hero);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-label="Introduction">
      <div className="hero__media">
        <div className="hero__frame">
          <img
            ref={imgRef}
            className="hero__image"
            src="/images/hero-1280.webp"
            srcSet="/images/hero-880.webp 880w, /images/hero-1280.webp 1280w, /images/hero-1600.webp 1600w, /images/hero.webp 1684w"
            sizes="100vw"
            width="1684"
            height="934"
            alt="A dirt road at sunrise running past a cotton field and a farmhouse in rural Alabama."
            fetchPriority="high"
            decoding="async"
          />
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

      <div className="hero__tear" aria-hidden="true" />
    </section>
  );
}
