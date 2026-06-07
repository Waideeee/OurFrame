import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profile } from '@/types';
import { useProfile } from '@/app/providers';
import { ProfileCard } from '@/components/common';
import { Button } from '@/components/ui';
import { Logo } from '@/components/layout';

export function ProfileSelectionPage() {
  const navigate = useNavigate();
  const { setActiveProfile, profiles } = useProfile();
  const [manageMode, setManageMode] = useState(false);

  const handleSelect = (profile: Profile) => {
    if (profile.kind === 'add') {
      navigate('/profiles/new');
      return;
    }
    if (manageMode) {
      navigate(`/profiles/edit/${profile.id}`);
      return;
    }
    setActiveProfile(profile);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container-edge py-6">
        <Logo />
      </header>

      <main className="container-edge flex flex-1 flex-col items-center justify-center gap-12 py-16">
        <h1 className="text-center text-headline-lg text-on-surface md:text-display-lg">
          {manageMode ? 'Manage Profiles' : "Who's watching?"}
        </h1>

        <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onSelect={handleSelect} />
          ))}
        </div>

        <Button
          variant="icon"
          onClick={() => setManageMode((v) => !v)}
          className="aspect-auto rounded-card border-metadata px-6 py-2.5 text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
        >
          {manageMode ? 'Done' : 'Manage Profiles'}
        </Button>
      </main>
    </div>
  );
}
