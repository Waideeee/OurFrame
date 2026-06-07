import { Play, Plus } from 'lucide-react';
import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow } from '@/components/media';

export function VideosPage() {
  const { getMemory, continueWatching, memoriesByType, openMemory } = useMemories();
  const videos = memoriesByType('video');
  const hero = getMemory('m-santorini') ?? videos[0];
  const travel = videos.filter((m) => m.category === 'Travel');
  const dateNights = videos.filter((m) => m.category === 'Dates' || m.category === 'Daily Life');

  return (
    <>
      {hero ? (
      <HeroBanner
        memory={hero}
        badgeLabel="Featured Memory"
        showDate
        actions={[
          { label: 'Play', icon: <Play size={18} className="fill-canvas" />, variant: 'primary' },
          { label: 'My List', icon: <Plus size={18} />, variant: 'secondary' },
          {
            label: '',
            icon: (
              <span className="flex h-4 w-4 items-center justify-center font-serif text-sm font-bold leading-none">
                i
              </span>
            ),
            variant: 'icon',
            ariaLabel: 'More information',
            className: 'p-1.5',
          },
        ]}
      />
      ) : null}

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        <MediaRow
          title="Pick Up Where You Left Off"
          memories={continueWatching}
          showProgress
          onSelect={openMemory}
        />
        <MediaRow title="Travel Destinations" memories={travel} onSelect={openMemory} />
        <MediaRow title="Date Nights & Dinners" memories={dateNights} onSelect={openMemory} />
      </div>
    </>
  );
}
