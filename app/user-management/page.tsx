"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import CreateUserForm from "./_components/CreateUserForm";
import ScheduleManagementModal from "./_components/ScheduleManagementModal";
import Image from "next/image";
import { Staff, CreateStaffRequest } from "../models";
import { userService } from "../lib/services";
import { ApiError } from "../models";
import { Pagination } from "../components/Pagination";
import TableActionMenu from "../components/TableActionMenu";
import { useAuthStore, useTenantStore, useUserStore } from "../stores";
import { isSuperAdmin } from "../lib/roles";
import { useSearchContext } from "../contexts/SearchContext";

// Helper function to get role badge color
const getRoleBadgeColor = (role: string | null | undefined): string => {
  if (!role) return "bg-slate-400";
  switch (role.toUpperCase()) {
    case "DOCTOR":
      return "bg-primary";
    case "SUPERADMIN":
      return "bg-success";
    case "ADMIN":
      return "bg-warning";
    default:
      return "bg-slate-400";
  }
};

// Helper function to check if status is active
const isActiveStatus = (status: string | null | undefined): boolean => {
  if (!status) return false;
  return status.toUpperCase() === "ACTIVE";
};

// Dot color for each status
const getStatusDotColor = (status: string | null | undefined): string => {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":      return "bg-success";
    case "PENDING":     return "bg-warning";
    case "SUSPENDED":   return "bg-error";
    case "DEACTIVATED": return "bg-slate-500";
    default:            return "bg-slate-400";
  }
};

// Badge bg for the confirmation button
const getStatusBadgeColor = (status: string | null | undefined): string => {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":      return "bg-success";
    case "PENDING":     return "bg-warning text-slate-800";
    case "SUSPENDED":   return "bg-error";
    case "DEACTIVATED": return "bg-slate-400";
    default:            return "bg-slate-400";
  }
};

