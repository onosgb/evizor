"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ActionButtons from "../../components/ActionButtons";
import { useAppointmentStore } from "../../stores/appointmentStore";
import { Appointment } from "../../models";
import HistoryAccordion from "./_components/HistoryAccordion";

function PatientHistoryContent() {
  const searchParams = useSearchParams();
  const { history, isLoading, selectAppointment } = useAppointmentStore();

  useEffect(() => {
    const appointmentId = searchParams.get("appointmentId");
    if (appointmentId) {
      selectAppointment(appointmentId);
    }
  }, [searchParams, selectAppointment]);

  const historyItems = history.map((appointment: Appointment) => ({
    id: appointment.id,
    title: appointment.doctorName || "Pending Assignment",
    date: new Date(appointment.scheduledAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    description: appointment.description,
    details: {
      primaryComplaint: appointment.symptoms.join(", "),
      selectedSymptoms: appointment.symptoms.join(" / "),
      duration: appointment.duration,
      severityLevel: `${appointment.severity}–10 scale`,
    },
  }));

  return (
    <div className="p-4 sm:p-5">
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-navy-500"
            >
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-navy-500" />
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-500" />
              </div>
              <div className="size-5 rounded bg-slate-200 dark:bg-navy-500" />
            </div>
          ))}
        </div>
      ) : (
        <HistoryAccordion items={historyItems} />
      )}
    </div>
  );
}

export default function PatientHistoryPage() {
  return (
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          History
        </h2>
        <ActionButtons />
      </div>
      <Suspense fallback={
        <div className="p-4 sm:p-5 animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-navy-500">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200 dark:bg-navy-500" />
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-500" />
              </div>
              <div className="size-5 rounded bg-slate-200 dark:bg-navy-500" />
            </div>
          ))}
        </div>
      }>
        <PatientHistoryContent />
      </Suspense>
    </div>
  );
}
