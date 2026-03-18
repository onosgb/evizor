"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/stores/authStore";
import { useProfileStore } from "@/app/stores/profileStore";
import { getTheme, isDoctor } from "@/app/lib/roles";
import { UserCircle2, Briefcase, GraduationCap, Clock, BarChart3, ShieldCheck, Activity } from "lucide-react";

interface ProfileSidebarProps {
  theme?: "admin" | "doctor";
}

export default function ProfileSidebar({ theme }: ProfileSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const user = useAuthStore((state) => state.user);

  const {
    viewedUser,
    isLoading: isSidebarLoading,
    fetchViewedUser,
  } = useProfileStore();
  const displayUser = viewedUser ?? user;

  useEffect(() => {
    if (user) {
      fetchViewedUser(userId, user?.id);
    }
  }, [userId, user?.id, fetchViewedUser]);

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
              src={displayUser?.profilePictureUrl?? "/images/200x200.png"}
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
            {displayUser?.role === "DOCTOR" && displayUser?.profileCompleted && !displayUser?.profileVerified && (
              <div className="mt-2 inline-flex items-center space-x-1 badge bg-warning/10 text-warning rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <span className="size-1.5 rounded-full bg-warning"></span>
                <span>Pending Approval</span>
              </div>
            )}
          </div>
        </div>
        <ul className="mt-6 space-y-1.5 font-inter font-medium">
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile"))}`}
              href={getLink("/profile")}
            >
              <UserCircle2 className="size-5" />
              <span>Personal Information</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/professional"))}`}
              href={getLink("/profile/professional")}
            >
              <Briefcase className={`size-5 transition-colors ${getIconClasses(isActive("/profile/professional"))}`} />
              <span>Professional Information</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/qualifications"))}`}
              href={getLink("/profile/qualifications")}
            >
              <GraduationCap className={`size-5 transition-colors ${getIconClasses(isActive("/profile/qualifications"))}`} />
              <span>Qualifications & Documents</span>
            </Link>
          </li>
          {(userId || isDoctor(user)) && (
            <li>
              <Link
                className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/availability"))}`}
                href={getLink("/profile/availability")}
              >
                <Clock className={`size-5 transition-colors ${getIconClasses(isActive("/profile/availability"))}`} />
                <span>Availability & Schedule</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/performance"))}`}
              href={getLink("/profile/performance")}
            >
              <BarChart3 className={`size-5 transition-colors ${getIconClasses(isActive("/profile/performance"))}`} />
              <span>Performance Snapshot</span>
            </Link>
          </li>
          {(!userId || userId === user?.id) && (
            <li>
              <Link
                className={`flex items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-hidden transition-all ${getActiveClasses(isActive("/profile/security"))}`}
                href={getLink("/profile/security")}
              >
                <ShieldCheck className={`size-5 transition-colors ${getIconClasses(isActive("/profile/security"))}`} />
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
                <Activity className={`size-5 transition-colors ${getIconClasses(isActive("/profile/activity"))}`} />
                <span>Activity Log</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
