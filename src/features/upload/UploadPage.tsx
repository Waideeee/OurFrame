import { useRef, useState, type FormEvent } from 'react';
import { MapPin, Star, UploadCloud, X } from 'lucide-react';
import type { MediaItem, Memory, MemoryCategory, Mood } from '@/types';
import { UPLOAD_CATEGORIES, UPLOAD_MOODS } from '@/lib/constants';
import { detectMediaType } from '@/lib/utils';
import { useMemories, useProfile } from '@/app/providers';
import { Dropzone } from '@/components/common';
import { MediaRow } from '@/components/media';
import { Button, Input } from '@/components/ui';

/** A pending file with its preview URL, detected type, and optional caption. */
interface PendingFile {
  id: string;
  name: string;
  url: string;
  type: 'photo' | 'video';
  caption: string;
}

export function UploadPage() {
  const { addMemory, recentMemories, openMemory } = useMemories();
  const { activeProfile } = useProfile();

  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<MemoryCategory | ''>('');
  const [story, setStory] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<Mood | ''>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [files, setFiles] = useState<PendingFile[]>([]);

  const idCounter = useRef(0);
  const nextId = (prefix: string) => {
    idCounter.current += 1;
    return `${prefix}-${idCounter.current}`;
  };

  const handleFiles = (incoming: File[]) => {
    setSubmitted(false);
    const mapped: PendingFile[] = incoming.map((file) => ({
      id: nextId('upload'),
      name: file.name,
      url: URL.createObjectURL(file),
      // Auto-detect photo vs video from the file extension.
      type: detectMediaType(file.name),
      caption: '',
    }));
    setFiles(mapped);
  };

  const setCaption = (id: string, caption: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, caption } : f)));
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const mediaItems: MediaItem[] | undefined = files.length
      ? files.map((f) => ({
          id: f.id,
          url: f.url,
          type: f.type,
          caption: f.caption.trim() || undefined,
        }))
      : undefined;

    // The memory's overall media type follows its first file.
    const memoryType = files[0]?.type ?? 'photo';

    const memory: Memory = {
      id: nextId('m'),
      title: title.trim() || 'Untitled Memory',
      description: story.trim(),
      imageUrl: files[0]?.url ?? '/lizard.jpg',
      type: memoryType,
      category: (category || 'Daily Life') as MemoryCategory,
      mood: mood || undefined,
      date: date || new Date().toISOString().slice(0, 10),
      location: location.trim() || undefined,
      hearts: 0,
      featured: isFeatured,
      uploadedBy: activeProfile?.name,
      mediaItems,
    };

    addMemory(memory);
    setSubmitted(true);
  };

  return (
    <div className="pb-24 pt-24">
      <header className="container-edge mb-10">
        <h1 className="text-headline-mobile text-on-surface md:text-headline-lg">New Premiere</h1>
        <p className="mt-2 max-w-2xl text-body-md text-metadata">
          Give your latest memory a proper release. Upload, write, and post — just like that.
        </p>
      </header>

      <div className="container-edge grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Dropzone onFiles={handleFiles} showList={false} />

          {/* Per-file previews with optional captions. */}
          {files.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-label-sm font-medium text-metadata">
                {files.length} file{files.length > 1 ? 's' : ''} attached
              </p>
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex gap-3 rounded-card bg-surface-high p-3"
                >
                  <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-card bg-surface">
                    <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                    <span className="absolute left-1 top-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-surface">
                      {file.type}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-label-sm text-on-surface">
                        {file.type === 'video' ? 'Video' : 'Photo'} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        aria-label={`Remove ${file.name}`}
                        className="rounded-full p-1 text-metadata transition-colors hover:text-on-surface"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      value={file.caption}
                      onChange={(e) => setCaption(file.id, e.target.value)}
                      placeholder="Add a caption for this media (optional)"
                      className="h-9 w-full rounded-card border border-transparent bg-surface px-3 text-label-sm text-on-surface placeholder:text-metadata/70 focus:border-outline focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-title-md text-on-surface">Production Details</h2>

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
            <label htmlFor="location" className="text-label-sm font-medium text-metadata">
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

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-label-sm font-medium text-metadata">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as MemoryCategory)}
              className="h-12 rounded-card border border-transparent bg-surface-high px-4 text-body-md text-on-surface focus:border-outline focus:outline-none"
            >
              <option value="" disabled>
                Choose a category
              </option>
              {UPLOAD_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="mood" className="text-label-sm font-medium text-metadata">
              Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood)}
              className="h-12 rounded-card border border-transparent bg-surface-high px-4 text-body-md text-on-surface focus:border-outline focus:outline-none"
            >
              <option value="" disabled>
                Choose a mood
              </option>
              {UPLOAD_MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="story" className="text-label-sm font-medium text-metadata">
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

          {/* Is Featured? toggle */}
          <label
            htmlFor="featured"
            className="flex cursor-pointer items-center justify-between gap-4 rounded-card bg-surface-high px-4 py-3"
          >
            <span className="flex items-center gap-2 text-body-md text-on-surface">
              <Star size={18} className={isFeatured ? 'fill-primary text-primary' : 'text-metadata'} />
              Feature this memory on the homepage?
            </span>
            <button
              type="button"
              id="featured"
              role="switch"
              aria-checked={isFeatured}
              onClick={() => setIsFeatured((v) => !v)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                isFeatured ? 'bg-primary' : 'bg-surface'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                  isFeatured ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          <Button type="submit" variant="brand" size="lg" leadingIcon={<UploadCloud size={18} />}>
            Upload Memory
          </Button>

          {submitted ? (
            <p className="rounded-card bg-primary/10 px-4 py-3 text-body-md text-primary-accent">
              Premiere scheduled — your memory has been added to the archive.
            </p>
          ) : null}
        </form>
      </div>

      <div className="mt-section-gap">
        <MediaRow
          title="Continue Your Archive"
          memories={recentMemories.slice(0, 8)}
          onSelect={openMemory}
        />
      </div>
    </div>
  );
}
