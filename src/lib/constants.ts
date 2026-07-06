import type { MemoryCategory, Mood } from '@/types';


export const APP_NAME = 'OurFrame';
export const APP_TAGLINE = 'Our Story, Our Way.';

/** Primary navigation, center of the navbar. */
export const NAV_LINKS = [
  { label: 'Memories', path: '/' },
  { label: 'Videos', path: '/videos' },
  { label: 'Photos', path: '/photos' },
  { label: 'Recently Added', path: '/recently-added' },
  { label: 'My Lists', path: '/my-lists' },
] as const;




/** Search page time/category filter chips. */
export const SEARCH_MEDIA_FILTERS = [
    'All',
    'Photos',
    'Videos',
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

export const GENRE_FILTERS = UPLOAD_CATEGORIES;

export const MOOD_FILTERS = UPLOAD_MOODS;



export const FOOTER_LINKS = ['Privacy', 'Terms of Service', 'Contact Us'] as const;

export const VIDEO_ROWS: {
  title: string;
  categories: MemoryCategory[];
}[] = [
  {
    title: 'Travel Destinations',
    categories: ['Travel'],
  },
  {
    title: 'Date Nights & Daily Life',
    categories: ['Dates', 'Daily Life'],
  },
  {
    title: 'Special Occasions',
    categories: ['Occasions', 'Anniversaries', 'Holidays'],
  },
  {
    title: 'Meetups',
    categories: ['Meetups'],
  },
];

export const HOME_ROWS: {
  title: string;
  categories: MemoryCategory[];
}[] = [
  {
    title: 'Travel Destinations',
    categories: ['Travel'],
  },
  {
    title: 'Date Nights & Dinners',
    categories: ['Dates', 'Daily Life'],
  },
  {
    title: 'Holidays',
    categories: ['Holidays'],
  },
  {
    title: 'Special Occasions',
    categories: ['Occasions'],
  },
  {
    title: 'Anniversaries',
    categories: ['Anniversaries'],
  },
];

export const PHOTO_ROWS: {
  title: string;
  categories: MemoryCategory[];
}[] = [
  {
    title: 'Travel Memories',
    categories: ['Travel'],
  },
  {
    title: 'Date Nights',
    categories: ['Dates'],
  },
  {
    title: 'Daily Life',
    categories: ['Daily Life'],
  },
  {
    title: 'Holidays',
    categories: ['Holidays'],
  },
  {
    title: 'Special Occasions',
    categories: ['Occasions'],
  },
  {
    title: 'Anniversaries',
    categories: ['Anniversaries'],
  },
];