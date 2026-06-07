import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Profile } from '@/types';
import { profiles as seedProfiles, selectableProfiles } from '@/data';
import { ProfileContext, type ProfileContextValue } from './profile-context';

let profileCounter = 0;
/** Stable-ish id without Date.now()/Math.random(). */
function nextProfileId(): string {
  profileCounter += 1;
  return `p-new-${profileCounter}`;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(
    () => selectableProfiles[0] ?? null,
  );
  const [profiles, setProfiles] = useState<Profile[]>(() => seedProfiles);

  const addProfile = useCallback((data: { name: string; avatarUrl: string }): Profile => {
    const profile: Profile = {
      id: nextProfileId(),
      name: data.name,
      avatarUrl: data.avatarUrl,
      kind: 'partner',
    };
    // Insert before the trailing "add" tile so the + stays last.
    setProfiles((prev) => {
      const addIndex = prev.findIndex((p) => p.kind === 'add');
      if (addIndex === -1) return [...prev, profile];
      return [...prev.slice(0, addIndex), profile, ...prev.slice(addIndex)];
    });
    return profile;
  }, []);

  const updateProfile = useCallback((id: string, patch: Partial<Profile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setActiveProfileState((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    setActiveProfileState((prev) => (prev && prev.id === id ? null : prev));
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile,
      setActiveProfile: setActiveProfileState,
      clearActiveProfile: () => setActiveProfileState(null),
      profiles,
      getProfile: (id) => profiles.find((p) => p.id === id),
      addProfile,
      updateProfile,
      deleteProfile,
    }),
    [activeProfile, profiles, addProfile, updateProfile, deleteProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
