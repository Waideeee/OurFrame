import { Check, Info, Play, Plus } from 'lucide-react';
import { useMemories } from '@/app/providers';
import { HeroBanner, MediaRow } from '@/components/media';


export function VideosPage() {
  const { getMemory, continueWatching, memoriesByType, openMemory, toggleCollection } = useMemories();
  const videos = memoriesByType('video');
  const hero = getMemory('m-santorini') ?? videos[0];
  const travel = videos.filter((m) => m.category === 'Travel');
  const dateNights = videos.filter((m) => m.category === 'Dates' || m.category === 'Daily Life');

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
