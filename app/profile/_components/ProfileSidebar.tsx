"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { getTheme, isDoctor } from "@/app/lib/roles";
import { adminService } from "@/app/lib/services";
import { User } from "@/app/models";

interface ProfileSidebarProps {
  theme?: "admin" | "doctor";
}

export default function ProfileSidebar({ theme }: ProfileSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const user = useAuthStore((state) => state.user);

  const [displayUser, setDisplayUser] = useState<User | null>(user);
  const [isSidebarLoading, setIsSidebarLoading] = useState(
    !!(userId && userId !== user?.id),
  );

  // Effect to determine which user to display
  useEffect(() => {
    const fetchUser = async () => {
      if (userId && userId !== user?.id) {
        setIsSidebarLoading(true);
        try {
          const response = await adminService.getUserProfile(userId);
          if (response.status && response.data) {
            setDisplayUser(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch user profile for sidebar:", error);
          setDisplayUser(user);
        } finally {
          setIsSidebarLoading(false);
        }
      } else {
        setDisplayUser(user);
        setIsSidebarLoading(false);
      }
    };

    fetchUser();
  }, [userId, user]);

  // Helper to build links with userId query param if present
  const getLink = (path: string) => {
    return userId ? `${path}?userId=${userId}` : path;
  };

  // Determine theme from user role if not provided (use logged-in user role for theme)
  const currentTheme = theme || getTheme(user);

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

  if (isSidebarLoading) {
    return (
      <div className="col-span-12 lg:col-span-4">
        <div className="card p-4 sm:p-5 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="size-14 rounded-full bg-slate-200 dark:bg-navy-500" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-navy-500" />
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-navy-500" />
            </div>
          </div>
          <ul className="mt-6 space-y-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center space-x-3 rounded-lg px-4 py-2.5"
              >
                <div className="size-5 rounded bg-slate-200 dark:bg-navy-500" />
                <div
                  className={`h-4 rounded bg-slate-200 dark:bg-navy-500 ${i % 2 === 0 ? "w-36" : "w-28"}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-4">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center space-x-4">
          <div className="avatar size-14">
            <Image
              className="rounded-full"
              src={displayUser?.profilePictureUrl || "/images/200x200.png"}
              alt="avatar"
              width={56}
              height={56}
            />
          </div>
          <div>
            <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
              {displayUser?.firstName && displayUser?.lastName
                ? `${displayUser.firstName} ${displayUser.lastName}`
                : ""}
            </h3>
            <p className="text-xs-plus">
              {displayUser?.role === "DOCTOR" && displayUser?.specialty
                ? `${displayUser.specialty}`
                : displayUser?.role || "Role"}
              {displayUser?.licenseNo ? ` | ${displayUser.licenseNo}` : ""}
            </p>
          </div>
        </div>
        <ul className="mt-6 space-y-1.5 font-inter font-medium">
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile"))}`}
              href={getLink("/profile")}
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
              href={getLink("/profile/professional")}
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
              href={getLink("/profile/qualifications")}
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
          {(userId || isDoctor(user)) && (
            <li>
              <Link
                className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/availability"))}`}
                href={getLink("/profile/availability")}
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
                  <path
                    fill="currentColor"
                    d="M22.59 25L20 22.41V18h2v3.59l2 2z"
                  />
                  <path
                    fill="currentColor"
                    d="M28 6a2 2 0 0 0-2-2h-4V2h-2v2h-8V2h-2v2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h4v-2H6V6h4v2h2V6h8v2h2V6h4v6h2Z"
                  />
                </svg>
                <span>Availability & Schedule</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/performance"))}`}
              href={getLink("/profile/performance")}
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
          {(!userId || userId === user?.id) && (
            <li>
              <Link
                className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/security"))}`}
                href={getLink("/profile/security")}
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
          )}
          {(!userId || userId === user?.id) && (
            <li>
              <Link
                className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/activity"))}`}
                href={getLink("/profile/activity")}
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
          )}
        </ul>
      </div>
    </div>
  );
}
