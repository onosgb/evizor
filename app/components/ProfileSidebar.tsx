"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface ProfileSidebarProps {
  theme?: "admin" | "doctor";
}

export default function ProfileSidebar({ theme }: ProfileSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  
  // Determine theme from user role if not provided
  const currentTheme = theme || (user?.role === "ADMIN" ? "admin" : "doctor");

  const isActive = (path: string) => pathname === path;
  
  // Theme-based active route styling
  const getActiveClasses = (isActiveRoute: boolean) => {
    if (isActiveRoute) {
      return currentTheme === "admin"
        ? "bg-green-600 text-white dark:bg-green-500"
        : "bg-primary text-white dark:bg-accent";
    }
    return "hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100";
  };
  
  const getIconClasses = (isActiveRoute: boolean) => {
    if (isActiveRoute) {
      return "text-white";
    }
    return "text-slate-400 group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200";
  };

  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center space-x-4">
          <div className="avatar size-14">
            <Image
              className="rounded-full"
              src="/images/200x200.png"
              alt="avatar"
              width={56}
              height={56}
            />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : ""}
            </h3>
            <p className="text-xs-plus">
              {user?.role === "DOCTOR" && user?.specialty ? `${user.specialty}` : user?.role || "Role"}
              {user?.licenseNo ? ` | ${user.licenseNo}` : ""}
            </p>
          </div>
        </div>
        <ul className="mt-6 space-y-1.5 font-inter font-medium">
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile"))}`}
              href="/profile"
            >
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
              <span>Personal Information</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/professional"))}`}
              href="/profile/professional"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/professional"))}`}
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <rect width="18" height="12" x="3" y="7" rx="2" />
                  <path d="M9 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1H9zm1 6l.211.106a4 4 0 0 0 3.578 0L14 12" />
                </g>
              </svg>
              <span>Professional Information</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/qualifications"))}`}
              href="/profile/qualifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/qualifications"))}`}
                viewBox="0 0 2048 2048"
              >
                <path
                  fill="currentColor"
                  d="M1920 512v1408H768v-256H512v-256H256V0h731l256 256h421v256zm-896-128h165l-165-165zm256 896V512H896V128H384v1152zm256 256V384h-128v1024H640v128zm257-896h-129v1024H896v128h897z"
                />
              </svg>
              <span>Qualifications & Documents</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/availability"))}`}
              href="/profile/availability"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/availability"))}`}
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M21 30a8 8 0 1 1 8-8a8 8 0 0 1-8 8m0-14a6 6 0 1 0 6 6a6 6 0 0 0-6-6"
                />
                <path fill="currentColor" d="M22.59 25L20 22.41V18h2v3.59l2 2z" />
                <path
                  fill="currentColor"
                  d="M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2Z"
                />
              </svg>
              <span> Availability & Schedule </span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/consultation"))}`}
              href="/profile/consultation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/consultation"))}`}
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                >
                  <path
                    strokeLinejoin="round"
                    d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172C2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07"
                  />
                  <path d="M10 8.484C10.5 7.494 11 7 12 7c1.246 0 2 .989 2 1.978s-.5 1.033-2 2.022v1m0 2.5v.5m2 4c-1.236 0-2.598.5-3.841 1.145c-1.998 1.037-2.997 1.556-3.489 1.225c-.492-.33-.399-1.355-.212-3.404L6.5 17.5" />
                </g>
              </svg>
              <span>Consultation Preferences </span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/performance"))}`}
              href="/profile/performance"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/performance"))}`}
                viewBox="0 0 14 14"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m1.24 6.54l11.5-5.23M10.59.5l2.15.81l-.8 2.15m1.31 10.05h-2.5h0v-7a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v7h0Zm-5 0h-2.5h0v-5.5a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v5.5h0Zm-5 0H.75h0v-4a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v4h0Z"
                />
              </svg>
              <span>Performance Snapshot</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/security"))}`}
              href="/profile/security"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/security"))}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Security</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/activity"))}`}
              href="/profile/activity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`size-5 transition-colors ${getIconClasses(isActive("/profile/activity"))}`}
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="m23 27.2l-2.6-2.6L19 26l4 4l7-7l-1.4-1.4zM12 18h8v2h-8zm0-5h8v2h-8zm0-5h8v2h-8z"
                />
                <path
                  fill="currentColor"
                  d="M16 28H6v-4h2v-2H6v-5h2v-2H6v-5h2V8H6V4h18v16h2V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v4H2v2h2v5H2v2h2v5H2v2h2v4c0 1.1.9 2 2 2h10z"
                />
              </svg>
              <span>Activity Log</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
