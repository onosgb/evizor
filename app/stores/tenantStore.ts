import { create } from "zustand";
import { Tenant } from "../models";
import { tenantService } from "../lib/services";

interface TenantState {
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  fetchTenants: () => Promise<void>;
  getTenantById: (id: string) => Tenant | undefined;
  getTenantByName: (name: string) => Tenant | undefined;
}

export const useTenantStore = create<TenantState>()((set, get) => ({
  tenants: [],
  isLoading: false,
  error: null,

  fetchTenants: async () => {
    // Prevent multiple simultaneous fetches
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getAllTenants();
      set({ tenants: response, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tenants";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getTenantById: (id: string) => {
    return get().tenants.find((tenant) => tenant.id === id);
  },

  getTenantByName: (name: string) => {
    return get().tenants.find(
      (tenant) => tenant.province.toLowerCase() === name.toLowerCase()
    );
  },
}));
