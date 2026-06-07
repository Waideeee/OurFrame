import { useMemo, useState } from 'react';
import { SEARCH_FILTERS } from '@/lib/constants';
import { useMemories } from '@/app/providers';
import { SearchBar } from '@/components/common';
import { CategoryChip } from '@/components/ui';
import { MemoryCard } from '@/components/media';

type SearchFilter = (typeof SEARCH_FILTERS)[number];

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('All Time');
  const { memories, openMemory } = useMemories();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return memories.filter((m) => {
      const matchesQuery =
        q.length === 0 ||
        m.title.toLowerCase().includes(q) ||
        m.location?.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);

      const matchesFilter =
        filter === 'All Time' ||
        (filter === 'Photos' && m.type === 'photo') ||
        (filter === 'Videos' && m.type === 'video') ||
        (filter === 'Travel' && m.category === 'Travel') ||
        (filter === 'Date Nights' && m.category === 'Dates') ||
        (filter === 'Anniversaries' && m.category === 'Anniversaries');

      return matchesQuery && matchesFilter;
    });
  }, [query, filter, memories]);

  return (
    <div className="container-edge pb-24 pt-24">
      <SearchBar value={query} onChange={setQuery} autoFocus className="mx-auto max-w-3xl" />

      <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
        {SEARCH_FILTERS.map((f) => (
          <CategoryChip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </CategoryChip>
        ))}
      </div>

      <h2 className="mb-5 mt-12 text-title-md text-on-surface">
        {query ? `Results for "${query}"` : 'Results for your search'}
        <span className="ml-2 text-label-sm text-metadata">{results.length} memories</span>
      </h2>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              className="w-full"
              onSelect={openMemory}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-body-md text-metadata">
          No memories match your search yet. Try a different mood, place, or moment.
        </p>
      )}
    </div>
  );
}
