import { createContext, useContext } from 'react';
import type { Profile } from '@/types';

export interface ProfileContextValue {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  clearActiveProfile: () => void;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
