import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

/**
 * Only the access token lives here (and in localStorage via `persist`).
 * The refresh token never touches JS — it's an httpOnly cookie the browser
 * sends automatically to `/auth/refresh` (see api/client.ts's interceptor).
 * Persisting the access token is a deliberate UX trade-off (survives a
 * page refresh without a network round trip); it's short-lived (15m
 * default) and role-only, so the blast radius of an XSS token theft is
 * bounded to that window.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
    }),
    { name: 'eezy-pos-auth' },
  ),
);
