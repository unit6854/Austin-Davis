import { useEffect, useRef } from 'react';
import './SeasonalBackground.css';

/* ==========================================================================
   Seasonal background — one camera, left in place while the year goes past.

   Everything you would want to tune lives in the block below.
   ========================================================================== */

/**
 * The cycle, in order. `hold` is how long a frame sits fully visible;
 * `fade` is how long the crossfade INTO that frame takes.
 *
 * Day and night are folded into this one timeline because only the summer
 * scene has a night photograph — see SEASONS below. The fades in and out of
 * night are deliberately much longer than a season change, so dusk and dawn
 * feel like the light going rather than a picture being swapped.
 */
const CYCLE = [
  { season: 'summer', hold: 5000, fade: 4000 },
  { season: 'summer-night', hold: 5000, fade: 5000 }, // dusk, a touch slower
  { season: 'autumn', hold: 5000, fade: 5000 }, // dawn
  { season: 'winter', hold: 5000, fade: 4000 },
  { season: 'spring', hold: 5000, fade: 4000 }, // the thaw, then round again
];

/** Slow in, a little acceleration, a long settle. */
const EASE = 'cubic-bezier(0.45, 0.02, 0.25, 1)';

/**
 * The scenes themselves.
 *
 * `light` marks a scene bright enough that cream type would wash out on it;
 * the hero's copy crosses to ink over those. To add a scene: convert the
 * source to `public/images/seasons/<file>-{880,1280,1684}.webp`, add it here,
 * and put a frame in CYCLE where it belongs in the year.
 */
const SEASONS = {
  summer: { file: 'summer', light: false, alt: 'The road in summer, at sunrise, past an open cotton field.' },
  'summer-night': { file: 'summer-night', light: false, alt: 'The same road at night under a full moon, the farmhouse windows lit.' },
  autumn: { file: 'autumn', light: false, alt: 'The same road in autumn, the trees turned red and the road covered in leaves.' },
  winter: { file: 'winter', light: true, alt: 'The same road in winter, snow over the field, the road and the bare trees.' },
  spring: { file: 'spring', light: true, alt: 'The same road in spring, the trees in new leaf and wildflowers along the verge.' },
};

const WIDTHS = [880, 1280, 1684];

const srcsetFor = (file) =>
  WIDTHS.map((w) => `/images/seasons/${file}-${w}.webp ${w}w`).join(', ');

const srcFor = (file) => `/images/seasons/${file}-1280.webp`;

export const FIRST_SEASON = SEASONS[CYCLE[0].season];
export { srcsetFor, srcFor };

/* ========================================================================== */

