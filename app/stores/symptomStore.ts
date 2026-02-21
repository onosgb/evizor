import { create } from "zustand";
import { Symptom } from "../models";
import { symptomService, CreateSymptomRequest } from "../lib/services/symptom.service";

interface SymptomState {
  symptoms: Symptom[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  fetchSymptoms: (tenantId?: string) => Promise<void>;
  createSymptom: (data: CreateSymptomRequest) => Promise<boolean>;
  updateSymptom: (id: string, data: CreateSymptomRequest) => Promise<boolean>;
  deleteSymptom: (id: string) => Promise<boolean>;
}

export const useSymptomStore = create<SymptomState>((set) => ({
  symptoms: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,

  fetchSymptoms: async (tenantId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await symptomService.getSymptoms(tenantId);
      if (response.status) {
        set({ symptoms: response.data || [] });
      } else {
        set({ error: response.message || "Failed to fetch symptoms" });
      }
    } catch (error: any) {
      set({ error: error.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  createSymptom: async (data: CreateSymptomRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await symptomService.createSymptom(data);
      if (response.status && response.data) {
        set((state) => ({ symptoms: [...state.symptoms, response.data] }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to create symptom" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateSymptom: async (id: string, data: CreateSymptomRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await symptomService.updateSymptom(id, data);
      if (response.status && response.data) {
        set((state) => ({
          symptoms: state.symptoms.map((s) => (s.id === id ? response.data : s)),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to update symptom" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteSymptom: async (id: string) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await symptomService.deleteSymptom(id);
      if (response.status) {
        set((state) => ({
          symptoms: state.symptoms.filter((s) => s.id !== id),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to delete symptom" });
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
