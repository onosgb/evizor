"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User } from "@/app/models";
import TableActionMenu from "@/app/components/TableActionMenu";

interface QueueItem {
  id: number;
  name: string;
  location: string;
  datetime: string;
  status: "waiting" | "cancelled";
}

const queueData: QueueItem[] = [
  {
    id: 1,
    name: "Anthony Jensen",
    location: "London, Kliniken Clinic",
    datetime: "Mon, 12 May - 09:00",
    status: "waiting",
  },
  {
    id: 2,
    name: "Konnor Guzman",
    location: "Manchester, PLC Home Health",
    datetime: "Tue, 17 June - 14:30",
    status: "cancelled",
  },
  {
    id: 3,
    name: "Derrick Simmons",
    location: "Liverpool, Life flash Clinic",
    datetime: "Wed, 29 May - 13:30",
    status: "cancelled",
  },
  {
    id: 4,
    name: "Henry Curtis",
    location: "London, Kliniken Clinic",
    datetime: "Mon, 22 June - 15:00",
    status: "waiting",
  },
  {
    id: 5,
    name: "Benjamin West",
    location: "Manchester, PLC Home Health",
    datetime: "Tue, 17 June - 14:30",
    status: "cancelled",
  },
  {
    id: 6,
    name: "Travis Fuller",
    location: "Liverpool, Life flash Clinic",
    datetime: "Wed, 19 May - 11:30",
    status: "waiting",
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function AdminDashboard({ user }: { user: User | null }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rowMenuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const filteredData = queueData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.datetime.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }

      if (openRowMenu !== null) {
        const rowMenuRef = rowMenuRefs.current[openRowMenu];
        if (rowMenuRef && !rowMenuRef.contains(event.target as Node)) {
          setOpenRowMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openRowMenu]);

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
    <>
      {/* Welcome Card */}
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-12 xl:col-span-12">
          <div
            className="card col-span-12 mt-12 bg-linear-to-r p-5 sm:col-span-8 sm:mt-0 sm:flex-row"
            style={{ background: "#49941c" }}
          >
            <div className="flex justify-center sm:order-last">
              <Image
                className="-mt-16 h-40 sm:mt-0"
                src="/images/illustrations/user-laptop.svg"
                alt="image"
                width={160}
                height={160}
              />
            </div>
            <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-left">
              <p className="text-white pb-2">System Administrator</p>
              <hr />
              <h3 className="text-xl mt-4">
                {getGreeting()}, <span className="font-semibold">{user?.firstName || "Admin"}</span>
              </h3>
              <p className="mt-2 leading-relaxed">
                Have a great day at work. Your progress is excellent.
              </p>
              <button className="btn mt-6 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Active Doctors</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                1.3k
              </p>
              <p className="text-xs text-success">+21%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-warning/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Waiting Patients</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                30.6m
              </p>
              <p className="text-xs text-success">+4%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-info/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Avg Waiting Time</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                4.3m
              </p>
              <p className="text-xs text-success">+8%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-success/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="card flex-row justify-between p-4 relative">
          <div>
            <p className="text-xs-plus uppercase">Consultations Today</p>
            <div className="mt-8 flex items-baseline space-x-1">
              <p className="text-2xl font-semibold text-slate-700 dark:text-navy-100">
                11.6k
              </p>
              <p className="text-xs text-error">-2.3%</p>
            </div>
          </div>
          <div className="mask is-squircle flex size-10 items-center justify-center bg-error/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m6 9l-2-2m0 0l-2-2m2 2l2 2m-2-2l-2 2"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-20 translate-x-1/4 translate-y-1/4 opacity-15 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m6 9l-2-2m0 0l-2-2m2 2l2 2m-2-2l-2 2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Queue Monitor Table */}
      <div className="mt-4 sm:mt-5 lg:mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
            Queue Monitor
          </h2>
          <div className="flex">
            <div className="flex items-center">
              <label className="block">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`form-input bg-transparent px-1 text-right transition-all duration-100 placeholder:text-slate-500 dark:placeholder:text-navy-200 ${
                    isSearchActive ? "w-32 lg:w-48" : "w-0"
                  }`}
                  placeholder="Search here..."
                  type="text"
                />
              </label>
              <button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="inline-flex relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
              {isMenuOpen && (
                <div className="popper-root show absolute right-0 top-full mt-1 z-50">
                  <div className="popper-box w-auto min-w-fit rounded-md border border-slate-150 bg-white py-1.5 font-inter dark:border-navy-500 dark:bg-navy-700">
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                        >
                          Another Action
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                        >
                          Something else
                        </a>
                      </li>
                    </ul>
                    <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                    <ul>
                      <li>
                        <a
                          href="#"
                          className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                        >
                          Separated Link
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="is-scrollbar-hidden min-w-full overflow-x-auto">
            <table className="is-hoverable w-full text-left">
              <thead>
                <tr>
                  <th className="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    NAME
                  </th>
                  <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                    LOCATION
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
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-y border-transparent ${
                      index === filteredData.length - 1
                        ? ""
                        : "border-b-slate-200 dark:border-b-navy-500"
                    }`}
                  >
                    <td
                      className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                        index === filteredData.length - 1 ? "rounded-bl-lg" : ""
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
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                      <a href="#" className="hover:underline focus:underline">
                        {item.location}
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
                        index === filteredData.length - 1 ? "rounded-br-lg" : ""
                      }`}
                    >
                      <div className="flex justify-end">
                        <TableActionMenu>
                            <div className="w-48">
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  >
                                    Action
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  >
                                    Another Action
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  >
                                    Something else
                                  </a>
                                </li>
                              </ul>
                              <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                              <ul>
                                <li>
                                  <a
                                    href="#"
                                    className="flex h-8 items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                                  >
                                    Separated Link
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
        </div>
      </div>
    </>
  );
}


