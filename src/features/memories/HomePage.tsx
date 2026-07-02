import { useState } from 'react';
import type { MemoryCategory } from '@/types';
import { GENRE_FILTERS } from '@/lib/constants';
import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow, FeaturedGrid } from '@/components/media';
import { CategoryChip } from '@/components/ui';
import {Check, Info ,Play ,Plus ,} from 'lucide-react';

export function HomePage() {
  const [activeGenre, setActiveGenre] = useState<MemoryCategory | null>(null);
  const { memoriesByCategory, recentMemories, memories, openMemory,toggleCollection } = useMemories();
  
  const hero = memories.find((m) => m.featured) ?? recentMemories[0];
  const firstDate = memoriesByCategory('Dates');
  const occasions = memoriesByCategory('Occasions');
  const bigTrip = memoriesByCategory('Travel');
  

  return (
    <>
     {hero ? (
  <HeroBanner
    memory={hero}
    actions={[
      {
        label: 'Play',
        icon: <Play size={18} className="fill-canvas" />,
        variant: 'primary',
        onClick: () => {
          openMemory(hero);
        },
      },
      {
        label: hero.inCollection ? 'In Collection' : 'Collection',
        icon: hero.inCollection ? <Check size={18} /> : <Plus size={18} />,
        variant: 'secondary',
        onClick: () => {
          toggleCollection(hero.memoryId);
        },
      },
      {
        label: '',
        icon: <Info size={18} />,
        variant: 'icon',
        ariaLabel: 'More information',
        onClick: () => {
          openMemory(hero);
        },
      },
    ]}
  />
) : null}

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        <MediaRow title="First Date" memories={firstDate} onSelect={openMemory} />
        <MediaRow title="1st Monthsary" memories={occasions} onSelect={openMemory} />

        <FeaturedGrid title="3rd Monthsary — Our Big Trip" memories={bigTrip} onSelect={openMemory} />

        <MediaRow title="Occasions" memories={memoriesByCategory('Holidays')} onSelect={openMemory} />
        <MediaRow title="Recently Added" memories={recentMemories} onSelect={openMemory} />
      </div>

      {/* Floating GENRES filter bar near the bottom of the viewport. */}
      <div className="pointer-events-none sticky bottom-6 z-40 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-md">
          <span className="px-2 text-label-sm font-semibold uppercase tracking-widest text-metadata">
            Genres
          </span>
          {GENRE_FILTERS.map((genre) => (
            <CategoryChip
              key={genre}
              active={activeGenre === genre}
              onClick={() => setActiveGenre((g) => (g === genre ? null : genre))}
            >
              {genre}
            </CategoryChip>
          ))}
        </div>
      </div>
    </>
  );
}
