import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import type { Memory } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';

interface FeaturedGridProps {
  title?: string;
  memories: Memory[];
  onSelect?: (memory: Memory) => void;
}

/**
 * Asymmetric editorial grid: the first item spans 2x2 as a "featured" tile,
 * the rest fill a 6-column mosaic. Used by Memories, Photos and Collection.
 */
export function FeaturedGrid({ title, memories, onSelect }: FeaturedGridProps) {
  if (memories.length === 0) return null;

  return (
    <section className="container-edge">
      {title ? <h2 className="mb-4 text-title-md text-on-surface">{title}</h2> : null}
      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:grid-cols-4">
        {memories.map((memory, index) => {
          const isLead = index === 0;
          return (
            <motion.button
              type="button"
              key={memory.id}
              onClick={() => onSelect?.(memory)}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'group relative overflow-hidden rounded-card bg-surface text-left',
                isLead ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1',
              )}
              aria-label={memory.title}
            >
              <img
                src={memory.imageUrl}
                alt={memory.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {memory.featured && isLead ? (
                <Badge className="absolute left-3 top-3">Featured</Badge>
              ) : null}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 opacity-90 transition-opacity group-hover:opacity-100">
                <p className={cn('truncate text-on-surface', isLead ? 'text-title-md' : 'text-body-md')}>
                  {memory.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-label-sm text-metadata">
                  <span>{formatDate(memory.date)}</span>
                  {memory.location ? (
                    <span className="flex items-center gap-0.5 truncate">
                      <MapPin size={11} /> {memory.location}
                    </span>
                  ) : null}
                  <span className="ml-auto flex items-center gap-0.5">
                    <Heart size={11} className="fill-primary text-primary" /> {memory.hearts}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
