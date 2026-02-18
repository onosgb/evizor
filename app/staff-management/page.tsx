"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import CreateStaffForm from "./_components/CreateStaffForm";
import ScheduleManagementModal from "./_components/ScheduleManagementModal";
import Image from "next/image";
import { Staff, CreateStaffRequest } from "../models";
import { staffService } from "../lib/services";
import { ApiError } from "../models";
import { Pagination } from "../components/Pagination";
import TableActionMenu from "../components/TableActionMenu";

// Helper function to get role badge color
const getRoleBadgeColor = (role: string | null | undefined): string => {
  if (!role) return "bg-slate-400";
  switch (role.toUpperCase()) {
    case "DOCTOR":
      return "bg-primary";
    case "SUPERADMIN":
      return "bg-success";
    default:
      return "bg-slate-400";
  }
};

// Helper function to check if status is active
const isActiveStatus = (status: string | null | undefined): boolean => {
  if (!status) return false;
  return status.toUpperCase() === "ACTIVE" || status === "true";
};

export default function StaffManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStaffForSchedule, setSelectedStaffForSchedule] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch staff on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await staffService.getAllStaff();
        if (response.status && response.data) {
          setStaff(response.data);
        } else {
          setError(response.message || "Failed to fetch staff");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Failed to fetch staff");
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching staff:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredData = staff.filter(
    (item) =>
      (item.fullName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (item.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.phoneNumber || "").includes(searchQuery),
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const toggleStaffStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = isActiveStatus(currentStatus) ? "INACTIVE" : "ACTIVE";
      const response = await staffService.toggleStaffStatus(id, newStatus);
      if (response.status && response.data) {
        setStaff(
          staff.map((member) => (member.id === id ? response.data : member)),
        );
      } else {
        setError(response.message || "Failed to update staff status");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to update staff status");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error updating staff status:", err);
    }
  };

  const handleCreateStaff = async (data: CreateStaffRequest) => {
    setIsSubmitting(true);
    setFormError(null);
    setError(null);

    try {
      const response = await staffService.createStaff(data);
      if (response.status && response.data) {
        setStaff([...staff, response.data]);
        setShowModal(false);
      } else {
        setFormError(response.message || "Failed to create staff");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message || "Failed to create staff");
      } else {
        setFormError("An unexpected error occurred");
      }
      console.error("Error creating staff:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenSchedule = (staffId: string, staffName: string) => {
    setSelectedStaffForSchedule({ id: staffId, name: staffName });
    setShowScheduleModal(true);
  };

  return (
    <DashboardLayout theme="admin">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">
            Staff Management
          </h2>
        </div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn min-w-28 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
          >
            Add New Staff
          </button>
        </div>
      </div>

      {/* Add Staff Modal */}
      <CreateStaffForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormError(null);
        }}
        onSubmit={handleCreateStaff}
        error={formError}
        isSubmitting={isSubmitting}
        theme="admin"
      />

      {/* Schedule Management Modal */}
      {selectedStaffForSchedule && (
        <ScheduleManagementModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedStaffForSchedule(null);
          }}
          userId={selectedStaffForSchedule.id}
          userName={selectedStaffForSchedule.name}
          theme="admin"
        />
      )}

      {/* Search Card */}
      <div className="card rounded-2xl px-4 py-4 sm:px-5">
        <div className="p-3">
          <div className="">
            <h2 className="mb-2 text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
              Search for Staff
            </h2>
          </div>
          <form className="mt-2" onSubmit={handleSearch}>
            <div className="relative flex -space-x-px">
              <input
                className="form-input peer w-full rounded-l-lg border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:z-10 hover:border-slate-400 focus:z-10 focus:border-navy dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5 transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.316 13.781l.73-.171-.73.171zm0-5.457l.73.171-.73-.171zm15.473 0l.73-.171-.73.171zm0 5.457l.73.171-.73-.171zm-5.008 5.008l-.171-.73.171.73zm-5.457 0l-.171.73.171-.73zm0-15.473l-.171-.73.171.73zm5.457 0l.171-.73-.171.73zM20.47 21.53a.75.75 0 101.06-1.06l-1.06 1.06zM4.046 13.61a11.198 11.198 0 010-5.115l-1.46-.342a12.698 12.698 0 000 5.8l1.46-.343zm14.013-5.115a11.196 11.196 0 010 5.115l1.46.342a12.698 12.698 0 000-5.8l-1.46.343zm-4.45 9.564a11.196 11.196 0 01-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46zM8.496 4.046a11.198 11.198 0 015.115 0l.342-1.46a12.698 12.698 0 00-5.8 0l.343 1.46zm0 14.013a5.97 5.97 0 01-4.45-4.45l-1.46.343a7.47 7.47 0 005.568 5.568l.342-1.46zm5.457 1.46a7.47 7.47 0 005.568-5.567l-1.46-.342a5.97 5.97 0 01-4.45 4.45l.342 1.46zM13.61 4.046a5.97 5.97 0 014.45 4.45l1.46-.343a7.47 7.47 0 00-5.568-5.567l-.342 1.46zm-5.457-1.46a7.47 7.47 0 00-5.567 5.567l1.46.342a5.97 5.97 0 014.45-4.45l-.343-1.46zm8.652 15.28l3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06z"></path>
                </svg>
              </div>

              <button
                type="submit"
                className="btn rounded-l-none bg-success font-medium text-white hover:bg-success-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-3 bg-error/10 text-error px-4 py-3 rounded-lg text-center"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Staff Table */}
      <div>
        <div className="card mt-3">
          {staff.length === 0 && !isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-600 dark:text-navy-300">
                No staff members found.
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
                                  src="/images/200x200.png"
                                  alt="avatar"
                                  width={40}
                                  height={40}
                                />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-700 dark:text-navy-100 lg:px-5">
                              {member.fullName}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {member.email}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                              {member.phoneNumber}
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
                              <label className="inline-flex items-center">
                                <input
                                  checked={isActiveStatus(member.status)}
                                  onChange={() =>
                                    toggleStaffStatus(member.id, member.status)
                                  }
                                  className="form-switch h-5 w-10 rounded-full bg-slate-300 before:rounded-full before:bg-slate-50 checked:bg-primary checked:before:bg-white dark:bg-navy-900 dark:before:bg-navy-300 dark:checked:bg-accent dark:checked:before:bg-white"
                                  type="checkbox"
                                />
                              </label>
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
                                            router.push(`/profile?userId=${member.id}`);
                                          }}
                                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                        >
                                          View Details
                                        </a>
                                      </li>
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
                                                handleOpenSchedule(member.id, member.fullName);
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
            currentPage={currentPage}
            totalEntries={filteredData.length}
            entriesPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onEntriesPerPageChange={(entries) => {
              setEntriesPerPage(entries);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
