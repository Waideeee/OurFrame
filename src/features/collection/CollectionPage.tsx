import { useState } from 'react';
import { ListPlus, Play } from 'lucide-react';
import type { MemoryCategory } from '@/types';
import { GENRE_FILTERS } from '@/lib/constants';
import {
  getMemory,
  collections,
  collectionTypes,
  recentMemories,
} from '@/data';
import { HeroBanner, MediaRow, FeaturedGrid } from '@/components/media';
import { CategoryChip } from '@/components/ui';

export function CollectionPage() {
  const [filter, setFilter] = useState<MemoryCategory | null>(null);
  const hero = getMemory('m-european-summer')!;

  const highlights = collections
    .filter((c) => (filter ? c.category === filter : true))
    .map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      imageUrl: c.coverUrl,
      type: 'collection' as const,
      category: c.category,
      date: `${c.year ?? '2024'}-01-01`,
      hearts: 5,
      featured: c.id === 'c-italy',
    }));

  return (
    <>
      <HeroBanner
        memory={hero}
        actions={[
          { label: 'Play All', icon: <Play size={18} className="fill-canvas" />, variant: 'primary' },
          { label: 'Add to List', icon: <ListPlus size={18} />, variant: 'secondary' },
        ]}
      />

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        <div className="container-edge flex flex-wrap gap-2">
          <CategoryChip active={filter === null} onClick={() => setFilter(null)}>
            All
          </CategoryChip>
          {GENRE_FILTERS.map((genre) => (
            <CategoryChip
              key={genre}
              active={filter === genre}
              onClick={() => setFilter((f) => (f === genre ? null : genre))}
            >
              {genre}
            </CategoryChip>
          ))}
        </div>

        {/* Collections by Type. */}
        <section className="container-edge">
          <h2 className="mb-4 text-title-md text-on-surface">Collections by Type</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {collectionTypes.map((type) => (
              <button
                key={type.category}
                type="button"
                className="group relative h-40 overflow-hidden rounded-card bg-surface text-left"
              >
                <img
                  src={type.coverUrl}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-title-md text-on-surface">{type.category}</span>
                  <span className="text-label-sm text-metadata">
                    {type.albumCount} albums · {type.itemCount} items
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <MediaRow title="Recent Albums" memories={recentMemories.slice(0, 8)} onViewAll={() => {}} />

        <FeaturedGrid title="Archive Highlights" memories={highlights} />
      </div>
    </>
  );
}
