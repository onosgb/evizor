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
import { FormSelect } from "../components/ui/FormSelect";
import { Button } from "../components/ui/button";
import ConfirmationModal from "../components/ConfirmationModal";
import { Edit3, Trash2, Plus } from "lucide-react";

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
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">Pharmacies</h2>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {userIsSuperAdmin && (
            <FormSelect
              value={selectedTenantId}
              onChange={(e) => { setSelectedTenantId(e.target.value); setPage(1); }}
              wrapperClassName="mb-0!"
              className="h-9 py-1!"
            >
              <option value="">All Provinces</option>
              {tenants.map((t) => <option key={t.id} value={t.id}>{t.province}</option>)}
            </FormSelect>
          )}
          <FormSelect
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
            wrapperClassName="mb-0!"
            className="h-9 py-1!"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormSelect>
          <Button
            onClick={() => { setFormError(null); setShowCreateModal(true); }}
            variant="success"
            className="min-w-28 rounded-full"
          >
            <Plus className="size-4 mr-1" /> Add Pharmacy
          </Button>
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
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Pharmacy"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        variant="error"
      />

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
                        <Button
                          onClick={() => { setFormError(null); setEditTarget(p); }}
                          title="Edit"
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full p-0 text-primary dark:hover:bg-navy-600"
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        {userIsSuperAdmin && (
                          <Button 
                            onClick={() => setDeleteTarget(p)} 
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
