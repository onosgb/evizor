"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { Pagination } from "../components/Pagination";
import { useAppointmentStore } from "../stores/appointmentStore";
import { AppointmentStatus } from "../models";
import { useSearchContext } from "../contexts/SearchContext";
import { formatTodayOrDate } from "@/app/lib/utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { FormInput } from "@/app/components/ui/FormInput";

export default function AssignedCasesPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "progress" | "completed">("all");

  const { assignedCases, assignedTotal, isQueueLoading, error, fetchAssignedCases, fetchVideoToken } =
    useAppointmentStore();
  const toast = useToast();

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search cases...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); setCurrentPage(1); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchAssignedCases({
      page: currentPage,
      limit: entriesPerPage,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
    });
  }, [currentPage, entriesPerPage, dateFrom, dateTo, debouncedSearch, statusFilter, fetchAssignedCases]);


  const hasDateFilter = !!(dateFrom || dateTo);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleJoinCall = async (appointmentId: string) => {
    try {
      await fetchVideoToken(appointmentId);
      window.location.href = `/consultation/${appointmentId}`;
    } catch (err: any) {
      toast.showToast(err.message || "Failed to start video call", "error");
    }
  };

  const startIndex = (currentPage - 1) * entriesPerPage;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between py-5 lg:py-6">
        <div>
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50 lg:text-2xl">
            Assigned Cases
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            {assignedTotal} total case{assignedTotal !== 1 ? "s" : ""} assigned to you
          </p>
        </div>
      </div>

      {/* Date Filter Card */}
      <div className="card rounded-2xl px-4 py-4 sm:px-5">
        <div className="p-3">
          <h2 className="mb-3 text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">
            Filter by Date
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput
              label="From"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
            />
            <FormInput
              label="To"
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {hasDateFilter && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-primary hover:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`btn h-8 rounded-full px-4 text-xs font-medium transition-all ${
              statusFilter === "all"
                ? "bg-primary text-white shadow-lg shadow-primary/20 dark:bg-accent dark:shadow-accent/20"
                : "bg-slate-150 text-slate-600 hover:bg-slate-200 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("progress")}
            className={`btn h-8 rounded-full px-4 text-xs font-medium transition-all ${
              statusFilter === "progress"
                ? "bg-primary text-white shadow-lg shadow-primary/20 dark:bg-accent dark:shadow-accent/20"
                : "bg-slate-150 text-slate-600 hover:bg-slate-200 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
            }`}
          >
            In-Progress
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`btn h-8 rounded-full px-4 text-xs font-medium transition-all ${
              statusFilter === "completed"
                ? "bg-primary text-white shadow-lg shadow-primary/20 dark:bg-accent dark:shadow-accent/20"
                : "bg-slate-150 text-slate-600 hover:bg-slate-200 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert mt-3 flex rounded-lg bg-error/10 py-4 px-4 text-error dark:bg-error/15 sm:px-5">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card mt-3">
        <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
          <table className="is-hoverable w-full text-left">
            <thead>
              <tr>
                <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  #
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Patient
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Description
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Status
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Symptoms
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Date
                </th>
                <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5" />
              </tr>
            </thead>
            <tbody>
              {isQueueLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-5 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center space-x-3">
                        <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
                        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-navy-500" />
                    </td>
                  </tr>
                ))
              ) : assignedCases.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-slate-500 dark:text-navy-300"
                  >
                    {statusFilter === "progress"
                      ? "No in-progress cases found."
                      : statusFilter === "completed"
                      ? "No completed cases found."
                      : "No cases found."}
                  </td>
                </tr>
              ) : (
                assignedCases.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-y border-transparent ${
                      index === assignedCases.length - 1
                        ? ""
                        : "border-b-slate-200 dark:border-b-navy-500"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-500 dark:text-navy-300">
                      {startIndex + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex items-center space-x-3">
                        <div className="avatar size-9 shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
                          <Image
                            className="rounded-full"
                            src={item.patientImageUrl || "/images/200x200.png"}
                            alt={item.patientName}
                            width={36}
                            height={36}
                          />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-navy-100 cursor-pointer hover:text-primary transition-colors">
                          {item.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                      <span className="line-clamp-1 max-w-37.5" title={item.description}>
                        {item.description || "—"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div
                        className={`badge space-x-1.5 rounded-full px-2 py-0.5 text-xs font-medium uppercase
                          ${item.status === 'completed'
                            ? "bg-success/10 text-success"
                            : item.status === 'progress'
                            ? "bg-warning/10 text-warning"
                            : "bg-slate-150 text-slate-500 dark:bg-navy-500 dark:text-navy-200"
                          }`}
                      >
                        <span>{item.status}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex flex-wrap gap-1 max-w-45">
                        {item.symptoms?.length > 0 ? (
                          item.symptoms.slice(0, 2).map((s: any, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-100 dark:bg-navy-500 px-1.5 py-0.5 rounded">
                              {typeof s === 'string' ? s : s.name}
                            </span>
                          ))
                        ) : "—"}
                        {item.symptoms?.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{item.symptoms.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                      <div className="flex flex-col">
                        <span className="text-xs">{formatTodayOrDate(item.scheduledAt)}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex justify-end space-x-2">
                        {item.status === 'progress' && (
                          <button
                            onClick={() => handleJoinCall(item.id)}
                            className="flex size-8 items-center justify-center rounded-full bg-info/10 text-info transition-colors hover:bg-info hover:text-white cursor-pointer"
                            title="Join Consultation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        <Link
                          href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
                          className="flex size-8 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450 cursor-pointer"
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

        <Pagination
          currentPage={currentPage}
          totalEntries={assignedTotal}
          entriesPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={(entries) => {
            setEntriesPerPage(entries);
            setCurrentPage(1);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
