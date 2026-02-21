"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../stores/authStore";
import { isSuperAdmin, isAdmin } from "../../lib/roles";
import { categories } from "../_lib/categories";

export default function ReferenceNav({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(user);
  const userIsAdmin = isAdmin(user);

  const visible = categories.filter(
    (c) => userIsSuperAdmin || (userIsAdmin && c.adminCanView)
  );

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-navy-800 -mx-4 px-4 sm:-mx-5 sm:px-5 pb-3 pt-1 mb-3 border-b border-slate-200 dark:border-navy-600">
      {/* Breadcrumb row */}
      <div className="flex items-center gap-2 py-2 text-sm text-slate-500 dark:text-navy-300">
        <Link
          href="/references"
          className="hover:text-primary dark:hover:text-accent-light transition-colors"
        >
          Reference Data
        </Link>
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium text-slate-700 dark:text-navy-100">
          {categories.find((c) => c.href === pathname)?.title ?? ""}
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {visible.map((cat) => {
          const active = pathname === cat.href;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-success text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-700 dark:text-navy-200 dark:hover:bg-navy-600"
              }`}
            >
              <span className={active ? "text-white" : ""}>{cat.icon}</span>
              {cat.title}
            </Link>
          );
        })}
      </div>

      {/* Page-level header row (title + action button) */}
      {children && (
        <div className="flex flex-col items-start justify-between gap-2 pt-3 sm:flex-row sm:items-center">
          {children}
        </div>
      )}
    </div>
  );
}
