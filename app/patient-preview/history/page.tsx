"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ActionButtons from "../../components/ActionButtons";
import { useAppointmentStore } from "../../stores/appointmentStore";
import { Appointment } from "../../models";
import HistoryAccordion from "./_components/HistoryAccordion";

export default function PatientHistoryPage() {
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
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          History
        </h2>
        <ActionButtons />
      </div>
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary dark:border-navy-500 dark:border-t-accent"></div>
          </div>
        ) : (
          <HistoryAccordion items={historyItems} />
        )}
      </div>
    </div>
  );
}
