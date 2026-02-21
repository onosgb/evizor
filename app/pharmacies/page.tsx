"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreatePharmacyForm from "./_components/CreatePharmacyForm";
import EditPharmacyForm from "./_components/EditPharmacyForm";
import { usePharmacyStore } from "../stores/pharmacyStore";
import { useTenantStore } from "../stores/tenantStore";
import { useAuthStore } from "../stores/authStore";
import { isSuperAdmin } from "../lib/roles";
import { CreatePharmacyRequest, UpdatePharmacyRequest } from "../models/Pharmacy";
import { Pharmacy } from "../models";
import { useSearchContext } from "../contexts/SearchContext";
import { Pagination } from "../components/Pagination";

export default function PharmaciesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const { pharmacies, total, isLoading, isSubmitting, submitError, fetchPharmacies, createPharmacy, updatePharmacy, deletePharmacy } =
    usePharmacyStore();
  const { tenants, fetchTenants } = useTenantStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Pharmacy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pharmacy | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search pharmacies...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); setPage(1); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchPharmacies({ page, limit, search: debouncedSearch || undefined, tenantId: selectedTenantId || undefined, status: selectedStatus || undefined });
  }, [page, limit, debouncedSearch, selectedTenantId, selectedStatus]);

  useEffect(() => { fetchTenants(); }, []);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (data: CreatePharmacyRequest) => {
    setFormError(null);
    const ok = await createPharmacy(data);
    if (ok) { setShowCreateModal(false); flash("Pharmacy created successfully."); }
    else setFormError(submitError);
  };

  const handleEdit = async (data: UpdatePharmacyRequest) => {
    if (!editTarget) return;
    setFormError(null);
    const ok = await updatePharmacy(editTarget.id, data);
    if (ok) { setEditTarget(null); flash("Pharmacy updated successfully."); }
    else setFormError(submitError);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deletePharmacy(deleteTarget.id);
    if (ok) { setDeleteTarget(null); flash("Pharmacy deleted."); }
  };

  const defaultTenantId = userIsSuperAdmin ? "" : (currentUser as any)?.tenantId ?? "";

  return (
    <DashboardLayout theme="admin">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-navy-900 -mx-4 px-4 sm:-mx-5 sm:px-5 lg:-mx-10 lg:px-10 pb-3 pt-1 mb-3 border-b border-slate-200 dark:border-navy-600">
        <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Pharmacies</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {userIsSuperAdmin && (
              <select
                value={selectedTenantId}
                onChange={(e) => { setSelectedTenantId(e.target.value); setPage(1); }}
                className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
              >
                <option value="">All Provinces</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.province}</option>)}
              </select>
            )}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => { setFormError(null); setShowCreateModal(true); }}
              className="btn min-w-28 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus"
            >
              + Add Pharmacy
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <CreatePharmacyForm
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setFormError(null); }}
        onSubmit={handleCreate}
        error={formError}
        isSubmitting={isSubmitting}
        tenants={tenants}
        defaultTenantId={defaultTenantId}
        isSuperAdmin={userIsSuperAdmin}
      />

      {/* Edit Modal */}
      <EditPharmacyForm
        isOpen={!!editTarget}
        onClose={() => { setEditTarget(null); setFormError(null); }}
        onSubmit={handleEdit}
        pharmacy={editTarget}
        error={formError}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-navy-700">
            <h3 className="text-base font-semibold text-slate-700 dark:text-navy-100">Delete Pharmacy</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-navy-300">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700 dark:text-navy-100">{deleteTarget.name}</span>?{" "}
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isSubmitting} className="btn rounded-full bg-error font-medium text-white hover:bg-error/90 disabled:opacity-50">
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {successMessage && (
        <div className="mb-3 bg-success/10 text-success px-4 py-3 rounded-lg text-center text-sm">{successMessage}</div>
      )}

      {/* Table */}
      <div className="card mt-3">
        {isLoading ? (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  {["#", "Name", "Address", "Phone", "Email", "License", userIsSuperAdmin ? "Province" : null, "Status", "Actions"]
                    .filter(Boolean).map((h) => (
                      <th key={h} className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 first:rounded-tl-lg last:rounded-tr-lg lg:px-5">{h}</th>
                    ))}
                </tr>
              </thead>
              <tbody className="animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                    {Array.from({ length: userIsSuperAdmin ? 9 : 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3 sm:px-5"><div className="h-4 rounded bg-slate-200 dark:bg-navy-500" style={{ width: `${[20, 100, 120, 80, 120, 80, 70, 60, 40][j]}px` }} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600 dark:text-navy-300">No pharmacies found.</p>
          </div>
        ) : (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Name</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Address</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Phone</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Email</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">License</th>
                  {userIsSuperAdmin && <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Province</th>}
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((p: Pharmacy, index: number) => (
                  <tr key={p.id} className={`border-y border-transparent ${index === pharmacies.length - 1 ? "" : "border-b-slate-200 dark:border-b-navy-500"}`}>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{(page - 1) * limit + index + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">{p.name}</td>
                    <td className="px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-300 max-w-xs truncate">{p.address}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{p.phoneNumber}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{p.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <span className="badge rounded-full bg-slate-150 text-slate-600 dark:bg-navy-500 dark:text-navy-200 text-xs">{p.licenseNumber}</span>
                    </td>
                    {userIsSuperAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <span className="badge rounded-full bg-slate-150 text-slate-600 dark:bg-navy-500 dark:text-navy-200 text-xs">
                          {p.tenantName ?? tenants.find((t) => t.id === p.tenantId)?.province ?? "—"}
                        </span>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-1.5">
                        <span className={`size-2 rounded-full ${p.isActive ? "bg-success" : "bg-slate-400"}`} />
                        <span className="text-xs font-medium text-slate-600 dark:text-navy-200">
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setFormError(null); setEditTarget(p); }}
                          title="Edit"
                          className="btn size-8 rounded-full p-0 hover:bg-primary/10 text-primary dark:hover:bg-navy-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        {userIsSuperAdmin && (
                          <button onClick={() => setDeleteTarget(p)} title="Delete" className="btn size-8 rounded-full p-0 hover:bg-error/10 text-error dark:hover:bg-navy-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={page}
          totalEntries={total}
          entriesPerPage={limit}
          onPageChange={setPage}
          onEntriesPerPageChange={setLimit}
        />
      </div>
    </DashboardLayout>
  );
}
