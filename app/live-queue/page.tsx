"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PatientCard from "../components/PatientCard";
import PatientCardWithMenu from "./_components/PatientCardWithMenu";
import { Appointment } from "../models";
import { appointmentService } from "../lib/services";

export default function LiveQueuePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveQueue = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getLiveQueue();
        if (response.data && response.data.appointments) {
          setAppointments(response.data.appointments);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch live queue");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveQueue();
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }
    if (diffInMinutes > 0) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

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
          {appointments.slice(0, 11).map((appointment) => (
            <PatientCard 
              key={appointment.id} 
              id={appointment.id}
              name={appointment.patientName}
              timeAgo={getTimeAgo(appointment.scheduledAt)}
              symptom={appointment.description}
            />
          ))}
          {/* Example of PatientCardWithMenu for the last item or specific logic */}
          {appointments.length > 11 && (
             <PatientCardWithMenu 
               id={appointments[11].id}
               name={appointments[11].patientName}
               timeAgo={getTimeAgo(appointments[11].scheduledAt)}
               symptom={appointments[11].description}
             />
          )}
        </div>
      )}
      
      {!loading && !error && appointments.length > 0 && (
        <div className="mt-10">
            {/* Pagination Logic placeholder */}
           <ol className="pagination space-x-1.5">
          <li>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-lg bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-3 leading-tight text-white transition-colors hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-lg bg-slate-150 text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </li>
        </ol>
        </div>
      )}
    </DashboardLayout>
  );
}
