"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import TableActionMenu from "./TableActionMenu";

interface PatientCardWithMenuProps {
  id: string | number;
  name: string;
  age?: number;
  timeAgo: string;
  symptom?: string;
  avatarSrc?: string;
}

export default function PatientCardWithMenu({
  name,
  age,
  timeAgo,
  symptom = "Patient Symptom",
  avatarSrc = "/images/200x200.png",
}: PatientCardWithMenuProps) {
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [clinicalAlertModalOpen, setClinicalAlertModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAcceptModalOpen(false);
        setReassignModalOpen(false);
        setScheduleModalOpen(false);
        setClinicalAlertModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);



  return (
    <>
      <div className="card">
        <div className="p-2 text-right">
          <div className="flex justify-end">
            <TableActionMenu>
              <div className="w-48">
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        setAcceptModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Accept
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setReassignModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Reassign
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setScheduleModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Schedule
                    </button>
                  </li>
                </ul>
                <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
                <ul>
                  <li>
                    <button
                      onClick={() => {
                        setClinicalAlertModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Clinical Alert
                    </button>
                  </li>
                </ul>
              </div>
            </TableActionMenu>
          </div>
        </div>
        <div className="flex grow flex-col items-center px-4 pb-5 sm:px-5">
          <div className="avatar size-20">
            <Image
              className="mask is-squircle"
              src={avatarSrc}
              alt={`${name} avatar`}
              width={80}
              height={80}
            />
          </div>
          <h3 className="pt-3 text-lg font-medium text-slate-700 dark:text-navy-100">
            {name}
          </h3>
          <p className="text-xs-plus">{symptom}</p>
          <div className="inline-space mt-3 flex grow flex-wrap items-start">
            {age !== undefined && (
              <span className="tag rounded-full bg-success/10 text-success hover:bg-success/20 focus:bg-success/20 active:bg-success/25">
                {age} years
              </span>
            )}
            <span className="tag rounded-full bg-primary/10 text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:bg-accent-light/10 dark:text-accent-light dark:hover:bg-accent-light/20 dark:focus:bg-accent-light/20 dark:active:bg-accent-light/25">
              {timeAgo}
            </span>
          </div>
          <div className="mt-6 grid w-full">
            <Link
              href="/patient-preview"
              className="btn space-x-2 bg-primary px-0 font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M5 19.111c0-2.413 1.697-4.468 4.004-4.848l.208-.035a17.134 17.134 0 015.576 0l.208.035c2.307.38 4.004 2.435 4.004 4.848C19 20.154 18.181 21 17.172 21H6.828C5.818 21 5 20.154 5 19.111zM16.083 6.938c0 2.174-1.828 3.937-4.083 3.937S7.917 9.112 7.917 6.937C7.917 4.764 9.745 3 12 3s4.083 1.763 4.083 3.938z"
                />
              </svg>
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {acceptModalOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
          <div
            className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
            onClick={() => setAcceptModalOpen(false)}
          ></div>
          <div className="relative max-w-lg rounded-lg bg-white px-4 py-10 text-center transition-opacity duration-300 dark:bg-navy-700 sm:px-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline size-28 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="mt-4">
              <h2 className="text-2xl text-slate-700 dark:text-navy-100">
                Success Message
              </h2>
              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consequuntur dignissimos soluta totam?
              </p>
              <button
                onClick={() => setAcceptModalOpen(false)}
                className="btn mt-6 bg-success font-medium text-white hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignModalOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
          <div
            className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
            onClick={() => setReassignModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
            <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
              <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                Reassign Patient
              </h3>
              <button
                onClick={() => setReassignModalOpen(false)}
                className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 sm:px-5">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda incidunt</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span>Choose category :</span>
                  <select className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                    <option>Laravel</option>
                    <option>Node JS</option>
                    <option>Django</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span>Description:</span>
                  <textarea
                    rows={4}
                    placeholder=" Enter Text"
                    className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  ></textarea>
                </label>
                <label className="block">
                  <span>Website Address:</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="URL Address"
                    type="text"
                  />
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    className="form-switch is-outline h-5 w-10 rounded-full border border-slate-400/70 bg-transparent before:rounded-full before:bg-slate-300 checked:border-primary checked:before:bg-primary dark:border-navy-400 dark:before:bg-navy-300 dark:checked:border-accent dark:checked:before:bg-accent"
                    type="checkbox"
                  />
                  <span>Public pin</span>
                </label>
                <div className="space-x-2 text-right">
                  <button
                    onClick={() => setReassignModalOpen(false)}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setReassignModalOpen(false)}
                    className="btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
          <div
            className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
            onClick={() => setScheduleModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
            <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
              <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                Schedule Patient
              </h3>
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 sm:px-5">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda incidunt</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span>Choose category :</span>
                  <select className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                    <option>Laravel</option>
                    <option>Node JS</option>
                    <option>Django</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span>Description:</span>
                  <textarea
                    rows={4}
                    placeholder=" Enter Text"
                    className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  ></textarea>
                </label>
                <label className="block">
                  <span>Date</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="URL Address"
                    type="datetime-local"
                  />
                </label>
                <label className="block">
                  <span>Website Address:</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="URL Address"
                    type="text"
                  />
                </label>
                <div className="space-x-2 text-right">
                  <button
                    onClick={() => setScheduleModalOpen(false)}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setScheduleModalOpen(false)}
                    className="btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Alert Modal */}
      {clinicalAlertModalOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
          <div
            className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
            onClick={() => setClinicalAlertModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
            <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
              <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                Clinical Alert
              </h3>
              <button
                onClick={() => setClinicalAlertModalOpen(false)}
                className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 sm:px-5">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda incidunt</p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span>Choose category :</span>
                  <select className="form-select mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:bg-navy-700 dark:hover:border-navy-400 dark:focus:border-accent">
                    <option>Laravel</option>
                    <option>Node JS</option>
                    <option>Django</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span>Description:</span>
                  <textarea
                    rows={4}
                    placeholder=" Enter Text"
                    className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  ></textarea>
                </label>
                <label className="block">
                  <span>Date</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="URL Address"
                    type="datetime-local"
                  />
                </label>
                <label className="block">
                  <span>Website Address:</span>
                  <input
                    className="form-input mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="URL Address"
                    type="text"
                  />
                </label>
                <div className="space-x-2 text-right">
                  <button
                    onClick={() => setClinicalAlertModalOpen(false)}
                    className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setClinicalAlertModalOpen(false)}
                    className="btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

