# Austin Davis

An immersive, editorial site for Austin Davis — writer, poet, storyteller.

React + Vite, no UI framework. Deploys to Netlify.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # → dist/
npm run preview
```

## Where things live

```
src/
  content/site.js      ← all copy, nav, social links. Change words here.
  content/writing/     ← the pieces themselves, one file per piece
  components/          Hero, Navigation, Welcome, StoryFeature, QuoteSection,
                       JourneyLinks, Newsletter, Footer, Dateline
  pages/               Home, SectionPage, Story, NotFound
  styles/base.css      design tokens: colour, type, spacing, motion
  lib/                 reveal, entrance, momentum scrolling, text protection
public/images/         hero, photograph, leaf, paper textures, torn edges
```

**All copy is in `src/content/site.js`.** Nothing is hard-coded in components.

## Adding content

- **A new piece of writing** — add a file to `src/content/writing/` exporting
  `STANZAS`: an array of stanzas, each an array of lines. The author's line
  breaks are preserved exactly, so type the lines as written rather than
  reflowing them into paragraphs. Then add an entry alongside `FIRST_STORY`
  in `site.js` (`title`, `slug`, `date`, `description`, `excerpt`, `stanzas`)
  and register it in `STORIES` in `src/pages/Story.jsx`.
- **Dates** — `date` is a plain ISO string (`'2026-08-30'`). The story page
  renders it through `<Dateline>`; the card and the stories list show the
  month and year.
- **Poems / Journal / About / Letters** — `PAGES` in `site.js`. Each page
  shows its heading, intro and an `empty` line until there is writing to list.
- **Social icons** — `SOCIAL_LINKS` in `site.js` is empty on purpose; no URLs
  were invented. Add `{ platform: 'instagram', label: 'Instagram', href: '…' }`
  and the icon appears in the footer. `instagram`, `youtube` and `email` icons
  are already drawn.

## The writing is protected

Anything inside a `.writing` element cannot be selected, copied, cut, dragged
or right-clicked — `user-select: none` in `base.css` plus the event guards in
`src/lib/protect.js`, which also catch a selection dragged in from outside and
a keyboard select-all. Currently applied to the story body and the excerpt on
the home page. Add the class to any new writing block; the rest of the site
stays selectable so links and the newsletter behave normally.

This deters casual copying. It cannot stop someone reading the page source,
and search engines still index the text — that is deliberate, since the piece
needs to be findable.

## Newsletter

Wired to **Netlify Forms** — no backend, no third-party script. The static
form in `index.html` is what Netlify's build crawler detects; the React form
posts to it. Submissions appear under **Forms** in the Netlify dashboard.
To pipe them to Mailchimp/ConvertKit/Buttondown, add a Netlify form
notification or an outgoing webhook.

## Images

Generated from the supplied source art with ImageMagick:

| File | From | Notes |
| --- | --- | --- |
| `hero.webp` | `Hero.png` | WebP quality **100**, 1684w |
| `hero-1600/1280/880.webp` | `Hero.png` | quality 90 — visually identical, ~⅓ the bytes |
| `pop.webp` | `Mock.png` | de-rotated, regrained archival photograph |
| `leaf.webp` | `Mock.png` | cut out on the HSV saturation channel |
| `torn-down/up.webp` | `Paper.png` | torn edge under the hero and above the newsletter |
| `paper-texture.webp`, `frame-texture.webp` | `Paper.png` | four-way mirrored, seamless |

The browser picks a hero variant from `srcset`; only displays wider than
1600px download the full-quality file.

## Motion

Everything is CSS transforms and opacity, driven by `IntersectionObserver`
and one `requestAnimationFrame` scroll handler that is attached only while
the hero is on screen.

**Momentum scrolling** (`src/lib/momentum.js`) intercepts the wheel and the
scrolling keys, keeps its own target position, and eases the real scroll
toward it each frame. Nothing is virtualised and no wrapper is transformed,
so anchors, focus, find-in-page and the scrollbar all still work. `LERP` at
the top of the file sets the weight — lower is heavier, currently `0.062`.
It stays off for touch pointers, which have momentum of their own.

`prefers-reduced-motion: reduce` disables the momentum scrolling, the
parallax, the drifting light and every entrance animation.
