import { create } from "zustand";
import { Qualification } from "../models";
import { qualificationService, adminService } from "../lib/services";

interface QualificationState {
  qualifications: Qualification[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadError: string | null;
  fetchQualifications: (userId?: string) => Promise<void>;
  uploadQualification: (data: FormData) => Promise<boolean>;
  deleteQualification: (id: number) => Promise<boolean>;
  isDeleting: boolean;
}

export const useQualificationStore = create<QualificationState>((set, get) => ({
  qualifications: [],
  isLoading: false,
  isUploading: false,
  error: null,
  uploadError: null,
  isDeleting: false,

  fetchQualifications: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let response;
      if (userId) {
        response = await adminService.getUserQualifications(userId);
      } else {
        response = await qualificationService.getQualifications();
      }

      if (response.status) {
        set({ qualifications: response.data || [] });
      } else {
        set({ error: response.message || "Failed to fetch qualifications" });
      }
    } catch (error: any) {
      set({ error: error.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadQualification: async (data: FormData): Promise<boolean> => {
    set({ isUploading: true, uploadError: null });
    try {
      const response = await qualificationService.uploadQualification(data);
      if (response.status) {
        // Refresh the list after successful upload
        await get().fetchQualifications();
        return true;
      } else {
        set({ uploadError: response.message || "Failed to upload qualification" });
        return false;
      }
    } catch (error: any) {
      set({
        uploadError: error?.response?.data?.message || error.message || "An unexpected error occurred",
      });
      return false;
    } finally {
      set({ isUploading: false });
    }
  },
  
  deleteQualification: async (id: number): Promise<boolean> => {
    set({ isDeleting: true, error: null });
    try {
      const response = await qualificationService.deleteQualification(id);
      if (response.status) {
        // Refresh the list after successful delete
        // Remove the deleted item from the local state instead of re-fetching
        const currentQualifications = get().qualifications;
        const updatedQualifications = currentQualifications.filter((q) => q.id !== id);
        set({ qualifications: updatedQualifications });
        return true;
      } else {
        set({ error: response.message || "Failed to delete qualification" });
        return false;
      }
    } catch (error: any) {
      set({
        error: error?.response?.data?.message || error.message || "An unexpected error occurred",
      });
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
