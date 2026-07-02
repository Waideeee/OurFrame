import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Plus } from 'lucide-react';
import { useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';
import { Logo } from '@/components/layout';
import { uploadFile } from '@/lib/upload';

export function AddProfilePage() {
  const navigate = useNavigate();
  const { addProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);


  const handleAvatar = async (file: File | undefined) => {
  if (!file) return;
  try {
    setIsUploadingAvatar(true);
    const url = await uploadFile(file);
    setAvatarUrl(url);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to upload photo');
  } finally {
    setIsUploadingAvatar(false);
  }
};
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setIsSubmitting(true);
      await addProfile({
        name: name.trim() || 'New Profile',
        avatarUrl: avatarUrl || 'https://picsum.photos/seed/ourframe-new/300/300',
      });
      navigate('/profiles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container-edge py-6">
        <Logo />
      </header>

      <main className="container-edge flex flex-1 flex-col items-center justify-center py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="mb-8 text-center text-headline-lg text-on-surface md:text-display-lg">
            Add Profile
          </h1>

          <div className="flex flex-col items-center gap-8">
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileRef.current?.click()}
              className="group relative h-36 w-36 overflow-hidden rounded-avatar border-2 border-dashed border-outline-variant bg-surface transition-colors hover:border-on-surface disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Upload profile photo"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full flex-col items-center justify-center gap-2 text-metadata group-hover:text-on-surface">
                  <Plus size={36} />
                  <span className="text-label-sm">Add photo</span>
                </span>
              )}
              <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={26} className="text-on-surface" />
                <span className="text-label-sm text-on-surface">
                  {isUploadingAvatar ? 'Uploading...' : 'Change'}
                </span>
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatar(e.target.files?.[0])}
            />

            <Input
              label="Profile name"
              placeholder="e.g. Partner 1"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center"
            />

            <div className="flex w-full flex-col gap-3">
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button
                type="submit"
                variant="brand"
                size="lg"
                fullWidth
                disabled={isSubmitting || isUploadingAvatar}
              >
                {isSubmitting
                  ? 'Creating...'
                  : isUploadingAvatar
                    ? 'Uploading Photo...'
                    : 'Create Profile'}
              </Button>
              <Link
                to="/profiles"
                className="text-center text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors hover:text-on-surface"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}