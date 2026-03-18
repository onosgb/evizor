"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/stores/authStore";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { adminService, appointmentService } from "@/app/lib/services";
import ProfileSidebar from "./ProfileSidebar";
import { useProfileStore } from "@/app/stores/profileStore";
import ScheduleManagementModal from "@/app/user-management/_components/ScheduleManagementModal";
import { isAdmin } from "@/app/lib/roles";
import { FormInput } from "@/app/components/ui/FormInput";
import { FormTextarea } from "@/app/components/ui/FormTextarea";
import { Button } from "@/app/components/ui/button";
import { Ban, CheckCircle, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Schedule {
  id: string;
  doctorId: string;
  dateScheduled: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  isAvailable: boolean;
}

export default function AvailabilityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isReadOnly = !!userId && userId !== user?.id;

  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"accept" | "reject">("accept");
  const [reason, setReason] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { viewedUser } = useProfileStore();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoadingAvailability(true);
      try {
        if (userId) {
          const response = await adminService.getUserAvailability(userId);
          if (response.status && response.data) {
            const mapped: Schedule[] = (response.data as any[]).map((item) => ({
              id: item.id,
              doctorId: item.doctorId,
              dateScheduled: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              timeSlot: `${item.startTime} – ${item.endTime}`,
              isAvailable: item.isAvailable ?? false,
            }));
            setSchedules(mapped);
          }
        } else {
          const response = await appointmentService.getMyAvailabilities();
          if (response.status && response.data) {
            const mapped: Schedule[] = response.data.map((item) => ({
              id: item.id,
              doctorId: item.doctorId,
              dateScheduled: item.date,
              startTime: item.startTime,
              endTime: item.endTime,
              timeSlot: `${item.startTime} – ${item.endTime}`,
              isAvailable: item.isAvailable ?? false,
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

  const openModal = (schedule: Schedule, action: "accept" | "reject") => {
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
        doctorId: selectedSchedule.doctorId,
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime,
        isAvailable: modalAction === "accept",
        ...(modalAction === "reject" && reason.trim() && { reason }),
      });

      setSchedules(
        schedules.map((s) =>
          s.id === selectedSchedule.id
            ? { ...s, isAvailable: modalAction === "accept" }
            : s,
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const availabilityDot = (isAvailable: boolean) =>
    isAvailable ? "bg-success" : "bg-error";

  const availabilityText = (isAvailable: boolean) =>
    isAvailable ? "text-success" : "text-error";

  const availabilityLabel = (isAvailable: boolean) =>
    isAvailable ? "Available" : "Unavailable";

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
              {isAdmin(user) && !!userId && (
                <Button
                  onClick={() => setShowScheduleModal(true)}
                  variant="success"
                  className="min-w-28 rounded-full font-medium"
                >
                  <Plus className="size-4 mr-2" /> Add Schedule
                </Button>
              )}
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
                              index % 2 === 0
                                ? "bg-slate-50 dark:bg-navy-800"
                                : ""
                            }`}
                          >
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-navy-100 sm:px-5">
                              {formatDate(schedule.dateScheduled)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-navy-100 sm:px-5">
                              {schedule.timeSlot}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                              <div className="inline-flex items-center space-x-2">
                                <span
                                  className={`size-2 rounded-full ${availabilityDot(schedule.isAvailable)}`}
                                />
                                <span
                                  className={`text-sm font-medium ${availabilityText(schedule.isAvailable)}`}
                                >
                                  {availabilityLabel(schedule.isAvailable)}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                              {!isReadOnly &&
                                (schedule.isAvailable ? (
                                  <Button
                                    onClick={() =>
                                      openModal(schedule, "reject")
                                    }
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
                                    title="Mark unavailable"
                                  >
                                    <Ban className="size-5" />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      openModal(schedule, "accept")
                                    }
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 rounded-full text-success hover:bg-success/20 focus:bg-success/20 active:bg-success/25"
                                    title="Mark available"
                                  >
                                    <CheckCircle className="size-5" />
                                  </Button>
                                ))}
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
                  {modalAction === "accept"
                    ? "Mark as Available"
                    : "Mark as Unavailable"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                >
                  <X className="size-4.5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-4 sm:px-5 space-y-4">
                {/* Readonly slot info */}
                <div className="grid grid-cols-3 gap-3">
                  <FormInput
                    label="Date"
                    readOnly
                    value={
                      selectedSchedule
                        ? formatDate(selectedSchedule.dateScheduled)
                        : ""
                    }
                    className="border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                  />
                  <FormInput
                    label="Start Time"
                    readOnly
                    value={selectedSchedule?.startTime ?? ""}
                    className="border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                  />
                  <FormInput
                    label="End Time"
                    readOnly
                    value={selectedSchedule?.endTime ?? ""}
                    className="border-slate-200 bg-slate-50 text-slate-600 dark:border-navy-500 dark:bg-navy-800 dark:text-navy-200 cursor-default"
                  />
                </div>

                {/* Reason — only for marking unavailable */}
                {modalAction === "reject" && (
                  <FormTextarea
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Enter your reason for rejecting this slot..."
                    required
                  />
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-1">
                  <Button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    variant="outline"
                    className="min-w-28 rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={
                      isSubmitting ||
                      (modalAction === "reject" && !reason.trim())
                    }
                    variant={modalAction === "accept" ? "success" : "error"}
                    className="min-w-28 rounded-full font-medium"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : "Confirm"}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {!!userId && viewedUser && (
        <ScheduleManagementModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            // Refresh schedules after adding
            const fetchAvailability = async () => {
              setIsLoadingAvailability(true);
              try {
                const response = await adminService.getUserAvailability(userId);
                if (response.status && response.data) {
                  const mapped: Schedule[] = (response.data as any[]).map((item) => ({
                    id: item.id,
                    doctorId: item.doctorId,
                    dateScheduled: item.date,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    timeSlot: `${item.startTime} – ${item.endTime}`,
                    isAvailable: item.isAvailable ?? false,
                  }));
                  setSchedules(mapped);
                }
              } catch (error) {
                console.error("Failed to fetch availability:", error);
              } finally {
                setIsLoadingAvailability(false);
              }
            };
            fetchAvailability();
          }}
          userId={userId}
          userName={viewedUser.fullName || `${viewedUser.firstName} ${viewedUser.lastName}`}
          theme="admin"
        />
      )}
    </>
  );
}
