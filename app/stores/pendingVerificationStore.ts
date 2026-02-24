import { create } from "zustand";
import { PendingVerification } from "../models/PendingVerification";
import { adminService } from "../lib/services/admin.service";
import { ApiError } from "../models/ApiError";

interface PendingVerificationStore {
  pendingVerifications: PendingVerification[];
  isLoading: boolean;
  error: string | null;
  search: string;
  tenantId: string;
  page: number;
  limit: number;
  total: number;
  setSearch: (search: string) => void;
  setTenantId: (tenantId: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  fetchPendingVerifications: () => Promise<void>;
  approveVerification: (userId: string) => Promise<void>;
  rejectVerification: (userId: string, reason: string) => Promise<void>;
}

export const usePendingVerificationStore = create<PendingVerificationStore>((set, get) => ({
  pendingVerifications: [],
  isLoading: false,
  error: null,
  search: "",
  tenantId: "",
  page: 1,
  limit: 10,
  total: 0,

  setSearch: (search) => set({ search, page: 1 }),
  setTenantId: (tenantId) => set({ tenantId, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),

  fetchPendingVerifications: async () => {
    const { search, tenantId, page, limit } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getPendingVerifications(
        search || undefined,
        tenantId || undefined,
        page,
        limit,
      );
      if (response.status && response.data) {
        set({
          pendingVerifications: response.data,
          total: response.total ?? 0,
          isLoading: false,
        });
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
      set((state) => ({
        pendingVerifications: state.pendingVerifications.filter((v) => v.userId !== userId),
        total: Math.max(0, state.total - 1),
      }));
    } catch (error) {
      if (error instanceof ApiError) set({ error: error.message });
    }
  },

  rejectVerification: async (userId: string, reason: string) => {
    try {
      await adminService.approveVerification(userId, false, reason);
      set((state) => ({
        pendingVerifications: state.pendingVerifications.filter((v) => v.userId !== userId),
        total: Math.max(0, state.total - 1),
      }));
    } catch (error) {
      if (error instanceof ApiError) set({ error: error.message });
    }
  },
}));
