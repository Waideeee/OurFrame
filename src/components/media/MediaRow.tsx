import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Memory } from '@/types';
import { MemoryCard } from './MemoryCard';

interface MediaRowProps {
  title: string;
  memories: Memory[];
  showProgress?: boolean;
  /** Optional "VIEW ALL" affordance on the right of the header. */
  onViewAll?: () => void;
  onSelect?: (memory: Memory) => void;
}

/**
 * A horizontally-scrollable row that bleeds off the right edge to signal more
 * content. Arrow controls appear on hover for pointer users; the row stays
 * swipe/scroll friendly on touch.
 */
export function MediaRow({ title, memories, showProgress, onViewAll, onSelect }: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (memories.length === 0) return null;

  return (
    <section className="group/row relative">
      <div className="container-edge mb-3 flex items-baseline justify-between">
        <h2 className="text-title-md text-on-surface">{title}</h2>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-label-sm font-semibold uppercase tracking-wide text-metadata transition-colors hover:text-on-surface"
          >
            View all
          </button>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-0 z-30 hidden h-full w-[4%] items-center justify-center bg-gradient-to-r from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronLeft className="text-on-surface" />
        </button>

        <div
          ref={scrollerRef}
          className="scrollbar-none flex gap-3 overflow-x-auto scroll-smooth px-edge pb-2 pt-6"
        >
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              showProgress={showProgress}
              onSelect={onSelect}
            />
          ))}
          {/* Spacer keeps the last card off the hard right edge. */}
          <span aria-hidden className="w-[1px] shrink-0" />
        </div>

        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-0 z-30 hidden h-full w-[4%] items-center justify-center bg-gradient-to-l from-black/80 to-transparent opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
        >
          <ChevronRight className="text-on-surface" />
        </button>
      </div>
    </section>
  );
}
