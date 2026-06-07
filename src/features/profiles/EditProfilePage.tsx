import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Camera, Trash2 } from 'lucide-react';
import { useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';
import { Logo } from '@/components/layout';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { getProfile, updateProfile, deleteProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const profile = getProfile(id);
  const [name, setName] = useState(profile?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? '');

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
        <p className="text-body-md text-metadata">That profile could not be found.</p>
        <Link
          to="/profiles"
          className="text-label-sm font-semibold uppercase tracking-widest text-on-surface"
        >
          Back to profiles
        </Link>
      </div>
    );
  }

  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(profile.id, { name: name.trim() || profile.name, avatarUrl });
    navigate('/profiles');
  };

  const handleDelete = () => {
    deleteProfile(profile.id);
    navigate('/profiles');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container-edge py-6">
        <Logo />
      </header>

      <main className="container-edge flex flex-1 flex-col items-center justify-center py-16">
        <form onSubmit={handleSave} className="w-full max-w-md">
          <h1 className="mb-8 text-center text-headline-lg text-on-surface md:text-display-lg">
            Edit Profile
          </h1>

          <div className="flex flex-col items-center gap-8">
            {/* Current avatar with change-image affordance */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative h-36 w-36 overflow-hidden rounded-avatar border-2 border-transparent bg-surface transition-colors hover:border-on-surface"
              aria-label="Change profile photo"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-surface-high text-metadata">
                  No photo
                </span>
              )}
              <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={26} className="text-on-surface" />
                <span className="text-label-sm text-on-surface">Change</span>
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
              placeholder="Profile name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-center"
            />

            <div className="flex w-full flex-col gap-3">
              <Button type="submit" variant="brand" size="lg" fullWidth>
                Save
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-card border border-primary px-6 text-body-md font-semibold text-primary transition duration-200 ease-cinematic hover:bg-primary/10 active:scale-95"
              >
                <Trash2 size={18} />
                Delete Profile
              </button>
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
