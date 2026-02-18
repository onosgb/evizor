"use client";

import ActionButtons from "../../components/ActionButtons";
import { useAppointmentStore } from "../../stores/appointmentStore";

export default function PatientSymptomsPage() {
  const { selectedAppointment, isLoading } = useAppointmentStore();

  return (
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Symptoms
        </h2>
        <ActionButtons />
      </div>

      {isLoading ? (
        <div className="animate-pulse p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-32 rounded bg-slate-200 dark:bg-navy-500" />
                <div className={`h-4 rounded bg-slate-200 dark:bg-navy-500 ${i % 2 === 0 ? "w-56" : "w-40"}`} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span>Primary Complaint</span>
              <span className="relative mt-1.5 flex">
                <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                  {selectedAppointment?.description ?? "—"}
                </span>
              </span>
            </label>
            <label className="block">
              <span>Selected Symptoms</span>
              <span className="relative mt-1.5 flex">
                <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                  {selectedAppointment?.symptoms?.join(" / ") ?? "—"}
                </span>
              </span>
            </label>
            <label className="block">
              <span>Duration of Symptoms</span>
              <span className="relative mt-1.5 flex">
                <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                  {selectedAppointment?.duration ?? "—"}
                </span>
              </span>
            </label>
            <label className="block">
              <span>Severity Level</span>
              <span className="relative mt-1.5 flex">
                <span className="text-base font-medium text-slate-600 dark:text-navy-100">
                  {selectedAppointment
                    ? `${selectedAppointment.severity} / 10`
                    : "—"}
                </span>
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
