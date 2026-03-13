import { create } from "zustand";
import { Appointment, AppointmentStatus, User, CompleteAppointmentRequest } from "../models";
import { ListQueryParams } from "../models/QueryParams";
import { appointmentService, adminService } from "../lib/services";

interface AppointmentState {
  liveQueue: Appointment[];
  assignedCases: Appointment[];
  clinicalAlerts: Appointment[];
  assignedTotal: number;
  history: Appointment[];
  selectedPatient: User | null;
  selectedAppointment: Appointment | null;
  isQueueLoading: boolean;
  isHistoryLoading: boolean;
  isPatientLoading: boolean;
  alertsLoading: boolean;
  actionLoading: boolean;
  isRejecting: boolean;
  error: string | null;

  videoMeetingToken: string | null;
  videoMeetingId: string | null;
  isVideoLoading: boolean;

  fetchLiveQueue: (isBackground?: boolean) => Promise<void>;
  fetchAssignedCases: (params?: ListQueryParams) => Promise<void>;
  fetchHistory: (patientId: string) => Promise<void>;
  fetchPatientDetails: (patientId: string) => Promise<void>;
  selectAppointment: (appointmentId: string | null) => void;
  setClinicalAlert: (appointmentId: string) => Promise<void>;
  fetchClinicalAlerts: () => Promise<void>;
  startVideoCall: (appointmentId: string) => Promise<void>;
  fetchVideoToken: (appointmentId: string) => Promise<void>;
  rejectAppointment: (appointmentId: string) => Promise<void>;
  completeAppointment: (appointmentId: string, data: CompleteAppointmentRequest) => Promise<void>;
  endVideoCall: () => void;
  addLiveQueueItem: (appointment: Appointment) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  liveQueue: [],
  assignedCases: [],
  clinicalAlerts: [],
  assignedTotal: 0,
  history: [],
  selectedPatient: null,
  selectedAppointment: null,
  isQueueLoading: false,
  isHistoryLoading: false,
  isPatientLoading: false,
  alertsLoading: true,
  actionLoading: false,
  isRejecting: false,
  error: null,
  videoMeetingToken: null,
  videoMeetingId: null,
  isVideoLoading: false,

  

  startVideoCall: async (appointmentId: string) => {
    const state = get();
    set({ isVideoLoading: true, error: null });
    try {
      const data = await appointmentService.requestVideoToken(appointmentId);

      const { liveQueue, assignedCases } = get();
      const appointment = 
        liveQueue.find((a: Appointment) => a.id === appointmentId) || 
        assignedCases.find((a: Appointment) => a.id === appointmentId) ||
        state.selectedAppointment;

      set({ 
        videoMeetingToken: data.dyteToken,
        selectedAppointment: appointment 
          ? { ...appointment, status: AppointmentStatus.PROGRESS } 
          : null 
      });

      if (appointment?.patientId) {
        get().fetchPatientDetails(appointment.patientId);
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to start video call" });
    } finally {
      set({ isVideoLoading: false });
    }
  },
  
  fetchVideoToken: async (appointmentId: string) => {
    set({ isVideoLoading: true, error: null });
    try {
      const data = await appointmentService.fetchAppointmentToken(appointmentId);
      set({ 
        videoMeetingToken: data.dyteToken,
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to fetch video token" });
    } finally {
      set({ isVideoLoading: false });
    }
  },

  rejectAppointment: async (appointmentId: string) => {
    set({ isRejecting: true, error: null });
    try {
      // If there's no backend endpoint for reject yet, we just update local state
      // await appointmentService.rejectAppointment(appointmentId);
      
      // Update local state to reflect rejection
      const { liveQueue, assignedCases, selectedAppointment } = get();
      const updateInList = (list: Appointment[]) => 
        list.filter((a) => a.id !== appointmentId);

      set({
        liveQueue: updateInList(liveQueue),
        assignedCases: updateInList(assignedCases),
        selectedAppointment: selectedAppointment?.id === appointmentId 
          ? null 
          : selectedAppointment
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to reject appointment" });
    } finally {
      set({ isRejecting: false });
    }
  },

  completeAppointment: async (appointmentId: string, data: CompleteAppointmentRequest) => {
    set({ actionLoading: true, error: null });
    try {
      await appointmentService.completeAppointment(appointmentId, data);
      const state = get();
      set({ 
        selectedAppointment: state.selectedAppointment?.id === appointmentId 
          ? { ...state.selectedAppointment, status: AppointmentStatus.COMPLETED } 
          : state.selectedAppointment 
      });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to complete appointment" });
      throw error;
    } finally {
      set({ actionLoading: false });
    }
  },

  endVideoCall: () => {
    set({ videoMeetingToken: null, videoMeetingId: null });
  },

  setClinicalAlert: async (appointmentId: string) => {
    const state = get();
    set({ actionLoading: true, error: null });
    try {
      await appointmentService.setClinicalAlert(appointmentId)
      set({ selectedAppointment: { ...state.selectedAppointment!, status: AppointmentStatus.CLINICAL } });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to set clinical alert" });
    } finally {
      set({ actionLoading: false });
    }
  },

  fetchClinicalAlerts: async () => {
    set({ alertsLoading: true, clinicalAlerts: [], error: null });
    try {
      const response = await appointmentService.getAllAppointments({status: AppointmentStatus.CLINICAL});
      set({ clinicalAlerts: response.data || [] });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to fetch clinical alerts" });
    } finally {
      set({ alertsLoading: false });
    }
  },

  fetchLiveQueue: async (isBackground = false) => {
    if (!isBackground) set({ isQueueLoading: true, error: null });
    try {
      const response = await appointmentService.getLiveQueue();
      console.log(response.data);
      if (response.data && response.data) {
        set({ liveQueue: response.data });
      } else {
        set({ liveQueue: [] });
      }
    } catch (error: unknown) {
      if (!isBackground) {
        set({ error: (error as Error).message || "Failed to fetch live queue" });
      }
    } finally {
      if (!isBackground) set({ isQueueLoading: false });
    }
  },

  fetchAssignedCases: async (params?: ListQueryParams) => {
    set({ isQueueLoading: true, error: null }); // Using isQueueLoading for consistency in dashboard
    try {
      const response = await appointmentService.getAssignedCases(params);
      set({ assignedCases: response.data || [], assignedTotal: response.total ?? 0 });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to fetch assigned cases" });
    } finally {
      set({ isQueueLoading: false });
    }
  },

  fetchHistory: async (patientId: string) => {
    set({ isHistoryLoading: true, error: null });
    try {
      const response = await appointmentService.getPatientHistory(patientId);
      set({ history: response.data || [] });
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to fetch history" });
    } finally {
      set({ isHistoryLoading: false });
    }
  },

  fetchPatientDetails: async (patientId: string) => {
    set({ isPatientLoading: true, error: null });

    const profilePromise = adminService
      .getUserProfile(patientId)
      .then((userProfile) => {
        if (userProfile.data) {
          set({ selectedPatient: userProfile.data });
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to fetch patient details:", error);
        // Don't set global error here to avoid blocking UI, just log
      });

    const historyPromise = appointmentService
      .getPatientHistory(patientId)
      .then((data) => {
        set({ history: data.data });
      })
      .catch((error: unknown) => {
        set({ error: (error as Error).message || "Failed to fetch patient history" });
      });

    await Promise.all([profilePromise, historyPromise]);
    set({ isPatientLoading: false });
  },
  selectAppointment: async (appointmentId: string | null) => {
    if (!appointmentId) {
      set({ selectedAppointment: null });
      return;
    }

    set({ isQueueLoading: true, error: null });

    try {
      const state = useAppointmentStore.getState();
      const appointment =
        state.history.find((a: Appointment) => a.id === appointmentId) ||
        state.liveQueue.find((a: Appointment) => a.id === appointmentId) ||
        null;

      if (appointment) {
        set({ selectedAppointment: appointment });
      } else {
        const data = await appointmentService.getAppointmentById(appointmentId);
        set({ selectedAppointment: data });
      }
    } catch (error: unknown) {
      set({ error: (error as Error).message || "Failed to fetch appointment details" });
    } finally {
      set({ isQueueLoading: false });
    }
  },
  addLiveQueueItem: (appointment: Appointment) => {
    const { liveQueue } = get();
    // Avoid duplicates
    if (liveQueue.some((a: Appointment) => a.id === appointment.id)) return;
    set({ liveQueue: [...liveQueue, appointment] });
  },
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => {
    const { liveQueue, assignedCases, selectedAppointment } = get();
    
    const updateInList = (list: Appointment[]) => 
      list.map((a) => (a.id === appointmentId ? { ...a, status } : a));

    set({
      liveQueue: updateInList(liveQueue),
      assignedCases: updateInList(assignedCases),
      selectedAppointment: selectedAppointment?.id === appointmentId 
        ? { ...selectedAppointment, status } 
        : selectedAppointment
    });
  },
}));
