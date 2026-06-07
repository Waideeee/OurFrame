import { createContext, useContext } from 'react';
import type { Memory } from '@/types';

/**
 * Live, mutable view of the memory store. Seeded from the mock data layer so a
 * real API can be swapped in later; selectors mirror the helpers in
 * src/data/memories.mock.ts but read from React state instead of the static
 * module so archive/like/upload changes are reflected app-wide.
 */
export interface MemoryContextValue {
  memories: Memory[];
  getMemory: (id: string) => Memory | undefined;
  memoriesByType: (type: Memory['type']) => Memory[];
  memoriesByCategory: (category: Memory['category']) => Memory[];
  featuredMemories: Memory[];
  continueWatching: Memory[];
  recentMemories: Memory[];

  /** Mutators — toggles flip the matching flag on the memory in place. */
  toggleArchive: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleCollection: (id: string) => void;
  addMemory: (memory: Memory) => void;
  updateMemory: (id: string, patch: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;

  /** Detail-modal controls. */
  activeMemory: Memory | null;
  openMemory: (memory: Memory) => void;
  closeMemory: () => void;
}

export const MemoryContext = createContext<MemoryContextValue | undefined>(undefined);

export function useMemories(): MemoryContextValue {
  const ctx = useContext(MemoryContext);
  if (!ctx) {
    throw new Error('useMemories must be used within a MemoryProvider');
  }
  return ctx;
}
