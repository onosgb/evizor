"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RealtimeKitProvider, useRealtimeKitClient, useRealtimeKitMeeting, useRealtimeKitSelector } from "@cloudflare/realtimekit-react";

import { useAppointmentStore } from "@/app/stores/appointmentStore";
import { useToast } from "@/app/contexts/ToastContext";

// Local video container
const LocalVideo = () => {
  const { meeting } = useRealtimeKitMeeting();
  const videoTrack = useRealtimeKitSelector((m) => m.self.videoTrack);
  const audioTrack = useRealtimeKitSelector((m) => m.self.audioTrack);

  useEffect(() => {
    const videoElement = document.getElementById("rtk-local-video") as HTMLVideoElement;
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
  const { meeting } = useRealtimeKitMeeting();
  const participants = useRealtimeKitSelector((m) => m.participants.joined);
  const participantsArray = Array.from(participants.values());

  useEffect(() => {
    participantsArray.forEach((p) => {
      const videoElement = document.getElementById(`rtk-remote-video-${p.id}`) as HTMLVideoElement;
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
        <div key={p.id} className="relative w-full h-full flex items-center justify-center">
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

type Tab = "info" | "notes" | "prescription" | "lab";

interface Medication {
  id: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export default function ConsultationPage({ params }: { params: Promise<{ appointmentId: string }> }) {
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
    actionLoading
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [notes, setNotes] = useState("");
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
  }, [selectedAppointment?.patientId, selectedPatient?.id, fetchPatientDetails]);

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

    try {
      initMeeting({
        authToken: activeToken,
        defaults: {
          audio: true,
          video: true,
        },
      });
    } catch (err: any) {
      console.error("Failed to initialize RealtimeKit meeting:", err);
      setError("Failed to connect to the video server.");
    }
  }, [videoMeetingToken, initMeeting]);

  const handleEndCall = async () => {
    if (meeting) {
      try {
        await meeting.leave();
      } catch (e) {
         console.warn("Error leaving meeting", e);
      }
    }
    endVideoCall();
    router.push("/live-queue");
  };

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




  useEffect(() => {
    if (!meeting) return;
    
    // Join the room now that we are initialized
    meeting.join().catch((err: any) => {
      console.error("Failed to join meeting", err);
      setError("Failed to join meeting.");
    });

    const handleRoomLeft = () => {
      handleEndCall();
    };

    meeting.self.on("roomLeft", handleRoomLeft);

    return () => {
      meeting.self.off("roomLeft", handleRoomLeft);
    };
  }, [meeting]);

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
  const displayPatientId = selectedPatient?.id || selectedAppointment?.patientId || "...";


  const activeToken = videoMeetingToken;

  if (!activeToken && !error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-900 flex items-center justify-center">
        <p>Loading consultation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-900 overflow-hidden font-inter">
      <main className="main-content w-full h-screen flex p-4 lg:p-6">
        <div className="flex flex-1 gap-6 h-full">

          {/* VIDEO SECTION */}
          <section className="flex flex-col flex-2 bg-white rounded-2xl shadow-md p-6 relative h-full">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
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

            {/* Video Container */}
            <div className="relative flex-1 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
              {error ? (
                <div className="flex flex-col items-center text-white">
                  <p className="text-lg text-red-500 mb-2">{error}</p>
                  <button onClick={() => router.push('/live-queue')} className="underline text-blue-400">Go Back</button>
                </div>
              ) : !meeting ? (
                <div className="flex flex-col items-center text-white space-y-4">
                  <svg className="w-10 h-10 animate-spin text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p>Starting video feed...</p>
                </div>
              ) : (
                <RealtimeKitProvider value={meeting}>
                  <div className="relative flex-1 w-full h-full bg-slate-900 overflow-hidden rounded-2xl">
                    {/* Render remote participants (Patient) */}
                    <RemoteVideos />
                    
                    {/* Render local participant (Doctor) */}
                    <LocalVideo />
                  </div>
                </RealtimeKitProvider>
              )}
            </div>

            {/* Transcript (Mocked as per template) */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
               Doctor: “Can you describe the pain you’re experiencing?”
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside className="w-1/3 min-w-87.5 bg-white rounded-2xl shadow-md p-6 flex flex-col h-full">
            {/* Tabs */}
            <div className="flex space-x-6 border-b pb-3 mb-4 text-sm font-medium overflow-x-auto is-scrollbar-hidden">
              <button 
                onClick={() => setActiveTab('info')} 
                className={activeTab === 'info' ? "border-b-2 border-[#2a27c2] text-[#2a27c2]" : "text-gray-500 hover:text-gray-700"}
              >
                Patient Info
              </button>
              <button 
                onClick={() => setActiveTab('notes')} 
                className={activeTab === 'notes' ? "border-b-2 border-[#2a27c2] text-[#2a27c2]" : "text-gray-500 hover:text-gray-700"}
              >
                Notes
              </button>
              <button 
                onClick={() => setActiveTab('prescription')} 
                className={activeTab === 'prescription' ? "border-b-2 border-[#2a27c2] text-[#2a27c2]" : "text-gray-500 hover:text-gray-700"}
              >
                Prescription
              </button>
              <button 
                onClick={() => setActiveTab('lab')} 
                className={activeTab === 'lab' ? "border-b-2 border-[#2a27c2] text-[#2a27c2]" : "text-gray-500 hover:text-gray-700"}
              >
                Lab
              </button>
            </div>

            <div className="flex-1 overflow-y-auto is-scrollbar-hidden pb-4">
              {/* PATIENT INFO */}
              {activeTab === 'info' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded-xl text-sm space-y-2">
                    <p><strong>Age:</strong> {selectedPatient?.dob ? (new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()) : "—"}</p>
                    <p><strong>Gender:</strong> {selectedPatient?.gender || "—"}</p>
                    <p><strong>Weight:</strong> {selectedPatient?.weight || selectedAppointment?.patientWeight || "—"} kg</p>
                    <p><strong>Height:</strong> {selectedPatient?.height || selectedAppointment?.patientHeight || "—"} cm</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Consultation Context</h4>
                    <p className="text-sm text-gray-600 italic">
                      {selectedAppointment?.description || "No description provided."}
                    </p>
                  </div>
                </div>
              )}

              {/* NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-4 animate-fade-in h-full flex flex-col">
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
              {activeTab === 'prescription' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <input 
                      value={drug} onChange={(e) => setDrug(e.target.value)}
                      placeholder="Drug Name" className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none" 
                    />
                    <input 
                      value={dosage} onChange={(e) => setDosage(e.target.value)}
                      placeholder="Dosage" className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none" 
                    />
                    <input 
                      value={frequency} onChange={(e) => setFrequency(e.target.value)}
                      placeholder="Frequency" className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none" 
                    />
                    <input 
                      value={duration} onChange={(e) => setDuration(e.target.value)}
                      placeholder="Duration" className="border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none" 
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
                      <div key={m.id} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center border border-gray-100">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{m.drug}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {m.dosage} {m.dosage && m.frequency ? "•" : ""} {m.frequency} {m.frequency && m.duration ? "•" : ""} {m.duration}
                          </p>
                        </div>
                        <button onClick={() => removeMedication(m.id)} className="text-red-500 text-xs font-medium hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    ))}
                    {medications.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">No medications added yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* LAB */}
              {activeTab === 'lab' && (
                <div className="space-y-4 text-sm animate-fade-in">
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Select Test</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white">
                      <option>Full Blood Count</option>
                      <option>Lipid Profile</option>
                      <option>Chest X-Ray</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Priority</label>
                    <select className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white">
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700">Notes to Lab</label>
                    <textarea 
                      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-1 focus:ring-[#2a27c2] outline-none resize-none h-24" 
                      placeholder="Additional instructions..."
                    />
                  </div>
                  <button 
                    onClick={() => showToast("Lab request sent successfully", "success")}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Send Lab Request
                  </button>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="pt-4 mt-auto border-t border-gray-100 flex justify-between gap-3">
              <button 
                onClick={() => showToast("Draft saved locally", "info")}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Save Draft
              </button>
              <button 
                onClick={handleFinalize}
                disabled={actionLoading || (activeTab === 'prescription' && medications.length === 0)}
                className="flex-2 py-2.5 bg-[#2a27c2] text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Processing..." : "Finalize & Close Case"}
              </button>
            </div>
          </aside>

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
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
