"use client";

import ActionButtons from "../components/ActionButtons";
import { useAppointmentStore } from "../stores/appointmentStore";

export default function PatientPreviewPage() {
  const { selectedPatient, selectedAppointment } = useAppointmentStore();

  return (
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Patient Details
        </h2>
        <ActionButtons />
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="text-base">Basic Information</h4>
        <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span>Patient ID</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedPatient?.id ?? "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Full Name</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedPatient
                  ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                  : "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Date of Birth</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedPatient?.dob ?? "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Gender</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedPatient?.gender ?? "—"}
              </span>
            </span>
          </label>
        </div>

        <h4 className="mt-5 text-base">Contact &amp; Visit Context</h4>
        <div className="my-7 h-px bg-slate-200 dark:bg-navy-500"></div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span>Consultation Type</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedAppointment?.description ?? "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Queue Entry Time</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedAppointment
                  ? new Date(selectedAppointment.scheduledAt).toLocaleString()
                  : "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Duration</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedAppointment?.duration ?? "—"}
              </span>
            </span>
          </label>
          <label className="block">
            <span>Status</span>
            <span className="relative mt-1.5 flex">
              <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                {selectedAppointment?.status ?? "—"}
              </span>
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
