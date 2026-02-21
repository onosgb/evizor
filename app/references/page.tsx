"use client";

import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { useAuthStore } from "../stores/authStore";
import { isSuperAdmin, isAdmin } from "../lib/roles";

// ─── Category Config ────────────────────────────────────────────────────────
interface ReferenceCategory {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  /** Regular admins (non-super) can see this card */
  adminCanView: boolean;
  /** Regular admins (non-super) can create items */
  adminCanCreate: boolean;
}

const categories: ReferenceCategory[] = [
  {
    id: "specialties",
    title: "Specialties",
    description: "Medical specialties available in the system.",
    href: "/references/specialties",
    adminCanView: true,
    adminCanCreate: false,
    color: "bg-primary/15 text-primary dark:bg-navy-600 dark:text-accent-light",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-7" viewBox="0 0 24 24" fill="currentColor">
        <path fillOpacity=".25" d="M9 3h6a2 2 0 0 1 2 2v1H7V5a2 2 0 0 1 2-2Z" />
        <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm9 2a1 1 0 0 0-1 1v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1a1 1 0 0 0-1-1Z" />
      </svg>
    ),
  },
  {
    id: "provinces",
    title: "Provinces",
    description: "Provinces / tenants configured in the platform.",
    href: "/references/provinces",
    adminCanView: true,
    adminCanCreate: false,
    color: "bg-success/15 text-success dark:bg-navy-600 dark:text-success-light",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-7" viewBox="0 0 24 24" fill="currentColor">
        <path fillOpacity=".25" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
];

export default function ReferencesPage() {
  const user = useAuthStore((state) => state.user);
  const userIsSuperAdmin = isSuperAdmin(user);
  const userIsAdmin = isAdmin(user);

  const visibleCategories = categories.filter(
    (c) => userIsSuperAdmin || (userIsAdmin && c.adminCanView)
  );

  const canCreate = (cat: ReferenceCategory) =>
    userIsSuperAdmin || (userIsAdmin && cat.adminCanCreate);

  return (
    <DashboardLayout theme="admin">
      {/* Header */}
      <div className="py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-700 dark:text-navy-50">Reference Data</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-navy-300">
          Manage system-wide reference lists
        </p>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="card group flex items-start gap-4 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:ring-1 hover:ring-slate-200 dark:hover:ring-navy-500 focus:outline-none"
          >
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${cat.color}`}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-700 group-hover:text-primary dark:text-navy-100 dark:group-hover:text-accent-light transition-colors">
                {cat.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-navy-300 line-clamp-2">
                {cat.description}
              </p>
              {/* Permission badge */}
              <div className="mt-2 flex flex-wrap gap-1">
                {canCreate(cat) ? (
                  <span className="badge rounded-full bg-success/15 text-success text-[10px] px-1.5 py-0.5">
                    can create
                  </span>
                ) : (
                  <span className="badge rounded-full bg-slate-200 text-slate-600 dark:bg-navy-600 dark:text-navy-300 text-[10px] px-1.5 py-0.5">
                    view only
                  </span>
                )}
              </div>
            </div>
            {/* Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 shrink-0 text-slate-300 group-hover:text-primary dark:text-navy-500 dark:group-hover:text-accent-light transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
