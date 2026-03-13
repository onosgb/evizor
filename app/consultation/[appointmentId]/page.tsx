"use client";

import { use, useEffect, useState, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import {
  useRealtimeKitClient,
} from "@cloudflare/realtimekit-react";
import type {
  Message as RTKMessage,
  ChatUpdateParams,
} from "@cloudflare/realtimekit";

import { useAppointmentStore } from "@/app/stores/appointmentStore";
import { usePharmacyStore } from "@/app/stores/pharmacyStore";
import { useToast } from "@/app/contexts/ToastContext";
import { appointmentService } from "@/app/lib/services/appointment.service";
import { VideoSection } from "./components/VideoSection";
import { RightPanel } from "./components/RightPanel";
import ConfirmationModal from "@/app/components/ConfirmationModal";


type Tab = "info" | "notes" | "prescription" | "lab" | "chat";

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const unwrappedParams = use(params);
  const appointmentId = unwrappedParams.appointmentId;

  const [meeting, initMeeting] = useRealtimeKitClient();
  const [error, setError] = useState<string | null>(null);
  const {
    selectedAppointment,
    selectedPatient,
    videoMeetingToken,
    endVideoCall,
    selectAppointment,
    fetchPatientDetails,
    completeAppointment,
    fetchVideoToken,
    actionLoading,
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [notes, setNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<RTKMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [drug, setDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [pharmacyId, setPharmacyId] = useState("");
  const [instructions, setInstructions] = useState("");
  const { pharmacies, fetchPharmacies } = usePharmacyStore();
  const [isSendingPrescription, setIsSendingPrescription] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labType, setLabType] = useState("Lab Test");
  const [isUploadingLab, setIsUploadingLab] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  // Refetch data on mount if missing (e.g., hard refresh)
  useEffect(() => {
    if (!selectedAppointment || selectedAppointment.id !== appointmentId) {
      selectAppointment(appointmentId);
    }
  }, [appointmentId, selectedAppointment, selectAppointment]);

  useEffect(() => {
    const pId = selectedPatient?.id || selectedAppointment?.patientId;
    if (pId && selectedPatient?.id !== pId) {
      fetchPatientDetails(pId);
    }
  }, [
    selectedAppointment?.patientId,
    selectedPatient?.id,
    fetchPatientDetails,
  ]);

  useEffect(() => {
    if (!videoMeetingToken && appointmentId) {
      fetchVideoToken(appointmentId);
    }
  }, [appointmentId, videoMeetingToken, fetchVideoToken]);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  // Initialize RealtimeKit meeting when component mounts
  useEffect(() => {
    const activeToken = videoMeetingToken;
    if (!activeToken) {
      return;
    }

    // Log meeting ID from token so you can compare with mobile (must be same meeting)
    try {
      const payload = JSON.parse(
        atob(activeToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      ) as { meetingId?: string; meeting_id?: string };
      const meetingId = payload.meetingId ?? payload.meeting_id;
      if (meetingId) {
        console.log("[Consultation] [WEB] Token meeting ID:", meetingId);
      }
    } catch {
      // ignore decode errors
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      initMeeting({
        authToken: activeToken,
        defaults: {
          audio: true,
          video: true,
        },
      });

      // Fallback: if we still have no meeting after 30s, show connection message (matches app behavior)
      timeoutId = setTimeout(() => {
        setError((prev) =>
          prev
            ? prev
            : "Connecting is taking longer than expected. Check your connection (try a different network) and try again.",
        );
      }, 30000);
      connectionTimeoutRef.current = timeoutId;
    } catch (err: unknown) {
      console.error("Failed to initialize RealtimeKit meeting:", err);
      setError("Failed to connect to the video server.");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      connectionTimeoutRef.current = null;
    };
  }, [videoMeetingToken, initMeeting, showToast]);

  // Clear connection-timeout error and cancel the 30s timer once meeting is available
  useEffect(() => {
    if (meeting) {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      setError((prev) =>
        prev?.includes("Connecting is taking longer") ? null : prev,
      );
    }
  }, [meeting]);

  // Tracks whether we initiated the leave ourselves, so the "roomLeft"
  // event listener doesn't trigger a second navigation.
  const isLeavingRef = useRef(false);
  const hasJoinedRef = useRef<string | null>(null);

  const handleEndCall = useCallback(async () => {
    if (isLeavingRef.current) return; // prevent double-execution
    isLeavingRef.current = true;
    if (meeting) {
      try {
        await meeting.leave();
      } catch (e) {
        console.warn("Error leaving meeting", e);
        showToast(
          `Error while ending session: ${(e as Error)?.message || "Please try again."}`,
          "error",
        );
      }
    }
    endVideoCall();
    showToast("Session ended. Redirecting to dashboard.", "success");
    router.push("/");
  }, [meeting, endVideoCall, router, showToast]);

  const handleRetryJoin = useCallback(async () => {
    setError(null);
    if (meeting) {
      try {
        await meeting.join();
      } catch (err: unknown) {
        const message =
          (err as Error)?.message || "Failed to join meeting. Try again or go back.";
        console.error("Failed to join meeting (retry)", err);
        setError(message);
        showToast(message, "error");
      }
      return;
    }
    // No meeting yet (init failed or timed out): re-init with current token
    const activeToken = videoMeetingToken;
    if (!activeToken) {
      setError("No session token. Please go back and start the call again.");
      return;
    }
    try {
      initMeeting({
        authToken: activeToken,
        defaults: { audio: true, video: true },
      });
    } catch (err: unknown) {
      console.error("Failed to re-initialize meeting", err);
      setError("Failed to connect. Try again or go back.");
    }
  }, [meeting, videoMeetingToken, initMeeting, showToast]);

  useEffect(() => {
    if (!meeting?.chat) return;

    setChatMessages(meeting.chat.messages || []);

    const handleChatUpdate = (payload: ChatUpdateParams) => {
      // SDK sends full list in payload.messages; use it to avoid duplicates and ordering issues
      if (Array.isArray(payload.messages)) {
        setChatMessages([...payload.messages]);
        return;
      }
      if (payload.action === "add" && payload.message) {
        setChatMessages((prev) => [...prev, payload.message!]);
      } else if (payload.action === "edit" && payload.message) {
        setChatMessages((prev) =>
          prev.map((m) => (m.id === payload.message!.id ? payload.message! : m))
        );
      } else if (payload.action === "delete" && payload.message) {
        setChatMessages((prev) =>
          prev.filter((m) => m.id !== payload.message!.id)
        );
      }
    };

    meeting.chat.on("chatUpdate", handleChatUpdate);

    return () => {
      meeting.chat.off("chatUpdate", handleChatUpdate);
    };
  }, [meeting]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleFinalize = () => {
    setIsFinalizeModalOpen(true);
  };

  const handleConfirmFinalize = async () => {
    setIsFinalizeModalOpen(false);
    try {
      await completeAppointment(appointmentId, {
        doctorNotes: notes,
      });
      showToast("Consultation completed successfully", "success");
      handleEndCall();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to complete consultation", "error");
    }
  };

  const handleSendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || !meeting?.chat) return;

    try {
      await meeting.chat.sendTextMessage(text);
      setChatInput("");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as Error).message
          : "Failed to send message";
      console.error("Failed to send chat message", err);
      showToast(message, "error");
    }
  };

  const handleSendPrescription = async () => {
    if (!pharmacyId) {
      showToast("Please select a pharmacy", "error");
      return;
    }
    if (!drug.trim()) {
      showToast("Please enter a drug name", "error");
      return;
    }

    setIsSendingPrescription(true);
    try {
      await appointmentService.addPrescription(appointmentId, {
        phamacyId: pharmacyId,
        appointmentId,
        medications: [
          {
            drug,
            dosage,
            frequency,
            instructions,
          },
        ],
      });
      showToast("Prescription sent successfully", "success");
      handleEndCall();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to send prescription", "error");
    } finally {
      setIsSendingPrescription(false);
    }
  };

  const handleSendLabRequest = async () => {
    if (!labFile) {
      showToast("Please select a file to upload", "error");
      return;
    }

    setIsUploadingLab(true);
    try {
      await appointmentService.addAttachment(appointmentId, labFile, labType);
      showToast("Attachment uploaded successfully", "success");
      setLabFile(null);
      // Reset file input if possible or rely on state clearing
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload attachment", "error");
    } finally {
      setIsUploadingLab(false);
    }
  };

  useEffect(() => {
    if (!meeting || hasJoinedRef.current === videoMeetingToken) return;

    // Join the room now that we are initialized
    console.log("[Consultation] [WEB] Joining the room...");
    hasJoinedRef.current = videoMeetingToken;
    meeting.join().then(() => {
      console.log("[Consultation] [WEB] We have joined the room");
    }).catch((err: unknown) => {
      const message =
        (err as Error)?.message ||
        "Failed to join meeting. Check your connection and try again.";
      console.error("Failed to join meeting", err);
      // Only set error if we are not already leaving
      if (!isLeavingRef.current) {
        setError(message);
        showToast(message, "error");
      }
    });

    const handleRoomLeft = () => {
      // Only navigate if the room was closed externally (e.g. doctor on another
      // device ended the call). If we initiated the leave ourselves,
      // handleEndCall already pushed to /live-queue.
      if (!isLeavingRef.current) {
        handleEndCall();
      }
    };

    meeting.self.on("roomLeft", handleRoomLeft);

    return () => {
      meeting.self.off("roomLeft", handleRoomLeft);
    };
  }, [meeting, handleEndCall, setError, showToast, videoMeetingToken]);

  // Patient data from store
  const patientDisplayName = selectedPatient
    ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
    : selectedAppointment?.patientName || "Loading...";
  const displayPatientId =
    selectedPatient?.id || selectedAppointment?.patientId || "...";

  const activeToken = videoMeetingToken;

  if (!activeToken && !error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center">
        <p>Loading consultation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen scrollbar-hide flex flex-col bg-slate-50 dark:bg-navy-900 overflow-hidden font-inter">
      <main className="main-content w-full h-screen flex pt-1 pb-4 px-4 lg:pt-1 lg:pb-6 lg:px-6 overflow-hidden">
        <div className="flex w-full min-w-0 h-full gap-3 lg:gap-4 overflow-hidden">
          {/* VIDEO SECTION — memoized so tab switches don't re-render the feed */}
          <VideoSection
            meeting={meeting}
            error={error}
            patientDisplayName={patientDisplayName}
            displayPatientId={displayPatientId}
            onEndCall={handleEndCall}
            onRetry={handleRetryJoin}
          />

          {/* RIGHT PANEL */}
          <RightPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedPatient={selectedPatient}
            selectedAppointment={selectedAppointment}
            notes={notes}
            setNotes={setNotes}
            pharmacyId={pharmacyId}
            setPharmacyId={setPharmacyId}
            pharmacies={pharmacies}
            drug={drug}
            setDrug={setDrug}
            dosage={dosage}
            setDosage={setDosage}
            frequency={frequency}
            setFrequency={setFrequency}
            duration={duration}
            setDuration={setDuration}
            instructions={instructions}
            setInstructions={setInstructions}
            isSendingPrescription={isSendingPrescription}
            handleSendPrescription={handleSendPrescription}
            labType={labType}
            setLabType={setLabType}
            setLabFile={setLabFile}
            labFile={labFile}
            isUploadingLab={isUploadingLab}
            handleSendLabRequest={handleSendLabRequest}
            chatMessages={chatMessages}
            meeting={meeting}
            chatEndRef={chatEndRef}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChatMessage={handleSendChatMessage}
            showToast={showToast}
            handleFinalize={handleFinalize}
            actionLoading={actionLoading}
          />
        </div>
      </main>

      <ConfirmationModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        onConfirm={handleConfirmFinalize}
        title="Finalize Consultation"
        message="Are you sure you want to finalize and close this consultation? This action cannot be undone."
        confirmText="Finalize"
        confirmButtonClass="bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
        isLoading={actionLoading}
        loadingText="Finalizing..."
      />

      <style jsx>{`
        .is-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .is-scrollbar-hidden {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .mirror {
          transform: scaleX(-1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
