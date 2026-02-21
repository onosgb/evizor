import { create } from "zustand";
import { Appointment, User } from "../models";
import { appointmentService, adminService } from "../lib/services";

interface AppointmentState {
  liveQueue: Appointment[];
  assignedCases: Appointment[];
  assignedTotal: number;
  history: Appointment[];
  selectedPatient: User | null;
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;

  fetchLiveQueue: () => Promise<void>;
  fetchAssignedCases: (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    search?: string;
  }) => Promise<void>;
  fetchHistory: (patientId: string) => Promise<void>;
  fetchPatientDetails: (patientId: string) => Promise<void>;
  selectAppointment: (appointmentId: string | null) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  liveQueue: [],
  assignedCases: [],
  assignedTotal: 0,
  history: [],
  selectedPatient: null,
  selectedAppointment: null,
  isLoading: false,
  error: null,

  fetchLiveQueue: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getLiveQueue();
      console.log(response.data);
      if (response.data && response.data) {
        set({ liveQueue: response.data });
      } else {
        set({ liveQueue: [] });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch live queue" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAssignedCases: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getAssignedCases(params);
      set({ assignedCases: response.data || [], assignedTotal: response.total ?? 0 });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch assigned cases" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHistory: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appointmentService.getPatientHistory(patientId);
      set({ history: response.data || [] });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch history" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPatientDetails: async (patientId: string) => {
    set({ isLoading: true, error: null });
    console.log(patientId);

    const profilePromise = adminService
      .getUserProfile(patientId)
      .then((userProfile) => {
        if (userProfile.data) {
          set({ selectedPatient: userProfile.data });
        }
      })
      .catch((error: any) => {
        console.error("Failed to fetch patient details:", error);
        // Don't set global error here to avoid blocking UI, just log
      });

    const historyPromise = appointmentService
      .getPatientHistory(patientId)
      .then((data) => {
        set({ history: data.data });
      })
      .catch((error: any) => {
        set({ error: error.message || "Failed to fetch patient history" });
      });

    await Promise.all([profilePromise, historyPromise]);
    set({ isLoading: false });
  },
  selectAppointment: async (appointmentId: string | null) => {
    if (!appointmentId) {
      set({ selectedAppointment: null });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const state = useAppointmentStore.getState();
      const appointment =
        state.history.find((a) => a.id === appointmentId) ||
        state.liveQueue.find((a) => a.id === appointmentId) ||
        null;

      if (appointment) {
        set({ selectedAppointment: appointment });
      } else {
        const data = await appointmentService.getAppointmentById(appointmentId);
        set({ selectedAppointment: data });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch appointment details" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
