"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PatientCard from "../components/PatientCard";
import { useAppointmentStore } from "../stores/appointmentStore";
import { useSearchContext } from "../contexts/SearchContext";
import ConfirmationModal from "../components/ConfirmationModal";

export default function LiveQueuePage() {
  const { liveQueue: appointments, isLoading: loading, error, fetchLiveQueue, startVideoCall, rejectAppointment, isVideoLoading, isRejecting } = useAppointmentStore();
  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: "info" | "success" | "danger";
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

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

  const handleAcceptClick = (appointmentId: string, patientName: string) => {
    setModalConfig({
      isOpen: true,
      title: "Accept Appointment",
      message: `Are you sure you want to accept the appointment with ${patientName} and start the video call?`,
      type: "success",
      confirmText: "Accept & Start",
      onConfirm: async () => {
        await startVideoCall(appointmentId);
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRejectClick = (appointmentId: string, patientName: string) => {
    setModalConfig({
      isOpen: true,
      title: "Reject Appointment",
      message: `Are you sure you want to reject the appointment with ${patientName}? This action cannot be undone.`,
      type: "danger",
      confirmText: "Reject",
      onConfirm: async () => {
        await rejectAppointment(appointmentId);
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
            Live Patient Queue
          </h2>
        </div>

      </div>

      {/* Toast Error Notification */}
      {error && (
        <div className="fixed bottom-4 right-4 z-100 flex items-center p-4 mb-4 text-sm text-error rounded-lg bg-error/10 shadow-lg border border-error/20 animate-fade-in dark:bg-error/20" role="alert">
          <svg className="shrink-0 inline w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium mr-1">Error:</span> {error}
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
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filteredAppointments.map((appointment) => (
            <PatientCard
              key={appointment.id}
              id={appointment.id}
              patientId={appointment.patientId}
              name={appointment.patientName}
              scheduledAt={appointment.scheduledAt}
              symptom={appointment.description}
              avatarSrc={appointment.patientImageUrl?? "/images/200x200.png"}
              onAccept={() => handleAcceptClick(appointment.id, appointment.patientName)}
              onReject={() => handleRejectClick(appointment.id, appointment.patientName)}
            />
          ))}
        </div>
      )}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        isLoading={isVideoLoading || isRejecting}
      />
    </DashboardLayout>
  );
}
