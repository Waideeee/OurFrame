import { useCallback, useMemo, useState,useEffect, type ReactNode } from 'react';
import type { Profile } from '@/types';
import { ProfileContext, type ProfileContextValue } from './profile-context';
import { useAuth } from './auth-context'; 
import { apiFetch } from '@/lib/api';

let profileCounter = 0;
/** Stable-ish id without Date.now()/Math.random(). */
function nextProfileId(): string {
  profileCounter += 1;
  return `p-new-${profileCounter}`;
}

export function ProfileProvider({ children }: { children: ReactNode }) {

  const { isAuthenticated } = useAuth();

  



  const [activeProfile, setActiveProfileState] =
  useState<Profile | null>(null);

  const [profiles, setProfiles] =
  useState<Profile[]>([]);

  useEffect(() => {
  if (!isAuthenticated) return;

  const loadProfiles = async () => {
    try {
      const data = await apiFetch<
        {
          profileId: string;
          name: string;
          avatarUrl: string | null;
          kind: 'owner' | 'partner' | 'shared';
        }[]
      >('/profiles');

      const mapped: Profile[] = data.map((p) => ({
        profileId: p.profileId,
        name: p.name,
        avatarUrl: p.avatarUrl ?? '',
        kind: p.kind,
      }));

      const withAddTile: Profile[] = [
        ...mapped,
        {
          profileId: 'add-tile',
          name: 'Add Profile',
          avatarUrl: '',
          kind: 'add',
        },
      ];

      setProfiles(withAddTile);

      setActiveProfileState((prev) => prev ?? mapped[0] ?? null);
    } catch (err) {
      console.error('Failed to load profiles:', err);
    }
  };

  loadProfiles();
}, [isAuthenticated]);

  const addProfile = useCallback((data: { name: string; avatarUrl: string }): Profile => {
    const profile: Profile = {
      profileId: nextProfileId(),
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
    setProfiles((prev) => prev.map((p) => (p.profileId === id ? { ...p, ...patch } : p)));
    setActiveProfileState((prev) => (prev && prev.profileId === id ? { ...prev, ...patch } : prev));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setProfiles((prev) => prev.filter((p) => p.profileId !== id));
    setActiveProfileState((prev) => (prev && prev.profileId === id ? null : prev));
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile,
      setActiveProfile: setActiveProfileState,
      clearActiveProfile: () => setActiveProfileState(null),
      profiles,
      getProfile: (id) => profiles.find((p) => p.profileId === id),
      addProfile,
      updateProfile,
      deleteProfile,
    }),
    [activeProfile, profiles, addProfile, updateProfile, deleteProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
