import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../models";

/**
 * Custom storage that uses localStorage when rememberMe is true,
 * and sessionStorage otherwise. The decision is based on whatever
 * was last persisted, so it survives hot-reloads correctly.
 */
const rememberMeStorage = createJSONStorage(() => ({
  getItem: (key: string) => {
    // Try localStorage first (rememberMe=true path), then sessionStorage
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    try {
      const parsed = JSON.parse(value);
      const rememberMe = parsed?.state?.rememberMe ?? false;
      if (rememberMe) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
}));

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  rememberMe: boolean;
  profileCompleted: boolean;

  login: (
    accessToken: string,
    refreshToken: string,
    user: User,
    profileCompleted: boolean,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setProfileStatus: (completed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: false,
      profileCompleted: false,

      login: (accessToken, refreshToken, user, profileCompleted, rememberMe = false) => {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
          profileCompleted,
          rememberMe,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          rememberMe: false,
          profileCompleted: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setProfileStatus: (completed) => {
        set({ profileCompleted: completed });
      },
    }),
    {
      name: "auth-storage",
      storage: rememberMeStorage,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        rememberMe: state.rememberMe,
        profileCompleted: state.profileCompleted,
      }),
    }
  )
);
