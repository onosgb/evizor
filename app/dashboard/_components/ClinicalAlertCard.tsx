"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import TableActionMenu from "@/components/TableActionMenu";

interface PatientInfo {
  label: string;
  value: string;
}

interface ClinicalAlertCardProps {
  name: string;
  procedure: string;
  dateLabel: string;
  time: string;
  avatarSrc?: string;
  patientInfo?: PatientInfo[];
}

export default function ClinicalAlertCard({
  name,
  procedure,
  dateLabel = "Today",
  time,
  avatarSrc = "/images/200x200.png",
  patientInfo = [
    { label: "D.O.B.", value: "25 Jan 1998" },
    { label: "Weight", value: "56 kg" },
    { label: "Height", value: "164 cm" },
    { label: "Last Appointment", value: "25 May 2021" },
    { label: "Register Date", value: "16 Jun 2020" },
  ],
}: ClinicalAlertCardProps) {

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
          </TableActionMenu>
        </div>
      </div>
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
    </div>
  );
}


