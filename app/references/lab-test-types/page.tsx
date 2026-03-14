"use client";

import { useState, useEffect } from "react";
import ReferenceNav from "../_components/ReferenceNav";
import DashboardLayout from "../../components/DashboardLayout";
import CreateLabTestTypeForm from "./_components/CreateLabTestTypeForm";
import EditLabTestTypeForm from "./_components/EditLabTestTypeForm";
import { useLabTestTypeStore } from "../../stores/labTestTypeStore";
import { useAuthStore } from "../../stores/authStore";
import { isSuperAdmin } from "../../lib/roles";
import { CreateLabTestTypeRequest } from "../../lib/services/lab-test-type.service";
import { LabTestType } from "../../models";
import { useSearchContext } from "../../contexts/SearchContext";

export default function LabTestTypesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const {
    labTestTypes,
    isLoading,
    error,
    fetchLabTestTypes,
    createLabTestType,
    updateLabTestType,
    deleteLabTestType,
    isSubmitting,
    submitError,
  } = useLabTestTypeStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<LabTestType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LabTestType | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { fetchLabTestTypes(debouncedSearch || undefined); }, [debouncedSearch, fetchLabTestTypes]);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (data: CreateLabTestTypeRequest) => {
    const ok = await createLabTestType(data);
    if (ok) { setShowCreateModal(false); flash("Lab test / Diagnosis created successfully."); }
  };

  const handleUpdate = async (id: string, data: Partial<CreateLabTestTypeRequest>) => {
    const ok = await updateLabTestType(id, data);
    if (ok) { setEditTarget(null); flash("Lab test / Diagnosis updated successfully."); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteLabTestType(deleteTarget.id);
    if (ok) { setDeleteTarget(null); flash("Lab test / Diagnosis deleted."); }
  };

  return (
    <DashboardLayout theme="admin">
      <ReferenceNav>
        <div>
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Lab Test / Diagnosis</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Configure laboratory tests / Diagnosis that patients can upload results for.
          </p>
        </div>
        {userIsSuperAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn min-w-28 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
          >
            + Add
          </button>
        )}
      </ReferenceNav>

      {/* Modals */}
      {userIsSuperAdmin && (
        <>
          <CreateLabTestTypeForm
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            error={submitError}
            isSubmitting={isSubmitting}
          />
          <EditLabTestTypeForm
            isOpen={!!editTarget}
            labTestType={editTarget}
            onClose={() => setEditTarget(null)}
            onSubmit={handleUpdate}
            error={submitError}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-navy-700">
            <h3 className="text-base font-semibold text-slate-700 dark:text-navy-100">Delete Lab Test Type</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-navy-300">
              Are you sure you want to delete <span className="font-medium text-slate-700 dark:text-navy-100">{deleteTarget.name}</span>?
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

      {successMessage && (
        <div className="mb-3 bg-success/10 text-success px-4 py-3 rounded-lg text-center text-sm">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mt-3 bg-error/10 text-error px-4 py-3 rounded-lg text-center" role="alert">
          {error}
        </div>
      )}

      <div className="card mt-3">
        {isLoading ? (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
               <thead>
                <tr>
                   <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100">#</th>
                   <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100">Name</th>
                   <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100">Status</th>
                   {userIsSuperAdmin && <th className="whitespace-nowrap px-4 py-3 font-semibold uppercase text-slate-800 dark:text-navy-100 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="animate-pulse">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-slate-200 dark:border-navy-500">
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-slate-200 dark:bg-navy-500 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-32 bg-slate-200 dark:bg-navy-500 rounded" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-slate-200 dark:bg-navy-500 rounded-full" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-16 bg-slate-200 dark:bg-navy-500 rounded ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : labTestTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-slate-600 dark:text-navy-300">No lab test types found.</p>
          </div>
        ) : (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Name</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  {userIsSuperAdmin && (
                    <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {labTestTypes.map((t, index) => (
                  <tr key={t.id} className={`border-y border-transparent ${index === labTestTypes.length - 1 ? "" : "border-b-slate-200 dark:border-b-navy-500"}`}>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 sm:px-5 truncate max-w-xs" title={t.description}>
                      <span className="font-semibold text-slate-700 dark:text-navy-100">{t.name}</span>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className={`badge rounded-full text-white ${t.isActive ? "bg-success" : "bg-slate-400"}`}>
                        {t.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    {userIsSuperAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-right">
                        <div className="flex justify-end gap-2 text-right">
                          <button
                            onClick={() => setEditTarget(t)}
                            className="btn size-8 rounded-full p-0 hover:bg-primary/10 text-primary dark:hover:bg-navy-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="btn size-8 rounded-full p-0 hover:bg-error/10 text-error dark:hover:bg-navy-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
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
