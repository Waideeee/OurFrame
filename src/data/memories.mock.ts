import type { Memory } from '@/types';

/** Local placeholder images served from /public, alternated repeatedly. */
const localImages = ['/lizard.jpg', '/impostor-cat.jpg'];
let imgCounter = 0;

/** Returns the next local image, cycling through the list on each call. */
export function img(_seed: string, _w = 800, _h = 450): string {
  const url = localImages[imgCounter % localImages.length];
  imgCounter += 1;
  return url;
}

/**
 * The single source of truth for every memory in the app. Pages compose rows
 * from this list; a real API would return the same `Memory[]` shape.
 */
export const memories: Memory[] = [
  {
    id: 'm-sunset',
    title: 'Our First Sunset',
    description:
      'The evening we drove past the city limits, found an empty stretch of coast, and watched the sky turn the color of everything we hoped for.',
    imageUrl: img('sunset', 1600, 900),
    type: 'photo',
    category: 'Travel',
    mood: 'Golden Hour',
    date: '2021-06-14',
    location: 'Big Sur, California',
    hearts: 5,
    featured: true,
  },
  {
    id: 'm-first-date',
    title: 'The First Date',
    description: 'Coffee that turned into dinner that turned into a six-hour conversation.',
    imageUrl: img('firstdate'),
    type: 'photo',
    category: 'Dates',
    mood: 'Candid',
    date: '2021-01-09',
    location: 'Downtown Cafe',
    hearts: 5,
  },
  {
    id: 'm-monthsary-1',
    title: '1st Monthsary',
    description: 'One month in and already collecting inside jokes.',
    imageUrl: img('monthsary1'),
    type: 'photo',
    category: 'Occasions',
    mood: 'Romantic',
    date: '2021-02-09',
    location: 'Home',
    hearts: 4,
    mediaItems: [
      { id: 'm-monthsary-1-1', url: '/lizard.jpg', type: 'photo', caption: 'The little cake we baked together' },
      { id: 'm-monthsary-1-2', url: '/impostor-cat.jpg', type: 'photo', caption: 'Handwritten cards' },
      { id: 'm-monthsary-1-3', url: '/lizard.jpg', type: 'video', caption: 'Our first slow dance in the kitchen' },
      { id: 'm-monthsary-1-4', url: '/impostor-cat.jpg', type: 'photo' },
    ],
  },
  {
    id: 'm-monthsary-3',
    title: '3rd Monthsary — Our Big Trip',
    description: 'We celebrated three months by getting lost in a city neither of us had seen.',
    imageUrl: img('bigtrip', 1600, 900),
    type: 'video',
    category: 'Travel',
    mood: 'Adventure',
    date: '2021-04-09',
    location: 'Lisbon, Portugal',
    hearts: 5,
    durationSeconds: 372,
    featured: true,
  },
  {
    id: 'm-santorini',
    title: 'Summer in Santorini',
    description: 'White walls, blue domes, and a whole week with nowhere to be.',
    imageUrl: img('santorini', 1600, 900),
    type: 'video',
    category: 'Travel',
    mood: 'Adventure',
    date: '2022-07-20',
    location: 'Santorini, Greece',
    hearts: 5,
    durationSeconds: 528,
    progress: 0.42,
    featured: true,
  },
  {
    id: 'm-amalfi',
    title: 'The Amalfi Coast Getaway',
    description: 'Lemon groves, cliffside lunches, and the bluest water we have ever seen.',
    imageUrl: img('amalfi', 1600, 900),
    type: 'photo',
    category: 'Travel',
    mood: 'Golden Hour',
    date: '2022-08-03',
    location: 'Amalfi, Italy',
    hearts: 5,
    featured: true,
  },
  {
    id: 'm-european-summer',
    title: 'European Summer',
    description: 'Three countries, one backpack each, endless gelato.',
    imageUrl: img('eurosummer', 1600, 900),
    type: 'collection',
    category: 'Travel',
    mood: 'Adventure',
    date: '2022-07-01',
    location: 'Europe',
    hearts: 5,
    featured: true,
  },
  {
    id: 'm-dinner-rooftop',
    title: 'Rooftop Anniversary Dinner',
    description: 'String lights, a shared dessert, and a skyline that felt like ours.',
    imageUrl: img('rooftop'),
    type: 'photo',
    category: 'Dates',
    mood: 'Dining',
    date: '2023-01-09',
    location: 'The Terrace',
    hearts: 5,
  },
  {
    id: 'm-pasta-night',
    title: 'Homemade Pasta Night',
    description: 'Flour everywhere, but the carbonara was worth it.',
    imageUrl: img('pasta'),
    type: 'video',
    category: 'Daily Life',
    mood: 'Dining',
    date: '2023-03-18',
    location: 'Home',
    hearts: 4,
    durationSeconds: 214,
    progress: 0.7,
  },
  {
    id: 'm-beach-day',
    title: 'A Lazy Beach Day',
    description: 'No plans, just waves and sandy sandwiches.',
    imageUrl: img('beachday'),
    type: 'photo',
    category: 'Travel',
    mood: 'Candid',
    date: '2023-05-27',
    location: 'Malibu',
    hearts: 4,
  },
  {
    id: 'm-snow-cabin',
    title: 'Snowed-In Cabin Weekend',
    description: 'A fireplace, two books, and absolutely nowhere to go.',
    imageUrl: img('cabin'),
    type: 'video',
    category: 'Holidays',
    mood: 'Romantic',
    date: '2023-12-23',
    location: 'Lake Tahoe',
    hearts: 5,
    durationSeconds: 463,
    progress: 0.15,
  },
  {
    id: 'm-farmers-market',
    title: 'Sunday Farmers Market',
    description: 'Our weekly ritual — fresh peaches and terrible singing in the car.',
    imageUrl: img('market'),
    type: 'photo',
    category: 'Daily Life',
    mood: 'Candid',
    date: '2024-04-07',
    location: 'Grove Market',
    hearts: 3,
  },
  {
    id: 'm-picnic',
    title: 'Golden Hour Picnic',
    description: 'A blanket, a bottle, and the park to ourselves.',
    imageUrl: img('picnic'),
    type: 'photo',
    category: 'Dates',
    mood: 'Golden Hour',
    date: '2024-05-19',
    location: 'Riverside Park',
    hearts: 5,
  },
  {
    id: 'firstmeet',
    title: 'The day we met',
    description: 'We met and we ate, walk and drink matcha afterall',
    imageUrl: img('firstmeet', 1600, 900),
    type: 'video',
    category: 'Meetups',
    mood: 'Lovely',
    date: '2025-02-16',
    location: 'Cubao',
    hearts: 1,
    durationSeconds: 689,
    progress: 0.6,
  },
  {
    id: 'm-anniversary-3',
    title: 'Third Anniversary',
    description: 'Same restaurant as the first date. Same order, too.',
    imageUrl: img('anniv3'),
    type: 'photo',
    category: 'Anniversaries',
    mood: 'Romantic',
    date: '2024-01-09',
    location: 'Downtown Cafe',
    hearts: 5,
  },
  {
    id: 'm-fireworks',
    title: 'New Year Fireworks',
    description: 'A countdown, a kiss, and a sky full of light.',
    imageUrl: img('fireworks'),
    type: 'video',
    category: 'Holidays',
    mood: 'Candid',
    date: '2024-01-01',
    location: 'Harbor Pier',
    hearts: 4,
    durationSeconds: 176,
  },
  {
    id: 'm-garden',
    title: 'Planting the Garden',
    description: 'We are not sure the tomatoes will survive us, but we tried.',
    imageUrl: img('garden'),
    type: 'photo',
    category: 'Daily Life',
    mood: 'Candid',
    date: '2024-05-25',
    location: 'Backyard',
    hearts: 3,
  },
  {
    id: 'm-night-drive',
    title: 'Movie Date ',
    description: 'We watched a movie named Final Destination and ate with her Sister',
    imageUrl: img('nightdrive'),
    type: 'photo',
    category: 'Dates',
    mood: 'Romantic',
    date: '2024-05-29',
    location: 'Ayala Cloverleaf',
    hearts: 4,
  },
  {
    id: 'm-coffee-morning',
    title: 'Our 1st monthsary',
    description: 'A simple Celebration of our first month together',
    imageUrl: img('coffee'),
    type: 'photo',
    category: 'Daily Life',
    mood: 'Candid',
    date: '2024-08-18',
    location: 'Taft Avenue',
    hearts: 1,
  },
];

/**
 * Credit each seed memory to a profile so the UI can show who posted it. Spread
 * deterministically across the two partners and the shared "Our Story" profile;
 * memories created through the upload form set their own `uploadedBy`.
 */
const SEED_UPLOADERS = ['Partner 1', 'Partner 2', 'Our Story'];
memories.forEach((m, i) => {
  if (!m.uploadedBy) m.uploadedBy = SEED_UPLOADERS[i % SEED_UPLOADERS.length];
});

/** Lookup helpers used across feature pages. */
export const memoriesById = new Map(memories.map((m) => [m.id, m]));

export function getMemory(id: string): Memory | undefined {
  return memoriesById.get(id);
}

export const featuredMemories = memories.filter((m) => m.featured);

export function memoriesByType(type: Memory['type']): Memory[] {
  return memories.filter((m) => m.type === type);
}

export function memoriesByCategory(category: Memory['category']): Memory[] {
  return memories.filter((m) => m.category === category);
}

/** Continue-watching: videos that have partial progress. */
export const continueWatching = memories.filter(
  (m) => m.type === 'video' && m.progress !== undefined && m.progress > 0 && m.progress < 1,
);

/** Most recent first. */
export const recentMemories = [...memories].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
