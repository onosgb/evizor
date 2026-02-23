"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { Pagination } from "../components/Pagination";
import { useAppointmentStore } from "../stores/appointmentStore";
import { AppointmentStatus } from "../models";
import { useSearchContext } from "../contexts/SearchContext";
import { formatDate } from "@/app/lib/utils/dateUtils";

export default function AssignedCasesPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { assignedCases, assignedTotal, isLoading, error, fetchAssignedCases } =
    useAppointmentStore();

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
    });
  }, [currentPage, entriesPerPage, dateFrom, dateTo, debouncedSearch]);

  const completedCases = assignedCases.filter(
    (item) => item.status === AppointmentStatus.COMPLETED,
  );

  const hasDateFilter = !!(dateFrom || dateTo);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
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
            {assignedTotal} completed case{assignedTotal !== 1 ? "s" : ""}
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
            <div>
              <label className="block text-xs text-slate-500 dark:text-navy-300 mb-0.5">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-navy-300 mb-0.5">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="form-input w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
              />
            </div>
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
                  Scheduled At
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  Severity
                </th>
                <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5" />
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
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-10 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-navy-500" />
                    </td>
                  </tr>
                ))
              ) : completedCases.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-slate-500 dark:text-navy-300"
                  >
                    No completed cases found.
                  </td>
                </tr>
              ) : (
                completedCases.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-y border-transparent ${
                      index === completedCases.length - 1
                        ? ""
                        : "border-b-slate-200 dark:border-b-navy-500"
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-500 dark:text-navy-300">
                      {startIndex + index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex items-center space-x-3">
                        <div className="avatar size-9">
                          <Image
                            className="rounded-full"
                            src="/images/200x200.png"
                            alt={item.patientName}
                            width={36}
                            height={36}
                          />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-navy-100">
                          {item.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-100 max-w-xs truncate">
                      {item.description || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-100">
                      {formatDate(item.scheduledAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-100">
                      {item.severity ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
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
