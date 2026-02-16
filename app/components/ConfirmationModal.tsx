"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-primary hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90",
  isLoading = false,
  loadingText = "Processing...",
}: ConfirmationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
      role="dialog"
      aria-modal="true"
    >
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-4 sm:px-5">
          <p className="text-slate-600 dark:text-navy-200">{message}</p>
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="btn min-w-28 rounded-full border border-slate-300 font-medium text-slate-800 hover:bg-slate-150 focus:bg-slate-150 active:bg-slate-150/80 dark:border-navy-450 dark:text-navy-50 dark:hover:bg-navy-500 dark:focus:bg-navy-500 dark:active:bg-navy-500/90"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`btn min-w-28 rounded-full font-medium text-white ${confirmButtonClass} ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
              ) : null}
              {isLoading ? loadingText : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
