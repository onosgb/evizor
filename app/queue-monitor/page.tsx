"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import TableActionMenu from "../components/TableActionMenu";
import { AppointmentStatus } from "@/app/models";
import { useQueueMonitorStore } from "@/app/stores/queueMonitorStore";
import { Pagination } from "../components/Pagination";

export default function QueueMonitorPage() {
  const {
    appointments,
    total,
    page,
    limit,
    status,
    isLoading,
    setPage,
    setLimit,
    setStatus,
    fetchAppointments
  } = useQueueMonitorStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchAppointments();
  }, [page, limit, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, client-side filter on the current page
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuRef = menuRefs.current[openMenuId];
        if (menuRef && !menuRef.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (itemId: string) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const filteredData = (appointments || []).filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);

  // Helper for status colors
  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.PROGRESS: // Grouping 'waiting' logic if needed, or separate
        return (
          <div className="flex items-center space-x-2 text-warning">
             <div className="size-2 rounded-full bg-current"></div>
             <span>Waiting</span>
          </div>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <div className="flex items-center space-x-2 text-success">
             <div className="size-2 rounded-full bg-current"></div>
             <span>Completed</span>
          </div>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <div className="flex items-center space-x-2 text-error">
             <div className="size-2 rounded-full bg-current"></div>
             <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 text-slate-400">
             <div className="size-2 rounded-full bg-current"></div>
             <span>{status}</span>
          </div>
        );
    }
  };

  return (
    <DashboardLayout theme="admin">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">
            Live Queue Monitor
          </h2>
        </div>
        <div className="flex items-center space-x-2">
            <select
                className="form-select rounded-full border border-slate-300 bg-white px-3 py-2 pr-9 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value as AppointmentStatus | "");
                }}
            >
                <option value="">All Status</option>
                <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
                <option value={AppointmentStatus.PROGRESS}>In Progress</option>
                <option value={AppointmentStatus.COMPLETED}>Completed</option>
                <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
            </select>
        </div>
      </div>

      {/* Search Card */}
      <div className="card rounded-2xl px-4 py-4 sm:px-5">
        <div className="p-3">
          <div className="">
            <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
              Search Live Queue
            </h2>
          </div>
          <form className="mt-2" onSubmit={handleSearch}>
            <div className="relative flex -space-x-px">
              <input
                className="form-input peer w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Search by patient or doctor..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z"></path>
                </svg>
              </div>

              <button
                type="submit"
                className="btn rounded-l-none bg-success font-medium text-white hover:bg-success-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Queue Table */}
      <div>
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
                      <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse">
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-10 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-navy-500" /></td>
                        <td className="px-4 py-3 sm:px-5"><div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500" /></td>
                      </tr>
                    ))
                ) : filteredData.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
                        <a
                            href="#"
                            className="hover:underline focus:underline"
                        >
                            {item.doctorName}
                        </a>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                        {item.scheduledAt}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {getStatusIcon(item.status)}
                        </td>
                        <td
                        className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                            index === filteredData.length - 1
                            ? "rounded-br-lg"
                            : ""
                        }`}
                        >
                        <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
                              className="flex size-8 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
                              title="View patient"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                              </svg>
                            </Link>
                            <TableActionMenu>
                                <div className="w-48">
                                <ul>
                                    <li>
                                    <Link
                                        href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
                                        className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    >
                                        View Details
                                    </Link>
                                    </li>
                                </ul>
                                </div>
                            </TableActionMenu>
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

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalEntries={total}
        entriesPerPage={limit}
        onPageChange={setPage}
        onEntriesPerPageChange={setLimit}
      />
    </DashboardLayout>
  );
}
