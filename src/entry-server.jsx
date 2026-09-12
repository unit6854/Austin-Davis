import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { PAGES, STORIES, POEMS } from './content/site.js';
import { SCENES, WIDTHS } from './components/PageBackground.jsx';
import { ABOUT_SCENE } from './pages/About.jsx';

/**
 * The build renders every route to real HTML — see scripts/prerender.js.
 * Nothing here runs in the browser.
 */

/** Every address the site answers on, with the head it should be served with. */
export const ROUTES = [
  {
    path: '/',
    title: 'Austin Davis — Stories about remembering how to live.',
    description:
      'Reflections on life, family, time, and the things we don’t understand until much later. Writing by Austin Davis.',
    image: '/images/seasons/summer-1280.webp',
    /* the road, which the homepage opens on */
    preload: '/images/seasons/summer',
  },
  ...Object.entries(PAGES).map(([key, page]) => ({
    path: `/${key}`,
    title: `${page.eyebrow} — Austin Davis`,
    description: page.intro,
    image: SCENES[page.scene]?.base
      ? `${SCENES[page.scene].base}-1280.webp`
      : ABOUT_SCENE.src,
    /* a scene cut at the three widths, or — the wood on About — one file */
    preload: SCENES[page.scene]?.base ?? { href: ABOUT_SCENE.src },
  })),
  ...POEMS.map((poem) => ({
    path: `/poems/${poem.slug}`,
    title: `${poem.title} — Austin Davis`,
    /* the opening line stands in for a description, with the comma or full
       stop that ends it taken off so the credit reads on from it */
    description: `“${poem.stanzas[0][0].replace(/[,.;:—–-]+$/, '')}” — a poem by Austin Davis.`,
    image: `${SCENES.poems.base}-1280.webp`,
    preload: SCENES.poems.base,
  })),
  ...STORIES.map((story) => ({
    path: `/stories/${story.slug}`,
    title: `${story.title} — Austin Davis`,
    description: story.description,
    image: '/images/pages/stories-1280.webp',
    preload: SCENES.stories.base,
  })),
  /* The page for an address that does not exist. Netlify serves 404.html
     for any path that is not a file, with a real 404 — see netlify.toml —
     and because the markup is the page the app would render, it hydrates
     cleanly instead of swapping the homepage out for it. */
  {
    path: '/404',
    title: 'Not here — Austin Davis',
    description: 'There is nothing at this address. The way back to the road is on the page.',
    image: `${SCENES.road.base}-1280.webp`,
    preload: SCENES.road.base,
  },
];

/** the widths every scene is cut at, for the preload's srcset */
export const IMAGE_WIDTHS = WIDTHS;

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
