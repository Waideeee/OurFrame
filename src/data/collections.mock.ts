import type { Collection } from '@/types';
import { img } from './memories.mock';

export const collections: Collection[] = [
  {
    id: 'c-italy',
    title: 'Italy Revisited',
    description: 'Every espresso, every piazza, every wrong turn that became a favorite.',
    coverUrl: img('italy', 1200, 675),
    category: 'Travel',
    memoryIds: ['m-amalfi', 'm-european-summer'],
    albumCount: 4,
    itemCount: 128,
    year: '2022',
  },
  {
    id: 'c-best-2022',
    title: 'Best of 2022',
    description: 'The year we said yes to almost everything.',
    coverUrl: img('best2022', 1200, 675),
    category: 'Occasions',
    memoryIds: ['m-santorini', 'm-amalfi', 'm-european-summer'],
    albumCount: 6,
    itemCount: 214,
    year: '2022',
  },
  {
    id: 'c-nature',
    title: 'Nature',
    description: 'Trails, tide pools, and the times we left our phones in the bag.',
    coverUrl: img('nature', 1200, 675),
    category: 'Travel',
    memoryIds: ['m-beach-day', 'm-roadtrip', 'm-snow-cabin'],
    albumCount: 3,
    itemCount: 86,
    year: '2023',
  },
  {
    id: 'c-socials',
    title: 'Socials',
    description: 'Friends, dinners, and the nights that ran long.',
    coverUrl: img('socials', 1200, 675),
    category: 'Dates',
    memoryIds: ['m-dinner-rooftop', 'm-picnic'],
    albumCount: 2,
    itemCount: 54,
    year: '2023',
  },
  {
    id: 'c-daily',
    title: 'Everyday Us',
    description: 'The unremarkable days that we will miss the most.',
    coverUrl: img('everyday', 1200, 675),
    category: 'Daily Life',
    memoryIds: ['m-coffee-morning', 'm-pasta-night', 'm-garden', 'm-farmers-market'],
    albumCount: 5,
    itemCount: 172,
    year: '2024',
  },
  {
    id: 'c-holidays',
    title: 'Holidays Together',
    description: 'Every season we got to spend side by side.',
    coverUrl: img('holidays', 1200, 675),
    category: 'Holidays',
    memoryIds: ['m-snow-cabin', 'm-fireworks'],
    albumCount: 3,
    itemCount: 97,
    year: '2024',
  },
];

export const collectionsById = new Map(collections.map((c) => [c.id, c]));

/** "Collections by Type" cards on the Collection page. */
export interface CollectionType {
  category: Collection['category'];
  albumCount: number;
  itemCount: number;
  coverUrl: string;
}

export const collectionTypes: CollectionType[] = [
  { category: 'Travel', albumCount: 7, itemCount: 214, coverUrl: img('type-travel', 600, 400) },
  { category: 'Dates', albumCount: 4, itemCount: 88, coverUrl: img('type-dates', 600, 400) },
  { category: 'Daily Life', albumCount: 5, itemCount: 172, coverUrl: img('type-daily', 600, 400) },
];
