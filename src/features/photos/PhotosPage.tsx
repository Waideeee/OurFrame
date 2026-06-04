import { useState } from 'react';
import { Heart, Images, Info } from 'lucide-react';
import type { Mood } from '@/types';
import { MOOD_FILTERS } from '@/lib/constants';
import { getMemory, memoriesByType, img } from '@/data';
import { HeroBanner, MediaRow, FeaturedGrid } from '@/components/media';
import { CategoryChip } from '@/components/ui';

const ANNIVERSARY_YEARS = ['2023', '2022', '2021', '2020', '2019', '2018'];

export function PhotosPage() {
  const [mood, setMood] = useState<Mood | 'All Captures'>('All Captures');
  const hero = getMemory('m-amalfi')!;
  const photos = memoriesByType('photo');

  const filtered =
    mood === 'All Captures' ? photos : photos.filter((m) => m.mood === mood);
  const summerVibes = photos.filter((m) => m.mood === 'Golden Hour' || m.category === 'Travel');

  return (
    <>
      <HeroBanner
        memory={hero}
        actions={[
          { label: 'Slideshow', icon: <Images size={18} />, variant: 'primary' },
          { label: 'Details', icon: <Info size={18} />, variant: 'secondary' },
          { label: '', icon: <Heart size={20} />, variant: 'icon', ariaLabel: 'Love this memory' },
        ]}
      />

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        {/* Filter by mood. */}
        <div className="container-edge">
          <p className="mb-3 text-label-sm font-semibold uppercase tracking-widest text-metadata">
            Filter by mood
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              active={mood === 'All Captures'}
              onClick={() => setMood('All Captures')}
            >
              All Captures
            </CategoryChip>
            {MOOD_FILTERS.map((m) => (
              <CategoryChip key={m} active={mood === m} onClick={() => setMood(m)}>
                {m}
              </CategoryChip>
            ))}
          </div>
        </div>

        <MediaRow title="Recent Captures" memories={filtered} />

        <FeaturedGrid title="Summer Vibes" memories={summerVibes} />

        {/* Anniversaries — year tiles. */}
        <section className="container-edge">
          <h2 className="mb-4 text-title-md text-on-surface">Anniversaries</h2>
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
