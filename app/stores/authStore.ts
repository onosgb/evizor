import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../models";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  rememberMe: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    user: User,
    rememberMe?: boolean
  ) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
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

      login: (accessToken, refreshToken, user, rememberMe = false) => {
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          user,
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    }
  )
);
