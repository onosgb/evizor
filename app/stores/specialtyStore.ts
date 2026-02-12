import { create } from "zustand";
import { Specialty } from "../models";
import { specialtyService } from "../lib/services";

interface SpecialtyState {
  specialties: Specialty[];
  isLoading: boolean;
  error: string | null;
  fetchSpecialties: () => Promise<void>;
}

export const useSpecialtyStore = create<SpecialtyState>((set) => ({
  specialties: [],
  isLoading: false,
  error: null,
  fetchSpecialties: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await specialtyService.getSpecialties();
      if (response.status) {
        set({ specialties: response.data || [] });
      } else {
        set({ error: response.message || "Failed to fetch specialties" });
      }
    } catch (error: any) {
      set({ error: error.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
