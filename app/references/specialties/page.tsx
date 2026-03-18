"use client";

import { useState, useEffect } from "react";
import ReferenceNav from "../_components/ReferenceNav";
import DashboardLayout from "../../components/DashboardLayout";
import CreateSpecialtyForm from "./_components/CreateSpecialtyForm";
import EditSpecialtyForm from "./_components/EditSpecialtyForm";
import { useSpecialtyStore } from "../../stores/specialtyStore";
import { useAuthStore } from "../../stores/authStore";
import { isSuperAdmin } from "../../lib/roles";
import { CreateSpecialtyRequest } from "../../lib/services/specialty.service";
import { Specialty } from "../../models";
import { useSearchContext } from "../../contexts/SearchContext";
import { Button } from "../../components/ui/button";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Edit3, Trash2, Plus } from "lucide-react";

export default function SpecialtiesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const {
    specialties,
    isLoading,
    error,
    fetchSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    isSubmitting,
    submitError,
  } = useSpecialtyStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Specialty | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Specialty | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search specialties...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { fetchSpecialties(debouncedSearch || undefined); }, [debouncedSearch, fetchSpecialties]);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (data: CreateSpecialtyRequest) => {
    setFormError(null);
    const ok = await createSpecialty(data);
    if (ok) { setShowCreateModal(false); flash("Specialty created successfully."); }
    else setFormError(submitError);
  };

  const handleUpdate = async (id: string, data: CreateSpecialtyRequest) => {
    setFormError(null);
    const ok = await updateSpecialty(id, data);
    if (ok) { setEditTarget(null); flash("Specialty updated successfully."); }
    else setFormError(submitError);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await deleteSpecialty(deleteTarget.id);
    if (ok) { setDeleteTarget(null); flash("Specialty deleted."); }
  };

  return (
    <DashboardLayout theme="admin">
      <ReferenceNav>
        <div>
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Specialties</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Medical specialties available in the system.
          </p>
        </div>
        {userIsSuperAdmin && (
          <Button
            onClick={() => { setFormError(null); setShowCreateModal(true); }}
            variant="success"
            className="min-w-28 rounded-full"
          >
            <Plus className="size-4 mr-1" /> Add Specialty
          </Button>
        )}
      </ReferenceNav>

      {/* Modals */}
      {userIsSuperAdmin && (
        <>
          <CreateSpecialtyForm
            isOpen={showCreateModal}
            onClose={() => { setShowCreateModal(false); setFormError(null); }}
            onSubmit={handleCreate}
            error={formError}
            isSubmitting={isSubmitting}
          />
          <EditSpecialtyForm
            isOpen={!!editTarget}
            specialty={editTarget}
            onClose={() => { setEditTarget(null); setFormError(null); }}
            onSubmit={handleUpdate}
            error={formError}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Specialty"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        variant="error"
      />

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
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  {userIsSuperAdmin && <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>}
                </tr>
              </thead>
              <tbody className="animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-5 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-48 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-navy-500" /></td>
                    {userIsSuperAdmin && <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded bg-slate-200 dark:bg-navy-500" /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : specialties.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600 dark:text-navy-300">No specialties found.</p>
          </div>
        ) : (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Name</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Description</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  {userIsSuperAdmin && (
                    <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {specialties.map((s: Specialty, index: number) => (
                  <tr
                    key={s.id}
                    className={`border-y border-transparent ${index === specialties.length - 1 ? "" : "border-b-slate-200 dark:border-b-navy-500"}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{index + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">{s.name}</td>
                    <td className="px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-300 max-w-xs truncate">{s.description || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className={`badge rounded-full text-white ${s.isActive ? "bg-success" : "bg-slate-400"}`}>
                        {s.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    {userIsSuperAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          <Button
                            onClick={() => { setFormError(null); setEditTarget(s); }}
                            title="Edit"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full p-0 text-primary dark:hover:bg-navy-600"
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          {/* Delete */}
                          <Button
                            onClick={() => setDeleteTarget(s)}
                            title="Delete"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full p-0 text-error dark:hover:bg-navy-600"
                          >
                            <Trash2 className="size-4" />
                          </Button>
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
