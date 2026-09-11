import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { PAGES, STORIES, POEMS } from './content/site.js';
import { SCENES, WIDTHS } from './components/PageBackground.jsx';

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
      : '/images/seasons/summer-1280.webp',
    preload: SCENES[page.scene]?.base,
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
