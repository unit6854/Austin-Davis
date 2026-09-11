/**
 * Every word on the site lives here, so copy can be changed without touching layout.
 */

export const NAV_LINKS = [
  { label: 'Stories', to: '/stories' },
  { label: 'Poems', to: '/poems' },
  { label: 'About', to: '/about' },
];

/**
 * Social accounts. Only add an entry once the account actually exists —
 * an empty list simply renders nothing.
 */
export const SOCIAL_LINKS = [
  // { platform: 'instagram', label: 'Instagram', href: 'https://instagram.com/…' },
];

export const HERO = {
  eyebrow: 'Writer · Poet · Storyteller',
  titleTop: 'Stories about',
  titleItalic: 'remembering how to live.',
  supporting:
    'Reflections on life, family, time, and the things we don’t understand until much later.',
  cue: 'Begin the journey',
};

export const WELCOME = {
  eyebrow: 'Welcome',
  title: 'I write about the things that shaped me.',
  lines: [
    'The people.',
    'The moments.',
    'The places.',
    'The lessons I didn’t understand until I was older.',
  ],
  closing: 'If you’re here, maybe you have your own story too.',
  cta: { label: 'Read my story', to: '/about' },
  note: 'The best things in life aren’t things at all.',
  noteAttribution: '— Pop',
  annotation: 'The things we understand later.',
  /* The two family photographs in the frame. They alternate on a ten second
     hold — see components/Welcome. Add a third and it simply joins the
     rotation. */
  photos: [
    {
      src: '/images/family/grandparents',
      alt: 'Pop and Granny in the back yard, standing behind one of the grandchildren on a swing set.',
    },
    {
      src: '/images/family/pool',
      alt: 'Two children sitting in a paddling pool in the yard on a summer afternoon, pouring water from a cup.',
    },
    {
      src: '/images/family/cat',
      /* the scan is only 600px across, so it is served at that one size —
         upscaling it would only soften it */
      widths: [600],
      alt: 'A boy in a red shirt sitting on the kitchen floor by the window, holding a grey and white cat in his lap.',
    },
  ],
};

import { STANZAS as THE_THINGS_I_DIDNT_UNDERSTAND } from './writing/the-things-i-didnt-understand.js';
import { STANZAS as THE_PEOPLE_I_THOUGHT_WOULD_BE_HERE } from './writing/the-people-i-thought-would-be-here.js';

/**
 * The published stories, newest first. The full text lives in ./writing/ —
 * one file per piece, transcribed verbatim, so the words stay separate from
 * the layout.
 */
export const STORIES = [
  {
    eyebrow: 'Second story',
    title: 'The People I Thought Would Be Here',
    slug: 'the-people-i-thought-would-be-here',
    date: '2026-09-09',
    description:
      'The friends I lost, the ones who are still here, and how little time we actually had.',
    excerpt: [
      'I miss him.',
      'Sometimes that’s all I can think to say.',
      'I miss him.',
    ],
    stanzas: THE_PEOPLE_I_THOUGHT_WOULD_BE_HERE,
    cta: 'Read the story',
    /* the engraving that stands beside it on the homepage */
    art: { src: '/images/skateboard.webp', width: 940, height: 1000 },
  },
  {
    eyebrow: 'First story',
    title: 'The Things I Didn’t Understand',
    slug: 'the-things-i-didnt-understand',
    date: '2026-08-30',
    description:
      'A letter to my grandfather, and the lessons I was too young to recognize.',
    excerpt: [
      'My grandfather, Pop, used to sit outside all the time.',
      'Watching.',
      'Listening.',
    ],
    stanzas: THE_THINGS_I_DIDNT_UNDERSTAND,
    cta: 'Read the story',
    art: { src: '/images/tomato.webp', width: 940, height: 1234 },
  },
];

/** The oldest — still the one the story pages and the dateline read from. */
export const FIRST_STORY = STORIES[STORIES.length - 1];

/** how long the homepage feature holds on one story before turning to the next */
export const FEATURE_HOLD = 20000;

