export interface DoctorAvailability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctorId: string;
}
