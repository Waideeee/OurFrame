import { useMemo, useState, type ReactNode } from 'react';
import type { Profile } from '@/types';
import { selectableProfiles } from '@/data';
import { ProfileContext, type ProfileContextValue } from './profile-context';

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(
    () => selectableProfiles[0] ?? null,
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile,
      setActiveProfile: setActiveProfileState,
      clearActiveProfile: () => setActiveProfileState(null),
    }),
    [activeProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
