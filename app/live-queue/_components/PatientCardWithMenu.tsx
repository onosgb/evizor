"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import TableActionMenu from "@/app/components/TableActionMenu";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useAppointmentStore } from "@/app/stores/appointmentStore";

interface PatientCardWithMenuProps {
  id: string;
  name: string;
  age?: number;
  timeAgo: string;
  symptom?: string;
  avatarSrc?: string;
}

export default function PatientCardWithMenu({
  id,
  name,
  age,
  timeAgo,
  symptom = "Patient Symptom",
  avatarSrc = "/images/200x200.png",
}: PatientCardWithMenuProps) {
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [clinicalAlertModalOpen, setClinicalAlertModalOpen] = useState(false);

  const { setClinicalAlert, selectedAppointment } = useAppointmentStore();

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
                  {/* <li>
                    <button
                      onClick={() => {
                        setReassignModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Reassign
                    </button>
                  </li> */}
                  {/* <li>
                    <button
                      onClick={() => {
                        setScheduleModalOpen(true);
                      }}
                      className="flex h-8 w-full items-center px-3 pr-8 font-medium tracking-wide outline-hidden transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                    >
                      Schedule
                    </button>
                  </li> */}
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
        <ConfirmationModal
          isOpen={acceptModalOpen}
          onClose={() => setAcceptModalOpen(false)}
          title="Accept"
          message="Are you sure you want to accept this patient?"
          onConfirm={async () => {
            // await acceptAppointment(id);  
            setAcceptModalOpen(false);
          }}
          confirmText="Accept"
          cancelText="Cancel"
        />
      )}

  
   

      {/* Clinical Alert Modal */}
      {clinicalAlertModalOpen && (
       <ConfirmationModal
       isOpen={clinicalAlertModalOpen}
       onClose={() => setClinicalAlertModalOpen(false)}
       title="Clinical Alert"
       message="Are you sure you want to accept this patient?"
       onConfirm={async () => {
         await setClinicalAlert(id);  
         setClinicalAlertModalOpen(false);
       }}
       confirmText="Accept"
       cancelText="Cancel"
       />
      )}
    </>
  );
}


