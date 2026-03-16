interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "green" | "gray";
}

export function Loading({ size = "md", color = "white" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-8 w-8 border-4",
  };

  const colorClasses = {
    white: "border-white border-t-transparent",
    green: "border-green-500 border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// Backward compatibility
export const SmallLoading = Loading;
