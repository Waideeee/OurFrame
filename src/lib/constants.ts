import type { MemoryCategory, Mood } from '@/types';

export const APP_NAME = 'OurFrame';
export const APP_TAGLINE = 'Our Story, Our Way.';

/** Primary navigation, center of the navbar. */
export const NAV_LINKS = [
  { label: 'Memories', path: '/' },
  { label: 'Videos', path: '/videos' },
  { label: 'Photos', path: '/photos' },
  { label: 'Recently Added', path: '/recently-added' },
  { label: 'Our Collection', path: '/collection' },
  { label: 'My Lists', path: '/my-lists' },
] as const;

/** Floating "GENRES" filter chips on the home page. */
export const GENRE_FILTERS: MemoryCategory[] = ['Travel', 'Dates', 'Daily Life', 'Holidays'];

/** "Filter by mood" chips on the photos page. */
export const MOOD_FILTERS: Mood[] = ['Candid', 'Adventure', 'Romantic', 'Dining', 'Golden Hour'];

/** Search page time/category filter chips. */
export const SEARCH_FILTERS = [
  'All Time',
  'Photos',
  'Videos',
  'Travel',
  'Date Nights',
  'Anniversaries',
] as const;

/** Mood options offered by the upload form's "Mood" dropdown. */
export const UPLOAD_MOODS: Mood[] = [
  'Happy',
  'Romantic',
  'Nostalgic',
  'Funny',
  'Emotional',
  'Adventurous',
  'Peaceful',
];

export const UPLOAD_CATEGORIES: MemoryCategory[] = [
  'Travel',
  'Dates',
  'Daily Life',
  'Holidays',
  'Occasions',
  'Anniversaries',
];

export const FOOTER_LINKS = ['Privacy', 'Terms of Service', 'Contact Us'] as const;
