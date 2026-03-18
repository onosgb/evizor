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
import { FormSelect } from "../../components/ui/FormSelect";
import { Button } from "../../components/ui/button";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Edit3, Trash2, Plus } from "lucide-react";

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

  useEffect(() => { fetchSymptoms(selectedTenantId || undefined, debouncedSearch || undefined); }, [selectedTenantId, debouncedSearch, fetchSymptoms]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

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
            <FormSelect
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              wrapperClassName="mb-0!"
              className="h-9 py-1!"
            >
              <option value="">All Provinces</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.province}</option>
              ))}
            </FormSelect>
          )}
          <Button
            onClick={() => { setFormError(null); setShowCreateModal(true); }}
            variant="success"
            className="min-w-28 rounded-full"
          >
            <Plus className="size-4 mr-1" /> Add Symptom
          </Button>
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
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Symptom"
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
                        <Button
                          onClick={() => { setFormError(null); setEditTarget(s); }}
                          title="Edit"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full p-0 text-primary dark:hover:bg-navy-600"
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        {userIsSuperAdmin && (
                          <Button
                            onClick={() => setDeleteTarget(s)}
                            title="Delete"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full p-0 text-error dark:hover:bg-navy-600"
                          >
                            <Trash2 className="size-4" />
                          </Button>
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
