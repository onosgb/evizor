"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { getTheme } from "../lib/roles";

export default function ActionButtons() {
  const user = useAuthStore((state) => state.user);
  const theme = getTheme(user);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [clinicalAlertModalOpen, setClinicalAlertModalOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAcceptModalOpen(false);
        setClinicalAlertModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const ModalContent = ({
    title,
    isOpen,
    onClose,
    children,
  }: {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5">
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-lg origin-top rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
              {title}
            </h3>
            <button
              onClick={onClose}
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
          <div className="px-4 py-4 sm:px-5">{children}</div>
        </div>
      </div>
    );
  };

  const FormFields = () => (
    <>
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
            onClick={() => {
              setAcceptModalOpen(false);
              setClinicalAlertModalOpen(false);
            }}
            className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setAcceptModalOpen(false);
              setClinicalAlertModalOpen(false);
            }}
            className={applyBtnClass}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );

  const btnClass =
    theme === "admin"
      ? "btn size-9 border border-green-600 p-0 font-medium text-green-600 hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white active:bg-green-600/90 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-white dark:focus:bg-green-500 dark:focus:text-white dark:active:bg-green-500/90"
      : "btn size-9 border border-primary p-0 font-medium text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary/90 dark:border-accent dark:text-accent-light dark:hover:bg-accent dark:hover:text-white dark:focus:bg-accent dark:focus:text-white dark:active:bg-accent/90";

  const applyBtnClass =
    theme === "admin"
      ? "btn min-w-28 rounded-full bg-green-600 font-medium text-white hover:bg-green-700 focus:bg-green-700 active:bg-green-700/90 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-500/90"
      : "btn min-w-28 rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90";

  return (
    <>
      <div className="flex justify-center space-x-2">
        {/* Accept Button */}
        <button
          onClick={() => setAcceptModalOpen(true)}
          className={btnClass}
          title="Accept"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8 12.5l3 3l5-6" />
              <circle cx="12" cy="12" r="10" />
            </g>
          </svg>
        </button>

        {/* Clinical Alert Button */}
        <button
          onClick={() => setClinicalAlertModalOpen(true)}
          className={btnClass}
          title="Clinical Alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024">
            <path
              fill="currentColor"
              d="M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 0 0-11.3 0l-39.6 39.6a8.03 8.03 0 0 0 0 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0m669.6-79.2l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-67.9 67.9a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3M832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32M484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8"
            />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <ModalContent
        title="Accept Patient"
        isOpen={acceptModalOpen}
        onClose={() => setAcceptModalOpen(false)}
      >
        <FormFields />
      </ModalContent>

      <ModalContent
        title="Clinical Alert"
        isOpen={clinicalAlertModalOpen}
        onClose={() => setClinicalAlertModalOpen(false)}
      >
        <>
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
                className={applyBtnClass}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      </ModalContent>
    </>
  );
}

