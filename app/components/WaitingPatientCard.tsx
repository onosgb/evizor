import Image from "next/image";
import Link from "next/link";
import { formatTodayOrDate } from "@/app/lib/utils/dateUtils";

interface WaitingPatientCardProps {
  name: string;
  procedure: string;
  date: string;
  time: string;
  avatarSrc?: string;
  onAccept?: () => void;
  onReject?: () => void;
  viewLink?: string;
}

export default function WaitingPatientCard({
  name,
  procedure,
  date,
  time,
  avatarSrc = "/images/200x200.png",
  onAccept,
  onReject,
  viewLink = "/patient-preview",
}: WaitingPatientCardProps) {
  return (
    <div className="card space-y-4 p-5">
      <div className="flex items-center space-x-3">
        <div className="avatar">
          <Image
            className="rounded-full"
            src={avatarSrc}
            alt={name}
            width={48}
            height={48}
          />
        </div>
        <div>
          <h3 className="font-medium text-slate-700 line-clamp-1 dark:text-navy-100">
            {name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-navy-300">
            {procedure}
          </p>
        </div>
      </div>
      <div>
        <p>{formatTodayOrDate(date)}</p>
        <p className="text-xl font-medium text-slate-700 dark:text-navy-100">
          {time}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={onAccept}
            className="btn size-7 rounded-full bg-success/10 p-0 text-success hover:bg-success/20 focus:bg-success/20 active:bg-success/25"
            aria-label="Accept"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={onReject}
            className="btn size-7 rounded-full bg-error/10 p-0 text-error hover:bg-error/20 focus:bg-error/20 active:bg-error/25"
            aria-label="Reject"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Link
          href={viewLink}
          className="btn size-7 rounded-full bg-slate-150 p-0 font-medium text-slate-800 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-200/50 focus:bg-slate-200 focus:shadow-lg focus:shadow-slate-200/50 active:bg-slate-200/80 dark:bg-navy-500 dark:text-navy-50 dark:hover:bg-navy-450 dark:hover:shadow-navy-450/50 dark:focus:bg-navy-450 dark:focus:shadow-navy-450/50 dark:active:bg-navy-450/90"
          aria-label="View patient"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 11l5-5m0 0l5 5m-5-5v12"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

