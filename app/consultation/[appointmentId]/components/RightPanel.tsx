"use client";

import { Pharmacy, Appointment, User, Attachment, MedicationRequest } from "@/app/models";
import { RefObject, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormSelect } from "@/app/components/ui/FormSelect";
import { FormTextarea } from "@/app/components/ui/FormTextarea";
import { History, Trash2, Send, MessageSquareText } from "lucide-react";

type Tab = "Info" | "Notes" | "Prescription" | "Lab / Diagnosis" | "Chat";

interface ChatMessage {
  id: string;
  sender: { name: string };
  text: string;
  timestamp: string;
}

interface RightPanelProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  selectedPatient: User | null;
  selectedAppointment: Appointment | null;
  notes: string;
  setNotes: (notes: string) => void;
  pharmacyId: string;
  setPharmacyId: (id: string) => void;
  pharmacies: Pharmacy[];
  medications: MedicationRequest[];
  setMedications: (meds: MedicationRequest[]) => void;
  isSendingPrescription: boolean;
  handleSendPrescription: () => void;
  uploads: Attachment[];
  setUploads: (uploads: Attachment[]) => void;
  isUploadingLab: boolean;
  handleSendLabRequest: () => void;
  chatMessages: ChatMessage[];
  chatEndRef: RefObject<HTMLDivElement | null>;
  chatInput: string;
  setChatInput: (input: string) => void;
  handleSendChatMessage: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  handleFinalize: () => void;
  actionLoading: boolean;
  history: Appointment[];
}

