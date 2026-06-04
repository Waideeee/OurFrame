import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TimelineGroup } from '@/types';
import { recentMemories } from '@/data';
import { Timeline } from '@/components/common';

export function RecentlyAddedPage() {
  const navigate = useNavigate();

  // Bucket the most recent memories into relative-time groups.
  const groups: TimelineGroup[] = [
    { id: 'weekend', label: 'This Weekend', memories: recentMemories.slice(0, 2) },
    { id: 'last-week', label: 'Last Week', memories: recentMemories.slice(2, 5) },
    { id: 'earlier', label: 'Earlier This Month', memories: recentMemories.slice(5, 10) },
  ].filter((g) => g.memories.length > 0);

  return (
    <div className="pb-24 pt-24">
      <header className="container-edge mb-10">
        <h1 className="text-headline-mobile text-on-surface md:text-headline-lg">Recently Added</h1>
        <p className="mt-2 max-w-2xl text-body-md text-metadata">
          Everything you&apos;ve archived lately, newest first — a running reel of the moments still
          warm from the making.
        </p>
      </header>

      <Timeline groups={groups} />

      {/* Floating add FAB. */}
      <button
        type="button"
        onClick={() => navigate('/upload')}
        aria-label="Add a new memory"
        className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
