"use client";

import type { Message as RTKMessage } from "@cloudflare/realtimekit";
import RealtimeKitClient from "@cloudflare/realtimekit";
import { Pharmacy, Appointment, User } from "@/app/models";
import { RefObject } from "react";

type Tab = "info" | "notes" | "prescription" | "lab" | "chat";

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
  drug: string;
  setDrug: (drug: string) => void;
  dosage: string;
  setDosage: (dosage: string) => void;
  frequency: string;
  setFrequency: (freq: string) => void;
  duration: string;
  setDuration: (dur: string) => void;
  instructions: string;
  setInstructions: (inst: string) => void;
  isSendingPrescription: boolean;
  handleSendPrescription: () => void;
  labType: string;
  setLabType: (type: string) => void;
  setLabFile: (file: File | null) => void;
  labFile: File | null;
  isUploadingLab: boolean;
  handleSendLabRequest: () => void;
  chatMessages: RTKMessage[];
  meeting: RealtimeKitClient | null;
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
  drug,
  setDrug,
  dosage,
  setDosage,
  frequency,
  setFrequency,
  duration,
  setDuration,
  instructions,
  setInstructions,
  isSendingPrescription,
  handleSendPrescription,
  labType,
  setLabType,
  setLabFile,
  labFile,
  isUploadingLab,
  handleSendLabRequest,
  chatMessages,
  meeting,
  chatEndRef,
  chatInput,
  setChatInput,
  handleSendChatMessage,
  showToast,
  handleFinalize,
  actionLoading,
}: RightPanelProps) => {
  return (
    <section className="flex flex-col shrink-0 w-[35%] min-w-0 bg-white rounded-2xl shadow-md pt-2 pb-4 px-4 lg:pt-3 lg:pb-6 lg:px-6 h-full min-h-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-3 mb-4 text-sm font-medium min-w-0">
        {(["chat", "info", "notes", "prescription", "lab"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "border-b-2 border-[#2a27c2] text-[#2a27c2]"
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
              className="flex-1 w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#2a27c2] focus:border-transparent outline-none resize-none"
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
                className="col-span-2 border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white text-sm"
              >
                <option value="">Select Pharmacy</option>
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.address}
                  </option>
                ))}
              </select>
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
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions"
                className="col-span-2 border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-[#2a27c2] outline-none min-h-15"
              />
            </div>

            <button
              onClick={handleSendPrescription}
              disabled={isSendingPrescription}
              className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
            >
              {isSendingPrescription ? "Sending..." : "Send Prescription"}
            </button>
          </div>
        )}

        {/* LAB */}
        {activeTab === "lab" && (
          <div className="space-y-4 text-sm animate-fade-in min-w-0">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700">
                Attachment Type
              </label>
              <select
                value={labType}
                onChange={(e) => setLabType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-2.5 focus:ring-1 focus:ring-[#2a27c2] outline-none bg-white"
              >
                <option value="Diagnosis">Diagnosis</option>
                <option value="Lab Test">Lab Test</option>
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
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#2a27c2] transition-colors"
                />
                {labFile && (
                  <p className="mt-2 text-xs text-[#2a27c2] font-medium text-center">
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
          disabled={actionLoading}
          className="flex-1 min-w-0 py-2.5 bg-[#2a27c2] text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {actionLoading ? "Processing..." : "Finalize & Close Case"}
        </button>
      </div>
    </section>
  );
};
