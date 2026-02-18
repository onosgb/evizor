"use client";

import { useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PatientCard from "../components/PatientCard";
import { useAppointmentStore } from "../stores/appointmentStore";

export default function LiveQueuePage() {
  const { liveQueue: appointments, isLoading: loading, error, fetchLiveQueue } = useAppointmentStore();

  useEffect(() => {
    fetchLiveQueue();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
            Live Patient Queue
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <label className="relative hidden sm:flex">
            <input
              className="form-input peer h-9 w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 text-xs-plus placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              placeholder="Search users..."
              type="text"
            />
            <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 transition-colors duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z" />
              </svg>
            </span>
          </label>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center p-10">
          <div className="spinner is-elastic h-7 w-7 animate-spin rounded-full border-[3px] border-primary/30 border-r-primary dark:border-accent/30 dark:border-r-accent"></div>
        </div>
      )}

      {error && (
        <div className="alert flex rounded-lg bg-error/10 py-4 px-4 text-error dark:bg-error/15 sm:px-5">
            {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {appointments.map((appointment) => (
            <PatientCard 
              key={appointment.id} 
              id={appointment.id}
              patientId={appointment.patientId}
              name={appointment.patientName}
              scheduledAt={appointment.scheduledAt}
              symptom={appointment.description}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
