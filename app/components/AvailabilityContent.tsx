"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { authService } from "../lib/services";
import ProfileSidebar from "./ProfileSidebar";

interface Schedule {
  id: string;
  dateScheduled: string;
  timeSlot: string;
  consultations: number;
  status: "available" | "offline";
}

export default function AvailabilityContent() {
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const isReadOnly = !!userId;
  
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      dateScheduled: "Monday Feb 9, 2026",
      timeSlot: "09:00 – 13:00",
      consultations: 20,
      status: "available",
    },
    {
      id: "2",
      dateScheduled: "Wednesday Feb 11, 2026",
      timeSlot: "16:00 – 20:00",
      consultations: 20,
      status: "offline",
    },
  ]);

  // Fetch availability if userId is present
  useEffect(() => {
    if (userId) {
      const fetchAvailability = async () => {
        try {
          const response = await authService.getUserAvailability(userId);
          if (response.status && response.data) {
            // Transform response data to match Schedule interface if needed
            // For now assuming response matches or keeping mock data if empty
            // setSchedules(response.data); 
          }
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      };
      fetchAvailability();
    }
  }, [userId]);

  const [modalData, setModalData] = useState({
    unavailabilityReason: "",
    yourReason: "",
    expectedReturnTime: "",
    updateAvailability: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setModalData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRejectClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
    setModalData({
      unavailabilityReason: "",
      yourReason: "",
      expectedReturnTime: "",
      updateAvailability: false,
    });
  };

  const handleApproveClick = (schedule: Schedule) => {
    // Directly toggle to available without modal
    setSchedules(
      schedules.map((s) =>
        s.id === schedule.id ? { ...s, status: "available" } : s
      )
    );
  };

  const handleApply = () => {
    if (selectedSchedule) {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === selectedSchedule.id
            ? { ...schedule, status: modalData.updateAvailability ? "available" : "offline" }
            : schedule
        )
      );
    }
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedSchedule(null);
    setModalData({
      unavailabilityReason: "",
      yourReason: "",
      expectedReturnTime: "",
      updateAvailability: false,
    });
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  // Theme-based outline switch styling
  const getOutlineSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-green-600 checked:before:bg-green-600 dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-green-500 dark:checked:before:bg-green-500"
      : "form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-primary checked:before:bg-primary dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-accent dark:checked:before:bg-accent";
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  return (
    <>
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Sidebar Navigation */}
        <ProfileSidebar />
        {/* Main Content */}
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
                        Consultations
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
                    {schedules.map((schedule, index) => (
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
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-navy-100 sm:px-5">
                          {schedule.consultations}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                          <div className="inline-flex items-center space-x-2">
                            <span
                              className={`size-2 rounded-full ${
                                schedule.status === "available"
                                  ? "bg-success"
                                  : "bg-error"
                              }`}
                            ></span>
                            <span
                              className={`text-sm font-medium ${
                                schedule.status === "available"
                                  ? "text-success"
                                  : "text-error"
                              }`}
                            >
                              {schedule.status === "available" ? "Available" : "Offline"}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                          {!isReadOnly && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApproveClick(schedule)}
                                className="btn size-8 rounded-full p-0 text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25"
                                title="Approve availability"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleRejectClick(schedule)}
                                className="btn size-8 rounded-full p-0 text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
                                title="Reject/Set unavailable"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="size-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                                    clipRule="evenodd"
                                  />
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

      {/* Availability Status Modal */}
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
            ></div>
            <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-100 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Availability Status
                </h3>
                <button
                  onClick={handleCancel}
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
              <div className="px-4 py-4 sm:px-5">
                <p className="text-sm text-slate-600 dark:text-navy-300">
                  Please provide the reasons why you will not be available on this scheduled day. This information helps us manage patient expectations and reschedule appointments accordingly.
                </p>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-100">Unavailability Reason</span>
                    <select
                      name="unavailabilityReason"
                      value={modalData.unavailabilityReason}
                      onChange={handleInputChange}
                      className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="">Personal</option>
                      <option value="medical">Medical</option>
                      <option value="emergency">Emergency</option>
                      <option value="vacation">Vacation</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-100">Your Reason</span>
                    <textarea
                      name="yourReason"
                      value={modalData.yourReason}
                      onChange={handleInputChange}
                      rows={3}
                      className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                      placeholder="Enter your reason..."
                    ></textarea>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-100">Expected Return Time</span>
                    <input
                      name="expectedReturnTime"
                      type="datetime-local"
                      value={modalData.expectedReturnTime}
                      onChange={handleInputChange}
                      className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    />
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      name="updateAvailability"
                      checked={modalData.updateAvailability}
                      onChange={handleInputChange}
                      className={getOutlineSwitchClasses()}
                      type="checkbox"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-navy-100">Update Availability</span>
                  </label>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={handleCancel}
                      className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApply}
                      className={`btn min-w-28 rounded-full font-medium text-white ${
                        theme === "admin"
                          ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
                          : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      }`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
