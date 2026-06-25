import { createContext, useContext } from 'react';
import type { Profile } from '@/types';

export interface ProfileContextValue {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  clearActiveProfile: () => void;
  profiles: Profile[];
  getProfile: (id: string) => Profile | undefined;
  addProfile: (data: { name: string; avatarUrl: string }) => Promise<Profile>;
  updateProfile: (id: string, patch: Partial<Profile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
