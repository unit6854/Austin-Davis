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
  components/          Hero, Navigation, Welcome, StoryFeature,
                       QuoteSection, JourneyLinks, Newsletter, Footer
  pages/               Home, SectionPage, Story, NotFound
  styles/base.css      design tokens: colour, type, spacing, motion
  lib/                 IntersectionObserver reveal + entrance sequencing
public/images/         hero, photograph, leaf, paper textures, torn edges
```

**All copy is in `src/content/site.js`.** Nothing is hard-coded in components.

## Adding content

- **A new story** — add it to `STORIES` in `src/pages/Story.jsx` and to the
  list in `SectionPage`. `FIRST_STORY.excerpt` is an array of paragraphs;
  add Austin's real text there and delete `continuation`, which is the line
  shown while a story is unfinished.
- **Poems / Journal / About / Letters** — `PAGES` in `site.js`. Each page
  shows its heading, intro and an `empty` line until there is writing to list.
- **Social icons** — `SOCIAL_LINKS` in `site.js` is empty on purpose; no URLs
  were invented. Add `{ platform: 'instagram', label: 'Instagram', href: '…' }`
  and the icon appears in the footer. `instagram`, `youtube` and `email` icons
  are already drawn.

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
the hero is on screen. `prefers-reduced-motion: reduce` disables the
parallax, the drifting light and every entrance animation.
