import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Archive,
  ArchiveRestore,
  Check,
  Heart,
  Info,
  MapPin,
  Pencil,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type { MediaItem, Memory } from '@/types';
import { useMemories } from '@/app/providers/memory-context';
import { useProfile } from '@/app/providers/profile-context';
import { cn, detectMediaType, formatDate, formatDuration } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';

/** A circular, outlined Netflix-style action button. */
function CircleAction({
  active = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-white/40 bg-black/40 text-on-surface hover:border-white hover:bg-white/10',
      )}
    >
      {children}
    </button>
  );
}

/** Episode-style row for memories with multiple media files. */
function MediaEpisode({
  item,
  index,
  onPlay,
}: {
  item: MediaItem;
  index: number;
  onPlay: (item: MediaItem) => void;
}) {
  const autoLabel = `${item.type === 'video' ? 'Video' : 'Photo'} ${index + 1}`;
  return (
    <button
      type="button"
      onClick={() => onPlay(item)}
      className="group flex w-full items-center gap-4 rounded-card border-b border-outline-variant/30 px-2 py-3 text-left transition-colors hover:bg-surface-high/60"
    >
      <span className="w-5 shrink-0 text-center text-title-md text-metadata">{index + 1}</span>
      <span className="relative h-[90px] w-[160px] shrink-0 overflow-hidden rounded-card bg-surface">
        <img src={item.url} alt={autoLabel} loading="lazy" className="h-full w-full object-cover" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play size={22} className="fill-white text-white" />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-md font-semibold text-on-surface">
          {item.caption ? item.caption : autoLabel}
        </span>
        <span className="mt-1 block line-clamp-2 text-label-sm text-metadata">
          {item.caption ? autoLabel : 'Tap to open this moment full-screen.'}
        </span>
      </span>
    </button>
  );
}

