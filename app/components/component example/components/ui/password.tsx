import { useState, forwardRef } from "react";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  className?: string;
  inputClassName?: string;
};

const Password = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className={className}>
        <span className="relative block">
          <input
            type={showPassword ? "text" : "password"}
            ref={ref}
            {...props}
            className={cn(
              "flex h-10 w-full rounded-md border border-input px-3 py-1 text-base text-background shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              inputClassName
            )}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className=" absolute top-0 flex h-full w-[34px] cursor-pointer items-center justify-start text-dark-900 hover:text-dark-700 right-0 lg:w-9"
          >
            {showPassword ? (
              <EyeOffIcon className="h-auto w-4" />
            ) : (
              <EyeIcon className="h-auto w-4" />
            )}
          </span>
        </span>
      </div>
    );
  }
);

Password.displayName = "Password";
export default Password;
