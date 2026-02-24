import { create } from "zustand";
import { Tenant } from "../models";
import { tenantService, UpdateTenantRequest } from "../lib/services/tenant.service";

interface TenantState {
  tenants: Tenant[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  fetchTenants: (search?: string) => Promise<void>;
  getTenantById: (id: string) => Tenant | undefined;
  getTenantByName: (name: string) => Tenant | undefined;
  updateTenant: (id: string, data: UpdateTenantRequest) => Promise<boolean>;
  toggleTenantStatus: (id: string, isActive: boolean) => Promise<boolean>;
  createTenant: (data: UpdateTenantRequest) => Promise<boolean>;
}

export const useTenantStore = create<TenantState>()((set, get) => ({
  tenants: [],
  isLoading: false,
  error: null,
  isSubmitting: false,
  submitError: null,

  fetchTenants: async (search?: string) => {
    if (!search && get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getAllTenants(search);
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

  updateTenant: async (id: string, data: UpdateTenantRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await tenantService.updateTenant(id, data);
      if (response.status && response.data) {
        set((state) => ({
          tenants: state.tenants.map((t) => (t.id === id ? response.data : t)),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to update tenant" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  toggleTenantStatus: async (id: string, isActive: boolean) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await tenantService.toggleTenantStatus(id, isActive);
      if (response.status && response.data) {
        set((state) => ({
          tenants: state.tenants.map((t) => (t.id === id ? response.data : t)),
        }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to update status" });
        return false;
      }
    } catch (error: any) {
      set({ submitError: error.message || "An unexpected error occurred" });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  createTenant: async (data: UpdateTenantRequest) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const response = await tenantService.createTenant(data);
      if (response.status && response.data) {
        set((state) => ({ tenants: [...state.tenants, response.data] }));
        return true;
      } else {
        set({ submitError: response.message || "Failed to create tenant" });
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

