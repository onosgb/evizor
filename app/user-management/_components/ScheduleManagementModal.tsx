"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { adminService } from "@/app/lib/services";
import { CreateScheduleRequest } from "@/app/models";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useToast } from "@/app/contexts/ToastContext";
import { FormInput } from "@/app/components/ui/FormInput";
import { Button } from "@/app/components/ui/button";
import { X, Trash2 } from "lucide-react";

interface Schedule {
  id: string;
  dateScheduled: string;
  timeSlot: string;
  isAvailable: boolean;
}

interface ScheduleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  theme?: "admin" | "doctor";
}

export default function ScheduleManagementModal({
  isOpen,
  onClose,
  userId,
  userName,
}: ScheduleManagementModalProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // New Schedule Form State
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getUserAvailability(userId);
      if (response.status && response.data) {
        const mapped: Schedule[] = (response.data as any[]).map((item) => ({
          id: item.id,
          dateScheduled: item.date,
          timeSlot: `${item.startTime} – ${item.endTime}`,
          isAvailable: item.isAvailable ?? false,
        }));
        setSchedules(mapped);
      } else {
        // Fallback or empty state
        setSchedules([]);
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError("Failed to load schedules.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchSchedules();
    }
  }, [isOpen, userId, fetchSchedules]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const todayStr = () => new Date().toISOString().split("T")[0];

  const handleAddSchedule = async () => {
    if (!newSchedule.date || !newSchedule.startTime || !newSchedule.endTime) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format data for API
      const payload: CreateScheduleRequest = {
        date: newSchedule.date,
        doctorId: userId,
        startTime: newSchedule.startTime,
        endTime: newSchedule.endTime,
      };

      const response = await adminService.scheduleUserAvailability(payload);
      
      if (response.status) {
        // Refresh list or append locally
        // For now, let's append locally to show immediate feedback if API returns the created object
        // If API returns just success, we might need to construct the object or re-fetch
        fetchSchedules(); 
        
        // Reset form
        setNewSchedule({
          date: "",
          startTime: "",
          endTime: "",
        });
      } else {
        setError(response.message || "Failed to add schedule.");
      }
    } catch (err) {
      console.error("Failed to add schedule:", err);
      setError("An error occurred while adding the schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {

    try {
      setIsSubmitting(true);
      const response = await adminService.removeUserAvailabilitySchedule(scheduleId);
      if (response.status) {
        setSchedules(schedules.filter(s => s.id !== scheduleId));
      } else {
        showToast(response.message || "Failed to remove schedule.", "error");
      }
      setOpenConfirmDialog(false);
      setOpenConfirmDialog(false);
    } catch {
      showToast("Failed to remove schedule.", "error");
      // Optimistic update fallback or error message
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
        <div className="flex justify-between rounded-t-lg bg-slate-100 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            Manage Schedule for {userName}
          </h3>
          <button
            onClick={onClose}
            className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          >
            <X className="size-4.5" />
          </button>
        </div>
        
        <div className="flex flex-col px-4 py-4 sm:px-5 space-y-4">
            {error && (
                <div className="rounded-lg bg-error/10 p-3 text-error text-sm">
                    {error}
                </div>
            )}

            {/* Add New Schedule Section */}
            <div className="rounded-lg border border-slate-200 p-4 dark:border-navy-500">
                <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-navy-100">Add New Availability</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end">
                    <FormInput
                        label="Date"
                        type="date"
                        name="date"
                        value={newSchedule.date}
                        min={todayStr()}
                        onChange={handleInputChange}
                    />
                    <FormInput
                        label="Start Time"
                        type="time"
                        name="startTime"
                        value={newSchedule.startTime}
                        onChange={handleInputChange}
                    />
                    <FormInput
                        label="End Time"
                        type="time"
                        name="endTime"
                        value={newSchedule.endTime}
                        onChange={handleInputChange}
                    />
                    <Button 
                        onClick={handleAddSchedule}
                        disabled={isSubmitting}
                        variant="default"
                        className="h-9.5 w-full rounded-lg font-medium"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </Button>
                </div>
            </div>

            {/* Existing Schedules List */}
            <div>
                <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-navy-100">Evaluated Availability</h4>
                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500 dark:text-navy-300">No schedules found.</p>
                ) : (
                    <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200 dark:border-navy-500">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 dark:bg-navy-800 dark:text-navy-200">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Date</th>
                                    <th className="px-4 py-2 font-medium">Time Slot</th>
                                    <th className="px-4 py-2 font-medium">Status</th>
                                    <th className="px-4 py-2 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-navy-500">
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-4 py-3 text-slate-700 dark:text-navy-100">{formatDate(schedule.dateScheduled)}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-navy-100">{schedule.timeSlot}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge rounded-full px-2 py-0.5 text-xs ${
                                              schedule.isAvailable
                                                ? "bg-success/10 text-success"
                                                : "bg-error/10 text-error"
                                            }`}>
                                              {schedule.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedScheduleId(schedule.id);
                                                    setOpenConfirmDialog(true);
                                                }}
                                                className="btn size-7 rounded-full p-0 text-error hover:bg-error/10 focus:bg-error/10 active:bg-error/20"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-end rounded-b-lg bg-slate-50 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <Button
            onClick={onClose}
            variant="outline"
            className="min-w-28 rounded-full"
          >
            Close
          </Button>
        </div>
        {openConfirmDialog && (
          <ConfirmationModal
            isLoading={isSubmitting}
            isOpen={openConfirmDialog}
            onClose={() => setOpenConfirmDialog(false)}
            onConfirm={() => handleDeleteSchedule(selectedScheduleId!)}
            title="Confirm Delete"
            message="Are you sure you want to delete this schedule?"
            confirmText="Delete"
            cancelText="Cancel"
            variant="error"
          />
        )}
      </div>
    </div>,
  
    document.body
  );
}


