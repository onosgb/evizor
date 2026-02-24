import { create } from "zustand";
import { Specialty } from "../models";
import { specialtyService, CreateSpecialtyRequest } from "../lib/services/specialty.service";

interface SpecialtyState {
  specialties: Specialty[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  fetchSpecialties: (search?: string) => Promise<void>;
  createSpecialty: (data: CreateSpecialtyRequest) => Promise<boolean>;
  updateSpecialty: (id: string, data: CreateSpecialtyRequest) => Promise<boolean>;
  deleteSpecialty: (id: string) => Promise<boolean>;
}

export const useSpecialtyStore = create<SpecialtyState>((set) => ({
  specialties: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,
  fetchSpecialties: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await specialtyService.getSpecialties(search);
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
  createSpecialty: async (data: CreateSpecialtyRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await specialtyService.createSpecialty(data);
      if (response.status && response.data) {
        set((state) => ({ specialties: [...state.specialties, response.data] }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to create specialty" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
  updateSpecialty: async (id: string, data: CreateSpecialtyRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await specialtyService.updateSpecialty(id, data);
      if (response.status && response.data) {
        set((state) => ({
          specialties: state.specialties.map((s) => (s.id === id ? response.data : s)),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to update specialty" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
  deleteSpecialty: async (id: string) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await specialtyService.deleteSpecialty(id);
      if (response.status) {
        set((state) => ({
          specialties: state.specialties.filter((s) => s.id !== id),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to delete specialty" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));

