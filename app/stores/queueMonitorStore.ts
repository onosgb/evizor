import { create } from "zustand";
import { Appointment, AppointmentStatus } from "../models";
import { adminService } from "../lib/services";

interface QueueMonitorState {
  appointments: Appointment[];
  total: number;
  page: number;
  limit: number;
  status: AppointmentStatus | "";
  isLoading: boolean;
  error: string | null;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setStatus: (status: AppointmentStatus | "") => void;
  fetchAppointments: () => Promise<void>;
}

export const useQueueMonitorStore = create<QueueMonitorState>((set, get) => ({
  appointments: [],
  total: 0,
  page: 1,
  limit: 10,
  status: "",
  isLoading: false,
  error: null,

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }), // Reset to page 1 on limit change
  setStatus: (status) => set({ status, page: 1 }), // Reset to page 1 on status change

  fetchAppointments: async () => {
    const { page, limit, status } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getAllAppointments(page, limit, status);
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
