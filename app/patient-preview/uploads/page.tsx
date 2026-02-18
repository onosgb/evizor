"use client";

import { Suspense } from "react";
import ActionButtons from "../../components/ActionButtons";
import AttachmentsViewer from "./_components/ImageCarousel";
import { useAppointmentStore } from "../../stores/appointmentStore";

function PatientUploadsContent() {
  const { selectedAppointment, isLoading } = useAppointmentStore();
  const attachments = selectedAppointment?.attachments ?? [];

  return (
    <div className="p-4 sm:p-5">
      {isLoading ? (
        <div className="animate-pulse grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-navy-500"
            />
          ))}
        </div>
      ) : attachments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-navy-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mb-3 size-14 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
          <p className="text-sm">No attachments found</p>
        </div>
      ) : (
        <AttachmentsViewer attachments={attachments} />
      )}
    </div>
  );
}

export default function PatientUploadsPage() {
  return (
    <div className="card">
      <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
        <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Uploaded Files
        </h2>
        <ActionButtons />
      </div>
      <Suspense
        fallback={
          <div className="animate-pulse grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 sm:p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-navy-500"
              />
            ))}
          </div>
        }
      >
        <PatientUploadsContent />
      </Suspense>
    </div>
  );
}
