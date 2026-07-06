import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Profile } from '@/types';
import {
  ProfileContext,
  type ProfileContextValue,
} from './profile-context';
import { useAuth } from './auth-context';
import { apiFetch } from '@/lib/api';

const ACTIVE_PROFILE_KEY = 'ourframe_active_profile';

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] =
    useState<Profile | null>(null);

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

        const mapped: Profile[] = data.map((profile) => ({
          profileId: profile.profileId,
          name: profile.name,
          avatarUrl: profile.avatarUrl ?? '',
          kind: profile.kind,
        }));

        setProfiles([
          ...mapped,
          {
            profileId: 'add-tile',
            name: 'Add Profile',
            avatarUrl: '',
            kind: 'add',
          },
        ]);

        const savedProfileId = localStorage.getItem(
          ACTIVE_PROFILE_KEY,
        );

        const initialProfile =
          mapped.find(
            (profile) =>
              profile.profileId === savedProfileId,
          ) ??
          mapped[0] ??
          null;

        setActiveProfileState(initialProfile);
      } catch (err) {
        console.error('Failed to load profiles:', err);
      }
    };

    loadProfiles();
  }, [isAuthenticated, user?.userId]);

  const setActiveProfile = useCallback(
    (profile: Profile) => {
      localStorage.setItem(
        ACTIVE_PROFILE_KEY,
        profile.profileId,
      );

      setActiveProfileState(profile);
    },
    [],
  );

  const clearActiveProfile = useCallback(() => {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    setActiveProfileState(null);
  }, []);

  const addProfile = useCallback(
    async (data: {
      name: string;
      avatarUrl: string;
    }): Promise<Profile> => {
      const created = await apiFetch<{
        profileId: string;
        name: string;
        avatarUrl: string | null;
        kind: 'owner' | 'partner' | 'shared';
      }>('/profiles', {
        method: 'POST',
        body: data,
      });

      const profile: Profile = {
        profileId: created.profileId,
        name: created.name,
        avatarUrl: created.avatarUrl ?? '',
        kind: created.kind,
      };

      setProfiles((prev) => {
        const addIndex = prev.findIndex(
          (p) => p.kind === 'add',
        );

        if (addIndex === -1) return [...prev, profile];

        return [
          ...prev.slice(0, addIndex),
          profile,
          ...prev.slice(addIndex),
        ];
      });

      return profile;
    },
    [],
  );

  const updateProfile = useCallback(
    async (
      id: string,
      patch: Partial<Profile>,
    ) => {
      await apiFetch(`/profiles/${id}`, {
        method: 'PUT',
        body: patch,
      });

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.profileId === id
            ? { ...profile, ...patch }
            : profile,
        ),
      );

      setActiveProfileState((prev) =>
        prev?.profileId === id
          ? { ...prev, ...patch }
          : prev,
      );
    },
    [],
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      await apiFetch(`/profiles/${id}`, {
        method: 'DELETE',
      });

      setProfiles((prev) =>
        prev.filter((profile) => profile.profileId !== id),
      );

      setActiveProfileState((prev) =>
        prev?.profileId === id
          ? null
          : prev,
      );
    },
    [],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      activeProfile,
      setActiveProfile,
      clearActiveProfile,
      profiles,
      getProfile: (id) =>
        profiles.find(
          (profile) => profile.profileId === id,
        ),
      addProfile,
      updateProfile,
      deleteProfile,
    }),
    [
      activeProfile,
      profiles,
      setActiveProfile,
      clearActiveProfile,
      addProfile,
      updateProfile,
      deleteProfile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}