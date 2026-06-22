import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiFetch, TOKEN_KEY } from '@/lib/api';
import { AuthContext, type AuthContextValue, type AuthUser, type LoginData, type RegisterData } from './auth-context';

const USER_ID_KEY = 'ourframe_user_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // 1. Sa unang load ng app — check kung may existing token + userId 
  //    sa localStorage. Kung meron, i-restore ang user state 
  //    (para hindi mag-logout ang user pag nag-refresh ng page!)
  useEffect(() => {

    const userId = localStorage.getItem(USER_ID_KEY)
    const token = localStorage.getItem(TOKEN_KEY)

    if(userId && token){
        setUser({userId})
    }


    // TODO: kunin ang token at userId mula localStorage
    // TODO: kung pareho silang meron, setUser({ userId })
  }, []);

  const login = useCallback(async (data: LoginData) => {
        const result = await apiFetch<{ token: string; userId: string }>('/auth/login',{
            method:'POST',
            body:data,
        })

         localStorage.setItem(TOKEN_KEY, result.token);
         localStorage.setItem(USER_ID_KEY, result.userId);
         setUser({ userId: result.userId });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
        await apiFetch<{message: string; userId: string}>('/auth/register',{
            method:'POST',
            body:data,
        })

        await login({email: data.email, password: data.password})
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    setUser(null)
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}