export function MemoryDetailModal() {
  const {
    activeMemory,
    getMemory,
    closeMemory,
    toggleLike,
    toggleCollection,
    toggleArchive,
    deleteMemory,
  } = useMemories();
  const { activeProfile } = useProfile();
  const navigate = useNavigate();
  const [fullView, setFullView] = useState<MediaItem | 'main' | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Prefer the live copy from the store so toggles reflect immediately, but
  // fall back to the passed object (e.g. synthetic collection tiles).
  const memory: Memory | null = activeMemory
    ? getMemory(activeMemory.id) ?? activeMemory
    : null;

  // Lock background scroll and wire Escape-to-close while the modal is open.
  useEffect(() => {
    if (!memory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullView) setFullView(null);
        else closeMemory();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [memory, fullView, closeMemory]);

  // Reset transient state whenever the open memory changes.
  useEffect(() => {
    setFullView(null);
    setConfirmingDelete(false);
  }, [activeMemory]);

  const isVideo = memory?.type === 'video';
  const hasMediaItems = (memory?.mediaItems?.length ?? 0) > 0;
  const uploader = memory?.uploadedBy ?? activeProfile?.name ?? 'You';
  // Edit/delete only apply to real, stored memories (not synthetic collection tiles).
  const isStored = !!(activeMemory && getMemory(activeMemory.id));

  const openFull = (target: MediaItem | 'main') => setFullView(target);

  const handleEdit = () => {
    if (!memory) return;
    closeMemory();
    navigate(`/memories/edit/${memory.id}`);
  };

  const handleDelete = () => {
    if (!memory) return;
    // Close the modal first and defer the actual removal until the exit
    // animation finishes (see onExitComplete). Mutating the list while the
    // modal is still animating out orphans its node, leaving a dead overlay.
    setPendingDeleteId(memory.id);
    closeMemory();
  };

  const handleExitComplete = () => {
    if (pendingDeleteId) {
      deleteMemory(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {memory ? (
        <motion.div
          key="memory-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeMemory}
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={memory.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-4 w-full max-w-4xl overflow-hidden rounded-card bg-[#141414] shadow-card-hover"
          >
            {/* Close */}
            <button
              type="button"
              onClick={closeMemory}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-on-surface transition-colors hover:bg-black"
            >
              <X size={20} />
            </button>

            {/* Top media */}
            <div className="relative aspect-video w-full overflow-hidden bg-surface">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />

              {isVideo && memory.durationSeconds ? (
                <Badge className="absolute left-4 top-4" tone="neutral">
                  {formatDuration(memory.durationSeconds)}
                </Badge>
              ) : null}

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 sm:p-6">
                <h2 className="text-headline-mobile text-on-surface md:text-headline-lg">
                  {memory.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    leadingIcon={<Play size={18} className="fill-canvas" />}
                    onClick={() => openFull('main')}
                  >
                    {isVideo ? 'Play' : 'View'}
                  </Button>

                  <CircleAction
                    label={memory.liked ? 'Remove like' : 'Like'}
                    active={!!memory.liked}
                    onClick={() => toggleLike(memory.id)}
                  >
                    <Heart size={18} className={memory.liked ? 'fill-white' : ''} />
                  </CircleAction>

                  <CircleAction
                    label={memory.inCollection ? 'Remove from collection' : 'Add to collection'}
                    active={!!memory.inCollection}
                    onClick={() => toggleCollection(memory.id)}
                  >
                    {memory.inCollection ? <Check size={18} /> : <Plus size={18} />}
                  </CircleAction>

                  {memory.description ? (
                    <CircleAction label="Info" onClick={() => openFull('main')}>
                      <Info size={18} />
                    </CircleAction>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-6 bg-[#141414] p-4 sm:p-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="text-label-sm text-metadata">{formatDate(memory.date)}</span>
                  {memory.location ? (
                    <span className="flex items-center gap-1 text-label-sm text-metadata">
                      <MapPin size={12} /> {memory.location}
                    </span>
                  ) : null}
                  {memory.mood ? (
                    <span className="text-label-sm text-metadata">{memory.mood}</span>
                  ) : null}
                  <Badge tone="featured">{memory.category}</Badge>
                  {memory.archived ? (
                    <Badge tone="brand">Archived</Badge>
                  ) : null}
                </div>

                <p className="text-body-md text-on-surface">{memory.description}</p>

                {/* Manage actions — archive toggle plus edit/delete for stored memories. */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button
                    variant={memory.archived ? 'secondary' : 'icon'}
                    size="md"
                    leadingIcon={
                      memory.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />
                    }
                    onClick={() => toggleArchive(memory.id)}
                    className={cn(
                      'aspect-auto rounded-card px-4 py-2 text-label-sm',
                    )}
                  >
                    {memory.archived ? 'Remove from Archive' : 'Add to Archive'}
                  </Button>

                  {isStored ? (
                    confirmingDelete ? (
                      <span className="flex items-center gap-2 rounded-card bg-surface-high px-3 py-1.5">
                        <span className="text-label-sm text-metadata">Delete this memory?</span>
                        <button
                          type="button"
                          onClick={handleDelete}
                          aria-label="Confirm delete"
                          title="Confirm delete"
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(false)}
                          aria-label="Cancel delete"
                          title="Cancel"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-on-surface transition-colors hover:border-white hover:bg-white/10"
                        >
                          <X size={18} />
                        </button>
                      </span>
                    ) : (
                      <>
                        <CircleAction label="Edit memory" onClick={handleEdit}>
                          <Pencil size={18} />
                        </CircleAction>
                        <CircleAction label="Delete memory" onClick={() => setConfirmingDelete(true)}>
                          <Trash2 size={18} />
                        </CircleAction>
                      </>
                    )
                  ) : null}
                </div>
              </div>

              <dl className="space-y-2 text-body-md md:border-l md:border-outline-variant/40 md:pl-6">
                <div>
                  <dt className="inline text-metadata">Uploaded by: </dt>
                  <dd className="inline text-on-surface">{uploader}</dd>
                </div>
                <div>
                  <dt className="inline text-metadata">Mood: </dt>
                  <dd className="inline text-on-surface">{memory.mood ?? '—'}</dd>
                </div>
                <div>
                  <dt className="inline text-metadata">Category: </dt>
                  <dd className="inline text-on-surface">{memory.category}</dd>
                </div>
              </dl>
            </div>

            {/* Episode-style media list */}
            {hasMediaItems ? (
              <div className="bg-[#141414] px-4 pb-6 sm:px-6">
                <h3 className="mb-2 text-title-md text-on-surface">
                  In this memory
                  <span className="ml-2 text-label-sm text-metadata">
                    {memory.mediaItems!.length} items
                  </span>
                </h3>
                <div>
                  {memory.mediaItems!.map((item, i) => (
                    <MediaEpisode key={item.id} item={item} index={i} onPlay={openFull} />
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>

          {/* Full-screen media viewer */}
          <AnimatePresence>
            {fullView ? (
              <motion.div
                key="full-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setFullView(null);
                }}
                className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4"
              >
                <button
                  type="button"
                  aria-label="Close full view"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullView(null);
                  }}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-on-surface hover:bg-black"
                >
                  <X size={22} />
                </button>
                {(() => {
                  const item = fullView === 'main' ? null : fullView;
                  const url = item ? item.url : memory.imageUrl;
                  const playable = item
                    ? item.type === 'video'
                    : isVideo && detectMediaType(memory.imageUrl) === 'video';
                  return playable ? (
                    <video
                      src={url}
                      controls
                      autoPlay
                      onClick={(e) => e.stopPropagation()}
                      className="max-h-[90vh] max-w-[95vw] rounded-card"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={memory.title}
                      onClick={(e) => e.stopPropagation()}
                      className="max-h-[90vh] max-w-[95vw] rounded-card object-contain"
                    />
                  );
                })()}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
