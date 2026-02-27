"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PatientCard from "../components/PatientCard";
import { useAppointmentStore } from "../stores/appointmentStore";
import { useSearchContext } from "../contexts/SearchContext";

export default function LiveQueuePage() {
  const { liveQueue: appointments, isLoading: loading, error, fetchLiveQueue } = useAppointmentStore();
  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    registerPageSearch("Search patients...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    fetchLiveQueue();
  }, []);

  const filteredAppointments = appointments.filter((a) =>
    a.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
            Live Patient Queue
          </h2>
        </div>

      </div>

      {error && (
        <div className="alert flex rounded-lg bg-error/10 py-4 px-4 text-error dark:bg-error/15 sm:px-5">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse p-4">
              <div className="flex items-center space-x-3">
                <div className="size-12 rounded-full bg-slate-200 dark:bg-navy-500 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
                  <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 w-40 rounded bg-slate-200 dark:bg-navy-500" />
                <div className="h-3 w-28 rounded bg-slate-200 dark:bg-navy-500" />
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-navy-500" />
                <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-navy-500" />
              </div>
            </div>
          ))}
        </div>
      ) : !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filteredAppointments.map((appointment) => (
            <PatientCard
              key={appointment.id}
              id={appointment.id}
              patientId={appointment.patientId}
              name={appointment.patientName}
              scheduledAt={appointment.scheduledAt}
              symptom={appointment.description}
              avatarSrc={appointment.patientImageUrl}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
