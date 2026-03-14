import { create } from "zustand";
import { LabTestType } from "../models";
import { labTestTypeService, CreateLabTestTypeRequest } from "../lib/services/lab-test-type.service";

interface LabTestTypeState {
  labTestTypes: LabTestType[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  fetchLabTestTypes: (search?: string) => Promise<void>;
  createLabTestType: (data: CreateLabTestTypeRequest) => Promise<boolean>;
  updateLabTestType: (id: string, data: Partial<CreateLabTestTypeRequest>) => Promise<boolean>;
  deleteLabTestType: (id: string) => Promise<boolean>;
}

export const useLabTestTypeStore = create<LabTestTypeState>((set, get) => ({
  labTestTypes: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,

  fetchLabTestTypes: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await labTestTypeService.getLabTestTypes(search);
      if (response.status) {
        set({ labTestTypes: response.data || [] });
      } else {
        set({ error: response.message || "Failed to fetch lab test types" });
      }
    } catch (err: any) {
      set({ error: err.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  createLabTestType: async (data: CreateLabTestTypeRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await labTestTypeService.createLabTestType(data);
      if (response.status) {
        await get().fetchLabTestTypes();
        return true;
      } else {
        set({ submitError: response.message || "Failed to create lab test type" });
        return false;
      }
    } catch (err: any) {
      set({ submitError: err.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateLabTestType: async (id: string, data: Partial<CreateLabTestTypeRequest>) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await labTestTypeService.updateLabTestType(id, data);
      if (response.status) {
        await get().fetchLabTestTypes(); // Refresh list to get updated data
        return true;
      } else {
        set({ submitError: response.message || "Failed to update lab test type" });
        return false;
      }
    } catch (err: any) {
      set({ submitError: err.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteLabTestType: async (id: string) => {
    set({ isSubmitting: true });
    try {
      const response = await labTestTypeService.deleteLabTestType(id);
      if (response.status) {
        set((state) => ({
          labTestTypes: state.labTestTypes.filter((t) => t.id !== id),
        }));
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
