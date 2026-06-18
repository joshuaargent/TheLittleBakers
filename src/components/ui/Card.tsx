import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ============================================
// Card Component
// ============================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable hover lift effect */
  hover?: boolean;
  /** Card padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Card background variant */
  variant?: "dark" | "cream" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, padding = "md", variant = "dark", children, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const variantClasses = {
      dark: "bg-var(--color-bg-card)] border-var(--color-border)]",
      cream: "bg-var(--color-cream)] border-var(--color-cream-dark)]",
      elevated: "bg-var(--color-bg-elevated)] border-var(--color-border)]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-card)] border",
          paddingClasses[padding],
          variantClasses[variant],
          hover && "transition-all duration-200 hover:shadow-[var(--shadow-card)] hover:-translate-y-1",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// ============================================
// Card Header
// ============================================

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

// ============================================
// Card Title
// ============================================

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-var(--color-text)]",
        className,
      )}
      {...props}
    />
  ),
);

CardTitle.displayName = "CardTitle";

// ============================================
// Card Description
// ============================================

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-var(--color-text-muted)]", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

// ============================================
// Card Content
// ============================================

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
  ),
);

CardContent.displayName = "CardContent";

// ============================================
// Card Footer
// ============================================

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4 mt-4 border-t border-var(--color-border)]", className)}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";
