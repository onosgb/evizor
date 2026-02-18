export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: AppointmentStatus;
  description: string;
  duration: string;
  severity: number;
  scheduledAt: string;
  createdAt: string;
  attachments: string[];
  symptoms: string[];
}

export interface LiveQueueResponse {
  data: Appointment[];
  total: number;
}

export interface AllAppointmentsResponse {
  data: Appointment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
