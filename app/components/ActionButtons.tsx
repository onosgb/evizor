"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { getTheme, UserRole } from "../lib/roles";
import { AppointmentStatus } from "../models";
import { useAppointmentStore } from "../stores/appointmentStore";
import ConfirmationModal from "./ConfirmationModal";

export default function ActionButtons() {
  const user = useAuthStore((state) => state.user);
  const selectedAppointment = useAppointmentStore((state) => state.selectedAppointment);
  const setClinicalAlert = useAppointmentStore((state) => state.setClinicalAlert);
  const actionLoading = useAppointmentStore((state) => state.actionLoading);
  const theme = getTheme(user);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [clinicalAlertModalOpen, setClinicalAlertModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAcceptModalOpen(false);
        setClinicalAlertModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const btnClass =
    theme === "admin"
      ? "btn size-9 border border-green-600 p-0 font-medium text-green-600 hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white active:bg-green-600/90 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-white dark:focus:bg-green-500 dark:focus:text-white dark:active:bg-green-500/90"
      : "btn size-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90";

  const applyBtnClass =
    theme === "admin"
      ? "btn min-w-28 rounded-full bg-green-600 font-medium text-white hover:bg-green-700 focus:bg-green-700 active:bg-green-700/90 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-500/90"
      : "btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90";

  return (
    <>
      <div className="flex justify-center space-x-2">
        {/* Accept Button */
        (selectedAppointment?.status === AppointmentStatus.SCHEDULED && user?.role == UserRole.DOCTOR)? <button
          onClick={() => setAcceptModalOpen(true)}
          className={btnClass}
          title="Accept"
          disabled={actionLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 12.5l3 3l5-6" />
              <circle cx="12" cy="12" r="10" />
            </g>
          </svg>
        </button>:<></>
         
        
        }

        {/* Clinical Alert Button */
        (user?.role !== UserRole.DOCTOR && (selectedAppointment?.status !== AppointmentStatus.CANCELLED && selectedAppointment?.status !== AppointmentStatus.COMPLETED && selectedAppointment?.status !== AppointmentStatus.CLINICAL))? <button
          onClick={() => setClinicalAlertModalOpen(true)}
          className={btnClass}
          title="Clinical Alert"
          disabled={actionLoading}
          
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 0 0-11.3 0l-39.6 39.6a8.03 8.03 0 0 0 0 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0m669.6-79.2l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-67.9 67.9a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3M832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32M484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8" />
          </svg>
        </button>:<></>}
       
      </div>

<ConfirmationModal 
isOpen={acceptModalOpen}
onClose={() => setAcceptModalOpen(false)}
title="Accept Patient"
loadingText="Accepting Patient..."
confirmText="Accept"
cancelText="Cancel"
isLoading={actionLoading}
message="Are you sure you want to accept this patient?"
onConfirm={() => {
  setAcceptModalOpen(false);
  // Handle accept logic here
}}
/>

<ConfirmationModal 
isOpen={clinicalAlertModalOpen}
onClose={() => setClinicalAlertModalOpen(false)}
title="Clinical Alert"
loadingText="Sending Clinical Alert..."
confirmText="Send Clinical Alert"
cancelText="Cancel"
isLoading={actionLoading}
message="Are you sure you want to send a clinical alert?"
onConfirm={async () => {
  await setClinicalAlert(selectedAppointment?.id!);
  setClinicalAlertModalOpen(false);
}}
/>
    </>
  );
}
