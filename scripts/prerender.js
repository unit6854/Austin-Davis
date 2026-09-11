/**
 * Writes a real HTML file for every address the site answers on.
 *
 * The site stays a single-page app once it is running — the page transitions,
 * the momentum, the seasons all still work — but the first thing a browser or
 * a link scraper receives is a finished page with the right title, the right
 * description and the writing already in it. Without this, every URL served
 * the same empty shell and a link to a story previewed as the homepage.
 *
 * Run by `npm run build` after the client and server bundles are built.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

/* Netlify sets URL to the site's own address at build time. Without it the
   absolute tags are left out rather than pointed at an invented domain. */
const SITE = process.env.URL || process.env.DEPLOY_PRIME_URL || '';

const { ROUTES, IMAGE_WIDTHS, render } = await import(
  pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
);

const shell = readFileSync(join(dist, 'index.html'), 'utf8');

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function headFor({ path, title, description, image }) {
  const url = SITE ? SITE.replace(/\/$/, '') + path : '';
  const absolute = (asset) => (SITE ? SITE.replace(/\/$/, '') + asset : asset);

  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    url ? `<link rel="canonical" href="${escape(url)}" />` : '',
    `<meta property="og:type" content="${path.startsWith('/stories/') ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${escape(absolute(image))}" />`,
    url ? `<meta property="og:url" content="${escape(url)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

/* Every page used to carry the homepage's image preload, because there was
   only ever one HTML file. Now that each route has its own, each one preloads
   the picture its own first screen actually shows — a story page was fetching
   a third of a megabyte of road it never puts on screen. */
const PRELOAD_BLOCK = /\n\s*<link\s+rel="preload"\s+as="image"[\s\S]*?\/>/;

function preloadFor(base) {
  if (!base) return '';
  const srcset = IMAGE_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  return [
    '',
    '    <link',
    '      rel="preload"',
    '      as="image"',
    `      href="${base}-1280.webp"`,
    `      imagesrcset="${srcset}"`,
    '      imagesizes="100vw"',
    '      fetchpriority="high"',
    '    />',
  ].join('\n');
}

/* The shell's own head carries the homepage's tags; each page swaps in its
   own. Matching on the exact tags the template writes keeps this honest — if
   index.html changes shape, this throws rather than silently doing nothing. */
const TEMPLATE_HEAD =
  /<title>[\s\S]*?<meta name="twitter:card" content="summary_large_image" \/>/;

if (!TEMPLATE_HEAD.test(shell)) {
  throw new Error(
    'prerender: could not find the head block in dist/index.html — has index.html changed?',
  );
}

if (!PRELOAD_BLOCK.test(shell)) {
  throw new Error(
    'prerender: could not find the image preload in dist/index.html — has index.html changed?',
  );
}

let written = 0;

for (const route of ROUTES) {
  const markup = render(route.path);

  const page = shell
    .replace(TEMPLATE_HEAD, headFor(route))
    .replace(PRELOAD_BLOCK, preloadFor(route.preload))
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  /* Two files per route. Static hosts disagree about how to resolve an
     extensionless path: some look for <path>.html, some for
     <path>/index.html, and a host that finds neither falls through to the
     single-page rewrite and serves the homepage for a story — which is the
     whole problem this is here to solve. Writing both leaves nothing to
     disagree about. */
  const targets =
    route.path === '/'
      ? [join(dist, 'index.html')]
      : [join(dist, route.path, 'index.html'), join(dist, `${route.path}.html`)];

  for (const file of targets) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, page);
  }

  written += 1;
  console.log('  prerendered', route.path);
}

console.log(`prerender: ${written} pages written`);
