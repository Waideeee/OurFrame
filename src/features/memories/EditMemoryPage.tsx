import { useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Save,
  Star,
  Trash2,
} from 'lucide-react';

import type {
  MemoryCategory,
  Mood,
} from '@/types';

import {
  UPLOAD_CATEGORIES,
  UPLOAD_MOODS,
} from '@/lib/constants';

import { useMemories, useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';
import { useUpload } from '@/hooks/useUpload';
import { UploadOverlay } from '@/components/upload';
  

export function EditMemoryPage() {
  const navigate = useNavigate();
const { id = '' } = useParams();

const { activeProfile } = useProfile();

const {
  getMemory,
  updateMemory,
  deleteMemory,
} = useMemories();

const memory = getMemory(id);

const mediaRef = useRef<HTMLInputElement>(null);
const coverRef = useRef<HTMLInputElement>(null);

if (!memory) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <p className="text-body-md text-metadata">
        That memory could not be found.
      </p>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-label-sm font-semibold uppercase tracking-widest text-on-surface"
      >
        Back home
      </button>
    </div>
  );
}

const categoryOptions = Array.from(
  new Set([
    ...(memory.category ? [memory.category] : []),
    ...UPLOAD_CATEGORIES,
  ]),
);

const moodOptions = Array.from(
  new Set([
    ...(memory.mood ? [memory.mood] : []),
    ...UPLOAD_MOODS,
  ]),
);

const [title, setTitle] = useState(memory.title);
const [date, setDate] = useState(memory.date);
const [location, setLocation] = useState(memory.location ?? '');
const [category, setCategory] =
  useState<MemoryCategory | ''>(memory.category);

const [mood, setMood] =
  useState<Mood | ''>(memory.mood ?? '');

const [story, setStory] =
  useState(memory.description);

const [isFeatured, setIsFeatured] =
  useState(memory.featured);

const [mediaUrl, setMediaUrl] =
  useState(memory.mediaUrl);

const [coverUrl, setCoverUrl] =
  useState(memory.coverPhoto ?? memory.mediaUrl);

const [error, setError] =
  useState<string | null>(null);

const [confirmingDelete, setConfirmingDelete] =
  useState(false);

const [isSubmitting, setIsSubmitting] =
  useState(false);

const {
  uploadFile: upload,
  progress,
  status,
  isUploading,
  begin,
  finish,
  reset,
  setStatus,
} = useUpload();

const handleMediaReplace = async (
  file?: File,
) => {
  if (!file) return;

  try {
    setError(null);

    begin();

    setStatus(
      memory.type === 'video'
        ? 'Uploading video...'
        : 'Uploading photo...',
    );

    const uploaded = await upload(
      file,
      0,
      95,
    );

    finish();

    await new Promise(resolve =>
      setTimeout(resolve, 500),
    );

    setMediaUrl(uploaded);

    if (memory.type === 'photo') {
      setCoverUrl(uploaded);
    }

    reset();
  } catch (err) {
    reset();

    setError(
      err instanceof Error
        ? err.message
        : 'Failed to upload media',
    );
  }
};

const handleReplaceCover = async (
  file?: File,
) => {
  if (!file) return;

  try {
    setError(null);

    begin();

    setStatus('Uploading cover...');

    const uploaded = await upload(
      file,
      0,
      95,
    );

    finish();

    await new Promise(resolve =>
      setTimeout(resolve, 500),
    );

    setCoverUrl(uploaded);

    reset();
  } catch (err) {
    reset();

    setError(
      err instanceof Error
        ? err.message
        : 'Failed to upload cover',
    );
  }
};

