"use client";

import DashboardLayout from "./components/DashboardLayout";
import WaitingPatientCard from "./components/WaitingPatientCard";
import ClinicalAlertCard from "./components/ClinicalAlertCard";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface Case {
  id: number;
  name: string;
  location: string;
  datetime: string;
  status: "pending" | "cancelled";
}

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rowMenuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const cases: Case[] = [
    {
      id: 1,
      name: "Anthony Jensen",
      location: "London, Kliniken Clinic",
      datetime: "Mon, 12 May - 09:00",
      status: "pending",
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
      status: "pending",
    },
    {
      id: 5,
      name: "Katrina West",
      location: "Manchester, PLC Home Health",
      datetime: "Tue, 17 June - 14:30",
      status: "cancelled",
    },
    {
      id: 6,
      name: "Travis Fuller",
      location: "Liverpool, Life flash Clinic",
      datetime: "Wed, 19 May - 11:30",
      status: "pending",
    },
  ];

  const filteredCases = cases.filter(
    (caseItem) =>
      caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.datetime.toLowerCase().includes(searchQuery.toLowerCase())
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

      // Handle row menu clicks outside
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
  return (
    <DashboardLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          {/* Welcome Card */}
          <div className="card col-span-12 mt-12 bg-gradient-to-r from-blue-500 to-blue-600 p-5 sm:col-span-8 sm:mt-0 sm:flex-row">
            <div className="flex justify-center sm:order-last">
              <Image
                className="-mt-16 h-40 sm:mt-0"
                src="/images/illustrations/doctor.svg"
                alt="image"
                width={160}
                height={160}
              />
            </div>
            <div className="mt-2 flex-1 pt-2 text-center text-white sm:mt-0 sm:text-left">
              <p className="text-white pb-2">Otario, Canada</p>
              <hr />
              <h3 className="text-xl mt-4">
                Good morning, <span className="font-semibold">Dr. Adam</span>
              </h3>
              <p className="mt-2 leading-relaxed">
                Have a great day at work. Your progress is excellent.
              </p>
              <button className="btn mt-6 border border-white/10 bg-white/20 text-white hover:bg-white/30 focus:bg-white/30">
                View Schedule
              </button>
            </div>
          </div>

          {/* Waiting Patients */}
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <div className="flex h-8 items-center justify-between">
              <h2 className="text-base font-medium tracking-wide text-slate-700 dark:text-navy-100">
                Waiting Patients
              </h2>
              <Link
                href="/live-queue"
                className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary outline-hidden transition-colors duration-300 hover:text-primary/70 focus:text-primary/70 dark:text-accent-light dark:hover:text-accent-light/70 dark:focus:text-accent-light/70"
              >
                View All
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              <WaitingPatientCard
                name="Travis Fuller"
                procedure="Scaling"
                date="Thu, 26 March"
                time="08:00"
                onAccept={() => console.log("Accept Travis")}
                onReject={() => console.log("Reject Travis")}
                viewLink="/patient-preview"
              />
              <WaitingPatientCard
                name="Alfredo Elliott"
                procedure="Checkup"
                date="Mon, 15 March"
                time="06:00"
                onAccept={() => console.log("Accept Alfredo")}
                onReject={() => console.log("Reject Alfredo")}
                viewLink="/patient-preview"
              />
              <WaitingPatientCard
                name="Derrick Simmons"
                procedure="Checkup"
                date="Wed, 14 March"
                time="11:00"
                onAccept={() => console.log("Accept Derrick")}
                onReject={() => console.log("Reject Derrick")}
                viewLink="/patient-preview"
              />
            </div>
          </div>

          {/* Today's Cases */}
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium tracking-wide text-slate-700 line-clamp-1 dark:text-navy-100">
                Today's Cases
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
                    aria-label="Toggle search"
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
                    aria-label="Menu"
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
                    <div className="popper-root show">
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
                    {filteredCases.map((caseItem, index) => (
                      <tr
                        key={caseItem.id}
                        className={`border-y border-transparent ${
                          index === filteredCases.length - 1
                            ? ""
                            : "border-b-slate-200 dark:border-b-navy-500"
                        }`}
                      >
                        <td
                          className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                            index === filteredCases.length - 1
                              ? "rounded-bl-lg"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="avatar size-9">
                              <Image
                                className="rounded-full"
                                src="/images/200x200.png"
                                alt={caseItem.name}
                                width={36}
                                height={36}
                              />
                            </div>
                            <span className="font-medium text-slate-700 dark:text-navy-100">
                              {caseItem.name}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          <a
                            href="#"
                            className="hover:underline focus:underline"
                          >
                            {caseItem.location}
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-600 dark:text-navy-100 sm:px-5">
                          {caseItem.datetime}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`ml-4 size-5 ${
                              caseItem.status === "cancelled"
                                ? "text-error"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {caseItem.status === "cancelled" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-3 sm:px-5 ${
                            index === filteredCases.length - 1
                              ? "rounded-br-lg"
                              : ""
                          }`}
                        >
                          <div
                            className="inline-flex relative"
                            ref={(el) => {
                              rowMenuRefs.current[caseItem.id] = el;
                            }}
                          >
                            <button
                              onClick={() =>
                                setOpenRowMenu(
                                  openRowMenu === caseItem.id
                                    ? null
                                    : caseItem.id
                                )
                              }
                              className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                              aria-label="Menu"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                              </svg>
                            </button>
                            {openRowMenu === caseItem.id && (
                              <div className="popper-root show">
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
                        </td>
                      </tr>
                    ))}
                    {filteredCases.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-slate-500 dark:text-navy-300"
                        >
                          No cases found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Clinical Alerts */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6">
            <ClinicalAlertCard
              name="Alfredo Elliott"
              procedure="Checkup"
              dateLabel="Today"
              time="11:00"
            />
            <ClinicalAlertCard
              name="Alfredo Elliott"
              procedure="Checkup"
              dateLabel="Today"
              time="11:00"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
