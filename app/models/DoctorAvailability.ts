export type AvailabilityStatus = "Pending" | "Accepted" | "Rejected";
export interface DoctorAvailability {
  id: string;
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
  status: "Accepted" | "Rejected";
}
