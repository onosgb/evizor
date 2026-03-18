export interface MedicationRequest {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionRequest {
  phamacyId: string;
  appointmentId: string;
  medications: MedicationRequest[];
}

export interface CompleteAppointmentRequest {
  doctorNotes: string;
}
