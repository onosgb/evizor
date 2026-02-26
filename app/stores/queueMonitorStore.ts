import { create } from "zustand";
import { Appointment, AppointmentStatus } from "../models";
import { ListQueryParams } from "../models/QueryParams";
import { appointmentService } from "../lib/services";

interface QueueMonitorState {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  status: AppointmentStatus | "";
  tenantId: string;
  search: string;
  isLoading: boolean;
  error: string | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setStatus: (status: AppointmentStatus | "") => void;
  setTenantId: (tenantId: string) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: Partial<ListQueryParams>) => void;
  fetchAppointments: () => Promise<void>;
}

export const useQueueMonitorStore = create<QueueMonitorState>((set, get) => ({
  appointments: [],
  total: 0,
  page: 1,
  limit: 10,
  status: "",
  tenantId: "",
  search: "",
  isLoading: false,
  error: null,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setTenantId: (tenantId) => set({ tenantId, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setFilters: (filters) => set((state) => ({
    ...state,
    page: filters.page ?? (Object.keys(filters).some(k => k !== "page") ? 1 : state.page),
    limit: filters.limit ?? state.limit,
    status: (filters.status as AppointmentStatus | "") ?? state.status,
    tenantId: filters.tenantId ?? state.tenantId,
    search: filters.search ?? state.search,
  })),

  fetchAppointments: async () => {
    const { page, limit, status, tenantId, search } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getAllAppointments({
        page,
        limit,
        status,
        tenantId,
        search
      });
      if (response.status && response.data) {
        // The API returns appointments array in 'data' field
        set({
            appointments: response.data || [],
            total: response.total || 0
        });
      } else {
        set({ error: response.message || "Failed to fetch appointments" });
      }
    } catch (error: any) {
         set({ error: error.message || "An unexpected error occurred" });
    } finally {
      set({ isLoading: false });
    }
  }
}));
