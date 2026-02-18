"use client";

import WaitingPatientCard from "@/app/components/WaitingPatientCard";
import ClinicalAlertCard from "./ClinicalAlertCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User } from "@/app/models";
import { useAppointmentStore } from "@/app/stores/appointmentStore";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function DoctorDashboard({ user }: { user: User | null }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { liveQueue, isLoading: queueLoading, fetchLiveQueue } = useAppointmentStore();

  useEffect(() => {
    fetchLiveQueue();
  }, []);

  const waitingPatients = liveQueue.slice(0, 6);

  const filteredCases = liveQueue.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scheduledAt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);


  return (
    <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
      <div className="col-span-12 lg:col-span-8 xl:col-span-9">
        {/* Welcome Card */}
        <div
          className="card col-span-12 mt-12 bg-linear-to-r p-5 sm:col-span-8 sm:mt-0 sm:flex-row"
          style={{ background: "#2a27c2" }}
        >
          <div className="flex justify-center sm:order-last">
            <Image
              className="-mt-16 h-40 sm:mt-0"
              src="/images/illustrations/doctor.svg"
              alt="image"
              width={160}
              height={160}
            />
          </div>
          <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-left">
            <p className="text-white pb-2">Medical Doctor</p>
            <hr />
            <h3 className="text-xl mt-4">
              {getGreeting()}, <span className="font-semibold">Dr. {user?.firstName || "Doctor"}</span>
            </h3>
            <p className="mt-2 leading-relaxed">
              Have a great day at work. Your progress is excellent.
            </p>
            <Link href="/profile/availability" className="btn mt-6 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30">
              View Schedule
            </Link>
          </div>
        </div>

        {/* Waiting Patients */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <div className="flex h-8 items-center justify-between">
            <h2 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">
              Waiting Patients
            </h2>
            <Link
              href="/live-queue"
              className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
            >
              View All
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {queueLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse space-y-4 p-5">
                  <div className="flex items-center space-x-3">
                    <div className="size-12 rounded-full bg-slate-200 dark:bg-navy-500 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                      <div className="h-3 w-20 rounded bg-slate-200 dark:bg-navy-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                    <div className="h-5 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="size-7 rounded-full bg-slate-200 dark:bg-navy-500" />
                    <div className="size-7 rounded-full bg-slate-200 dark:bg-navy-500" />
                  </div>
                </div>
              ))
            ) : waitingPatients.length === 0 ? (
              <p className="col-span-3 py-6 text-center text-sm text-slate-400 dark:text-navy-300">
                No patients in the queue.
              </p>
            ) : (
              waitingPatients.map((appointment) => (
                <WaitingPatientCard
                  key={appointment.id}
                  name={appointment.patientName}
                  procedure={appointment.description || "—"}
                  date={appointment.scheduledAt}
                  time=""
                  viewLink={`/patient-preview?appointmentId=${appointment.id}&patientId=${appointment.patientId}`}
                />
              ))
            )}
          </div>
        </div>

        {/* Today's Cases */}
        <div className="mt-4 sm:mt-5 lg:mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
              Today's Cases
            </h2>
            <div className="flex">
              <div className="flex items-center">
                <label className="block">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200 ${
                      isSearchActive ? "w-32 lg:w-48" : "w-0"
                    }`}
                    placeholder="Search here..."
                    type="text"
                  />
                </label>
                <button
                  onClick={() => setIsSearchActive(!isSearchActive)}
                  className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  aria-label="Toggle search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
              <table className="is-hoverable w-full text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      NAME
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      LOCATION
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      DATETIME
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      STATUS
                    </th>
                    <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {queueLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse">
                        <td className="px-4 py-3 sm:px-5">
                          <div className="flex items-center space-x-3">
                            <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
                            <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-16 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500" /></td>
                      </tr>
                    ))
                  ) : filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-navy-300">
                        {searchQuery ? `No cases found matching "${searchQuery}"` : "No cases in the queue."}
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((caseItem, index) => (
                      <tr
                        key={caseItem.id}
                        className={`border-y border-transparent ${
                          index === filteredCases.length - 1
                            ? ""
                            : "border-b-slate-200 dark:border-b-navy-500"
                        }`}
                      >
                        <td className={`whitespace-nowrap px-4 py-3 sm:px-5 ${index === filteredCases.length - 1 ? "rounded-bl-lg" : ""}`}>
                          <div className="flex items-center space-x-4">
                            <div className="avatar size-9">
                              <Image className="rounded-full" src="/images/200x200.png" alt={caseItem.patientName} width={36} height={36} />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-navy-100">
                              {caseItem.patientName}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-100">
                          {caseItem.description || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                          {caseItem.scheduledAt}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          <div className={`flex items-center space-x-2 ${
                            caseItem.status === "cancelled" ? "text-error" :
                            caseItem.status === "completed" ? "text-success" : "text-warning"
                          }`}>
                            <div className="size-2 rounded-full bg-current" />
                            <span className="capitalize">{caseItem.status}</span>
                          </div>
                        </td>
                        <td className={`whitespace-nowrap px-4 py-3 sm:px-5 ${index === filteredCases.length - 1 ? "rounded-br-lg" : ""}`}>
                          <div className="flex justify-end">
                            <Link
                              href={`/patient-preview?appointmentId=${caseItem.id}&patientId=${caseItem.patientId}`}
                              className="flex size-8 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
                              title="View patient"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Clinical Alerts */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6">
          <ClinicalAlertCard
            name="Alfredo Elliott"
            procedure="Checkup"
            dateLabel="Today"
            time="11:00"
          />
          <ClinicalAlertCard
            name="Alfredo Elliott"
            procedure="Checkup"
            dateLabel="Today"
            time="11:00"
          />
        </div>
      </div>
    </div>
  );
}


