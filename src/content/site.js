/**
 * Every word on the site lives here, so copy can be changed without touching layout.
 */

export const NAV_LINKS = [
  { label: 'Stories', to: '/stories' },
  { label: 'Poems', to: '/poems' },
  { label: 'Journal', to: '/journal' },
  { label: 'About', to: '/about' },
  { label: 'Letters', to: '/letters' },
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
  photoAlt:
    'An archival photograph of Pop sitting in a rocking chair on the porch, looking out at the yard.',
};

/**
 * The first published story.
 * `body` is intentionally short — add Austin's real text here as it is ready.
 * Nothing on this site should be invented on his behalf.
 */
export const FIRST_STORY = {
  eyebrow: 'First story',
  title: 'The Things I Didn’t Understand',
  slug: 'the-things-i-didnt-understand',
  description:
    'A letter to my grandfather, and the lessons I was too young to recognize.',
  excerpt: [
    'My grandfather, Pop, used to sit outside all the time.',
    'Watching.',
    'Listening.',
  ],
  /* Shown at the end of the story page until the full text is added above. */
  continuation: 'The rest of this letter is still being written.',
  cta: 'Read the story',
};

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
  {
    icon: 'journal',
    label: 'Journal',
    description: 'Questions I’m still trying to answer.',
    to: '/journal',
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
    eyebrow: 'Stories',
    title: 'The people and moments that shaped me.',
    intro:
      'Some of these took twenty years to understand. I am writing them down as they come back to me.',
    empty: 'More stories are being written.',
  },
  poems: {
    eyebrow: 'Poems',
    title: 'Words I’ve carried with me for years.',
    intro:
      'Some of these were written in a notebook a long time ago and have been waiting since.',
    empty: 'These are being gathered.',
  },
  journal: {
    eyebrow: 'Journal',
    title: 'Questions I’m still trying to answer.',
    intro:
      'Not conclusions. Just the things I keep turning over — about time, work, family, and what any of it is for.',
    empty: 'The first entries are coming.',
  },
  about: {
    eyebrow: 'About',
    title: 'I’m trying to understand this too.',
    intro:
      'I write about family, childhood, ambition, time, freedom, loss, memory, and music — and the question underneath all of it: what does it actually mean to live?',
    empty: 'A fuller introduction is on its way.',
  },
  letters: {
    eyebrow: 'Letters',
    title: 'Written to someone in particular.',
    intro:
      'Letters to the people who shaped me — some of whom will never read them.',
    empty: 'The first letters are coming.',
  },
};