export default function SeasonalBackground({ onReady }) {
  /* Two layers, created once and reused for the whole life of the page. The
     back layer holds what you are looking at; the front layer fades the next
     scene in over the top of it, so there is never a moment when the two are
     both semi-transparent and the ground shows through. */
  const layerA = useRef(null);
  const layerB = useRef(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    const back = { el: layerA.current, index: 0 };
    const front = { el: layerB.current, index: -1 };
    if (!back.el || !front.el) return undefined;

    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let timer = null;
    let preloader = null;
    let stopped = false;

    const applySceneAttributes = (season) => {
      root.dataset.scene = season;
      root.dataset.sceneLight = String(SEASONS[season].light);
    };

    /* --- first frame ------------------------------------------------------ */
    const first = CYCLE[0].season;
    applySceneAttributes(first);
    root.style.setProperty('--scene-fade', `${CYCLE[1]?.fade ?? 10000}ms`);

    const announceReady = () => readyRef.current?.();
    if (back.el.complete) announceReady();
    else back.el.addEventListener('load', announceReady, { once: true });

    /* --- warm the image after next, so a fade never waits on the network --- */
    const preload = (index) => {
      const { file } = SEASONS[CYCLE[index % CYCLE.length].season];
      preloader = new Image();
      preloader.sizes = '100vw';
      preloader.srcset = srcsetFor(file);
      preloader.src = srcFor(file);
    };

    /* --- the cycle -------------------------------------------------------- */
    /* A hold that is interrupted by the tab going away resumes where it left
       off. Restarting it from the top would mean someone who keeps switching
       tabs never sees the season change at all. */
    let holdStartedAt = 0;
    let holdRemaining = 0;
    let midTransition = false;

    const scheduleHold = (ms) => {
      if (stopped) return;
      holdRemaining = ms ?? CYCLE[back.index].hold;
      holdStartedAt = Date.now();
      timer = window.setTimeout(beginTransition, holdRemaining);
    };

    function beginTransition() {
      if (stopped) return;
      midTransition = true;

      const nextIndex = (back.index + 1) % CYCLE.length;
      const { season, fade } = CYCLE[nextIndex];
      const { file } = SEASONS[season];

      front.index = nextIndex;
      front.el.sizes = '100vw';
      front.el.srcset = srcsetFor(file);
      front.el.src = srcFor(file);

      const start = () => {
        if (stopped) return;

        /* the copy over the top changes colour on exactly the same curve */
        root.style.setProperty('--scene-fade', `${fade}ms`);
        applySceneAttributes(season);

        front.el.style.willChange = 'opacity';
        front.el.style.transition = `opacity ${fade}ms ${EASE}`;
        /* two frames, so the browser has the start value before it animates */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!stopped) front.el.style.opacity = '1';
          });
        });

        timer = window.setTimeout(finishTransition, fade + 60);
      };

      /* wait until the incoming frame is actually decoded — never fade to a
         blank layer */
      if (front.el.complete) {
        (front.el.decode?.() ?? Promise.resolve()).then(start, start);
      } else {
        front.el.addEventListener(
          'load',
          () => (front.el.decode?.() ?? Promise.resolve()).then(start, start),
          { once: true },
        );
        front.el.addEventListener('error', start, { once: true });
      }
    }

    function finishTransition() {
      if (stopped || !midTransition) return;
      midTransition = false;

      /* The front layer is now fully opaque, so the layer underneath is
         invisible: it can be reset without anything showing. Swap the roles
         rather than moving images between elements. */
      const wasBack = back.el;
      back.el = front.el;
      back.index = front.index;

      front.el = wasBack;
      front.el.style.transition = 'none';
      front.el.style.opacity = '0';
      front.el.style.willChange = 'auto';

      back.el.style.zIndex = '1';
      front.el.style.zIndex = '2';

      preload(back.index + 1);
      scheduleHold();
    }

    /* --- pause when nobody is looking ------------------------------------- */
    /* Nobody is looking if the tab is in the background, and nobody is
       looking if the page has been scrolled past the road either. Holding
       the cycle in both cases stops the browser fetching the rest of the
       year — several megabytes of frames — for a screen that is not on
       show, and stops the crossfades running against an empty room. */
    let paused = false;
    let onScreen = true;
    const away = () => document.hidden || !onScreen;

    const updateActivity = () => {
      if (stopped || reduced.matches) return;

      if (away()) {
        /* Only a hold is paused. A crossfade already in flight is left alone:
           CSS transitions run on wall-clock time regardless, and cutting one
           short would strand the two layers mid-swap. */
        if (midTransition || paused) return;
        window.clearTimeout(timer);
        holdRemaining = Math.max(600, holdRemaining - (Date.now() - holdStartedAt));
        paused = true;
        return;
      }

      if (!paused) return;   // nothing was paused, so nothing to resume
      paused = false;
      scheduleHold(holdRemaining);
    };

    const watcher =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              onScreen = entry.isIntersecting;
              updateActivity();
            },
            { threshold: 0 },
          );
    if (watcher && back.el.parentElement) watcher.observe(back.el.parentElement);

    const startCycling = () => {
      if (reduced.matches) return;
      preload(1);
      scheduleHold();
      document.addEventListener('visibilitychange', updateActivity);
    };

    const stopCycling = () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', updateActivity);
    };

    const onMotionChange = () => {
      stopCycling();
      if (!reduced.matches) startCycling();
    };

    startCycling();
    reduced.addEventListener('change', onMotionChange);

    return () => {
      stopped = true;
      watcher?.disconnect();
      stopCycling();
      reduced.removeEventListener('change', onMotionChange);
      if (preloader) preloader.src = '';
      delete root.dataset.scene;
      delete root.dataset.sceneLight;
      root.style.removeProperty('--scene-fade');
    };
  }, []);

  const first = SEASONS[CYCLE[0].season];

  return (
    <div className="seasons">
      <img
        ref={layerA}
        className="seasons__layer"
        style={{ opacity: 1, zIndex: 1 }}
        src={srcFor(first.file)}
        srcSet={srcsetFor(first.file)}
        sizes="100vw"
        width="1684"
        height="934"
        alt={first.alt}
        fetchPriority="high"
        decoding="async"
      />
      <img
        ref={layerB}
        className="seasons__layer"
        style={{ opacity: 0, zIndex: 2 }}
        alt=""
        aria-hidden="true"
        width="1684"
        height="934"
        decoding="async"
      />
    </div>
  );
}
