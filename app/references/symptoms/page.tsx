"use client";

import { useState, useEffect } from "react";
import ReferenceNav from "../_components/ReferenceNav";
import DashboardLayout from "../../components/DashboardLayout";
import CreateSymptomForm from "./_components/CreateSymptomForm";
import EditSymptomForm from "./_components/EditSymptomForm";
import { useSymptomStore } from "../../stores/symptomStore";
import { useTenantStore } from "../../stores/tenantStore";
import { useAuthStore } from "../../stores/authStore";
import { isSuperAdmin } from "../../lib/roles";
import { CreateSymptomRequest } from "../../lib/services/symptom.service";
import { Symptom } from "../../models";
import { useSearchContext } from "../../contexts/SearchContext";

export default function SymptomsPage() {
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const { symptoms, isLoading, error, isSubmitting, submitError, fetchSymptoms, createSymptom, updateSymptom, deleteSymptom } =
    useSymptomStore();
  const { tenants, fetchTenants } = useTenantStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Symptom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Symptom | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState("");

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search symptoms...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { fetchSymptoms(selectedTenantId || undefined, debouncedSearch || undefined); }, [selectedTenantId, debouncedSearch]);

  useEffect(() => { fetchTenants(); }, []);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (data: CreateSymptomRequest) => {
    setFormError(null);
    const ok = await createSymptom(data);
    if (ok) { setShowCreateModal(false); flash("Symptom created successfully."); }
    else setFormError(submitError);
  };

  const handleUpdate = async (id: string, data: CreateSymptomRequest) => {
    setFormError(null);
    const ok = await updateSymptom(id, data);
    if (ok) { setEditTarget(null); flash("Symptom updated successfully."); }
    else setFormError(submitError);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteSymptom(deleteTarget.id);
    if (ok) { setDeleteTarget(null); flash("Symptom deleted."); }
  };

  const defaultTenantId = userIsSuperAdmin ? "" : (currentUser as any)?.tenantId ?? "";

  const tenantName = (tenantId: string) =>
    tenants.find((t) => t.id === tenantId)?.province ?? tenantId;

  return (
    <DashboardLayout theme="admin">
      <ReferenceNav>
        <div>
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Symptoms</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Symptoms available for selection during consultations.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {userIsSuperAdmin && (
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
            >
              <option value="">All Provinces</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.province}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => { setFormError(null); setShowCreateModal(true); }}
            className="btn min-w-28 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
          >
            + Add Symptom
          </button>
        </div>
      </ReferenceNav>

      {/* Create Modal */}
      <CreateSymptomForm
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
      <EditSymptomForm
        isOpen={!!editTarget}
        symptom={editTarget}
        onClose={() => { setEditTarget(null); setFormError(null); }}
        onSubmit={handleUpdate}
        error={formError}
        isSubmitting={isSubmitting}
        tenants={tenants}
        isSuperAdmin={userIsSuperAdmin}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-navy-700">
            <h3 className="text-base font-semibold text-slate-700 dark:text-navy-100">Delete Symptom</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-navy-300">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-700 dark:text-navy-100">{deleteTarget.name}</span>?{" "}
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="btn rounded-full bg-error font-medium text-white hover:bg-error/90 disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {successMessage && (
        <div className="mb-3 bg-success/10 text-success px-4 py-3 rounded-lg text-center text-sm">
          {successMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-3 bg-error/10 text-error px-4 py-3 rounded-lg text-center" role="alert">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card mt-3">
        {isLoading ? (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Name</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Description</th>
                  {userIsSuperAdmin && <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Province</th>}
                  <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-5 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-48 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    {userIsSuperAdmin && <td className="px-4 py-3 sm:px-5"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" /></td>}
                    <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded bg-slate-200 dark:bg-navy-500" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : symptoms.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600 dark:text-navy-300">No symptoms found.</p>
          </div>
        ) : (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Name</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Description</th>
                  {userIsSuperAdmin && (
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Province</th>
                  )}
                  <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {symptoms.map((s: Symptom, index: number) => (
                  <tr
                    key={s.id}
                    className={`border-y border-transparent ${index === symptoms.length - 1 ? "" : "border-b-slate-200 dark:border-b-navy-500"}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{index + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">{s.name}</td>
                    <td className="px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-300 max-w-xs truncate">{s.description || "—"}</td>
                    {userIsSuperAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <span className="badge rounded-full bg-slate-150 text-slate-600 dark:bg-navy-500 dark:text-navy-200 text-xs">
                          {s.tenantName ?? tenantName(s.tenantId)}
                        </span>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setFormError(null); setEditTarget(s); }}
                          title="Edit"
                          className="btn size-8 rounded-full p-0 hover:bg-primary/10 text-primary dark:hover:bg-navy-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                        {userIsSuperAdmin && (
                          <button
                            onClick={() => setDeleteTarget(s)}
                            title="Delete"
                            className="btn size-8 rounded-full p-0 hover:bg-error/10 text-error dark:hover:bg-navy-600"
                          >
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
      </div>
    </DashboardLayout>
  );
}
