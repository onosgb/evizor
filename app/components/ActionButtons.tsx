"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { getTheme, UserRole } from "../lib/roles";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "../models";
import { useAppointmentStore } from "../stores/appointmentStore";
import ConfirmationModal from "./ConfirmationModal";
import { useRouter } from "next/navigation";
import { useToast } from "../contexts/ToastContext";
import { Button } from "./ui/button";
import { CheckCircle2, Info } from "lucide-react";

export default function ActionButtons() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const toast = useToast();
  const selectedAppointment = useAppointmentStore((state) => state.selectedAppointment);
  const setClinicalAlert = useAppointmentStore((state) => state.setClinicalAlert);
  const actionLoading = useAppointmentStore((state) => state.actionLoading);
  const startVideoCall = useAppointmentStore((state) => state.startVideoCall);
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

  const variant = theme === "admin" ? "success" : "default";

  return (
    <>
      <div className="flex justify-center space-x-2">
        {/* Accept Button */
        (selectedAppointment?.status === AppointmentStatus.SCHEDULED && user?.role == UserRole.DOCTOR) ? (
          <Button
            onClick={() => setAcceptModalOpen(true)}
            variant="outline"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              theme === "admin" 
                ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white" 
                : "border-primary text-primary hover:bg-primary hover:text-white"
            )}
            title="Accept"
            disabled={actionLoading}
          >
            <CheckCircle2 className="size-5" />
          </Button>
        ) : null}

        {/* Clinical Alert Button */
        (user?.role !== UserRole.DOCTOR && (selectedAppointment?.status !== AppointmentStatus.CANCELLED && selectedAppointment?.status !== AppointmentStatus.COMPLETED && selectedAppointment?.status !== AppointmentStatus.CLINICAL)) ? (
          <Button
            onClick={() => setClinicalAlertModalOpen(true)}
            variant="outline"
            size="icon"
            className={cn(
              "size-9 rounded-full",
              theme === "admin" 
                ? "border-green-600 text-green-600 hover:bg-green-600 hover:text-white" 
                : "border-primary text-primary hover:bg-primary hover:text-white"
            )}
            title="Clinical Alert"
            disabled={actionLoading}
          >
            <Info className="size-5" />
          </Button>
        ) : null}
       
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
onConfirm={async () => {
  if (selectedAppointment) {
    try {
      await startVideoCall(selectedAppointment.id);
      router.push(`/consultation/${selectedAppointment.id}`);
    } catch (err: any) {
      toast.showToast(err.message || "Failed to start video call", "error");
    }
  }
  setAcceptModalOpen(false);
}}
variant={variant}
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
    if (selectedAppointment?.id) {
      try {
        await setClinicalAlert(selectedAppointment.id);
        toast.showToast("Clinical alert sent successfully", "success");
      } catch (err: any) {
        toast.showToast(err.message || "Failed to send clinical alert", "error");
      }
    }
    setClinicalAlertModalOpen(false);
}}
variant={variant}
/>
    </>
  );
}