export default function UserManagementPage() {
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(currentUser);
  const { tenants, fetchTenants } = useTenantStore();
  const { query: contextQuery, registerPageSearch, unregisterPageSearch } = useSearchContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedUserForSchedule, setSelectedUserForSchedule] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [toggleTarget, setToggleTarget] = useState<Staff | null>(null);
  const [toggleNewStatus, setToggleNewStatus] = useState<string>("");

  const {
    users,
    total,
    isLoading,
    error,
    isSubmitting,
    formError,
    fetchUsers,
    createUser,
    toggleUserStatus,
    resetFormError
  } = useUserStore();

  // Register top-bar search for this page
  useEffect(() => {
    registerPageSearch("Search users...");
    return () => unregisterPageSearch();
  }, [registerPageSearch, unregisterPageSearch]);

  // Sync top-bar search query into local state
  useEffect(() => {
    setSearchQuery(contextQuery);
  }, [contextQuery]);

  // Debounce search — wait 450 ms after the user stops typing before fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Re-fetch whenever page, page size, search query, province or role filter changes
  useEffect(() => {
    fetchUsers({
      page,
      limit,
      search: debouncedSearch || undefined,
      tenantId: selectedProvince || undefined,
      role: selectedRole || undefined,
    });
  }, [page, limit, debouncedSearch, selectedProvince, selectedRole, fetchUsers]);

  useEffect(() => { if (userIsSuperAdmin) fetchTenants(); }, [userIsSuperAdmin]);

  // Data is already paginated by the server
  const startIndex = (page - 1) * limit;
  const paginatedData = users;

  const confirmToggleUserStatus = async () => {
    if (!toggleTarget || !toggleNewStatus) return;
    await toggleUserStatus(toggleTarget.id, toggleNewStatus);
    setToggleTarget(null);
    setToggleNewStatus("");
  };

  const handleCreateUser = async (data: CreateStaffRequest) => {
    const success = await createUser(data);
    if (success) {
      setShowModal(false);
    }
  };


  const handleOpenSchedule = (userId: string, userName: string) => {
    setSelectedUserForSchedule({ id: userId, name: userName });
    setShowScheduleModal(true);
  };

  return (
    <DashboardLayout theme="admin">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">
            User Management
          </h2>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
            className="form-select h-9 w-36 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
          >
            <option value="">All Roles</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
          </select>
          {userIsSuperAdmin && (
            <select
              value={selectedProvince}
              onChange={(e) => { setSelectedProvince(e.target.value); setPage(1); }}
              className="form-select h-9 rounded-lg border border-slate-300 bg-transparent px-3 py-1.5 text-sm dark:border-navy-450 dark:text-navy-100"
            >
              <option value="">All Provinces</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>{t.province}</option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="btn min-w-28 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
          >
            Add New User
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      <CreateUserForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetFormError();
        }}
        onSubmit={handleCreateUser}
        error={formError}
        isSubmitting={isSubmitting}
        theme="admin"
      />

      {/* Toggle Status Confirmation */}
      {toggleTarget && (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4" role="dialog">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => { setToggleTarget(null); setToggleNewStatus(""); }} />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-navy-700">
            <h3 className="text-base font-semibold text-slate-700 dark:text-navy-100">
              Confirm Status Change
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-navy-300">
              Are you sure you want to set{" "}
              <span className="font-medium text-slate-700 dark:text-navy-100">
                {toggleTarget.firstName} {toggleTarget.lastName}
              </span>{" "}
              to <span className="font-medium">{toggleNewStatus}</span>?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => { setToggleTarget(null); setToggleNewStatus(""); }}
                className="btn rounded-full border border-slate-300 font-medium text-slate-700 hover:bg-slate-100 dark:border-navy-450 dark:text-navy-100 dark:hover:bg-navy-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleUserStatus}
                className={`btn rounded-full font-medium text-white ${getStatusBadgeColor(toggleNewStatus)}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Management Modal */}
      {selectedUserForSchedule && (
        <ScheduleManagementModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedUserForSchedule(null);
          }}
          userId={selectedUserForSchedule.id}
          userName={selectedUserForSchedule.name}
          theme="admin"
        />
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mt-3 bg-error/10 text-error px-4 py-3 rounded-lg text-center"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* User Table */}
      <div>
        <div className="card mt-3">
          {users.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600 dark:text-navy-300">
                No users found.
              </p>
            </div>
          ) : (
            <>
              <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
                <table className="is-hoverable w-full text-left">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        #
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Avatar
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Name
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Email
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Phone
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Province
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Role
                      </th>
                      <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Status
                      </th>
                      <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading
                      ? Array.from({ length: 6 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500 animate-pulse"
                          >
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-5 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="size-9 rounded-full bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-40 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-navy-500" />
                            </td>
                            <td className="px-4 py-3 sm:px-5">
                              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-navy-500" />
                            </td>
                          </tr>
                        ))
                      : paginatedData.map((member, index) => (
                          <tr
                            key={member.id}
                            className={`border-y border-transparent ${
                              index === paginatedData.length - 1
                                ? ""
                                : "border-b-slate-200 dark:border-b-navy-500"
                            }`}
                          >
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {index + startIndex + 1}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              <div className="avatar flex size-10">
                                <Image
                                  className="mask is-squircle"
                                  src={member.profilePictureUrl??"/images/200x200.png"}
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                              {member.firstName + " " + member.lastName}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {member.email}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {member.phoneNumber}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {tenants.find((t) => t.id === member.tenantId)?.province || "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                               <div
                                 className={`badge rounded-full ${getRoleBadgeColor(
                                  member.role,
                                )} text-white`}
                              >
                                {member.role}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-block size-2 rounded-full ${getStatusDotColor(member.status)}`} />
                                <span className="text-xs font-medium text-slate-600 dark:text-navy-200">{member.status ?? "—"}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              <div className="flex justify-end">
                                <TableActionMenu>
                                  <div className="w-48">
                                    <ul>
                                      <li>
                                        <a
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (member.role?.toUpperCase() === "PATIENT") {
                                              router.push(`/patient-preview?patientId=${member.id}`);
                                            } else {
                                              router.push(`/profile?userId=${member.id}`);
                                            }
                                          }}
                                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                        >
                                          View Details
                                        </a>
                                      </li>
                                    </ul>

                                    {/* Status change actions */}
                                    <div className="my-1 h-px bg-slate-150 dark:bg-navy-500" />
                                    <ul>
                                      {(member.status ?? "").toUpperCase() !== "ACTIVE" && (
                                        <li>
                                          <button
                                            onClick={() => { setToggleTarget(member); setToggleNewStatus("ACTIVE"); }}
                                            className="flex w-full h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide text-success outline-hidden transition-all hover:bg-slate-100 dark:hover:bg-navy-600"
                                          >
                                            Activate
                                          </button>
                                        </li>
                                      )}
                                      {(member.status ?? "").toUpperCase() !== "SUSPENDED" && (
                                        <li>
                                          <button
                                            onClick={() => { setToggleTarget(member); setToggleNewStatus("SUSPENDED"); }}
                                            className="flex w-full h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide text-error outline-hidden transition-all hover:bg-slate-100 dark:hover:bg-navy-600"
                                          >
                                            Suspend
                                          </button>
                                        </li>
                                      )}
                                      {(member.status ?? "").toUpperCase() !== "DEACTIVATED" && (
                                        <li>
                                          <button
                                            onClick={() => { setToggleTarget(member); setToggleNewStatus("DEACTIVATED"); }}
                                            className="flex w-full h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide text-slate-500 outline-hidden transition-all hover:bg-slate-100 dark:hover:bg-navy-600"
                                          >
                                            Deactivate
                                          </button>
                                        </li>
                                      )}
                                    </ul>

                                    {member.role?.toUpperCase() === "DOCTOR" && (
                                      <>
                                        <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                                        <ul>
                                          <li>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenSchedule(member.id, member.firstName + " " + member.lastName);
                                              }}
                                              className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                            >
                                              Schedule
                                            </a>
                                          </li>
                                        </ul>
                                      </>
                                    )}
                                  </div>
                                </TableActionMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
      <Pagination
        currentPage={page}
        totalEntries={total}
        entriesPerPage={limit}
        onPageChange={setPage}
        onEntriesPerPageChange={setLimit}
      />
        </div>
      </div>
    </DashboardLayout>
  );
}
