import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Types
// ============================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// ============================================
// Component
// ============================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-base text-[var(--color-text)]",
            "placeholder:text-[var(--color-text-subtle)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-pink)] focus:border-[var(--color-pink)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]",
            className,
          )}
          {...props}
        />
        {hint && !error && <p className="text-sm text-[var(--color-text-subtle)]">{hint}</p>}
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
