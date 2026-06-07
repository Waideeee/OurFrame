import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Plus } from 'lucide-react';
import { useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';
import { Logo } from '@/components/layout';

export function AddProfilePage() {
  const navigate = useNavigate();
  const { addProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addProfile({
      name: name.trim() || 'New Profile',
      avatarUrl: avatarUrl || 'https://picsum.photos/seed/ourframe-new/300/300',
    });
    navigate('/profiles');
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
            {/* Square avatar upload */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative h-36 w-36 overflow-hidden rounded-avatar border-2 border-dashed border-outline-variant bg-surface transition-colors hover:border-on-surface"
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
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={28} className="text-on-surface" />
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
              <Button type="submit" variant="brand" size="lg" fullWidth>
                Create Profile
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
