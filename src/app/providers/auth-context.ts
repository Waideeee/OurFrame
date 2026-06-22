import { createContext, useContext } from 'react';

export interface AuthUser {
    userId: String
}

export interface RegisterData {
  firstName: string;
  partnerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  anniversaryDate: string;
}

export interface LoginData {
  email: string;
  password: string;
}


export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}