export const RightPanel = ({
  activeTab,
  setActiveTab,
  selectedPatient,
  selectedAppointment,
  notes,
  setNotes,
  pharmacyId,
  setPharmacyId,
  pharmacies,
  medications,
  setMedications,
  isSendingPrescription,
  handleSendPrescription,
  uploads,
  setUploads,
  isUploadingLab,
  handleSendLabRequest,
  chatMessages,
  chatEndRef,
  chatInput,
  setChatInput,
  handleSendChatMessage,
  showToast,
  handleFinalize,
  actionLoading,
  history,
}: RightPanelProps) => {
  // Local state for current drug form
  const [currentDrug, setCurrentDrug] = useState("");
  const [currentDosage, setCurrentDosage] = useState("");
  const [currentFrequency, setCurrentFrequency] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [currentInstructions, setCurrentInstructions] = useState("");

  const addMedication = () => {
    if (!currentDrug.trim()) {
      showToast("Drug name is required", "error");
      return;
    }
    const newMed = {
      drug: currentDrug,
      dosage: currentDosage,
      frequency: currentFrequency,
      duration: currentDuration,
      instructions: currentInstructions,
      // Create a combined instruction for mobile display
      displayInstructions: `${currentFrequency ? currentFrequency + ' times daily. ' : ''}${currentDuration ? 'For ' + currentDuration + '. ' : ''}${currentInstructions || ''}`.trim()
    };
    setMedications([...medications, newMed]);
    // Reset form
    setCurrentDrug("");
    setCurrentDosage("");
    setCurrentFrequency("");
    setCurrentDuration("");
    setCurrentInstructions("");
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  return (
    <section className="flex flex-col shrink-0 w-[35%] min-w-0 bg-white rounded-2xl shadow-md pt-1 pb-2 px-4 lg:pt-2 lg:pb-3 lg:px-6 h-full min-h-0 overflow-hidden text-slate-800">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-3 mb-4 text-sm font-medium min-w-0">
        {(["Chat", "Info", "Notes", "Prescription", "Lab / Diagnosis"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 capitalize"
            }
          >
            {tab === "Info" ? "Patient Info" : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 flex flex-col min-h-0 pb-4">
        {/* PATIENT INFO */}
        {activeTab === "Info" && (
          <div className="flex-1 space-y-4 animate-fade-in min-w-0 overflow-y-auto">
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
                {selectedAppointment?.description || "No description provided."}
              </p>
            </div>

            {/* Previous Consultations */}
            <div className="pt-2">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <History className="size-4 text-blue-600" />
                Previous Consultations
              </h4>
              <div className="space-y-3">
                {history.filter(a => a.id !== selectedAppointment?.id).length > 0 ? (
                  history
                    .filter(a => a.id !== selectedAppointment?.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((h) => (
                      <div key={h.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="font-bold text-slate-700">{new Date(h.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider ${
                            h.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium mb-1">Dr. {h.doctorName}</p>
                        {h.description && (
                          <p className="text-slate-400 italic line-clamp-2 leading-relaxed">{h.description}</p>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 italic">No previous history available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === "Notes" && (
          <div className="flex-1 space-y-4 animate-fade-in flex flex-col min-w-0">
            <FormTextarea
              label="Consultation Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your clinical notes here..."
              className="flex-1"
              rows={10}
            />
          </div>
        )}

        {/* PRESCRIPTION */}
        {activeTab === "Prescription" && (
          <div className="flex-1 space-y-4 animate-fade-in min-w-0 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <FormSelect
                  label="Pharmacy Referral"
                  value={pharmacyId}
                  onChange={(e) => setPharmacyId(e.target.value)}
                  options={[
                    { value: "", label: "Select Pharmacy" },
                    ...pharmacies.map((p) => ({
                      value: p.id,
                      label: `${p.name} - ${p.address}`,
                    })),
                  ]}
                />
              </div>

              <div className="col-span-2 border border-blue-100 bg-blue-50/30 rounded-xl p-3 space-y-3">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add Medication</h5>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    value={currentDrug}
                    onChange={(e) => setCurrentDrug(e.target.value)}
                    placeholder="Drug"
                    type="text"
                  />
                  <FormSelect
                    value={currentDosage}
                    onChange={(e) => setCurrentDosage(e.target.value)}
                    options={[
                      { value: "", label: "Dosage" },
                      ...Array.from({ length: 5 }, (_, i) => ({
                        value: `${i + 1} Dose(s)`,
                        label: `${i + 1} Dose(s)`,
                      })),
                    ]}
                  />
                  <FormSelect
                    value={currentFrequency}
                    onChange={(e) => setCurrentFrequency(e.target.value)}
                    options={[
                      { value: "", label: "Frequency" },
                      { value: "Once a day", label: "Once a day" },
                      ...Array.from({ length: 4 }, (_, i) => ({
                        value: `${i + 2} times a day`,
                        label: `${i + 2} times a day`,
                      })),
                    ]}
                  />
                  <FormSelect
                    value={currentDuration}
                    onChange={(e) => setCurrentDuration(e.target.value)}
                    options={[
                      { value: "", label: "Duration" },
                      { value: "Once", label: "Once" },
                      ...Array.from({ length: 29 }, (_, i) => ({
                        value: `${i + 2} days`,
                        label: `${i + 2} days`,
                      })),
                    ]}
                  />
                  <div className="col-span-2">
                    <FormTextarea
                      value={currentInstructions}
                      onChange={(e) => setCurrentInstructions(e.target.value)}
                      placeholder="Instructions (Optional)"
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={addMedication}
                    className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                    size="sm"
                  >
                    + ADD DRUG
                  </Button>
                </div>
              </div>

              {/* Added Medications List */}
              {medications.length > 0 && (
                <div className="col-span-2 space-y-2">
                  <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Medications List</h5>
                  <div className="space-y-2">
                    {medications.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-2 rounded-lg group">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-blue-600 text-[13px]">{med.drug}</p>
                            <span className="text-[11px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold">
                              {med.dosage}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {med.frequency} • {med.duration}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeMedication(idx)}
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSendPrescription}
              disabled={isSendingPrescription || medications.length === 0}
              fullWidth
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSendingPrescription ? "Sending..." : "Send Prescription"}
            </Button>
          </div>
        )}

        {activeTab === "Lab / Diagnosis" && (
          <div className="flex-1 space-y-6 text-sm animate-fade-in min-w-0 overflow-y-auto">
            {["Diagnosis", "Lab Test"].map((types) => {
              const currentUpload = uploads.find((u) => u.types === types);
              return (
                <div key={types} className="space-y-1.5">
                  <span className="text-sm font-medium">{types} Upload</span>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const otherUploads = uploads.filter(
                            (u) => u.types !== types
                          );
                          setUploads([...otherUploads, { file, types }]);
                        }
                      }}
                      className={`w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        currentUpload
                          ? "border-blue-500 bg-blue-50/30"
                          : "border-gray-200 hover:border-blue-600"
                      }`}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p
                        className={`text-xs ${
                          currentUpload
                            ? "text-blue-600 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {currentUpload
                          ? `Selected: ${currentUpload.file.name}`
                          : "No file selected (Optional)"}
                      </p>
                      {currentUpload && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setUploads(uploads.filter((u) => u.types !== types));
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-medium h-auto p-1"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              onClick={handleSendLabRequest}
              disabled={isUploadingLab || uploads.length === 0}
              fullWidth
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              {isUploadingLab ? "Uploading..." : "Send Attachment(s)"}
            </Button>
          </div>
        )}

        {activeTab === "Chat" && (
          <div className="flex-1 flex flex-col animate-fade-in min-w-0 overflow-y-auto">
            <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-gray-200 rounded-xl bg-white">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                   <MessageSquareText className="size-10 mb-2" />
                   <p className="text-sm">No messages yet. Start the chat.</p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isOwn = msg.sender.name === "You";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                    >
                       <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                             {isOwn ? "You" : msg.sender.name}
                          </span>
                          <span className="text-[10px] text-slate-300">
                             {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                          isOwn 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-slate-100 text-slate-800 rounded-tl-none"
                       }`}>
                          {msg.text}
                       </div>
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
                className="flex-1 border border-gray-200 rounded-xl p-2 outline-none focus:ring-1 focus:ring-blue-600 text-sm"
              />
              <Button
                onClick={handleSendChatMessage}
                size="icon"
                variant="default"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 mt-auto border-t border-gray-100 flex justify-center min-w-0 shrink-0">
        <Button
          onClick={handleFinalize}
          disabled={actionLoading || !notes.trim()}
          fullWidth
          size="lg"
          variant="optima"
          className="shadow-md"
        >
          {actionLoading ? "Processing..." : "Finalize Consultation"}
        </Button>
      </div>
    </section>
  );
};
