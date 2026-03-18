import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  labelRight?: React.ReactNode;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, label, error,  wrapperClassName, labelRight, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", wrapperClassName)}>
        {label && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{label}</span>
            {labelRight && <div className="text-sm">{labelRight}</div>}
          </div>
        )}
        <textarea
          className={cn(
            "form-textarea w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-error focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-xs text-error font-medium mt-1">{error}</span>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea"

export { FormTextarea }
