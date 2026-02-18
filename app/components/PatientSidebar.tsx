"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PatientSidebarProps {
  patientName?: string;
  location?: string;
  avatarSrc?: string;
}

export default function PatientSidebar({
  patientName = "Travis Fuller",
  location = "Otario, Canada",
  avatarSrc = "/images/200x200.png",
}: PatientSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get("appointmentId") ?? "";
  const patientId = searchParams.get("patientId") ?? "";

  const buildHref = (base: string) => {
    const params = new URLSearchParams();
    if (appointmentId) params.set("appointmentId", appointmentId);
    if (patientId) params.set("patientId", patientId);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const menuItems = [
    {
      href: "/patient-preview",
      label: "Patient Details",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      href: "/patient-preview/symptoms",
      label: "Symptoms",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0m5-5V3m-1 0h2m2.536 5.464l2.828-2.828m-.707-.707l1.414 1.414M17 12h4m0-1v2m-5.465 2.536l2.829 2.828m.707-.707l-1.414 1.414M12 17v4m1 0h-2m-2.535-5.464l-2.829 2.828m.707.707L4.93 17.657M7 12H3m0 1v-2m5.464-2.536L5.636 5.636m-.707.707L6.343 4.93"
          />
        </svg>
      ),
    },
    {
      href: "/patient-preview/uploads",
      label: "Uploaded Files",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
    },
    {
      href: "/patient-preview/history",
      label: "History",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-5"
        >
          <path
            fill="currentColor"
            d="M13.26 3C8.17 2.86 4 6.95 4 12H2.21c-.45 0-.67.54-.35.85l2.79 2.8c.2.2.51.2.71 0l2.79-2.8a.5.5 0 0 0-.36-.85H6c0-3.9 3.18-7.05 7.1-7c3.72.05 6.85 3.18 6.9 6.9c.05 3.91-3.1 7.1-7 7.1c-1.61 0-3.1-.55-4.28-1.48a.994.994 0 0 0-1.32.08c-.42.42-.39 1.13.08 1.49A8.858 8.858 0 0 0 13 21c5.05 0 9.14-4.17 9-9.26c-.13-4.69-4.05-8.61-8.74-8.74m-.51 5c-.41 0-.75.34-.75.75v3.68c0 .35.19.68.49.86l3.12 1.85c.36.21.82.09 1.03-.26c.21-.36.09-.82-.26-1.03l-2.88-1.71v-3.4c0-.4-.34-.74-.75-.74"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center space-x-4">
        <div className="avatar size-14">
          <Image
            className="rounded-full"
            src={avatarSrc}
            alt={`${patientName} avatar`}
            width={56}
            height={56}
          />
        </div>
        <div>
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            {patientName}
          </h3>
          <p className="text-xs-plus">{location}</p>
        </div>
      </div>

      <ul className="mt-6 space-y-1.5 font-inter font-medium">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={buildHref(item.href)}
                className={`group flex space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${
                  isActive
                    ? "bg-primary text-white dark:bg-accent"
                    : "hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
