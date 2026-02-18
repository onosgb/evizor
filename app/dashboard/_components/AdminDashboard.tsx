"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, AppointmentStatus } from "@/app/models";
import { useQueueMonitorStore } from "@/app/stores/queueMonitorStore";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function AdminDashboard({ user }: { user: User | null }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { appointments, isLoading, setLimit, fetchAppointments } =
    useQueueMonitorStore();

  useEffect(() => {
    setLimit(6);
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  const filteredData = (appointments || []).filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scheduledAt.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.PROGRESS:
        return (
          <div className="flex items-center space-x-2 text-warning">
            <div className="size-2 rounded-full bg-current" />
            <span>Waiting</span>
          </div>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <div className="flex items-center space-x-2 text-success">
            <div className="size-2 rounded-full bg-current" />
            <span>Completed</span>
          </div>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <div className="flex items-center space-x-2 text-error">
            <div className="size-2 rounded-full bg-current" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="size-2 rounded-full bg-current" />
            <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <>
      {/* Welcome Card */}
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-12 xl:col-span-12">
          <div
            className="card col-span-12 mt-12 bg-linear-to-r p-5 sm:col-span-8 sm:mt-0 sm:flex-row"
            style={{ background: "#49941c" }}
          >
            <div className="flex justify-center sm:order-last">
              <Image
                className="-mt-16 h-40 sm:mt-0"
                src="/images/illustrations/user-laptop.svg"
                alt="image"
                width={160}
                height={160}
              />
            </div>
            <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-left">
              <p className="text-white pb-2">System Administrator</p>
              <hr />
              <h3 className="text-xl mt-4">
                {getGreeting()},{" "}
                <span className="font-semibold">
                  {user?.firstName || "Admin"}
                </span>
              </h3>
              <p className="mt-2 leading-relaxed">
                Have a great day at work. Your progress is excellent.
              </p>
              <Link href="/profile" className="btn mt-6 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30">
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Active Doctors</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                1.3k
              </p>
              <p className="text-xs text-success">+21%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-warning/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Waiting Patients</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                30.6m
              </p>
              <p className="text-xs text-success">+4%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-info/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Avg Waiting Time</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                4.3m
              </p>
              <p className="text-xs text-success">+8%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-success/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Consultations Today</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                11.6k
              </p>
              <p className="text-xs text-error">-2.3%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-error/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m6 9l-2-2m0 0l-2-2m2 2l2 2m-2-2l-2 2"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m6 9l-2-2m0 0l-2-2m2 2l2 2m-2-2l-2 2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Queue Monitor Table */}
      <div className="mt-4 sm:mt-5 lg:mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
            Queue Monitor
          </h2>
          <div className="flex items-center space-x-2">
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
            <Link
              href="/queue-monitor"
              className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="card mt-3">
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    PATIENT
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    ASSIGNED DOCTOR
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
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center space-x-3">
                          <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
                          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-navy-500" />
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500" />
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500 dark:text-navy-300"
                    >
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-y border-transparent ${
                        index === filteredData.length - 1
                          ? ""
                          : "border-b-slate-200 dark:border-b-navy-500"
                      }`}
                    >
                      <td
                        className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                          index === filteredData.length - 1
                            ? "rounded-bl-lg"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="avatar size-9">
                            <Image
                              className="rounded-full"
                              src="/images/200x200.png"
                              alt="avatar"
                              width={36}
                              height={36}
                            />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-navy-100">
                            {item.patientName}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.doctorName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                        {item.scheduledAt}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {getStatusBadge(item.status)}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                          index === filteredData.length - 1
                            ? "rounded-br-lg"
                            : ""
                        }`}
                      >
                        <div className="flex justify-end">
                          <Link
                            href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
                            className="flex size-8 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
                            title="View patient"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="size-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 17L17 7M17 7H7M17 7v10"
                              />
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
    </>
  );
}
