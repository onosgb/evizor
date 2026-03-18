"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

interface TableActionMenuProps {
  children: ReactNode;
}

export default function TableActionMenu({ children }: TableActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full p-0 outline-none"
          aria-label="Options"
        >
          <MoreHorizontal className="size-5" />
        </Button>
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
