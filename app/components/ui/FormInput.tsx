import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  labelRight?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      className,
      label,
      error,
      wrapperClassName,
      type,
      leftIcon,
      rightIcon,
      labelRight,
      ...props
    },
    ref
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
          <input
            type={type}
            className={cn(
              "form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              error && "border-error focus:border-error",
              className
            )}
            ref={ref}
            {...props}
          />
          {leftIcon && (
            <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent left-0">
              {leftIcon}
            </span>
          )}
          {rightIcon && (
            <div className="absolute right-0 flex h-full w-10 items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-error font-medium mt-1">{error}</span>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
