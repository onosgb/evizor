import { create } from "zustand";
import { ProfessionalProfile } from "../models";
import { authService } from "../lib/services";

interface ProfessionalProfileState {
  profile: ProfessionalProfile | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveError: string | null;
  saveSuccess: boolean;
  fetchProfile: (userId?: string) => Promise<void>;
  updateProfile: (data: ProfessionalProfile) => Promise<boolean>;
  approveProfile: (userId: string) => Promise<boolean>;
  clearMessages: () => void;
}

export const useProfessionalProfileStore = create<ProfessionalProfileState>(
  (set, get) => ({
    profile: null,
    isLoading: false,
    isSaving: false,
    error: null,
    saveError: null,
    saveSuccess: false,

    fetchProfile: async (userId?: string) => {
      set({ isLoading: true, error: null });
      try {
        let response;
        if (userId) {
          response = await authService.getProfessionalProfileByUserId(userId);
        } else {
          response = await authService.getProfessionalProfile();
        }
        
        if (response.status && response.data) {
          set({ profile: response.data });
        } else {
          set({ error: response.message || "Failed to fetch professional profile" });
        }
      } catch (error: any) {
        set({ error: error.message || "An unexpected error occurred" });
      } finally {
        set({ isLoading: false });
      }
    },

    updateProfile: async (data: ProfessionalProfile): Promise<boolean> => {
      set({ isSaving: true, saveError: null, saveSuccess: false });
      try {
        const response = await authService.updateProfessionalProfile(data);
        if (response.status) {
          set({ profile: response.data || data, saveSuccess: true });
          return true;
        } else {
          set({
            saveError: response.message || "Failed to save professional information",
          });
          return false;
        }
      } catch (error: any) {
        set({
          saveError:
            error?.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
        });
        return false;
      } finally {
        set({ isSaving: false });
      }
    },

    approveProfile: async (userId: string): Promise<boolean> => {
      set({ isSaving: true, saveError: null, saveSuccess: false });
      try {
        const response = await authService.approveProfessionalProfile(userId);
        if (response.status) {
          set({ saveSuccess: true });
          // Refresh profile after approval
          await get().fetchProfile(userId);
          return true;
        } else {
          set({
            saveError: response.message || "Failed to approve profile",
          });
          return false;
        }
      } catch (error: any) {
        set({
          saveError:
            error?.response?.data?.message ||
            error.message ||
            "An unexpected error occurred",
        });
        return false;
      } finally {
        set({ isSaving: false });
      }
    },

    clearMessages: () => {
      set({ saveError: null, saveSuccess: false });
    },
  })
);
