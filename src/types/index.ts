/**
 * Domain model for OurFrame.
 *
 * The mock data layer (src/data) returns these exact shapes so a real API can
 * be swapped in later without touching component code. Keep these types free of
 * UI concerns.
 */

export type MediaType = 'photo' | 'video' | 'collection';

export type MemoryCategory =
  | 'Travel'
  | 'Dates'
  | 'Daily Life'
  | 'Holidays'
  | 'Occasions'
  | 'Anniversaries';

/** Mood tags used by the Photos page "Filter by mood" chip bar. */
export type Mood = 'Candid' | 'Adventure' | 'Romantic' | 'Dining' | 'Golden Hour';

export interface Memory {
  id: string;
  title: string;
  description: string;
  /** 16:9 landscape image used for cards and hero banners. */
  imageUrl: string;
  type: MediaType;
  category: MemoryCategory;
  mood?: Mood;
  /** ISO-8601 date the memory was captured. */
  date: string;
  location?: string;
  /** Heart rating, 0–5, mirrors the prototype's "heart rating" overlay. */
  hearts: number;
  /** Runtime in seconds for video memories. */
  durationSeconds?: number;
  /** Continue-watching progress, 0–1. Only meaningful for videos. */
  progress?: number;
  featured?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  category: MemoryCategory;
  /** IDs into the memories mock store. */
  memoryIds: string[];
  albumCount: number;
  itemCount: number;
  /** Year label for anniversary-style tiles, e.g. "2023". */
  year?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  /** "add" tiles render the dashed + affordance instead of a real profile. */
  kind: 'partner' | 'shared' | 'add';
}

/** A logical "row" of memories on a content page. */
export interface MemoryRow {
  id: string;
  title: string;
  memories: Memory[];
}

/** Recently-Added timeline grouping. */
export interface TimelineGroup {
  id: string;
  label: string;
  memories: Memory[];
}
