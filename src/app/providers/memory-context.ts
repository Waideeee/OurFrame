import { createContext, useContext } from 'react';
import type { Memory } from '@/types';

export interface MemoryContextValue {
  memories: Memory[];
  getMemory: (id: string) => Memory | undefined;
  memoriesByType: (type: Memory['type']) => Memory[];
  memoriesByCategory: (category: Memory['category']) => Memory[];
  featuredMemories: Memory[];
  continueWatching: Memory[];
  recentMemories: Memory[];

  toggleArchive: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  toggleCollection: (id: string) => Promise<void>;
  toggleList: (id: string) => Promise<void>;
  addMemory: (data: {
    title: string;
    description: string;
    mediaUrl: string;
    coverPhoto?: string;
    type: Memory['type'];
    category: Memory['category'];
    mood?: Memory['mood'];
    date: string;
    location?: string;
    durationSeconds?: number;
    featured?: boolean;
  }) => Promise<Memory>;
  updateMemory: (id: string, patch: Partial<Memory>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;

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