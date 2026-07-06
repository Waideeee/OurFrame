import { useMemo } from 'react';
import { GENRE_FILTERS, HOME_ROWS } from '@/lib/constants';
import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow } from '@/components/media';
import { CategoryChip } from '@/components/ui';
import { Check, Info, Play, Plus } from 'lucide-react';
import { useMemoryFilter } from '@/hooks/useMemoryFilter';

export function HomePage() {
  const {
    memories,
    recentMemories,
    openMemory,
    toggleCollection,
  } = useMemories();

  const {
    filterMemories,
    activeCategory,
    setActiveCategory,
} = useMemoryFilter(memories);

  const hero =
    memories.find((m) => m.featured) ??
    recentMemories[0];

  const rows = useMemo(() => {
  return HOME_ROWS.map((row) => ({
    ...row,
    memories: filterMemories(
      memories.filter((memory) =>
        row.categories.includes(memory.category),
      ),
    ),
  }));
}, [memories, filterMemories]);

  

  return (
    <>
      {hero && (
        <HeroBanner
          memory={hero}
          actions={[
            {
              label: 'Play',
              icon: (
                <Play
                  size={18}
                  className="fill-canvas"
                />
              ),
              variant: 'primary',
              onClick: () => openMemory(hero),
            },
            {
              label: hero.inCollection
                ? 'In Collection'
                : 'Collection',
              icon: hero.inCollection ? (
                <Check size={18} />
              ) : (
                <Plus size={18} />
              ),
              variant: 'secondary',
              onClick: () =>
                toggleCollection(hero.memoryId),
            },
            {
              label: '',
              icon: <Info size={18} />,
              variant: 'icon',
              ariaLabel: 'More information',
              onClick: () => openMemory(hero),
            },
          ]}
        />
      )}

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        {rows.map((row) =>
          row.memories.length > 0 ? (
            <MediaRow
              key={row.title}
              title={row.title}
              memories={row.memories}
              onSelect={openMemory}
            />
          ) : null,
        )}

        <MediaRow
            title="Recently Added"
            memories={filterMemories(recentMemories)}
            onSelect={openMemory}
        />
      </div>

      <div className="pointer-events-none sticky bottom-6 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-md">
          <span className="px-2 text-label-sm font-semibold uppercase tracking-widest text-metadata">
            Genres
          </span>

          {/* All */}
          <CategoryChip
            active={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          >
            All
          </CategoryChip>

          {GENRE_FILTERS.map((genre) => (
            <CategoryChip
              key={genre}
              active={activeCategory === genre}
              onClick={() =>
                setActiveCategory(
                  activeCategory === genre
                    ? null
                    : genre,
                )
              }
            >
              {genre}
            </CategoryChip>
          ))}
        </div>
      </div>
    </>
  );
}