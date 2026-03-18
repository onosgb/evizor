"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FormTextarea } from "@/app/components/ui/FormTextarea";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";



export default function VerificationModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  type = "reject",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<void>;
  userName: string;
  type?: "approve" | "reject";
}) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isApprove = type === "approve";
  const title = isApprove ? "Approve Verification" : "Reject Verification";
  const buttonText = isApprove ? "Approve Verification" : "Reject Verification";
  const buttonClass = isApprove
    ? "bg-success hover:bg-success-focus focus:bg-success-focus active:bg-success-focus/90"
    : "bg-error hover:bg-error-focus focus:bg-error-focus active:bg-error-focus/90";
  const loadingText = isApprove ? "Approving..." : "Rejecting...";

  const handleSubmit = async () => {
    if (!isApprove && !comment.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(comment);
      onClose();
      setComment(""); // Reset comment on success
    } catch (err) {
      console.error("Failed to verify:", err);
      setError("Failed to process verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 outline-none focus:outline-none"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-lg transition-all dark:bg-navy-700">
        <div className="flex items-center justify-between rounded-t-lg bg-slate-100 px-4 py-3 dark:bg-navy-800">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-4 text-sm text-slate-500 dark:text-navy-300">
            Are you sure you want to {isApprove ? "approve" : "reject"} the profile verification for{" "}
            <span className="font-semibold text-slate-700 dark:text-navy-100">
              {userName}
            </span>
            ? {isApprove ? "" : "Please provide a reason below."}
          </p>

          <div className="space-y-3">
             {!isApprove && (
               <FormTextarea
                 label="Reason for Rejection"
                 rows={4}
                 value={comment}
                 onChange={(e) => setComment(e.target.value)}
                 placeholder="e.g., Incomplete documentation, Invalid license number..."
                 required
               />
             )}
            {error && <span className="text-xs text-error">{error}</span>}
          </div>

          <div className="mt-5 flex justify-end space-x-2">
            <Button
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant={isApprove ? "success" : "error"}
              className="rounded-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{loadingText}</span>
                </div>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

