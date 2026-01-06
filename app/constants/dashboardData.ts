// Search data
export const SEARCH_TABS = [
  "tabAll",
  "tabFiles",
  "tabChats",
  "tabEmails",
  "tabProjects",
  "tabTasks",
];

export const SEARCH_QUICK_ACCESS_ITEMS = [
  {
    name: "Kanban",
    href: "/apps-kanban",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    bg: "bg-success",
  },
  {
    name: "Analytics",
    href: "/dashboards-crm-analytics",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    bg: "bg-secondary",
  },
  {
    name: "Chat",
    href: "/apps-chat",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    bg: "bg-info",
  },
  {
    name: "Files",
    href: "/apps-filemanager",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
    bg: "bg-error",
  },
  {
    name: "Crypto",
    href: "/dashboards-crypto-1",
    icon: "M15 9a2 2 0 10-4 0v5a2 2 0 01-2 2h6m-6-4h4m8 0a9 9 0 11-18 0 9 9 0 0118 0z",
    bg: "bg-secondary",
  },
  {
    name: "Banking",
    href: "/dashboards-banking-1",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    bg: "bg-primary dark:bg-accent",
  },
  {
    name: "Todo",
    href: "/apps-todo",
    icon: "M12.5293 18L20.9999 8.40002 M3 13.2L7.23529 18L17.8235 6",
    bg: "bg-info",
  },
  {
    name: "Orders",
    href: "/dashboards-orders",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    bg: "bg-warning",
  },
];

export const SEARCH_RECENT_ITEMS = [
  {
    name: "Chat App",
    href: "/apps-chat",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    name: "File Manager App",
    href: "/apps-filemanager",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  },
  {
    name: "Email App",
    href: "/apps-mail",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    name: "Kanban Board",
    href: "/apps-kanban",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
  },
  {
    name: "Todo App",
    href: "/apps-todo",
    icon: "M12.5293 18L20.9999 8.40002 M3 13.2L7.23529 18L17.8235 6",
  },
  {
    name: "Crypto Dashboard",
    href: "/dashboards-crypto-2",
    icon: "M15 9a2 2 0 10-4 0v5a2 2 0 01-2 2h6m-6-4h4m8 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Banking Dashboard",
    href: "/dashboards-banking-2",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  {
    name: "Analytics Dashboard",
    href: "/dashboards-crm-analytics",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    name: "Influencer Dashboard",
    href: "/dashboards-influencer",
    icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

// Notification data
export const NOTIFICATION_TABS = ["All", "Alerts", "Events", "Logs"];

export const NOTIFICATION_ITEMS_ALL = [
  {
    title: "User Photo Changed",
    description: "John Doe changed his avatar photo",
    icon: "user-edit",
    bg: "bg-secondary/10 dark:bg-secondary-light/15",
    iconColor: "text-secondary dark:text-secondary-light",
  },
  {
    title: "Mon, June 14, 2021",
    description: "08:00 - 09:00 | Frontend Conf",
    icon: "calendar",
    bg: "bg-info/10 dark:bg-info/15",
    iconColor: "text-info",
    isEvent: true,
  },
  {
    title: "Images Added",
    description: "Mores Clarke added new image gallery",
    icon: "image",
    bg: "bg-primary/10 dark:bg-accent-light/15",
    iconColor: "text-primary dark:text-accent-light",
  },
  {
    title: "Design Completed",
    description: "Robert Nolan completed the design of the CRM application",
    icon: "leaf",
    bg: "bg-success/10 dark:bg-success/15",
    iconColor: "text-success",
  },
  {
    title: "Wed, June 21, 2021",
    description: "16:00 - 20:00 | UI/UX Conf",
    icon: "calendar",
    bg: "bg-info/10 dark:bg-info/15",
    iconColor: "text-info",
    isEvent: true,
  },
  {
    title: "ER Diagram",
    description: "Team completed the ER diagram app",
    icon: "project-diagram",
    bg: "bg-warning/10 dark:bg-warning/15",
    iconColor: "text-warning",
  },
  {
    title: "THU, May 11, 2021",
    description: "10:00 - 11:30 | Interview, Konnor Guzman",
    icon: "microphone",
    bg: "bg-warning/10 dark:bg-warning/15",
    iconColor: "text-warning",
    isEvent: true,
  },
  {
    title: "Weekly Report",
    description: "The weekly report was uploaded",
    icon: "history",
    bg: "bg-error/10 dark:bg-error/15",
    iconColor: "text-error",
  },
];

export const NOTIFICATION_ITEMS_ALERTS = [
  {
    title: "User Photo Changed",
    description: "John Doe changed his avatar photo",
    icon: "user-edit",
    bg: "bg-secondary/10 dark:bg-secondary-light/15",
    iconColor: "text-secondary dark:text-secondary-light",
  },
  {
    title: "Images Added",
    description: "Mores Clarke added new image gallery",
    icon: "image",
    bg: "bg-primary/10 dark:bg-accent-light/15",
    iconColor: "text-primary dark:text-accent-light",
  },
  {
    title: "Design Completed",
    description: "Robert Nolan completed the design of the CRM application",
    icon: "leaf",
    bg: "bg-success/10 dark:bg-success/15",
    iconColor: "text-success",
  },
  {
    title: "ER Diagram",
    description: "Team completed the ER diagram app",
    icon: "project-diagram",
    bg: "bg-warning/10 dark:bg-warning/15",
    iconColor: "text-warning",
  },
  {
    title: "Weekly Report",
    description: "The weekly report was uploaded",
    icon: "history",
    bg: "bg-error/10 dark:bg-error/15",
    iconColor: "text-error",
  },
];

export const NOTIFICATION_ITEMS_EVENTS = [
  {
    title: "Mon, June 14, 2021",
    description: "08:00 - 09:00 | Frontend Conf",
    icon: "calendar",
    bg: "bg-info/10 dark:bg-info/15",
    iconColor: "text-info",
    isEvent: true,
  },
  {
    title: "Wed, June 21, 2021",
    description: "16:00 - 20:00 | UI/UX Conf",
    icon: "calendar",
    bg: "bg-info/10 dark:bg-info/15",
    iconColor: "text-info",
    isEvent: true,
  },
  {
    title: "THU, May 11, 2021",
    description: "10:00 - 11:30 | Interview, Konnor Guzman",
    icon: "microphone",
    bg: "bg-warning/10 dark:bg-warning/15",
    iconColor: "text-warning",
    isEvent: true,
  },
  {
    title: "Mon, Jul 16, 2021",
    description: "06:00 - 16:00 | Laravel Conf",
    icon: "calendar",
    bg: "bg-info/10 dark:bg-info/15",
    iconColor: "text-info",
    isEvent: true,
  },
  {
    title: "Wed, Jun 16, 2021",
    description: "15:30 - 11:30 | Interview, Jonh Doe",
    icon: "microphone",
    bg: "bg-warning/10 dark:bg-warning/15",
    iconColor: "text-warning",
    isEvent: true,
  },
];
