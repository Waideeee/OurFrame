import { useMemo } from 'react';
import { Check, Info, Play, Plus } from 'lucide-react';

import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow } from '@/components/media';
import { CategoryChip } from '@/components/ui';

import {
  VIDEO_ROWS,
  GENRE_FILTERS,
} from '@/lib/constants';

import { useMemoryFilter } from '@/hooks/useMemoryFilter';

export function VideosPage() {
  const {
    getMemory,
    continueWatching,
    memoriesByType,
    openMemory,
    toggleCollection,
  } = useMemories();

  const videos = memoriesByType('video');

  const {
    filterMemories,
    activeCategory,
    setActiveCategory,
  } = useMemoryFilter(videos);

  const hero =
    getMemory('m-santorini') ??
    videos[0];

  const rows = useMemo(() => {
    return VIDEO_ROWS.map((row) => ({
      ...row,
      memories: filterMemories(
        videos.filter((memory) =>
          row.categories.includes(memory.category),
        ),
      ),
    }));
  }, [videos, filterMemories]);

  const filteredContinueWatching = useMemo(() => {
    return filterMemories(continueWatching);
  }, [continueWatching, filterMemories]);

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
        {/* Category Filter */}
        <div className="container-edge">
          <p className="mb-3 text-label-sm font-semibold uppercase tracking-widest text-metadata">
            Filter by category
          </p>

          <div className="flex flex-wrap gap-2">
            <CategoryChip
              active={activeCategory === null}
              onClick={() => setActiveCategory(null)}
            >
              All
            </CategoryChip>

            {GENRE_FILTERS.map((category) => (
              <CategoryChip
                key={category}
                active={activeCategory === category}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category
                      ? null
                      : category,
                  )
                }
              >
                {category}
              </CategoryChip>
            ))}
          </div>
        </div>

        {filteredContinueWatching.length > 0 && (
          <MediaRow
            title="Pick Up Where You Left Off"
            memories={filteredContinueWatching}
            showProgress
            onSelect={openMemory}
          />
        )}

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
      </div>
    </>
  );
}