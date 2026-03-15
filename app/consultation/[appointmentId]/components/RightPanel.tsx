"use client";

import { Pharmacy, Appointment, User, LabTestType } from "@/app/models";
import { RefObject, useState } from "react";

type Tab = "info" | "notes" | "prescription" | "lab" | "chat";

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
  medications: any[];
  setMedications: (meds: any[]) => void;
  isSendingPrescription: boolean;
  handleSendPrescription: () => void;
  labTestTypeId: string;
  setLabTestTypeId: (id: string) => void;
  labTestTypes: LabTestType[];
  setLabFile: (file: File | null) => void;
  labFile: File | null;
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
  labTestTypeId,
  setLabTestTypeId,
  labTestTypes,
  setLabFile,
  labFile,
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
    <section className="flex flex-col shrink-0 w-[35%] min-w-0 bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 h-full min-h-0 overflow-hidden text-slate-800">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-3 mb-4 text-sm font-medium min-w-0">
        {(["chat", "info", "notes", "prescription", "lab"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 capitalize"
            }
          >
            {tab === "info" ? "Patient Info" : tab}
          </button>
        ))}
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
                {selectedAppointment?.description || "No description provided."}
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
              className="flex-1 w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
            />
          </div>
        )}

        {/* PRESCRIPTION */}
        {activeTab === "prescription" && (
          <div className="space-y-4 animate-fade-in min-w-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <select
                value={pharmacyId}
                onChange={(e) => setPharmacyId(e.target.value)}
                className="col-span-2 border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-blue-600 outline-none bg-white text-sm"
              >
                <option value="">Select Pharmacy</option>
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.address}
                  </option>
                ))}
              </select>

              <div className="col-span-2 border border-blue-100 bg-blue-50/30 rounded-xl p-3 space-y-3">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add Medication</h5>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={currentDrug}
                    onChange={(e) => setCurrentDrug(e.target.value)}
                    placeholder="Drug Name"
                    className="col-span-2 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  <input
                    value={currentDosage}
                    onChange={(e) => setCurrentDosage(e.target.value)}
                    placeholder="Dosage"
                    className="border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  <input
                    value={currentFrequency}
                    onChange={(e) => setCurrentFrequency(e.target.value)}
                    placeholder="Frequency"
                    className="border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  <input
                    value={currentDuration}
                    onChange={(e) => setCurrentDuration(e.target.value)}
                    placeholder="Duration"
                    className="border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  <button
                    onClick={addMedication}
                    className="bg-blue-600 text-white text-xs font-bold rounded-lg px-2 hover:bg-blue-700 transition-colors"
                  >
                    + ADD DRUG
                  </button>
                  <textarea
                    value={currentInstructions}
                    onChange={(e) => setCurrentInstructions(e.target.value)}
                    placeholder="Instructions"
                    className="col-span-2 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none min-h-12 text-xs"
                  />
                </div>
              </div>

              {/* Added Medications List */}
              {medications.length > 0 && (
                <div className="col-span-2 space-y-2">
                  <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Medications List</h5>
                  <div className="space-y-2">
                    {medications.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-2 rounded-lg group">
                        <div className="min-w-0">
                          <p className="font-bold text-blue-600 text-xs">{med.drug}</p>
                          <p className="text-[10px] text-gray-500">
                            {med.dosage} - {med.frequency} ({med.duration})
                          </p>
                        </div>
                        <button
                          onClick={() => removeMedication(idx)}
                          className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSendPrescription}
              disabled={isSendingPrescription || medications.length === 0}
              className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSendingPrescription ? "Sending..." : "Send Prescription"}
            </button>
          </div>
        )}

        {activeTab === "lab" && (
          <div className="space-y-4 text-sm animate-fade-in min-w-0">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">
                Lab Test / Diagnosis
              </label>
              <select
                value={labTestTypeId}
                onChange={(e) => setLabTestTypeId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-blue-600 outline-none bg-white font-inter"
              >
                <option value="">Select Lab Test / Diagnosis</option>
                {labTestTypes.filter(t => t.isActive).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">
                Upload File
              </label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => setLabFile(e.target.files?.[0] || null)}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-600 transition-colors"
                />
                {labFile && (
                  <p className="mt-2 text-xs text-blue-600 font-medium text-center">
                    Selected: {labFile.name}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSendLabRequest}
              disabled={isUploadingLab || !labFile}
              className="w-full py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isUploadingLab ? "Uploading..." : "Send Attachment"}
            </button>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col h-full animate-fade-in min-w-0">
            <div className="flex-1 overflow-y-auto p-2 space-y-2 border border-gray-200 rounded-xl bg-white">
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                   <svg className="size-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                   </svg>
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
              <button
                onClick={handleSendChatMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="pt-4 mt-auto border-t border-gray-100 flex justify-between gap-3 min-w-0 shrink-0">
        <button
          onClick={() => showToast("Draft saved locally", "info")}
          className="flex-1 min-w-0 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors overflow-hidden text-ellipsis whitespace-nowrap"
        >
          Save Draft
        </button>
        <button
          onClick={handleFinalize}
          disabled={actionLoading}
          className="flex-1 min-w-0 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-ellipsis whitespace-nowrap shadow-md"
        >
          {actionLoading ? "Processing..." : "Finalize & Close Case"}
        </button>
      </div>
    </section>
  );
};
