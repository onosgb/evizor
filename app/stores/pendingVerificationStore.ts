import { create } from "zustand";
import { PendingVerification } from "../models/PendingVerification";
import { adminService } from "../lib/services/admin.service";
import { ApiError } from "../models/ApiError";

interface PendingVerificationStore {
  pendingVerifications: PendingVerification[];
  isLoading: boolean;
  error: string | null;
  fetchPendingVerifications: () => Promise<void>;
  approveVerification: (userId: string) => Promise<void>;
  rejectVerification: (userId: string, reason: string) => Promise<void>;
}

export const usePendingVerificationStore = create<PendingVerificationStore>((set, get) => ({
  pendingVerifications: [],
  isLoading: false,
  error: null,

  fetchPendingVerifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getPendingVerifications();
      if (response.status && response.data) {
        set({ pendingVerifications: response.data, isLoading: false });
      } else {
        set({ error: response.message || "Failed to fetch pending verifications", isLoading: false });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        set({ error: error.message, isLoading: false });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },

  approveVerification: async (userId: string) => {
    try {
      await adminService.approveVerification(userId, true);
      // Remove the approved verification from the list
      set((state) => ({
        pendingVerifications: (state.pendingVerifications || []).filter((v) => v.userId !== userId),
      }));
    } catch (error) {
      console.error("Failed to approve verification:", error);
      // Optionally set an error state here, but for now just logging
      if (error instanceof ApiError) {
         set({ error: error.message });
      }
    }
  },

  rejectVerification: async (userId: string, reason: string) => {
    try {
      await adminService.approveVerification(userId, false, reason);
      // Remove the rejected verification from the list
      set((state) => ({
        pendingVerifications: (state.pendingVerifications || []).filter((v) => v.userId !== userId),
      }));
    } catch (error) {
      console.error("Failed to reject verification:", error);
      if (error instanceof ApiError) {
         set({ error: error.message });
      }
    }
  },
}));
