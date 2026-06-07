import { Archive, Heart, ListPlus } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Memory } from '@/types';
import { collections } from '@/data';
import { useMemories } from '@/app/providers';
import { MediaRow, FeaturedGrid } from '@/components/media';

/** Wraps a personal list so empty lists still show their heading + a hint. */
function ListSection({
  title,
  icon,
  memories,
  emptyHint,
  onSelect,
}: {
  title: string;
  icon: ReactNode;
  memories: Memory[];
  emptyHint: string;
  onSelect: (memory: Memory) => void;
}) {
  if (memories.length > 0) {
    return <MediaRow title={title} memories={memories} onSelect={onSelect} />;
  }
  return (
    <section className="container-edge">
      <h2 className="mb-3 flex items-center gap-2 text-title-md text-on-surface">
        {icon}
        {title}
      </h2>
      <div className="rounded-card border border-dashed border-outline-variant/60 bg-surface/40 px-5 py-8 text-center text-body-md text-metadata">
        {emptyHint}
      </div>
    </section>
  );
}

export function MyListsPage() {
  const { memories, openMemory } = useMemories();

  const myList = memories.filter((m) => m.inCollection);
  const loved = memories.filter((m) => m.liked);
  const archived = memories.filter((m) => m.archived);

  // Map the curated collections into the Memory shape the grid expects so a tap
  // opens them in the same detail modal as everything else.
  const collectionTiles: Memory[] = collections.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    imageUrl: c.coverUrl,
    type: 'collection' as const,
    category: c.category,
    date: `${c.year ?? '2024'}-01-01`,
    hearts: 5,
  }));

  return (
    <div className="pb-24 pt-24">
      <header className="container-edge mb-10">
        <h1 className="text-headline-mobile text-on-surface md:text-headline-lg">My Lists</h1>
        <p className="mt-2 max-w-2xl text-body-md text-metadata">
          Everything you&apos;ve saved in one place — the memories you added to your list, the ones
          you loved, what you&apos;ve archived, and every collection.
        </p>
      </header>

      <div className="flex flex-col gap-row-gap">
        <ListSection
          title="My List"
          icon={<ListPlus size={18} className="text-primary-accent" />}
          memories={myList}
          emptyHint="Open any memory and tap ＋ Add to Collection to start your list."
          onSelect={openMemory}
        />

        <ListSection
          title="Loved"
          icon={<Heart size={18} className="fill-primary text-primary" />}
          memories={loved}
          emptyHint="Tap the heart on a memory to gather your favorites here."
          onSelect={openMemory}
        />

        <ListSection
          title="Archived"
          icon={<Archive size={18} className="text-metadata" />}
          memories={archived}
          emptyHint="Nothing archived yet. Use Add to Archive in a memory to tuck it away here."
          onSelect={openMemory}
        />

        <FeaturedGrid title="All Collections" memories={collectionTiles} onSelect={openMemory} />
      </div>
    </div>
  );
}
