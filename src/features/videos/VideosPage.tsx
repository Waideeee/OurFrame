import { Play, Plus } from 'lucide-react';
import { getMemory, continueWatching, memoriesByType } from '@/data';
import { HeroBanner, MediaRow } from '@/components/media';

export function VideosPage() {
  const hero = getMemory('m-santorini')!;
  const videos = memoriesByType('video');
  const travel = videos.filter((m) => m.category === 'Travel');
  const dateNights = videos.filter((m) => m.category === 'Dates' || m.category === 'Daily Life');

  return (
    <>
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

      <div className="relative z-10 -mt-16 flex flex-col gap-row-gap pb-20">
        <MediaRow title="Pick Up Where You Left Off" memories={continueWatching} showProgress />
        <MediaRow title="Travel Destinations" memories={travel} />
        <MediaRow title="Date Nights & Dinners" memories={dateNights} />
      </div>
    </>
  );
}