const handleSave = async (
  e: FormEvent,
) => {
  e.preventDefault();

  try {
    setError(null);
    setIsSubmitting(true);

    await updateMemory(
      memory.memoryId,
      {
        title: title.trim(),
        description: story.trim(),
        mediaUrl,
        coverPhoto:
          memory.type === 'video'
            ? coverUrl
            : undefined,
        category:
          (category ||
            memory.category) as MemoryCategory,
        mood: mood || undefined,
        date,
        location:
          location.trim() || undefined,
        featured: isFeatured,
      },
    );

    navigate(-1);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Something went wrong',
    );
  } finally {
    setIsSubmitting(false);
  }
};
  
 


  const handleDelete = async () => {
  try {
    if (!activeProfile) return;

    await deleteMemory(memory.memoryId);

    navigate('/');
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Failed to delete memory',
    );
  }
};

  return (
    <div className="pb-24 pt-24">
      <header className="container-edge mb-10">
        <h1 className="text-headline-mobile text-on-surface md:text-headline-lg">Edit Memory</h1>
        <p className="mt-2 max-w-2xl text-body-md text-metadata">
          Update the details of your memory, manage its media, or remove it from the archive for
          good.
        </p>
      </header>

      <div className="container-edge grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        {/* Cover + existing media */}
        <div className="flex flex-col gap-5">

          {/* Cover (Video only) */}
          {memory.type === 'video' && (
            <div className="flex flex-col gap-2">
              <span className="text-label-sm font-medium text-metadata">
                Video Cover
              </span>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => coverRef.current?.click()}
                className="group relative aspect-video w-full overflow-hidden rounded-card bg-surface"
              >
                <img
                  src={coverUrl}
                  alt={`${title} cover`}
                  className="h-full w-full object-cover"
                />

                <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera
                    size={28}
                    className="text-white"
                  />

                  <span className="text-label-sm text-white">
                    {isUploading
                      ? 'Uploading...'
                      : 'Replace Cover'}
                  </span>
                </span>
              </button>

              <input
                ref={coverRef}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleReplaceCover(
                    e.target.files?.[0],
                  )
                }
              />

              <p className="text-xs text-metadata">
                This thumbnail is shown before the
                video plays.
              </p>
            </div>
          )}

          {/* Original Media */}
          <div className="flex flex-col gap-3">

            <p className="text-label-sm font-medium text-metadata">
              Memory Media
            </p>

            <div className="rounded-card bg-surface-high p-3">

              <div className="flex gap-3">

                <div className="relative h-[80px] w-[140px] overflow-hidden rounded-card bg-surface">

                  <img
                    src={mediaUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-2 top-2 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    {memory.type}
                  </span>

                </div>

                <div className="flex flex-1 flex-col justify-between">

                  <div>

                    <h3 className="text-body-md font-semibold text-on-surface">
                      {memory.type === 'video'
                        ? 'Original Video'
                        : 'Original Photo'}
                    </h3>

                    <p className="my-1 text-xs text-metadata">
                      Upload a new photo or video while preserving the title, story, reactions, comments, and other memory details.
                    </p>

                  </div>

                  <Button
                    type="button"
                    className="mt-1"
                    size="sm"
                    variant="secondary"
                    leadingIcon={<Camera size={16} />}
                    disabled={isUploading}
                    onClick={() =>
                      mediaRef.current?.click()
                    }
                  >
                    Replace {memory.type}
                  </Button>

                </div>

              </div>

            </div>

            <input
              ref={mediaRef}
              hidden
              type="file"
              accept={
                memory.type === 'video'
                  ? 'video/*'
                  : 'image/*'
              }
              onChange={(e) =>
                handleMediaReplace(
                  e.target.files?.[0],
                )
              }
            />

          </div>

        </div>

                {/* Details form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <h2 className="text-title-md text-on-surface">
            Production Details
          </h2>

          <Input
            label="Memory Title"
            placeholder="Give it a headline"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            label="Release Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-on-surface [color-scheme:dark]"
          />

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-label-sm font-medium text-metadata"
            >
              Location
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-metadata"
              />

              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where did this happen?"
                className="h-12 w-full rounded-card border border-transparent bg-surface-high pl-11 pr-4 text-body-md text-on-surface placeholder:text-metadata/70 focus:border-outline focus:bg-surface-container focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="category"
              className="text-label-sm font-medium text-metadata"
            >
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as MemoryCategory)
              }
              className="h-12 rounded-card border border-transparent bg-surface-high px-4 text-body-md text-on-surface focus:border-outline focus:outline-none"
            >
              <option value="" disabled>
                Choose a category
              </option>

              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="mood"
              className="text-label-sm font-medium text-metadata"
            >
              Mood
            </label>

            <select
              id="mood"
              value={mood}
              onChange={(e) =>
                setMood(e.target.value as Mood)
              }
              className="h-12 rounded-card border border-transparent bg-surface-high px-4 text-body-md text-on-surface focus:border-outline focus:outline-none"
            >
              <option value="">No mood</option>

              {moodOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Story */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="story"
              className="text-label-sm font-medium text-metadata"
            >
              The Story
            </label>

            <textarea
              id="story"
              rows={5}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What happened? Where were you? What do you want to remember?"
              className="resize-none rounded-card border border-transparent bg-surface-high px-4 py-3 text-body-md text-on-surface placeholder:text-metadata/70 focus:border-outline focus:outline-none"
            />
          </div>

          {/* Featured */}
          <label
            htmlFor="featured"
            className="flex cursor-pointer items-center justify-between gap-4 rounded-card bg-surface-high px-4 py-3"
          >
            <span className="flex items-center gap-2 text-body-md text-on-surface">
              <Star
                size={18}
                className={
                  isFeatured
                    ? 'fill-primary text-primary'
                    : 'text-metadata'
                }
              />

              Feature this memory on the homepage?
            </span>

            <button
              type="button"
              id="featured"
              role="switch"
              aria-checked={isFeatured}
              onClick={() => setIsFeatured((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isFeatured ? 'bg-primary' : 'bg-surface'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-200 ${
                  isFeatured
                    ? 'right-0.5'
                    : 'left-0.5'
                }`}
              />
            </button>
          </label>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="brand"
            size="lg"
            fullWidth
            leadingIcon={<Save size={18} />}
            disabled={
              isSubmitting ||
              isUploading
            }
          >
            {isSubmitting
              ? 'Saving...'
              : 'Save Changes'}
          </Button>

          {confirmingDelete ? (
            <div className="flex items-center justify-between gap-3 rounded-card border border-primary/60 bg-primary/10 px-4 py-3">
              <span className="text-body-md text-on-surface">
                Delete this memory permanently?
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-card bg-primary px-4 py-2 text-label-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  Delete
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirmingDelete(false)
                  }
                  className="px-2 text-label-sm font-semibold text-metadata transition-colors hover:text-on-surface"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setConfirmingDelete(true)
              }
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-card border border-primary px-6 text-body-md font-semibold text-primary transition duration-200 ease-cinematic hover:bg-primary/10 active:scale-95"
            >
              <Trash2 size={18} />
              Delete Memory
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-center text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors hover:text-on-surface"
          >
            Cancel
          </button>
        </form>
      </div>
      <UploadOverlay
        open={isUploading}
        progress={progress}
        status={status}
      />
    </div>
  );
}
