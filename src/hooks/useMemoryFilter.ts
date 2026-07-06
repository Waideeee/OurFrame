import { useCallback, useMemo, useState } from 'react';
import type {
  Memory,
  MemoryCategory,
  Mood,
} from '@/types';

interface Options {
  type?: Memory['type'];
}

export function useMemoryFilter(
  memories: Memory[],
  options?: Options,
) {
  const [activeCategory, setActiveCategory] =
    useState<MemoryCategory | null>(null);

  const [activeMood, setActiveMood] =
    useState<Mood | null>(null);

  const filterMemories = useCallback(
    (items: Memory[]) => {
      let result = items;

      if (options?.type) {
        result = result.filter(
          (m) => m.type === options.type,
        );
      }

      if (activeCategory) {
        result = result.filter(
          (m) => m.category === activeCategory,
        );
      }

      if (activeMood) {
        result = result.filter(
          (m) => m.mood === activeMood,
        );
      }

      return result;
    },
    [
      options?.type,
      activeCategory,
      activeMood,
    ],
  );

  const filteredMemories = useMemo(
    () => filterMemories(memories),
    [memories, filterMemories],
  );

  return {
    filteredMemories,

    filterMemories,

    activeCategory,
    setActiveCategory,

    activeMood,
    setActiveMood,
  };
}