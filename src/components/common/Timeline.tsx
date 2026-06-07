import { motion } from 'framer-motion';
import { Heart, MapPin, User } from 'lucide-react';
import type { TimelineGroup, Memory } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';

interface TimelineProps {
  groups: TimelineGroup[];
  onSelect?: (memory: Memory) => void;
}

function TimelineItem({
  memory,
  large,
  onSelect,
}: {
  memory: Memory;
  large: boolean;
  onSelect?: (memory: Memory) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(memory)}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group flex w-full gap-4 text-left"
    >
      <img
        src={memory.imageUrl}
        alt={memory.title}
        loading="lazy"
        className={`shrink-0 rounded-card object-cover transition-transform group-hover:scale-[1.02] ${
          large ? 'h-40 w-72' : 'h-20 w-32'
        }`}
      />
      <div className="min-w-0 flex-1 border-b border-outline-variant/40 pb-4">
        <div className="flex items-center gap-2">
          <p className="truncate text-title-md text-on-surface">{memory.title}</p>
          {memory.featured ? <Badge>Featured</Badge> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-label-sm text-metadata">
          <span>{formatDate(memory.date)}</span>
          {memory.location ? (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {memory.location}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <Heart size={12} className="fill-primary text-primary" /> {memory.hearts}
          </span>
          {memory.uploadedBy ? (
            <span className="flex items-center gap-1">
              <User size={12} /> {memory.uploadedBy}
            </span>
          ) : null}
        </div>
        {large ? (
          <p className="mt-2 line-clamp-2 text-body-md text-metadata">{memory.description}</p>
        ) : null}
      </div>
    </motion.button>
  );
}

/** Vertical timeline with dot markers, grouped by recency. */
export function Timeline({ groups, onSelect }: TimelineProps) {
  return (
    <div className="container-edge">
      {groups.map((group) => (
        <section key={group.id} className="mb-12">
          <h2 className="mb-6 text-label-sm font-semibold uppercase tracking-widest text-primary-accent">
            {group.label}
          </h2>
          <div className="relative space-y-6 pl-6">
            {/* The vertical spine. */}
            <span
              aria-hidden
              className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-outline-variant/50"
            />
            {group.memories.map((memory, idx) => (
              <div key={memory.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-6 top-2 h-3 w-3 rounded-full border-2 border-primary bg-background"
                />
                <TimelineItem memory={memory} large={idx === 0} onSelect={onSelect} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
