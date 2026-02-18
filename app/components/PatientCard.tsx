import Link from "next/link";

interface PatientCardProps {
  id: string | number;
  patientId: string;
  name: string;
  symptom?: string;
  scheduledAt: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function PatientCard({
  id,
  patientId,
  name,
  symptom = "General",
  scheduledAt,
  onAccept,
  onReject,
}: PatientCardProps) {
  const date = new Date(scheduledAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="card p-4 sm:p-5">
      {/* Top row: avatar + name/type */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-accent/15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6 text-primary dark:text-accent"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M5 19.111c0-2.413 1.697-4.468 4.004-4.848l.208-.035a17.134 17.134 0 015.576 0l.208.035c2.307.38 4.004 2.435 4.004 4.848C19 20.154 18.181 21 17.172 21H6.828C5.818 21 5 20.154 5 19.111zM16.083 6.938c0 2.174-1.828 3.937-4.083 3.937S7.917 9.112 7.917 6.937C7.917 4.764 9.745 3 12 3s4.083 1.763 4.083 3.938z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-700 dark:text-navy-100">
            {name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-navy-300">{symptom}</p>
        </div>
      </div>

      {/* Date & time */}
      <div className="mt-4">
        <p className="text-xs font-medium text-primary dark:text-accent">
          {formattedDate}
        </p>
        <p className="text-2xl font-bold text-slate-700 dark:text-navy-100">
          {formattedTime}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onAccept}
          className="flex size-9 items-center justify-center rounded-full bg-success/10 text-success transition-colors hover:bg-success/20 active:bg-success/25"
          title="Accept"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
        <button
          onClick={onReject}
          className="flex size-9 items-center justify-center rounded-full bg-error/10 text-error transition-colors hover:bg-error/20 active:bg-error/25"
          title="Reject"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <Link
          href={`/patient-preview?appointmentId=${id}&patientId=${patientId}`}
          className="ml-auto flex size-9 items-center justify-center rounded-full bg-slate-150 text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-200 dark:hover:bg-navy-450"
          title="View details"
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
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
