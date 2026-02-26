export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
  CLINICAL = 'clinical'
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
  severity?: number; // legacy global severity
  scheduledAt: string;
  createdAt: string;
  tenantId: string;
  attachments: string[];
  symptoms: any[]; // Supports both legacy strings and new `{ symptomId, severity, name }` objects
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
