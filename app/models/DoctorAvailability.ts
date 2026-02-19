export type AvailabilityStatus = "Pending" | "Accepted" | "Rejected";

export interface CreateScheduleRequest {
  date: string;
  doctorId: string;
  startTime: string;
  endTime: string;
}
export interface DoctorAvailability {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
}

export interface ProposeAvailabilityRequest {
  date: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  reason?: string;
}