import { STANZAS as STREETLIGHT_SOLILOQUY } from './writing/poems/streetlight-soliloquy.js';
import { STANZAS as THE_BATTLEFIELD_OF_US } from './writing/poems/the-battlefield-of-us.js';
import { STANZAS as THE_EDGE_OF_A_CLIFF } from './writing/poems/the-edge-of-a-cliff-or-the-bottom-of-the-sea.js';
import { STANZAS as A_RECOLLECTION_OF_MY_HEART } from './writing/poems/a-recollection-of-my-heart.js';
import { STANZAS as THOUGHTS_OF_THE_NIGHT } from './writing/poems/thoughts-of-the-night.js';
import { STANZAS as MUSIC_INTERTWINED_WITH_LOVE } from './writing/poems/music-intertwined-with-love.js';

/**
 * The poems, oldest first — they read as a life that way, and Austin has said
 * they were written in order.
 *
 * `date` is the day each was first posted to his WritersCafe page
 * (writerscafe.org/lamaz1928), where most of them appeared under earlier
 * titles. The words here are the versions in Writing/, not the ones there.
 * A poem with no date has not been found on that page; it stays at the end,
 * with the newest, until Austin says when it was written.
 */
export const POEMS = [
  {
    title: 'Music Intertwined with Love',
    slug: 'music-intertwined-with-love',
    date: '2008-11-29',
    stanzas: MUSIC_INTERTWINED_WITH_LOVE,
  },
  {
    title: 'Thoughts of the Night',
    slug: 'thoughts-of-the-night',
    date: '2010-01-21',
    stanzas: THOUGHTS_OF_THE_NIGHT,
  },
  {
    title: 'A Recollection of My Heart',
    slug: 'a-recollection-of-my-heart',
    date: '2011-03-10',
    stanzas: A_RECOLLECTION_OF_MY_HEART,
  },
  {
    title: 'The Edge of a Cliff or the Bottom of The Sea',
    slug: 'the-edge-of-a-cliff-or-the-bottom-of-the-sea',
    date: '2011-07-20',
    stanzas: THE_EDGE_OF_A_CLIFF,
  },
  {
    title: 'The Battlefield of Us',
    slug: 'the-battlefield-of-us',
    date: null,
    stanzas: THE_BATTLEFIELD_OF_US,
  },
  {
    title: 'Streetlight Soliloquy',
    slug: 'streetlight-soliloquy',
    date: null,
    stanzas: STREETLIGHT_SOLILOQUY,
  },
];

/** 30 August 2026 → { day: '30', month: 'August', year: '2026' } */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    day: String(d),
    month: date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }),
    monthShort: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    year: String(y),
    iso,
  };
}

export const QUOTE = {
  text: 'We don’t always understand the most important lessons until much later.',
  attribution: 'Austin Davis',
};

export const JOURNEY = [
  {
    icon: 'book',
    label: 'Stories',
    description: 'The people and moments that shaped me.',
    to: '/stories',
  },
  {
    icon: 'feather',
    label: 'Poems',
    description: 'Words I’ve carried with me for years.',
    to: '/poems',
  },
];

export const NEWSLETTER = {
  title: 'Join the Journey',
  supporting: 'Stories, letters, and reflections – sent occasionally.',
  placeholder: 'your email address',
  button: 'Subscribe',
  success: 'Thank you. Something will find its way to you soon.',
  error: 'Something went wrong. Please try again in a moment.',
};

export const FOOTER = {
  name: 'Austin Davis',
  tagline: 'Writer · Poet · Storyteller',
};

/**
 * Interior pages. The homepage only teases these — each one stays quiet
 * until there is real writing to put in it.
 */
export const PAGES = {
  stories: {
    scene: 'stories',
    eyebrow: 'Stories',
    title: 'The people and moments that shaped me.',
    intro:
      'Some of these took twenty years to understand. I am writing them down as they come back to me.',
    empty: 'More stories are being written.',
  },
  poems: {
    scene: 'poems',
    eyebrow: 'Poems',
    title: 'Words I’ve carried with me for years.',
    intro:
      'Some of these were written in a notebook a long time ago and have been waiting since.',
    /* the line under the last sheet */
    closing: 'More are still in the notebook.',
  },
  about: {
    scene: 'about',
    eyebrow: 'About',
    title: 'I’m trying to understand this too.',
    intro:
      'I write about family, childhood, ambition, time, freedom, loss, memory, and music — and the question underneath all of it: what does it actually mean to live?',
    empty: 'A fuller introduction is on its way.',
  },
};
