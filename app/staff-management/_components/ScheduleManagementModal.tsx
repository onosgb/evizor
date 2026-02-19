"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { adminService } from "@/app/lib/services";
import { CreateScheduleRequest } from "@/app/models";
import { AvailabilityStatus } from "@/app/models/DoctorAvailability";

interface Schedule {
  id: string;
  dateScheduled: string;
  timeSlot: string;
  consultations: number;
  status: AvailabilityStatus;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Schedule Form State
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchSchedules();
    }
  }, [isOpen, userId]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getUserAvailability(userId);
      if (response.status && response.data) {
        const mapped: Schedule[] = response.data.map((item: any) => ({
          id: item.id,
          dateScheduled: item.date,
          timeSlot: `${item.startTime} – ${item.endTime}`,
          consultations: 0,
          status: (item.status ?? "Pending") as AvailabilityStatus,
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
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSchedule = async () => {
    // Basic validation
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
    if (!confirm("Are you sure you want to remove this time slot?")) return;

    try {
      const response = await adminService.removeUserAvailabilitySchedule(scheduleId);
      if (response.status) {
        setSchedules(schedules.filter(s => s.id !== scheduleId));
      } else {
        setError(response.message || "Failed to remove schedule.");
      }
    } catch (err) {
      console.error("Failed to remove schedule:", err);
      // Optimistic update fallback or error message
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
                    <label className="block">
                        <span className="text-xs text-slate-500 dark:text-navy-300">Date</span>
                        <input
                            type="date"
                            name="date"
                            value={newSchedule.date}
                            onChange={handleInputChange}
                            className="form-input mt-1 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs text-slate-500 dark:text-navy-300">Start Time</span>
                        <input
                            type="time"
                            name="startTime"
                            value={newSchedule.startTime}
                            onChange={handleInputChange}
                            className="form-input mt-1 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        />
                    </label>
                    <label className="block">
                        <span className="text-xs text-slate-500 dark:text-navy-300">End Time</span>
                        <input
                            type="time"
                            name="endTime"
                            value={newSchedule.endTime}
                            onChange={handleInputChange}
                            className="form-input mt-1 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        />
                    </label>
                    <button 
                        onClick={handleAddSchedule}
                        disabled={isSubmitting}
                        className="btn h-9.5 w-full rounded-lg bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 disabled:opacity-70 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>
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
                                        <td className="px-4 py-3 text-slate-700 dark:text-navy-100">{schedule.dateScheduled}</td>
                                        <td className="px-4 py-3 text-slate-700 dark:text-navy-100">{schedule.timeSlot}</td>
                                        <td className="px-4 py-3">
                                            <span className={`badge rounded-full px-2 py-0.5 text-xs ${
                                              schedule.status === "Accepted"
                                                ? "bg-success/10 text-success"
                                                : schedule.status === "Pending"
                                                ? "bg-warning/10 text-warning"
                                                : "bg-error/10 text-error"
                                            }`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                className="btn size-7 rounded-full p-0 text-error hover:bg-error/10 focus:bg-error/10 active:bg-error/20"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
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
            <button
                onClick={onClose}
                className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
            >
                Close
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
}


