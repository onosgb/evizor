"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";

interface TableActionMenuProps {
  children: ReactNode;
}

export default function TableActionMenu({ children }: TableActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 outline-none"
          aria-label="Options"
        >
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
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-auto min-w-37.5 rounded-md border border-slate-150 bg-white py-1.5 font-inter shadow-lg dark:border-navy-500 dark:bg-navy-700 animate-in fade-in zoom-in-95 duration-200"
          side="bottom"
          align="end"
          sideOffset={5}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button, a")) {
              setOpen(false);
            }
          }}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
