import { createPortal } from 'react-dom';
import './PageBackground.css';

/* ==========================================================================
   Page background — one photograph, left standing while the page moves.

   The layer is fixed to the viewport and rendered into <body> through a
   portal, deliberately outside the page transition: a transformed ancestor
   would turn `position: fixed` back into `position: absolute` and the scene
   would lurch as the outgoing page settles. Out here it simply holds still
   while the writing travels over it.

   The stack, bottom to top: the photograph, a dark veil that takes it down
   far enough for cream type to sit on it, a vignette that closes the corners,
   and the same film grain every other dark surface on the site carries.
   ========================================================================== */

const WIDTHS = [880, 1280, 1684];

/**
 * The scenes. `base` is a path minus `-<width>.webp`, so every entry has to
 * exist at all three widths.
 *
 * `about` is borrowed rather than its own photograph: it sits on the same road
 * as the homepage.
 */
const SCENES = {
  stories: {
    base: '/images/pages/stories',
    alt: 'A stack of old books on a windowsill at sunset, a lantern lit behind them.',
  },
  poems: {
    base: '/images/pages/poems',
    alt: 'A handwritten manuscript on a wooden desk, a pen beside it, late light across the boards.',
  },
  about: {
    base: '/images/seasons/summer',
    alt: 'The road in summer, at sunrise, past an open cotton field.',
  },
  journey: {
    base: '/images/pages/journey',
    alt: 'A field gate at sunrise, mist over the valley and a track leading away.',
  },
};

const srcsetFor = (base) =>
  WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ');

export const SCENE_NAMES = Object.keys(SCENES);
export { SCENES, WIDTHS, srcsetFor };

/**
 * @param {object} props
 * @param {string} props.scene   a key of SCENES
 * @param {boolean} [props.inline]  render in place instead of into <body>;
 *   used by the Join the Journey band, which is its own dark surface and
 *   wants the photograph inside it rather than behind the whole viewport.
 */
export default function PageBackground({ scene, inline = false }) {
  const found = SCENES[scene];
  if (!found) return null;

  const layer = (
    <div
      className={`page-bg${inline ? ' page-bg--inline' : ''}`}
      data-scene={scene}
      aria-hidden="true"
    >
      <div className="page-bg__frame">
        <img
          className="page-bg__image"
          src={`${found.base}-1280.webp`}
          srcSet={srcsetFor(found.base)}
          sizes="100vw"
          alt=""
          width="1684"
          height="933"
          decoding="async"
          fetchPriority={inline ? 'low' : 'high'}
          loading={inline ? 'lazy' : 'eager'}
        />
      </div>
      <div className="page-bg__veil" />
      <div className="page-bg__vignette" />
      <div className="page-bg__grain" />
    </div>
  );

  if (inline) return layer;

  return createPortal(layer, document.body);
}
