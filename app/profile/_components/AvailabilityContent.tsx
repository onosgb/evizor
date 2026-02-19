"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme } from "@/app/lib/roles";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { adminService, appointmentService } from "@/app/lib/services";
import { AvailabilityStatus } from "@/app/models/DoctorAvailability";
import ProfileSidebar from "./ProfileSidebar";

interface Schedule {
  id: string;
  dateScheduled: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  consultations: number;
  status: AvailabilityStatus;
}

export default function AvailabilityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isReadOnly = !!userId;

  const theme = getTheme(user);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"Accepted" | "Rejected">("Accepted");
  const [reason, setReason] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoadingAvailability(true);
      try {
        if (userId) {
          const response = await adminService.getUserAvailability(userId);
          if (response.status && response.data) {
            const mapped: Schedule[] = (response.data as any[]).map((item) => ({
              id: item.id,
              dateScheduled: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              timeSlot: `${item.startTime} – ${item.endTime}`,
              consultations: 0,
              status: (item.status ?? "Pending") as AvailabilityStatus,
            }));
            setSchedules(mapped);
          }
        } else {
          const response = await appointmentService.getMyAvailabilities();
          if (response.status && response.data) {
            const mapped: Schedule[] = response.data.map((item) => ({
              id: item.id,
              dateScheduled: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              timeSlot: `${item.startTime} – ${item.endTime}`,
              consultations: 0,
              status: (item.status ?? "Pending") as AvailabilityStatus,
            }));
            setSchedules(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [userId]);

  const openModal = (schedule: Schedule, action: "Accepted" | "Rejected") => {
    setSelectedSchedule(schedule);
    setModalAction(action);
    setReason("");
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedSchedule(null);
    setReason("");
  };

  const handleApply = async () => {
    if (!selectedSchedule) return;
    setIsSubmitting(true);
    try {
      await appointmentService.proposeAvailability(selectedSchedule.id, {
        date: selectedSchedule.dateScheduled,
        doctorId: user?.id ?? "",
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime,
        ...(modalAction === "Rejected" && { reason }),
        status: modalAction,
      });

      setSchedules(
        schedules.map((s) =>
          s.id === selectedSchedule.id ? { ...s, status: modalAction } : s,
        ),
      );
      setShowModal(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.error("Failed to propose availability:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) handleCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  const statusDot = (status: AvailabilityStatus) =>
    status === "Accepted"
      ? "bg-success"
      : status === "Pending"
        ? "bg-warning"
        : "bg-error";

  const statusText = (status: AvailabilityStatus) =>
    status === "Accepted"
      ? "text-success"
      : status === "Pending"
        ? "text-warning"
        : "text-error";

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <ProfileSidebar />
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
              <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Availability & Schedule
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-navy-500">
                      <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-600 dark:text-navy-100 lg:px-5">
                        Date Scheduled
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-600 dark:text-navy-100 lg:px-5">
                        Time Slots
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-600 dark:text-navy-100 lg:px-5">
                        Status
                      </th>
                      <th className="whitespace-nowrap px-3 py-3 font-semibold uppercase text-slate-600 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingAvailability
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-b border-slate-200 dark:border-navy-500 animate-pulse"
                          >
                            <td className="px-4 py-4 sm:px-5">
                              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-4 sm:px-5">
                              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-4 sm:px-5">
                              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-4 sm:px-5">
                              <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-navy-500" />
                            </td>
                          </tr>
                        ))
                      : schedules.map((schedule, index) => (
                          <tr
                            key={schedule.id}
                            className={`border-b border-slate-200 dark:border-navy-500 ${
                              index % 2 === 0 ? "bg-slate-50 dark:bg-navy-800" : ""
                            }`}
                          >
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-navy-100 sm:px-5">
                              {schedule.dateScheduled}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-navy-100 sm:px-5">
                              {schedule.timeSlot}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                              <div className="inline-flex items-center space-x-2">
                                <span className={`size-2 rounded-full ${statusDot(schedule.status)}`} />
                                <span className={`text-sm font-medium ${statusText(schedule.status)}`}>
                                  {schedule.status}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                              {!isReadOnly && schedule.status === "Pending" && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => openModal(schedule, "Accepted")}
                                    className="btn size-8 rounded-full p-0 text-success hover:bg-success/20 focus:bg-success/20 active:bg-success/25"
                                    title="Accept slot"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => openModal(schedule, "Rejected")}
                                    className="btn size-8 rounded-full p-0 text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
                                    title="Reject slot"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept / Reject Modal */}
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
              onClick={handleCancel}
            />
            <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
              {/* Header */}
              <div className="flex justify-between rounded-t-lg bg-slate-100 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  {modalAction === "Accepted" ? "Accept Slot" : "Reject Slot"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-4 sm:px-5 space-y-4">
                {/* Readonly slot info */}
                <div className="grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-500 dark:text-navy-300">Date</span>
                    <input
                      readOnly
                      value={selectedSchedule?.dateScheduled ?? ""}
                      className="form-input mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-500 dark:text-navy-300">Start Time</span>
                    <input
                      readOnly
                      value={selectedSchedule?.startTime ?? ""}
                      className="form-input mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium text-slate-500 dark:text-navy-300">End Time</span>
                    <input
                      readOnly
                      value={selectedSchedule?.endTime ?? ""}
                      className="form-input mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                    />
                  </label>
                </div>

                {/* Reason — only for Reject */}
                {modalAction === "Rejected" && (
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-100">
                      Reason <span className="text-error">*</span>
                    </span>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Enter your reason for rejecting this slot..."
                      className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    />
                  </label>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={isSubmitting || (modalAction === "Rejected" && !reason.trim())}
                    className={`btn min-w-28 rounded-full font-medium text-white disabled:opacity-60 ${
                      modalAction === "Accepted"
                        ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
                        : "bg-error hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90"
                    }`}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : modalAction === "Accepted"
                        ? "Accept"
                        : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
