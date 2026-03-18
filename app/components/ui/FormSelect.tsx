import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  options?: { value: string; label: string }[];
  leftIcon?: React.ReactNode;
  labelRight?: React.ReactNode;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      className,
      label,
      error,
      wrapperClassName,
      children,
      options,
      leftIcon,
      labelRight,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{label}</span>
            {labelRight && <div className="text-sm">{labelRight}</div>}
          </div>
        )}
        <div className="relative flex">
          <select
            className={cn(
              "form-select w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              error && "border-error focus:border-error",
              className
            )}
            ref={ref}
            {...props}
          >
            {children ||
              options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          {leftIcon && (
            <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 dark:text-navy-300">
              {leftIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-error font-medium mt-1">{error}</span>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

export { FormSelect };
