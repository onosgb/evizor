// Shared category config used by the hub page and secondary nav
export interface ReferenceCategory {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  adminCanView: boolean;
  adminCanCreate: boolean;
}

export const categories: ReferenceCategory[] = [
  {
    id: "specialties",
    title: "Specialties",
    description: "Medical specialties available in the system.",
    href: "/references/specialties",
    adminCanView: true,
    adminCanCreate: false,
    color: "bg-primary/15 text-primary dark:bg-navy-600 dark:text-accent-light",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
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
      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillOpacity=".25" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
];
