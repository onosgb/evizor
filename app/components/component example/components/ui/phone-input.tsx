import * as React from "react";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState("");

    // Sync with external value changes
    React.useEffect(() => {
      if (value) {
        const stringValue = String(value);
        setLocalValue(stringValue);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      
      // Only allow digits
      const digitsOnly = input.replace(/\D/g, "");
      
      // Limit to 11 digits
      const limited = digitsOnly.slice(0, 11);
      
      setLocalValue(limited);
      
      // Pass the full number to parent (11 digits)
      if (onChange) {
        onChange(limited);
      }
    };

    return (
      <input
        type="tel"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={localValue}
        onChange={handleChange}
        placeholder="08012345678"
        maxLength={11}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };

