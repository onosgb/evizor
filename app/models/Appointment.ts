export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show"; // Adjust based on actual API
  description: string;
  duration: string;
  severity: number;
  scheduledAt: string;
  createdAt: string;
}

export interface LiveQueueResponse {
  appointments: Appointment[];
  total: number;
}
