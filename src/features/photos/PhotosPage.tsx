import { useMemo } from 'react';
import { Check, Heart, Play, Plus } from 'lucide-react';
import { img } from '@/data';
import { HeroBanner, MediaRow } from '@/components/media';
import { CategoryChip } from '@/components/ui';
import { useMemories } from '@/app/providers';
import { useMemoryFilter } from '@/hooks/useMemoryFilter';
import { MOOD_FILTERS, PHOTO_ROWS } from '@/lib/constants';

const ANNIVERSARY_YEARS = [
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
];

export function PhotosPage() {
  const {
    memories,
    openMemory,
    toggleCollection,
    toggleLike,
  } = useMemories();

  const photos = memories.filter(
    (memory) => memory.type === 'photo',
  );

  const {
    filterMemories,
    activeMood,
    setActiveMood,
  } = useMemoryFilter(photos, {
    type: 'photo',
  });

  const hero =
    photos.find((memory) => memory.featured) ??
    photos[0];

  const rows = useMemo(() => {
    return PHOTO_ROWS.map((row) => ({
      ...row,
      memories: filterMemories(
        photos.filter((memory) =>
          row.categories.includes(memory.category),
        ),
      ),
    }));
  }, [photos, filterMemories]);

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
                ? 'In My List'
                : 'My List',
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
              label: 'Like',
              icon: (
                <Heart
                  size={18}
                  className={
                    hero.liked ? 'fill-white' : ''
                  }
                />
              ),
              variant: 'circle',
              active: hero.liked,
              onClick: () =>
                toggleLike(hero.memoryId),
            },
          ]}
        />
      )}

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        <div className="container-edge">
          <p className="mb-3 text-label-sm font-semibold uppercase tracking-widest text-metadata">
            Filter by Mood
          </p>

          <div className="flex flex-wrap gap-2">
            <CategoryChip
              active={activeMood === null}
              onClick={() => setActiveMood(null)}
            >
              All
            </CategoryChip>

            {MOOD_FILTERS.map((mood) => (
              <CategoryChip
                key={mood}
                active={activeMood === mood}
                onClick={() =>
                  setActiveMood(
                    activeMood === mood
                      ? null
                      : mood,
                  )
                }
              >
                {mood}
              </CategoryChip>
            ))}
          </div>
        </div>

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

        <section className="container-edge">
          <h2 className="mb-4 text-title-md text-on-surface">
            Anniversaries
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {ANNIVERSARY_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                className="group relative aspect-square overflow-hidden rounded-card bg-surface"
                aria-label={`Anniversary memories from ${year}`}
              >
                <img
                  src={img(`anniv-${year}`, 400, 400)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-display-lg font-extrabold text-on-surface transition-colors group-hover:bg-black/20">
                  {year}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}