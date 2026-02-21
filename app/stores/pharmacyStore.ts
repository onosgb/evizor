import { create } from "zustand";
import { Pharmacy, CreatePharmacyRequest, UpdatePharmacyRequest } from "../models";
import { pharmacyService } from "../lib/services/pharmacy.service";
import { ListQueryParams } from "../models/QueryParams";
import { PaginatedData } from "../models/ApiResponse";

interface PharmacyState {
  pharmacies: Pharmacy[];
  total: number;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;

  fetchPharmacies: (params?: ListQueryParams) => Promise<void>;
  createPharmacy: (data: CreatePharmacyRequest) => Promise<boolean>;
  updatePharmacy: (id: string, data: UpdatePharmacyRequest) => Promise<boolean>;
  deletePharmacy: (id: string) => Promise<boolean>;
}

export const usePharmacyStore = create<PharmacyState>((set, get) => ({
  pharmacies: [],
  total: 0,
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,

  fetchPharmacies: async (params?) => {
    set({ isLoading: true, error: null });
    try {
      const response = await pharmacyService.getPharmacies(params);
      if (response.status) {
        const paged = response.data as PaginatedData<Pharmacy>;
        set({ pharmacies: paged.data || [], total: paged.total ?? 0 });
      } else {
        set({ error: response.message || "Failed to fetch pharmacies" });
      }
    } catch (error: any) {
      set({ error: error.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  createPharmacy: async (data) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await pharmacyService.createPharmacy(data);
      if (response.status && response.data) {
        set((state) => ({ pharmacies: [...state.pharmacies, response.data] }));
        return true;
      }
      set({ submitError: response.message || "Failed to create pharmacy" });
      return false;
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

              updatePharmacy: async (id: string, data: UpdatePharmacyRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await pharmacyService.updatePharmacy(id, data);
      if (response.status && response.data) {
        set((state) => ({
          pharmacies: state.pharmacies.map((p) => (p.id === id ? response.data : p)),
        }));
        return true;
      }
      set({ submitError: response.message || "Failed to update pharmacy" });
      return false;
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deletePharmacy: async (id) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await pharmacyService.deletePharmacy(id);
      if (response.status) {
        set((state) => ({ pharmacies: state.pharmacies.filter((p) => p.id !== id) }));
        return true;
      }
      set({ submitError: response.message || "Failed to delete pharmacy" });
      return false;
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
