"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { createPortal } from "react-dom";
import ProfileSidebar from "./ProfileSidebar";

interface Schedule {
  id: string;
  day: string;
  timeSlot: string;
  maxConsultations: number;
  status: boolean;
}

export default function AvailabilityContent() {
  const user = useAuthStore((state) => state.user);
  const theme = user?.role === "ADMIN" ? "admin" : "doctor";
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      day: "Monday",
      timeSlot: "09:00 – 13:00",
      maxConsultations: 20,
      status: true,
    },
    {
      id: "2",
      day: "Wednesday",
      timeSlot: "16:00 – 20:00",
      maxConsultations: 15,
      status: true,
    },
  ]);

  const [formData, setFormData] = useState({
    day: "",
    timeSlot: "",
    maxConsultations: "",
    updateAvailability: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSchedule = () => {
    if (formData.day && formData.timeSlot && formData.maxConsultations) {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        day: formData.day,
        timeSlot: formData.timeSlot,
        maxConsultations: parseInt(formData.maxConsultations),
        status: formData.updateAvailability,
      };
      setSchedules([...schedules, newSchedule]);
      setShowModal(false);
      setFormData({
        day: "",
        timeSlot: "",
        maxConsultations: "",
        updateAvailability: false,
      });
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData({
      day: "",
      timeSlot: "",
      maxConsultations: "",
      updateAvailability: false,
    });
  };

  const handleStatusToggle = (id: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? { ...schedule, status: !schedule.status }
          : schedule
      )
    );
  };

  // Theme-based switch styling
  const getSwitchClasses = () => {
    return theme === "admin"
      ? "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-green-600 checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-green-500 dark:checked:before:bg-white"
      : "form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white";
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
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className={`btn min-w-28 rounded-full font-medium text-white ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                      : "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  }`}
                >
                  Add New Schedule
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table className="is-zebra w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Days Available
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Time Slots
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Max Daily Consultations
                      </th>
                      <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                          {schedule.day}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {schedule.timeSlot}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          {schedule.maxConsultations}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          <label className="inline-flex items-center">
                            <input
                              checked={schedule.status}
                              onChange={() => handleStatusToggle(schedule.id)}
                              className={getSwitchClasses()}
                              type="checkbox"
                            />
                          </label>
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

      {/* Modal */}
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
              <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  Availability & Schedule
                </h3>
                <button
                  onClick={() => setShowModal(false)}
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
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Assumenda incidunt
                </p>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span>Days Available</span>
                    <select
                      name="day"
                      value={formData.day}
                      onChange={handleInputChange}
                      className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </label>
                  <label className="block">
                    <span>Time Slots</span>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="">Select Time Slot</option>
                      <option value="09:00 – 13:00">09:00 – 13:00</option>
                      <option value="16:00 – 20:00">16:00 – 20:00</option>
                    </select>
                  </label>
                  <label className="block">
                    <span>Max Daily Consultations:</span>
                    <select
                      name="maxConsultations"
                      value={formData.maxConsultations}
                      onChange={handleInputChange}
                      className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                    >
                      <option value="">Select Max Consultations</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                      <option value="30">30</option>
                    </select>
                  </label>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      name="updateAvailability"
                      checked={formData.updateAvailability}
                      onChange={handleInputChange}
                      className={getOutlineSwitchClasses()}
                      type="checkbox"
                    />
                    <span>Update Availability</span>
                  </label>
                  <div className="space-x-2 text-right">
                    <button
                      onClick={handleCancel}
                      className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSchedule}
                      className={`btn min-w-28 rounded-full font-medium text-white ${
                    theme === "admin"
                      ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
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
