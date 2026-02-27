"use client";

import Image from "next/image";
import TableActionMenu from "@/app/components/TableActionMenu";
import { useAppointmentStore } from "@/app/stores/appointmentStore";
import Link from "next/link";
import { useState } from "react";
import ConfirmationModal from "@/app/components/ConfirmationModal";

interface PatientInfo {
  label: string;
  value: string;
}

interface ClinicalAlertCardProps {
  name?: string;
  procedure?: string;
  dateLabel?: string;
  time?: string;
  avatarSrc?: string;
  patientInfo?: PatientInfo[];
  isLoading?: boolean;
  id?:string;
  patientId?:string;
}

export default function ClinicalAlertCard({
  name = "",
  id,
  patientId,
  procedure = "",
  dateLabel = "Today",
  time = "",
  avatarSrc = "/images/200x200.png",
  patientInfo = [
    { label: "D.O.B.", value: "-" },
    { label: "Weight", value: "-" },
    { label: "Height", value: "-" },
    { label: "Last Appointment", value: "-" },
    { label: "Register Date", value: "-" },
  ],
  isLoading = false,
}: ClinicalAlertCardProps) {

  const { acceptAppointment } = useAppointmentStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-info/10 px-4 pb-5 dark:bg-navy-800 sm:px-5">
      <div className="flex items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-slate-700 dark:text-navy-100">
          Clinical Alerts
        </h2>
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
                      setOpen(true);
                    }}
                 >
                    Accept
                  </a>
                </li>
              
              </ul>
              <div className="my-1 h-px bg-slate-150 dark:bg-navy-500"></div>
              <ul>
                <li>
                  <Link
                    href={`/patient-preview?appointmentId=${id}&userId=${patientId}`}
                    className="flex h-8 items-center whitespace-nowrap px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                  >
                   View patient
                  </Link>
                </li>
              </ul>
            </div>
          </TableActionMenu>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between">
            <div className="size-16 rounded-full bg-slate-200 dark:bg-navy-500" />
            <div className="space-y-2">
              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-navy-500 ml-auto" />
              <div className="h-6 w-16 rounded bg-slate-200 dark:bg-navy-500 ml-auto" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-slate-200 dark:bg-navy-500" />
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-navy-500" />
                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-navy-500" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="avatar size-16">
              <Image
                className="rounded-full"
                src={avatarSrc}
                alt={name}
                width={64}
                height={64}
              />
            </div>
            <div>
              <p>{dateLabel}</p>
              <p className="text-xl font-medium text-slate-700 dark:text-navy-100">
                {time}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-navy-100">
              {name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-navy-300">
              {procedure}
            </p>
          </div>
          <div className="space-y-3 text-xs-plus">
            {patientInfo.map((info, index) => (
              <div key={index} className="flex justify-between">
                <p className="font-medium text-slate-700 dark:text-navy-100">
                  {info.label}
                </p>
                <p className="text-right">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={ async () => {
          await acceptAppointment(id!);
          setOpen(false);
        }}
        title="Accept Appointment"
        message="Are you sure you want to accept this appointment?"
        confirmText="Accept"
        cancelText="Cancel"
      />
    </div>

  );
}


