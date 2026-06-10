import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Pencil, Trash2 } from 'lucide-react';
import { useMemories, useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';

/**
 * "My Profile" — the active profile views and edits its own name/avatar, sees
 * read-only upload stats, and can delete the profile from the danger zone.
 * Reuses the same avatar-upload behaviour as the Add/Edit Profile pages.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const { activeProfile, updateProfile, deleteProfile } = useProfile();
  const { memories } = useMemories();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(activeProfile?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(activeProfile?.avatarUrl ?? '');

  // Stats are pulled from the memories this profile uploaded (read-only).
  const stats = useMemo(() => {
    const mine = activeProfile
      ? memories.filter((m) => m.uploadedBy === activeProfile.name)
      : [];
    const photos = mine.filter((m) => m.type === 'photo').length;
    const videos = mine.filter((m) => m.type === 'video').length;
    const earliest = mine.reduce<string | null>(
      (acc, m) => (acc === null || m.date < acc ? m.date : acc),
      null,
    );
    const memberSince = earliest
      ? new Date(earliest).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      : '—';
    return { total: mine.length, photos, videos, memberSince };
  }, [activeProfile, memories]);

  if (!activeProfile) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#141414] px-edge">
        <p className="text-body-md text-metadata">No profile is currently active.</p>
        <Link
          to="/profiles"
          className="text-label-sm font-semibold uppercase tracking-widest text-on-surface"
        >
          Choose a profile
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
    updateProfile(activeProfile.id, {
      name: name.trim() || activeProfile.name,
      avatarUrl: avatarUrl || activeProfile.avatarUrl,
    });
    setEditingName(false);
  };

  const handleDelete = () => {
    deleteProfile(activeProfile.id);
    navigate('/profiles');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#141414] px-edge py-24">
      <form onSubmit={handleSave} className="w-full max-w-[480px]">
        <h1 className="mb-8 text-center text-headline-lg text-on-surface">My Profile</h1>

        <div className="rounded-card border border-white/10 bg-surface/60 p-8">
          {/* Profile info */}
          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="group relative h-32 w-32 overflow-hidden rounded-full border-2 border-transparent bg-surface-high transition-colors hover:border-on-surface"
              aria-label="Change profile photo"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={activeProfile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-metadata">
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

            {editingName ? (
              <Input
                label="Profile name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="text-center"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="inline-flex items-center gap-2 text-title-md text-on-surface transition-colors hover:text-metadata"
              >
                {activeProfile.name}
                <Pencil size={16} className="text-metadata" />
              </button>
            )}
          </div>

          <Button type="submit" variant="brand" size="lg" fullWidth className="mt-6">
            Save Changes
          </Button>

          {/* Stats */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="mb-4 text-label-sm font-semibold uppercase tracking-widest text-metadata">
              Stats
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              <div className="rounded-card bg-surface-high/60 px-4 py-3">
                <dt className="text-label-sm text-metadata">Memories uploaded</dt>
                <dd className="text-title-md text-on-surface">{stats.total}</dd>
              </div>
              <div className="rounded-card bg-surface-high/60 px-4 py-3">
                <dt className="text-label-sm text-metadata">Member since</dt>
                <dd className="text-title-md text-on-surface">{stats.memberSince}</dd>
              </div>
              <div className="rounded-card bg-surface-high/60 px-4 py-3">
                <dt className="text-label-sm text-metadata">Photos</dt>
                <dd className="text-title-md text-on-surface">{stats.photos}</dd>
              </div>
              <div className="rounded-card bg-surface-high/60 px-4 py-3">
                <dt className="text-label-sm text-metadata">Videos</dt>
                <dd className="text-title-md text-on-surface">{stats.videos}</dd>
              </div>
            </dl>
          </div>

          {/* Danger zone */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="mb-3 text-label-sm font-semibold uppercase tracking-widest text-metadata">
              Danger Zone
            </h2>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-card border border-primary px-6 text-body-md font-semibold text-primary transition duration-200 ease-cinematic hover:bg-primary/10 active:scale-95"
            >
              <Trash2 size={18} />
              Delete Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
