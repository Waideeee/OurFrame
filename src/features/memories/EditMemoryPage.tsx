import { useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, MapPin, Save, Star, Trash2, X } from 'lucide-react';
import type { MediaItem, MemoryCategory, Mood } from '@/types';
import { UPLOAD_CATEGORIES, UPLOAD_MOODS } from '@/lib/constants';
import { useMemories } from '@/app/providers';
import { Button, Input } from '@/components/ui';

export function EditMemoryPage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { getMemory, updateMemory, deleteMemory } = useMemories();
  const coverRef = useRef<HTMLInputElement>(null);

  const memory = getMemory(id);

  // Include the memory's current values so moods/categories outside the upload
  // presets (e.g. 'Dining', 'Meetups') still display and are preserved on save.
  const categoryOptions = Array.from(
    new Set([...(memory?.category ? [memory.category] : []), ...UPLOAD_CATEGORIES]),
  );
  const moodOptions = Array.from(
    new Set([...(memory?.mood ? [memory.mood] : []), ...UPLOAD_MOODS]),
  );

  const [title, setTitle] = useState(memory?.title ?? '');
  const [date, setDate] = useState(memory?.date ?? '');
  const [location, setLocation] = useState(memory?.location ?? '');
  const [category, setCategory] = useState<MemoryCategory | ''>(memory?.category ?? '');
  const [mood, setMood] = useState<Mood | ''>(memory?.mood ?? '');
  const [isFeatured, setIsFeatured] = useState(!!memory?.featured);
  const [story, setStory] = useState(memory?.description ?? '');
  const [coverUrl, setCoverUrl] = useState(memory?.imageUrl ?? '');
  const [items, setItems] = useState<MediaItem[]>(memory?.mediaItems ?? []);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (!memory) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <p className="text-body-md text-metadata">That memory could not be found.</p>
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

  const handleCover = (file: File | undefined) => {
    if (!file) return;
    setCoverUrl(URL.createObjectURL(file));
  };

  const setCaption = (itemId: string, caption: string) => {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, caption } : it)));
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateMemory(memory.id, {
      title: title.trim() || memory.title,
      description: story.trim(),
      imageUrl: coverUrl || memory.imageUrl,
      category: (category || memory.category) as MemoryCategory,
      mood: mood || undefined,
      date: date || memory.date,
      location: location.trim() || undefined,
      featured: isFeatured,
      mediaItems: items.length
        ? items.map((it) => ({ ...it, caption: it.caption?.trim() || undefined }))
        : undefined,
    });
    navigate(-1);
  };

  const handleDelete = () => {
    deleteMemory(memory.id);
    navigate('/');
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-label-sm font-medium text-metadata">Cover image</span>
            <button
              type="button"
              onClick={() => coverRef.current?.click()}
              className="group relative aspect-video w-full overflow-hidden rounded-card bg-surface"
              aria-label="Change cover image"
            >
              <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
              <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={26} className="text-on-surface" />
                <span className="text-label-sm text-on-surface">Change cover</span>
              </span>
            </button>
            <input
              ref={coverRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleCover(e.target.files?.[0])}
            />
          </div>

          {items.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-label-sm font-medium text-metadata">
                Media in this memory ({items.length})
              </p>
              {items.map((item, index) => (
                <div key={item.id} className="flex gap-3 rounded-card bg-surface-high p-3">
                  <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-card bg-surface">
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                    <span className="absolute left-1 top-1 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-surface">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-label-sm text-on-surface">
                        {item.type === 'video' ? 'Video' : 'Photo'} {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove media ${index + 1}`}
                        className="rounded-full p-1 text-metadata transition-colors hover:text-on-surface"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      value={item.caption ?? ''}
                      onChange={(e) => setCaption(item.id, e.target.value)}
                      placeholder="Add a caption for this media (optional)"
                      className="h-9 w-full rounded-card border border-transparent bg-surface px-3 text-label-sm text-on-surface placeholder:text-metadata/70 focus:border-outline focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Details form */}
        <form onSubmit={handleSave} className="flex flex-col gap-5">
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
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

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
              <option value="">No mood</option>
              {moodOptions.map((m) => (
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

          <div className="flex flex-col gap-3">
            <Button type="submit" variant="brand" size="lg" fullWidth leadingIcon={<Save size={18} />}>
              Save Changes
            </Button>

            {confirmingDelete ? (
              <div className="flex items-center justify-between gap-3 rounded-card border border-primary/60 bg-primary/10 px-4 py-3">
                <span className="text-body-md text-on-surface">Delete this memory permanently?</span>
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
                    onClick={() => setConfirmingDelete(false)}
                    className="px-2 text-label-sm font-semibold text-metadata transition-colors hover:text-on-surface"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
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
          </div>
        </form>
      </div>
    </div>
  );
}
