"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { AppointmentStatus } from "@/app/models";
import { useQueueMonitorStore } from "@/app/stores/queueMonitorStore";
import { useTenantStore } from "@/app/stores/tenantStore";
import { useAuthStore } from "@/app/stores/authStore";
import { isSuperAdmin } from "@/app/lib/roles";
import { Pagination } from "../components/Pagination";
import { useSearchContext } from "../contexts/SearchContext";

export default function QueueMonitorPage() {
  const {
    appointments,
    total,
    page,
    limit,
    status,
    tenantId,
    isLoading,
    setPage,
    setLimit,
    setStatus,
    setTenantId,
    fetchAppointments
  } = useQueueMonitorStore();

  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);
  const { tenants, fetchTenants } = useTenantStore();

  const [searchQuery, setSearchQuery] = useState("");

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search by patient or doctor...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => { if (userIsSuperAdmin) fetchTenants(); }, [userIsSuperAdmin]);

  useEffect(() => {
    fetchAppointments();
  }, [page, limit, status, tenantId]);

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
        <div className="flex items-center gap-2 flex-wrap">
          {userIsSuperAdmin && (
            <select
              value={tenantId}
              className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
              onChange={(e) => setTenantId(e.target.value)}
            >
              <option value="">All Provinces</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.province}</option>
              ))}
            </select>
          )}
          <select
            className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus | "")}
          >
            <option value="">All Status</option>
            <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
            <option value={AppointmentStatus.PROGRESS}>In Progress</option>
            <option value={AppointmentStatus.COMPLETED}>Completed</option>
            <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
          </select>
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
                        <div className="flex items-center justify-end">
                            <Link
                              href={`/patient-preview?appointmentId=${item.id}&patientId=${item.patientId}`}
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
