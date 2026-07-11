import { useState } from 'react';
import { ListPlus, Play } from 'lucide-react';
import type { MemoryCategory } from '@/types';
import { GENRE_FILTERS } from '@/lib/constants';

import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow,} from '@/components/media';
import { CategoryChip } from '@/components/ui';

export function CollectionPage() {
  const [filter, setFilter] = useState<MemoryCategory | null>(null);
  const { getMemory, recentMemories, openMemory } = useMemories();
  const hero = getMemory('m-european-summer') ?? recentMemories[0];

  

  return (
    <>
      {hero ? (
      <HeroBanner
        memory={hero}
        actions={[
          { label: 'Play All', icon: <Play size={18} className="fill-canvas" />, variant: 'primary' },
          { label: 'Add to List', icon: <ListPlus size={18} />, variant: 'secondary' },
        ]}
      />
      ) : null}

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
           
          </div>
        </section>

        <MediaRow
          title="Recent Albums"
          memories={recentMemories.slice(0, 8)}
          onViewAll={() => {}}
          onSelect={openMemory}
        />

       
      </div>
    </>
  );
}
