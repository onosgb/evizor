"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import PatientSidebar from "../components/PatientSidebar";
import { useAppointmentStore } from "../stores/appointmentStore";
import { useAuthStore } from "../stores/authStore";
import { getTheme } from "../lib/roles";

export default function PatientPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const patientId = searchParams.get("patientId");

  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);

  const {
    selectedAppointment,
    selectedPatient,
    selectAppointment,
    fetchPatientDetails,
  } = useAppointmentStore();

  // Load appointment from URL
  useEffect(() => {
    if (appointmentId) {
      selectAppointment(appointmentId);
    }
  }, [appointmentId, selectAppointment]);

  // Load patient: use patientId from URL when available,
  // otherwise fall back to patientId derived from the loaded appointment
  useEffect(() => {
    const id = patientId ?? selectedAppointment?.patientId;
    if (id) {
      fetchPatientDetails(id);
    }
  }, [patientId, selectedAppointment?.patientId, fetchPatientDetails]);

  return (
    <DashboardLayout theme={theme}>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Patient Preview
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600"></div>
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <Link
              href="/live-queue"
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
            >
              Live Queue
            </Link>
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
              />
            </svg>
          </li>
          <li>Patient Preview</li>
        </ul>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <div className="col-span-12 lg:col-span-4">
          <PatientSidebar
            patientName={
              selectedPatient
                ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                : undefined
            }
            location={selectedPatient?.address ?? undefined}
            avatarSrc={selectedPatient?.profilePictureUrl ?? undefined}
            theme={theme}
          />
        </div>

        <div className="col-span-12 lg:col-span-8">{children}</div>
      </div>
    </DashboardLayout>
  );
}
