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

## The seasonal background

The hero is not one photograph but a slow environmental cycle — the same
camera left in place while the year goes past. `src/components/
SeasonalBackground.jsx` owns it, and every timing lives in the `CYCLE`
constant at the top of that file.

| Order | Scene | Source file | Holds for | Fades in over |
| --- | --- | --- | --- | --- |
| 1 | Summer, sunrise | `Seasons/Hero.png` | 38 s | 10 s |
| 2 | Summer, night | `Seasons/Night hero.png` | 32 s | 17 s (dusk) |
| 3 | Autumn | `Seasons/Autumn Hero.png` | 38 s | 17 s (dawn) |
| 4 | Winter | `Seasons/Winter Hero.png` | 38 s | 11 s |

**There is no spring photograph yet.** Add `Spring Hero.png` to `Seasons/`,
convert it the same way, add an entry to `SEASONS` and a frame at the top of
`CYCLE`, and the full Spring → Summer → Autumn → Winter loop closes with no
other change.

Day and night share one timeline rather than running as a second cycle,
because only the summer scene has a night photograph. The fades into and out
of night are ~1.6× longer than a season change, so dusk and dawn read as the
light going rather than a picture being swapped.

**How the crossfade works.** Two `<img>` layers are created once and reused
forever. The back layer holds what you are looking at; the front layer fades
the next scene in *over the top of it*. Because the layer underneath stays
fully opaque throughout, there is never a frame where both are partly
transparent — so no flash, no black frame, no wash. When the fade completes
the two layers swap roles: the now-visible front becomes the back, and the
old back (invisible beneath it) has its opacity reset and its next source
set. Nothing is added to or removed from the DOM.

Only `opacity` animates, on `cubic-bezier(0.45, 0.02, 0.25, 1)` — slow to
start, a little acceleration, a long settle. The scroll parallax lives on a
wrapper (`.hero__parallax`), so the layers themselves never transform.

**Performance.** The first frame is preloaded from `index.html` with
`fetchpriority="high"`. The scene *after next* is warmed with an `Image()`
during each hold, so a fade never waits on the network, and a fade will not
begin until the incoming frame has actually decoded. There is no React state
and no `requestAnimationFrame` loop — the whole thing is timers plus CSS
transitions. The cycle pauses on `visibilitychange` when the tab is hidden.

**Reduced motion.** `prefers-reduced-motion: reduce` stops the cycle
entirely: the summer frame is shown and nothing else is even downloaded.

**Winter turns the type over.** Winter is a bright scene, so cream copy would
wash out on the snow. `SeasonalBackground` sets `data-scene-light` on
`<html>`, and the hero's colour tokens flip to ink with a light halo plus a
soft mist behind the copy — transitioning on exactly the same duration and
curve as the image underneath. Measured contrast at rest, every scene,
desktop and mobile: 6.1:1 to 15.1:1.

## Images

Generated from the supplied source art with ImageMagick:

| File | From | Notes |
| --- | --- | --- |
| `seasons/{summer,summer-night,autumn,winter}-1684.webp` | `Seasons/*.png` | quality **95** — 2% RMSE from quality 100 at a third of the bytes |
| `seasons/…-1280.webp` / `…-880.webp` | `Seasons/*.png` | quality 92 / 90 for narrower viewports |
| `hero.webp` | `Hero.png` | the original quality-100 conversion, kept as the archive copy |
| `pop.webp` | `Mock.png` | de-rotated, regrained archival photograph |
| `leaf.webp` | `Mock.png` | cut out on the HSV saturation channel |
| `torn-down/up.webp` | `Paper.png` | torn edge under the hero and above the newsletter |
| `paper-texture.webp`, `frame-texture.webp` | `Paper.png` | four-way mirrored, seamless |

The source PNGs in `Seasons/` are never modified. `Night hero.png` is one
pixel wider than the others and is cropped to 1684 on the way out so all four
frames align exactly.

The browser picks one width per scene from `srcset`. A phone loads about
650 KB across the whole four-scene cycle, and only as each scene is reached.

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
