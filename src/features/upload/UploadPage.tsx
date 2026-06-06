import { useState, type FormEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { UPLOAD_CATEGORIES } from '@/lib/constants';
import { recentMemories } from '@/data';
import { Dropzone } from '@/components/common';
import { MediaRow } from '@/components/media';
import { Button, Input } from '@/components/ui';

export function UploadPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pb-24 pt-24">
      <header className="container-edge mb-10">
        <h1 className="text-headline-mobile text-on-surface md:text-headline-lg">New Premiere</h1>
        <p className="mt-2 max-w-2xl text-body-md text-metadata">
          Give your latest memory a proper release — add the media, write the story, and send it to
          the archive.
        </p>
      </header>

      <div className="container-edge grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Dropzone onFiles={() => setSubmitted(false)} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-title-md text-on-surface">Production Details</h2>

          <Input label="Memory Title" placeholder="Give it a headline" required />
          <Input
            label="Release Date"
            type="date"
            required
            className="text-on-surface [color-scheme:dark]"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-label-sm font-medium text-metadata">
              Category
            </label>
            <select
              id="category"
              className="h-12 rounded-card border border-transparent bg-surface-high px-4 text-body-md text-on-surface focus:border-outline focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Choose a category
              </option>
              {UPLOAD_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
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
              placeholder="What happened? Where were you? What do you want to remember?"
              className="resize-none rounded-card border border-transparent bg-surface-high px-4 py-3 text-body-md text-on-surface placeholder:text-metadata/70 focus:border-outline focus:outline-none"
            />
          </div>

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
        <MediaRow title="Continue Your Archive" memories={recentMemories.slice(0, 8)} />
      </div>
    </div>
  );
}
