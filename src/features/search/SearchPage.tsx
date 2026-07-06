import { useMemo, useState } from 'react';

import {
  SEARCH_MEDIA_FILTERS,
  GENRE_FILTERS,
} from '@/lib/constants';

import { useMemories } from '@/app/providers';

import { SearchBar } from '@/components/common';
import { CategoryChip } from '@/components/ui';
import { MemoryCard } from '@/components/media';

import type { MemoryCategory } from '@/types';

type MediaFilter =
  (typeof SEARCH_MEDIA_FILTERS)[number];

export function SearchPage() {
  const [query, setQuery] = useState('');

  const [mediaFilter, setMediaFilter] =
    useState<MediaFilter>('All');

  const [categoryFilter, setCategoryFilter] =
    useState<MemoryCategory | null>(null);

  const {
    memories,
    openMemory,
  } = useMemories();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return memories.filter((memory) => {
      const matchesQuery =
        q.length === 0 ||
        memory.title.toLowerCase().includes(q) ||
        memory.location
          ?.toLowerCase()
          .includes(q) ||
        memory.category
          .toLowerCase()
          .includes(q);

      const matchesMedia =
        mediaFilter === 'All' ||
        (mediaFilter === 'Photos' &&
          memory.type === 'photo') ||
        (mediaFilter === 'Videos' &&
          memory.type === 'video');

      const matchesCategory =
        categoryFilter === null ||
        memory.category === categoryFilter;

      return (
        matchesQuery &&
        matchesMedia &&
        matchesCategory
      );
    });
  }, [
    query,
    mediaFilter,
    categoryFilter,
    memories,
  ]);

  return (
    <div className="container-edge pb-24 pt-24">
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        className="mx-auto max-w-3xl"
      />

      {/* Media Type */}
      <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
        {SEARCH_MEDIA_FILTERS.map((filter) => (
          <CategoryChip
            key={filter}
            active={mediaFilter === filter}
            onClick={() =>
              setMediaFilter(filter)
            }
          >
            {filter}
          </CategoryChip>
        ))}
      </div>

      {/* Categories */}
      <div className="mx-auto mt-3 flex max-w-3xl flex-wrap justify-center gap-2">
        <CategoryChip
          active={categoryFilter === null}
          onClick={() =>
            setCategoryFilter(null)
          }
        >
          All Categories
        </CategoryChip>

        {GENRE_FILTERS.map((category) => (
          <CategoryChip
            key={category}
            active={
              categoryFilter === category
            }
            onClick={() =>
              setCategoryFilter(
                categoryFilter === category
                  ? null
                  : category,
              )
            }
          >
            {category}
          </CategoryChip>
        ))}
      </div>

      <h2 className="mb-5 mt-12 text-title-md text-on-surface">
        {query
          ? `Results for "${query}"`
          : 'Results for your search'}

        <span className="ml-2 text-label-sm text-metadata">
          {results.length} memories
        </span>
      </h2>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((memory) => (
            <MemoryCard
              key={memory.memoryId}
              memory={memory}
              className="w-full"
              onSelect={openMemory}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-body-md text-metadata">
          No memories match your search yet.
          Try a different search or filter.
        </p>
      )}
    </div>
  );
}