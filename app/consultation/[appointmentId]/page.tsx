"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitSelector,
} from "@cloudflare/realtimekit-react";
import type {
  Message as RTKMessage,
  ChatUpdateParams,
} from "@cloudflare/realtimekit";

import { useAppointmentStore } from "@/app/stores/appointmentStore";
import { usePharmacyStore } from "@/app/stores/pharmacyStore";
import { useLabTestTypeStore } from "@/app/stores/labTestTypeStore";
import { useToast } from "@/app/contexts/ToastContext";
import { appointmentService } from "@/app/lib/services/appointment.service";
import { RightPanel } from "./components/RightPanel";

type Tab = "info" | "notes" | "prescription" | "lab" | "chat";

// Local video (doctor) — inline so page re-renders keep connection rendering
const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);
  const audioTrack = useRealtimeKitSelector((m) => m.self.audioTrack);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (videoTrack || audioTrack) {
      const stream = new MediaStream();
      if (videoTrack) stream.addTrack(videoTrack);
      if (audioTrack) stream.addTrack(audioTrack);
      videoElement.srcObject = stream;
    } else {
      videoElement.srcObject = null;
    }
  }, [videoTrack, audioTrack]);

  return (
    <div className="absolute bottom-4 right-4 w-40 h-56 bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20 flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }}
        className="flex-1 w-full h-full object-cover bg-slate-800"
      />
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium text-white backdrop-blur-sm">
        You (Doctor)
      </div>
    </div>
  );
};

// Remote participants — old logic: only participants.joined, filter self (connection renders with page)
const RemoteVideos = ({ patientDisplayName }: { patientDisplayName: string }) => {
  const participants = useRealtimeKitSelector((m) => m.participants.joined);
  const selfId = useRealtimeKitSelector((m) => m.self.id);
  const participantsArray = Array.from(participants.values()).filter((p: any) => p.id !== selfId);

  useEffect(() => {
    participantsArray.forEach((p: any) => {
      const el = document.getElementById(`rtk-remote-video-${p.id}`) as HTMLVideoElement;
      if (el) {
        const stream = new MediaStream();
        if (p.videoTrack) stream.addTrack(p.videoTrack);
        if (p.audioTrack) stream.addTrack(p.audioTrack);
        if (stream.getTracks().length > 0 && el.srcObject !== stream) {
          el.srcObject = stream;
        }
      }
    });
  }, [participantsArray]);

  if (participantsArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-white/40 space-y-3">
        <div className="size-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
        </div>
        <p className="text-sm font-medium">Waiting for {patientDisplayName} to connect...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid grid-cols-1 overflow-hidden">
      {participantsArray.map((p: any) => (
        <div key={p.id} className="relative w-full h-full flex items-center justify-center bg-slate-900">
          <video
            id={`rtk-remote-video-${p.id}`}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium backdrop-blur-sm border border-white/10">
            {p.name || "Patient"}
          </div>
        </div>
      ))}
    </div>
  );
};

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
  const [medications, setMedications] = useState<any[]>([]);
  const [pharmacyId, setPharmacyId] = useState("");
  const { pharmacies, fetchPharmacies } = usePharmacyStore();
  const [isSendingPrescription, setIsSendingPrescription] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labTestTypeId, setLabTestTypeId] = useState("");
  const { labTestTypes, fetchLabTestTypes } = useLabTestTypeStore();
  const [isUploadingLab, setIsUploadingLab] = useState(false);

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
    fetchLabTestTypes();
  }, [fetchPharmacies, fetchLabTestTypes]);

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
  }, [videoMeetingToken, initMeeting]);

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

  const handleFinalize = async () => {
    try {
      await completeAppointment(appointmentId, {
        doctorNotes: notes,
        medications: medications.map((m: any) => ({
          drug: m.drug,
          dosage: m.dosage,
          frequency: m.frequency,
          instructions: m.instructions ?? m.duration,
        })),
      });
      showToast("Consultation completed successfully", "success");
      handleEndCall();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to complete consultation", "error");
    }
  };

  const handleSendPrescription = async () => {
    if (!pharmacyId) {
      showToast("Please select a pharmacy", "error");
      return;
    }
    if (medications.length === 0) {
      showToast("Please add at least one medication", "error");
      return;
    }
    setIsSendingPrescription(true);
    try {
      await appointmentService.addPrescription(appointmentId, {
        phamacyId: pharmacyId,
        appointmentId,
        medications: medications.map((m: any) => ({
          drug: m.drug,
          dosage: m.dosage,
          frequency: m.frequency,
          instructions: m.instructions ?? m.duration,
        })),
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
      if (labTestTypeId) {
        await appointmentService.uploadLabResult(appointmentId, labTestTypeId, labFile);
      } else {
        await appointmentService.addAttachment(appointmentId, labFile, "Lab Test / Diagnosis");
      }
      showToast("Attachment uploaded successfully", "success");
      setLabFile(null);
      setLabTestTypeId("");
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload attachment", "error");
    } finally {
      setIsUploadingLab(false);
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
    selectedPatient?.healthCardNo|| "...";

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
          {/* VIDEO SECTION — inline so connection keeps rendering */}
          <section className="flex flex-col flex-1 min-w-0 w-full lg:max-w-[55%] bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 relative h-full min-h-0 overflow-hidden">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <h2 className="text-xl font-semibold">Consultation with {patientDisplayName}</h2>
                <p className="text-sm text-gray-500">Patient ID: {displayPatientId}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full animate-pulse">Live</span>
                <button
                  onClick={handleEndCall}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-0 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              {error ? (
                <div className="w-full px-5 py-6 max-w-lg rounded-2xl bg-red-900/70 border border-red-500/30 shadow-lg backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-red-500/20 p-2 text-red-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M8.257 3.099c.366-.746 1.4-.746 1.766 0l6.523 13.307c.35.714-.232 1.594-.883 1.594H2.617c-.651 0-1.233-.88-.883-1.594L8.257 3.1zM10 12a1 1 0 100 2 1 1 0 000-2zm-.75-4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-base font-semibold text-red-100">Call session error</p>
                      <p className="mt-1 text-sm text-red-200">{error}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button onClick={handleRetryJoin} className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition">
                      Retry
                    </button>
                    <button onClick={handleEndCall} className="w-full cursor-pointer px-3 py-2 bg-transparent border border-white/60 text-white rounded-lg hover:bg-white/10 transition">
                      End Meeting
                    </button>
                  </div>
                  <p className="mt-3 text-xs cursor-pointer text-red-200 opacity-80">
                    If the issue persists, refresh the page or check your network.
                  </p>
                </div>
              ) : !meeting ? (
                <div className="flex flex-col items-center text-white space-y-4">
                  <svg className="w-10 h-10 animate-spin text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p>Starting video feed...</p>
                </div>
              ) : (
                <RealtimeKitProvider value={meeting}>
                  <RemoteVideos patientDisplayName={patientDisplayName} />
                  <LocalVideo />
                </RealtimeKitProvider>
              )}
            </div>

            <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
              Doctor: “Can you describe the pain you’re experiencing?”
            </div>
          </section>

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
            medications={medications}
            setMedications={setMedications}
            isSendingPrescription={isSendingPrescription}
            handleSendPrescription={handleSendPrescription}
            labTestTypeId={labTestTypeId}
            setLabTestTypeId={setLabTestTypeId}
            labTestTypes={labTestTypes}
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
