"use client";

import { use, useEffect, useState, useCallback, useRef, memo } from "react";
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
import { useToast } from "@/app/contexts/ToastContext";

// Local video container
const LocalVideo = () => {
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);
  const audioTrack = useRealtimeKitSelector((m) => m.self.audioTrack);

  useEffect(() => {
    const videoElement = document.getElementById(
      "rtk-local-video",
    ) as HTMLVideoElement;
    if (videoElement && videoTrack) {
      const stream = new MediaStream();
      stream.addTrack(videoTrack);
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
      videoElement.srcObject = stream;
    }
  }, [videoTrack, audioTrack]);

  return (
    <div className="absolute bottom-4 right-4 w-40 h-56 bg-black rounded-lg overflow-hidden border-2 border-slate-700 shadow-xl z-20">
      <video
        id="rtk-local-video"
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover mirror"
      />
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white">
        You
      </div>
    </div>
  );
};

// Remote participants container
const RemoteVideos = () => {
  const participants = useRealtimeKitSelector((m) => m.participants.joined);
  const selfId = useRealtimeKitSelector((m) => m.self.id);
  // Filter out the local participant — on slow/bad networks the SDK can
  // briefly include self in the joined map, which splits the screen in two.
  const participantsArray = Array.from(participants.values()).filter(
    (p) => p.id !== selfId,
  );

  // Log when someone joins the room (for debugging same-meeting issues)
  const prevIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const ids = new Set(participantsArray.map((p) => p.id));
    const prev = prevIdsRef.current;
    if (ids.size !== prev.size || [...ids].some((id) => !prev.has(id))) {
      console.log(
        "[Consultation] [WEB] Remote participants:",
        participantsArray.length,
        participantsArray.map((p) => `${p.name ?? "?"} (id=${p.id})`),
      );
      participantsArray.forEach((p) => {
        if (!prev.has(p.id)) {
          console.log(
            "[Consultation] [WEB] Someone joined the room:",
            p.name ?? "Participant",
            `(id=${p.id})`,
          );
        }
      });
      prevIdsRef.current = ids;
    }
  }, [participantsArray]);

  useEffect(() => {
    participantsArray.forEach((p) => {
      const videoElement = document.getElementById(
        `rtk-remote-video-${p.id}`,
      ) as HTMLVideoElement;
      if (videoElement) {
        const stream = new MediaStream();
        if (p.videoTrack) stream.addTrack(p.videoTrack);
        if (p.audioTrack) stream.addTrack(p.audioTrack);
        if (stream.getTracks().length > 0) {
          videoElement.srcObject = stream;
        }
      }
    });
  }, [participantsArray]);

  if (participantsArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white/50">
        <p>Waiting for others to join...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 align-center justify-center h-full w-full">
      {participantsArray.map((p) => (
        <div
          key={p.id}
          className="relative w-full h-full flex items-center justify-center"
        >
          <video
            id={`rtk-remote-video-${p.id}`}
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-lg text-sm text-white font-medium">
            {p.name || "Participant"}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// VideoSection is memoized so switching tabs in the right panel does NOT
// cause the video feed to re-render / re-attach srcObject.
// ---------------------------------------------------------------------------
const VideoSection = memo(function VideoSection({
  meeting,
  error,
  patientDisplayName,
  displayPatientId,
  onEndCall,
  onRetry,
}: {
  meeting: ReturnType<
    typeof import("@cloudflare/realtimekit-react").useRealtimeKitClient
  >[0];
  error: string | null;
  patientDisplayName: string;
  displayPatientId: string;
  onEndCall: () => void;
  onRetry: () => void;
}) {
  return (
    <section className="flex flex-col flex-1 min-w-0 w-full lg:max-w-[55%] bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 relative h-full min-h-0 overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-1.5">
        <div>
          <h2 className="text-xl font-semibold">
            Consultation with {patientDisplayName}
          </h2>
          <p className="text-sm text-gray-500">
            Patient ID: {displayPatientId}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-full animate-pulse">
            Live
          </span>
          <button
            onClick={onEndCall}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative flex-1 min-h-0 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
        {error ? (
          <div className="w-full px-5 py-6 max-w-lg rounded-2xl bg-red-900/70 border border-red-500/30 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-red-500/20 p-2 text-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.366-.746 1.4-.746 1.766 0l6.523 13.307c.35.714-.232 1.594-.883 1.594H2.617c-.651 0-1.233-.88-.883-1.594L8.257 3.1zM10 12a1 1 0 100 2 1 1 0 000-2zm-.75-4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-red-100">
                  Call session error
                </p>
                <p className="mt-1 text-sm text-red-200">{error}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={onRetry}
                className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
              >
                Retry
              </button>
              <button
                onClick={onEndCall}
                className="w-full cursor-pointer px-3 py-2 bg-transparent border border-white/60 text-white rounded-lg hover:bg-white/10 transition"
              >
                End Meeting
              </button>
            </div>
            <p className="mt-3 text-xs cursor-pointer text-red-200 opacity-80">
              If the issue persists, refresh the page or check your network.
            </p>
          </div>
        ) : !meeting ? (
          <div className="flex flex-col items-center text-white space-y-4">
            <svg
              className="w-10 h-10 animate-spin text-white opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Starting video feed...</p>
          </div>
        ) : (
          <RealtimeKitProvider value={meeting}>
            <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden rounded-2xl">
              <RemoteVideos />
              <LocalVideo />
            </div>
          </RealtimeKitProvider>
        )}
      </div>

      {/* Transcript (Mocked) */}
      <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
        Doctor: “Can you describe the pain you’re experiencing?”
      </div>
    </section>
  );
});

type Tab = "info" | "notes" | "prescription" | "lab" | "chat";

interface Medication {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

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
  const [medications, setMedications] = useState<Medication[]>([]);
  const [drug, setDrug] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

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

  // Fetch token if missing (Session Recovery)
  useEffect(() => {
    if (!videoMeetingToken && appointmentId) {
      fetchVideoToken(appointmentId);
    }
  }, [appointmentId, videoMeetingToken, fetchVideoToken]);

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
      );
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
    } catch (err: any) {
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
      } catch (err: any) {
        const message =
          err?.message || "Failed to join meeting. Try again or go back.";
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
    } catch (err: any) {
      console.error("Failed to re-initialize meeting", err);
      setError("Failed to connect. Try again or go back.");
    }
  }, [meeting, videoMeetingToken, initMeeting]);

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
        notes,
        medications,
      });
      showToast("Consultation completed successfully", "success");
      handleEndCall();
    } catch (err: any) {
      showToast(err.message || "Failed to complete consultation", "error");
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
    if (!meeting) return;

    // Join the room now that we are initialized
    console.log("[Consultation] [WEB] Joining the room...");
    meeting.join().then(() => {
      console.log("[Consultation] [WEB] We have joined the room");
    }).catch((err: any) => {
      const message =
        err?.message ||
        "Failed to join meeting. Check your connection and try again.";
      console.error("Failed to join meeting", err);
      setError(message);
      showToast(message, "error");
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
  }, [meeting, handleEndCall, setError]);

  const addMedication = () => {
    if (!drug.trim()) {
      showToast("Please enter a drug name", "error");
      return;
    }
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        drug,
        dosage,
        frequency,
        duration,
      },
    ]);
    setDrug("");
    setDosage("");
    setFrequency("");
    setDuration("");
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m: Medication) => m.id !== id));
  };

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
          <section className="flex flex-col shrink-0 w-[35%] min-w-0 bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 h-full min-h-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 border-b pb-3 mb-4 text-sm font-medium min-w-0">
              <button
                onClick={() => setActiveTab("chat")}
                className={
                  activeTab === "chat"
                    ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={
                  activeTab === "info"
                    ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Patient Info
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={
                  activeTab === "notes"
                    ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab("prescription")}
                className={
                  activeTab === "prescription"
                    ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Prescription
              </button>
              <button
                onClick={() => setActiveTab("lab")}
                className={
                  activeTab === "lab"
                    ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
                    : "text-gray-500 hover:text-gray-700"
                }
              >
                Lab
              </button>
            </div>

            <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden is-scrollbar-hidden pb-4">
              {/* PATIENT INFO */}
              {activeTab === "info" && (
                <div className="space-y-4 animate-fade-in min-w-0">
                  <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                    <p>
                      <strong>Age:</strong>{" "}
                      {selectedPatient?.dob
                        ? new Date().getFullYear() -
                          new Date(selectedPatient.dob).getFullYear()
                        : "—"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedPatient?.gender || "—"}
                    </p>
                    <p>
                      <strong>Weight:</strong>{" "}
                      {selectedPatient?.weight ||
                        selectedAppointment?.patientWeight ||
                        "—"}{" "}
                      kg
                    </p>
                    <p>
                      <strong>Height:</strong>{" "}
                      {selectedPatient?.height ||
                        selectedAppointment?.patientHeight ||
                        "—"}{" "}
                      cm
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Consultation Context</h4>
                    <p className="text-sm text-gray-600 italic">
                      {selectedAppointment?.description ||
                        "No description provided."}
                    </p>
                  </div>
                </div>
              )}

              {/* NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-4 animate-fade-in h-full flex flex-col min-w-0">
                  <h4 className="font-semibold">Consultation Notes</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type your clinical notes here..."
                    className="flex-1 w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2a27c2] focus:border-transparent outline-none resize-none"
                  />
                  <button
                    onClick={() => showToast("Notes saved locally", "info")}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              )}

              {/* PRESCRIPTION */}
              {activeTab === "prescription" && (
                <div className="space-y-4 animate-fade-in min-w-0">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <input
                      value={drug}
                      onChange={(e) => setDrug(e.target.value)}
                      placeholder="Drug Name"
                      className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none"
                    />
                    <input
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="Dosage"
                      className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none"
                    />
                    <input
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="Frequency"
                      className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none"
                    />
                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Duration"
                      className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none"
                    />
                  </div>

                  <button
                    onClick={addMedication}
                    className="w-full py-2 bg-green-50 text-green-600 border border-green-200 rounded-xl hover:bg-green-100 font-medium transition-colors"
                  >
                    + Add Medication
                  </button>

                  <div className="space-y-2 mt-4">
                    {medications.map((m: Medication) => (
                      <div
                        key={m.id}
                        className="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-sm text-gray-800">
                            {m.drug}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {m.dosage} {m.dosage && m.frequency ? "•" : ""}{" "}
                            {m.frequency} {m.frequency && m.duration ? "•" : ""}{" "}
                            {m.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMedication(m.id)}
                          className="text-red-500 text-xs font-medium hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {medications.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">
                        No medications added yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* LAB */}
              {activeTab === "lab" && (
                <div className="space-y-4 text-sm animate-fade-in min-w-0">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Select Test
                    </label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white">
                      <option>Full Blood Count</option>
                      <option>Lipid Profile</option>
                      <option>Chest X-Ray</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Priority
                    </label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white">
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">
                      Notes to Lab
                    </label>
                    <textarea
                      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-1 focus:ring-[#2a27c2] outline-none resize-none h-24"
                      placeholder="Additional instructions..."
                    />
                  </div>
                  <button
                    onClick={() =>
                      showToast("Lab request sent successfully", "success")
                    }
                    className="w-full py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Send Lab Request
                  </button>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="flex flex-col h-full animate-fade-in min-w-0">
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-gray-200 rounded-xl bg-white">
                    {chatMessages.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">
                        No messages yet. Start the chat.
                      </p>
                    ) : (
                      chatMessages.map((msg) => {
                        const isOwn = msg.userId === meeting?.self?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`rounded-xl p-2 text-sm ${
                              isOwn
                                ? "bg-[#2a27c2] text-white self-end"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="font-medium text-xs uppercase opacity-70 mb-0.5">
                              {isOwn ? "You" : msg.displayName || "Participant"}
                              <span className="ml-2 text-[10px] text-gray-500">
                                {msg.time
                                  ? new Date(msg.time).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <div>{"message" in msg ? msg.message : ""}</div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-200 rounded-xl p-2 outline-none focus:ring-1 focus:ring-[#2a27c2]"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="px-4 py-2 bg-[#2a27c2] text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="pt-4 mt-auto border-t border-gray-100 flex justify-between gap-3 min-w-0 shrink-0">
              <button
                onClick={() => showToast("Draft saved locally", "info")}
                className="flex-1 min-w-0 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
              >
                Save Draft
              </button>
              <button
                onClick={handleFinalize}
                disabled={
                  actionLoading ||
                  (activeTab === "prescription" && medications.length === 0)
                }
                className="flex-1 min-w-0 py-2.5 bg-[#2a27c2] text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {actionLoading ? "Processing..." : "Finalize & Close Case"}
              </button>
            </div>
          </section>
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
