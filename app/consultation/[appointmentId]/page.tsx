"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  StreamVideo,
  StreamVideoClient as StreamClient,
  StreamCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { useAppointmentStore } from "@/app/stores/appointmentStore";
import { usePharmacyStore } from "@/app/stores/pharmacyStore";
import { useToast } from "@/app/contexts/ToastContext";
import { appointmentService } from "@/app/lib/services/appointment.service";
import { RightPanel } from "./components/RightPanel";
import { Attachment } from "@/app/models";

type Tab = "Info" | "Notes" | "Prescription" | "Lab / Diagnosis" | "Chat";

// Local video (doctor) — inline so page re-renders keep connection rendering
const LocalVideo = () => {
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  if (!localParticipant) return null;

  return (
    <div className="absolute bottom-28 right-4 w-32 h-44 bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20 flex flex-col">
      <ParticipantView
        participant={localParticipant}
        mirror={true}
        className="flex-1 w-full h-full object-cover bg-slate-800"
      />
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-medium text-white backdrop-blur-sm">
        You (Doctor)
      </div>
    </div>
  );
};

// Remote participants — prioritized 1-on-1 layout
const RemoteVideos = ({ patientDisplayName }: { patientDisplayName: string }) => {
  const { useRemoteParticipants } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();

  if (remoteParticipants.length === 0) {
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

  // In 1-on-1, the first remote participant is the patient
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <ParticipantView 
        participant={remoteParticipants[0]} 
        className="w-full h-full object-cover"
        mirror={false}
      />
    </div>
  );
};

