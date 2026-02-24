import { create } from "zustand";
import { User } from "../models";
import { adminService, authService } from "../lib/services";

interface ProfileStore {
  /** The user whose profile is currently being viewed. */
  viewedUser: User | null;
  isLoading: boolean;
  /** Id that was last loaded — used to skip redundant network calls. */
  loadedUserId: string | null;

  /**
   * Fetches the profile for `userId`.
   * - If `userId` is null or matches `loggedInUserId`, fetches own profile.
   * - Otherwise fetches the target user via adminService.
   * - Skips the network call if the same id is already loaded.
   * Returns the fetched User so callers can sync other stores if needed.
   */
  fetchViewedUser: (
    userId: string | null,
    loggedInUserId?: string,
  ) => Promise<User | null>;

  /** Directly set the viewed user (e.g. after an avatar upload). */
  setViewedUser: (user: User) => void;

  /** Reset store when the profile page unmounts. */
  clearViewedUser: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  viewedUser: null,
  isLoading: false,
  loadedUserId: null,

  fetchViewedUser: async (userId, loggedInUserId) => {
    const targetId =
      userId && userId !== loggedInUserId ? userId : (loggedInUserId ?? null);

    // Skip if already loaded for this id
    if (targetId && get().loadedUserId === targetId) return get().viewedUser;

    set({ isLoading: true });
    try {
      if (userId && userId !== loggedInUserId) {
        const response = await adminService.getUserProfile(userId);
        if (response.status && response.data) {
          set({
            viewedUser: response.data,
            loadedUserId: userId,
            isLoading: false,
          });
          return response.data;
        }
      } else {
        const response = await authService.getMyProfile();
        if (response.status && response.data) {
          const loaded = response.data;
          set({
            viewedUser: loaded,
            loadedUserId: loaded.id ?? loggedInUserId ?? null,
            isLoading: false,
          });
          return loaded;
        }
      }
    } catch {
      // silent — components fall back to auth store user
    }
    set({ isLoading: false });
    return null;
  },

  setViewedUser: (user) => set({ viewedUser: user }),

  clearViewedUser: () =>
    set({ viewedUser: null, loadedUserId: null, isLoading: false }),
}));
