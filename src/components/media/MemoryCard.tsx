import { motion } from 'framer-motion';
import { Heart, MapPin, Play, User } from 'lucide-react';
import type { Memory } from '@/types';
import { cn, formatDate, formatDuration } from '@/lib/utils';
import { Badge } from '@/components/ui';

interface MemoryCardProps {
  memory: Memory;
  /** Fixed width helps horizontal rows keep a consistent rhythm. */
  className?: string;
  /** Renders a continue-watching progress bar when the memory has progress. */
  showProgress?: boolean;
  onSelect?: (memory: Memory) => void;
}

function HeartRating({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} of 5 hearts`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Heart
          key={i}
          size={12}
          className={i < value ? 'fill-primary text-primary' : 'text-white/30'}
        />
      ))}
    </span>
  );
}

/**
 * 16:9 media tile. On hover it scales to 1.1 (the "luminance + scale" depth
 * model) and reveals a metadata overlay via Framer Motion.
 */
export function MemoryCard({ memory, className, showProgress = false, onSelect }: MemoryCardProps) {
  const isVideo = memory.type === 'video';
  const progressPct = Math.round((memory.progress ?? 0) * 100);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(memory)}
      whileHover="hover"
      initial="rest"
      animate="rest"
      variants={{
        rest: { scale: 1, zIndex: 0 },
        hover: { scale: 1.1, zIndex: 20 },
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative aspect-video w-64 shrink-0 overflow-hidden rounded-card bg-surface text-left',
        'origin-center will-change-transform',
        'ring-0 hover:shadow-glow focus-visible:shadow-glow',
        className,
      )}
      aria-label={`${memory.title}${memory.location ? `, ${memory.location}` : ''}`}
    >
      <img
        src={memory.imageUrl}
        alt={memory.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />

      {memory.featured ? (
        <Badge className="absolute left-2 top-2" tone="featured">
          Featured
        </Badge>
      ) : null}

      {isVideo && memory.durationSeconds ? (
        <Badge className="absolute right-2 top-2" tone="neutral">
          {formatDuration(memory.durationSeconds)}
        </Badge>
      ) : null}

      {/* Hover metadata overlay. */}
      <motion.div
        variants={{
          rest: { opacity: 0, y: 8 },
          hover: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3"
      >
        <p className="truncate text-title-md text-on-surface">{memory.title}</p>
        <div className="mt-1 flex items-center gap-2 text-label-sm text-metadata">
          <span>{formatDate(memory.date)}</span>
          {memory.location ? (
            <span className="flex items-center gap-0.5 truncate">
              <MapPin size={11} /> {memory.location}
            </span>
          ) : null}
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <HeartRating value={memory.hearts} />
          {memory.uploadedBy ? (
            <span className="flex items-center gap-1 truncate text-label-sm text-metadata">
              <User size={11} /> {memory.uploadedBy}
            </span>
          ) : null}
        </div>
      </motion.div>

      {isVideo ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 p-3 text-canvas">
            <Play size={20} className="fill-canvas" />
          </span>
        </span>
      ) : null}

      {showProgress && memory.progress !== undefined ? (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
          <span className="block h-full bg-primary" style={{ width: `${progressPct}%` }} />
        </span>
      ) : null}
    </motion.button>
  );
}
