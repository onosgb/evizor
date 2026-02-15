"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Image from "next/image";
import TableActionMenu from "../components/TableActionMenu";

interface QueueItem {
  id: number;
  patientName: string;
  assignedDoctor: string;
  datetime: string;
  status: "waiting" | "completed" | "cancelled";
}

const queueData: QueueItem[] = [
  {
    id: 1,
    patientName: "Anthony Jensen",
    assignedDoctor: "London, Kliniken Clinic",
    datetime: "Mon, 12 May - 09:00",
    status: "waiting",
  },
  {
    id: 2,
    patientName: "Konnor Guzman",
    assignedDoctor: "Manchester, PLC Home Health",
    datetime: "Tue, 17 June - 14:30",
    status: "cancelled",
  },
  {
    id: 3,
    patientName: "Derrick Simmons",
    assignedDoctor: "Liverpool, Life flash Clinic",
    datetime: "Wed, 29 May - 13:30",
    status: "cancelled",
  },
  {
    id: 4,
    patientName: "Henry Curtis",
    assignedDoctor: "London, Kliniken Clinic",
    datetime: "Mon, 22 June - 15:00",
    status: "waiting",
  },
  {
    id: 5,
    patientName: "Benjamin West",
    assignedDoctor: "Manchester, PLC Home Health",
    datetime: "Tue, 17 June - 14:30",
    status: "cancelled",
  },
  {
    id: 6,
    patientName: "Travis Fuller",
    assignedDoctor: "Liverpool, Life flash Clinic",
    datetime: "Wed, 19 May - 11:30",
    status: "waiting",
  },
];

export default function QueueMonitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const filteredData = queueData.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedDoctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const menuRef = menuRefs.current[openMenuId];
        if (menuRef && !menuRef.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (itemId: number) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const getStatusIcon = (status: string) => {
    if (status === "waiting") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-4 size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    } else if (status === "cancelled") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-4 size-5 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <DashboardLayout theme="admin">
      <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
        <div className="flex items-center space-x-1">
          <h2 className="text-xl font-medium text-slate-700 line-clamp-1 dark:text-navy-50">
            Live Queue Monitor
          </h2>
        </div>
      </div>

      {/* Search Card */}
      <div className="card rounded-2xl px-4 py-4 sm:px-5">
        <div className="p-3">
          <div className="">
            <h2 className="text-lg font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
              Search Live Queue
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

      {/* Queue Table */}
      <div>
        <div className="card mt-3">
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    PATIENT
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    ASSIGNED DOCTOR
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    DATETIME
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    STATUS
                  </th>
                  <th className="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-y border-transparent ${
                      index === paginatedData.length - 1
                        ? ""
                        : "border-b-slate-200 dark:border-b-navy-500"
                    }`}
                  >
                    <td
                      className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                        index === paginatedData.length - 1
                          ? "rounded-bl-lg"
                          : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="avatar size-9">
                          <Image
                            className="rounded-full"
                            src="/images/200x200.png"
                            alt="avatar"
                            width={36}
                            height={36}
                          />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-navy-100">
                          {item.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <a
                        href="#"
                        className="hover:underline focus:underline"
                      >
                        {item.assignedDoctor}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                      {item.datetime}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      {getStatusIcon(item.status)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                        index === paginatedData.length - 1
                          ? "rounded-br-lg"
                          : ""
                      }`}
                    >
                      <div className="flex justify-end">
                        <TableActionMenu>
                            <div className="w-48">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Handle view action
                                    }}
                                  >
                                    View Details
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Handle assign action
                                    }}
                                  >
                                    Assign Doctor
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Handle cancel action
                                    }}
                                  >
                                    Cancel Appointment
                                  </a>
                                </li>
                              </ul>
                              <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Handle delete action
                                    }}
                                  >
                                    Remove from Queue
                                  </a>
                                </li>
                              </ul>
                            </div>
                        </TableActionMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col justify-between space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:space-y-0 sm:px-5">
            <div className="flex items-center space-x-2 text-xs-plus">
              <span>Show</span>
              <label className="block">
                <select
                  className="form-select rounded-full border border-slate-300 bg-white px-2 py-1 pr-6 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent"
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <span>entries</span>
            </div>

            <ol className="pagination flex items-center space-x-1">
              <li className="rounded-l-lg bg-slate-150 dark:bg-navy-500">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 disabled:opacity-50 disabled:cursor-not-allowed dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className="bg-slate-150 dark:bg-navy-500"
                  >
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-3 leading-tight transition-colors ${
                        page === currentPage
                          ? "bg-success text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90 dark:bg-success dark:hover:bg-success-focus dark:focus:bg-success-focus dark:active:bg-success/90"
                          : "text-slate-500 hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                      }`}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li className="rounded-r-lg bg-slate-150 dark:bg-navy-500">
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300/80 disabled:opacity-50 disabled:cursor-not-allowed dark:text-navy-200 dark:hover:bg-navy-450 dark:focus:bg-navy-450 dark:active:bg-navy-450/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </li>
            </ol>

            <div className="text-xs-plus">
              {startIndex + 1} - {Math.min(endIndex, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