// Custom mobile-like controls
const ConsultationControls = ({ onLeave }: { onLeave: () => void }) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCamMuted } = useCameraState();

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
      {/* Mic Toggle */}
      <button
        onClick={() => microphone.toggle()}
        className={`size-10 rounded-xl flex items-center justify-center transition-all ${
          isMicMuted 
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
      >
        {isMicMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Camera Toggle */}
      <button
        onClick={() => camera.toggle()}
        className={`size-10 rounded-xl flex items-center justify-center transition-all ${
          isCamMuted 
            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
        title={isCamMuted ? "Turn Camera On" : "Turn Camera Off"}
      >
        {isCamMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth={2} />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* End Call */}
      <button
        onClick={onLeave}
        className="h-10 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-lg shadow-red-500/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2 2m-2-2v10m-6-8l-2-2m0 0l-2 2m2-2v10m-6-8l-2-2m0 0l-2 2m2-2v10" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        End Call
      </button>
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

  const [client, setClient] = useState<StreamClient | null>(null);
  const [call, setCall] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    selectedAppointment,
    selectedPatient,
    streamCredentials,
    endVideoCall,
    selectAppointment,
    fetchPatientDetails,
    completeAppointment,
    fetchVideoToken,
    actionLoading,
    history,
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = useState<Tab>("Notes");
  const [notes, setNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [pharmacyId, setPharmacyId] = useState("");
  const { pharmacies, fetchPharmacies } = usePharmacyStore();
  const [isSendingPrescription, setIsSendingPrescription] = useState(false);
  const [uploads, setUploads] = useState<Attachment[]>([]);
  const [isUploadingLab, setIsUploadingLab] = useState(false);
  
  // Refs to allow cleanup on unmount even if state is stale
  const callRef = useRef<any>(null);
  const clientRef = useRef<StreamClient | null>(null);

  // Sync refs with state
  useEffect(() => {
    callRef.current = call;
    clientRef.current = client;
  }, [call, client]);

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
    if (!streamCredentials && appointmentId) {
      fetchVideoToken(appointmentId);
    }
  }, [appointmentId, streamCredentials, fetchVideoToken]);

  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  const hasInitializedRef = useRef(false);

  // Initialize Stream Video client when credentials arrive
  useEffect(() => {
    if (!streamCredentials || hasInitializedRef.current) return;

    const initStream = async () => {
      hasInitializedRef.current = true;
      const { userId, userToken, callId, callType } = streamCredentials;
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

      const newClient = new StreamClient(apiKey);
      setClient(newClient);

      try {
        await newClient.connectUser(
          { id: userId, name: selectedAppointment?.doctorName || "Doctor" },
          userToken
        );
        console.log("[Stream] User connected successfully");

        const newCall = newClient.call(callType, callId);
        setCall(newCall);

        // Initiate the ringing flow by adding members and setting ring: true
        const patientId = selectedAppointment?.patientId || (selectedPatient as any)?.id;
        await newCall.getOrCreate({
          ring: true,
          data: {
            members: [
              { user_id: userId, role: 'admin' },
              { user_id: patientId, role: 'user' },
            ].filter(m => m.user_id),
          },
        });

        await newCall.join();
        console.log("[Stream] Joined and rang call successfully");
      } catch (err: any) {
        console.error("[Stream] Initialization failed:", err);
        setError(`Video initialization failed: ${err.message || "Unknown error"}`);
        hasInitializedRef.current = false; // Allow retry
      }
    };

    initStream();

    return () => {
      hasInitializedRef.current = false;
    };
  }, [streamCredentials, selectedAppointment?.doctorName]);

  // Handle cleanup on unmount to ensure camera/mic are released if user navigates away
  useEffect(() => {
    return () => {
      // If we haven't already explicitly left (via handleEndCall)
      if (!isLeavingRef.current) {
        if (callRef.current) {
          console.log("[Stream] Cleaning up call on unmount");
          callRef.current.leave().catch((e: any) => console.warn("Error leaving call", e));
        }
        if (clientRef.current) {
          console.log("[Stream] Disconnecting client on unmount");
          clientRef.current.disconnectUser().catch((e: any) => console.warn("Error disconnecting client", e));
        }
      }
    };
  }, []);

  // Initialization Effect return handles cleanup

  // Tracks whether we initiated the leave ourselves, so the "roomLeft"
  // event listener doesn't trigger a second navigation.
  const isLeavingRef = useRef(false);

  const handleEndCall = useCallback(async () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    if (call) {
      try {
        await call.leave();
      } catch (e) {
        console.warn("Error leaving call", e);
      }
    }
    if (client) {
      await client.disconnectUser();
    }
    endVideoCall();
    showToast("Session ended. Redirecting to dashboard.", "success");
    router.push("/");
  }, [call, client, endVideoCall, router, showToast]);

  const handleRetryJoin = useCallback(async () => {
    setError(null);
    if (call) {
      try {
        await call.join({ create: true });
      } catch (err: unknown) {
        const message = (err as Error)?.message || "Failed to join call. Try again.";
        setError(message);
        showToast(message, "error");
      }
      return;
    }
    
    if (appointmentId) {
      fetchVideoToken(appointmentId);
    }
  }, [call, appointmentId, fetchVideoToken, showToast]);

  // Handle incoming chat messages via custom events
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event: any) => {
      if (event.type === "chat") {
        setChatMessages((prev) => [
          ...prev,
          {
            id: event.event_id || Date.now().toString(),
            sender: { name: event.user?.name || "Patient" },
            text: event.custom.text,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    });

    return () => unsubscribe();
  }, [call]);

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
      setTimeout(() => handleEndCall(), 1000);
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
      await appointmentService.addPrescription({
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
      setTimeout(() => handleEndCall(), 1000);
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to send prescription", "error");
    } finally {
      setIsSendingPrescription(false);
    }
  };

  const handleSendLabRequest = async () => {
    if (uploads.length === 0) {
      showToast("Please select at least one file to upload", "error");
      return;
    }
    setIsUploadingLab(true);
    try {
      await appointmentService.addAttachments(appointmentId, uploads);
      showToast("Attachment(s) uploaded successfully", "success");
      setUploads([]);
    } catch (err: unknown) {
      showToast(
        (err as Error).message || "Failed to upload attachment(s)",
        "error"
      );
    } finally {
      setIsUploadingLab(false);
    }
  };

  const handleSendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || !call) return;

    try {
      await call.sendCustomEvent({
        type: "chat",
        text: text,
      });

      // Add to local state
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: { name: "You" },
          text: text,
          timestamp: new Date().toISOString(),
        },
      ]);
      setChatInput("");
    } catch (err: unknown) {
      console.error("Failed to send chat message", err);
      showToast("Failed to send message", "error");
    }
  };

  // Effects above handle joining and messaging

  // Patient data from store
  const patientDisplayName = selectedPatient
    ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
    : selectedAppointment?.patientName || "Loading...";
  const displayPatientId =
    selectedPatient?.healthCardNo|| "...";


  return (
    <div className="h-dvh scrollbar-hide flex flex-col bg-slate-50 dark:bg-navy-900 overflow-hidden font-inter">
      <main className="main-content w-full h-full flex items-center pt-4 pb-12 px-4 lg:pt-6 lg:pb-16 lg:px-10 overflow-hidden">
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
              </div>
            </div>

            <div className="relative flex-1 min-h-0 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              {(!client || !call) && !error ? (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-8">
                  <div className="size-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/40 font-medium text-sm">Initializing secure video session...</p>
                </div>
              ) : error ? (
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
                </div>
              ) : (
                <StreamVideo client={client!}>
                  <StreamCall call={call!}>
                    <RemoteVideos patientDisplayName={patientDisplayName} />
                    <LocalVideo />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
                       <ConsultationControls onLeave={handleEndCall} />
                    </div>
                  </StreamCall>
                </StreamVideo>
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
            uploads={uploads}
            setUploads={setUploads}
            isUploadingLab={isUploadingLab}
            handleSendLabRequest={handleSendLabRequest}
            chatMessages={chatMessages}
            chatEndRef={chatEndRef}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendChatMessage={handleSendChatMessage}
            showToast={showToast}
            handleFinalize={handleFinalize}
            actionLoading={actionLoading}
            history={history}
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
