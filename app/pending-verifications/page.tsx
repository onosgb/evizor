"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { usePendingVerificationStore } from "@/app/stores/pendingVerificationStore";
import { useTenantStore } from "@/app/stores/tenantStore";
import { useAuthStore } from "@/app/stores/authStore";
import { isSuperAdmin } from "@/app/lib/roles";
import { useSearchContext } from "../contexts/SearchContext";
import { Pagination } from "../components/Pagination";
import VerificationModal from "./_components/VerificationModal";
import { formatDate } from "../lib/utils/dateUtils";

export default function PendingVerificationsPage() {
  const {
    pendingVerifications,
    isLoading,
    error,
    search,
    tenantId,
    page,
    limit,
    total,
    setSearch,
    setTenantId,
    setPage,
    setLimit,
    fetchPendingVerifications,
    approveVerification,
    rejectVerification,
  } = usePendingVerificationStore();

  const { tenants, fetchTenants } = useTenantStore();
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const {
    query: contextQuery,
    registerPageSearch,
    unregisterPageSearch,
  } = useSearchContext();
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    userId: string;
    userName: string;
  } | null>(null);

  // Register top-bar search
  useEffect(() => {
    registerPageSearch("Search verifications...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  // Sync top-bar query → store
  useEffect(() => {
    setSearch(contextQuery);
  }, [contextQuery, setSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch tenants for province dropdown (super admin only)
  useEffect(() => {
    if (userIsSuperAdmin) fetchTenants();
  }, [userIsSuperAdmin, fetchTenants]);

  // Re-fetch whenever debounced search, province, page or limit changes
  useEffect(() => {
    fetchPendingVerifications();
  }, [debouncedSearch, tenantId, page, limit, fetchPendingVerifications]);

  const handleOpenModal = (
    userId: string,
    userName: string,
    type: "approve" | "reject",
  ) => {
    setVerificationModal({ isOpen: true, type, userId, userName });
  };

  const handleConfirmVerification = async (comment: string) => {
    if (!verificationModal) return;
    if (verificationModal.type === "approve") {
      await approveVerification(verificationModal.userId);
    } else {
      await rejectVerification(verificationModal.userId, comment);
    }
    setVerificationModal(null);
  };

  return (
    <DashboardLayout theme="admin">
      <div className="flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center lg:py-6">
        <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">
          Pending Verifications
        </h2>

        {userIsSuperAdmin && (
          <select
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
          >
            <option value="">All Provinces</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.province}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-error/10 px-4 py-3 text-error dark:bg-error/20">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="card mt-3">
        <div className="is-scrollbar-hidden overflow-x-auto">
          <table className="is-hoverable w-full text-left">
            <thead>
              <tr>
                <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  DOCTOR NAME
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  SPECIALTY
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  LICENSE NUMBER
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  ISSUING AUTHORITY
                </th>
                <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  EXPIRY DATE
                </th>
                <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-36 rounded bg-slate-200 dark:bg-navy-500" />
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
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
                      <div className="flex space-x-2">
                        <div className="h-8 w-16 rounded bg-slate-200 dark:bg-navy-500" />
                        <div className="h-8 w-14 rounded bg-slate-200 dark:bg-navy-500" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : pendingVerifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500 dark:text-navy-300"
                  >
                    No pending verifications found.
                  </td>
                </tr>
              ) : (
                pendingVerifications.map((item) => (
                  <tr
                    key={item.userId}
                    className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500"
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 font-medium text-slate-700 dark:text-navy-100">
                      {item.doctorName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      {item.specialty || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      {item.licenseNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      {item.issuingAuthority}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      {formatDate(item.licenseExpiryDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleOpenModal(
                              item.userId,
                              item.doctorName,
                              "approve",
                            )
                          }
                          className="btn h-8 rounded bg-primary px-3 text-xs font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleOpenModal(
                              item.userId,
                              item.doctorName,
                              "reject",
                            )
                          }
                          className="btn h-8 rounded bg-error px-3 text-xs font-medium text-white hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalEntries={total}
          entriesPerPage={limit}
          onPageChange={setPage}
          onEntriesPerPageChange={setLimit}
        />
      </div>

      <VerificationModal
        isOpen={!!verificationModal?.isOpen}
        onClose={() => setVerificationModal(null)}
        onConfirm={handleConfirmVerification}
        userName={verificationModal?.userName || ""}
        type={verificationModal?.type}
      />
    </DashboardLayout>
  );
}
