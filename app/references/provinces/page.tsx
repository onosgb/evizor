"use client";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";
import ReferenceNav from "../_components/ReferenceNav";
import DashboardLayout from "../../components/DashboardLayout";
import EditTenantForm from "./_components/EditTenantForm";
import CreateTenantForm from "./_components/CreateTenantForm";
import { useTenantStore } from "../../stores/tenantStore";
import { useAuthStore } from "../../stores/authStore";
import { isSuperAdmin } from "../../lib/roles";
import { UpdateTenantRequest } from "../../lib/services/tenant.service";
import { Tenant } from "../../models";
import { useSearchContext } from "../../contexts/SearchContext";
import { Button } from "../../components/ui/button";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Edit3, Ban, CheckCircle, Plus } from "lucide-react";

export default function ProvincesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);

  const { tenants, isLoading, error, isSubmitting, submitError, fetchTenants, updateTenant, toggleTenantStatus, createTenant } =
    useTenantStore();

  const [editTarget, setEditTarget] = useState<Tenant | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<Tenant | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  useEffect(() => {
    registerPageSearch("Search provinces...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  useEffect(() => { setSearchQuery(contextQuery); }, [contextQuery]);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchQuery); }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { fetchTenants(debouncedSearch || undefined); }, [debouncedSearch]);

  const flash = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreate = async (data: UpdateTenantRequest) => {
    setFormError(null);
    const ok = await createTenant(data);
    if (ok) { setShowCreateModal(false); flash("Province created successfully."); }
    else setFormError(submitError);
  };

  const handleUpdate = async (id: string, data: UpdateTenantRequest) => {
    setFormError(null);
    const ok = await updateTenant(id, data);
    if (ok) { setEditTarget(null); flash("Province updated successfully."); }
    else setFormError(submitError);
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    const ok = await toggleTenantStatus(toggleTarget.id, !toggleTarget.isActive);
    if (ok) {
      flash(`Province ${toggleTarget.isActive ? "deactivated" : "activated"} successfully.`);
      setToggleTarget(null);
    }
  };

  return (
    <DashboardLayout theme="admin">
      <ReferenceNav>
        <div>
          <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Provinces</h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
            Provinces / tenants configured in the platform.
          </p>
        </div>
        {userIsSuperAdmin && (
          <Button
            onClick={() => { setFormError(null); setShowCreateModal(true); }}
            variant="success"
            className="min-w-28 rounded-full"
          >
            <Plus className="size-4 mr-1" /> Add Province
          </Button>
        )}
      </ReferenceNav>

      {/* Create Modal */}
      {userIsSuperAdmin && (
        <CreateTenantForm
          isOpen={showCreateModal}
          onClose={() => { setShowCreateModal(false); setFormError(null); }}
          onSubmit={handleCreate}
          error={formError}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Toggle status confirmation */}
      <ConfirmationModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        title={`${toggleTarget?.isActive ? "Deactivate" : "Activate"} Province`}
        message={`Are you sure you want to ${toggleTarget?.isActive ? "deactivate" : "activate"} ${toggleTarget?.province}?`}
        confirmText={toggleTarget?.isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        onConfirm={handleToggle}
        isLoading={isSubmitting}
        variant={toggleTarget?.isActive ? "error" : "success"}
      />

      {/* Edit Modal */}
      {userIsSuperAdmin && (
        <EditTenantForm
          isOpen={!!editTarget}
          tenant={editTarget}
          onClose={() => { setEditTarget(null); setFormError(null); }}
          onSubmit={handleUpdate}
          error={formError}
          isSubmitting={isSubmitting}
        />
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
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Province</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Slug</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  {userIsSuperAdmin && <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>}
                </tr>
              </thead>
              <tbody className="animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-5 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-36 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" /></td>
                    <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-navy-500" /></td>
                    {userIsSuperAdmin && <td className="px-4 py-3 sm:px-5"><div className="h-5 w-16 rounded bg-slate-200 dark:bg-navy-500" /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : tenants.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600 dark:text-navy-300">No provinces found.</p>
          </div>
        ) : (
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">#</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Province</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Slug</th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Status</th>
                  {userIsSuperAdmin && (
                    <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tenants.map((t: Tenant, index: number) => (
                  <tr
                    key={t.id}
                    className={`border-y border-transparent ${index === tenants.length - 1 ? "" : "border-b-slate-200 dark:border-b-navy-500"}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">{index + 1}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">{t.province}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 text-slate-600 dark:text-navy-300">{t.slug}</td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <div className={`badge rounded-full text-white ${t.isActive ? "bg-success" : "bg-slate-400"}`}>
                        {t.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    {userIsSuperAdmin && (
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          <Button
                            onClick={() => { setFormError(null); setEditTarget(t); }}
                            title="Edit"
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full p-0 text-primary dark:hover:bg-navy-600"
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          {/* Toggle status */}
                          <Button
                            onClick={() => setToggleTarget(t)}
                            title={t.isActive ? "Deactivate" : "Activate"}
                            disabled={isSubmitting}
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "size-8 rounded-full p-0",
                              t.isActive
                                ? "text-error dark:hover:bg-navy-600"
                                : "text-success dark:hover:bg-navy-600"
                            )}
                          >
                            {t.isActive ? (
                              <Ban className="size-4" />
                            ) : (
                              <CheckCircle className="size-4" />
                            )}
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
