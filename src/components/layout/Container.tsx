import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

// ============================================
// Component
// ============================================

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-3xl',      // 768px - narrow content
      default: 'max-w-5xl',  // 1024px - standard content
      lg: 'max-w-6xl',       // 1152px - wider sections
      xl: 'max-w-7xl',       // 1280px - max content
      full: 'max-w-full',    // full width
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          sizeClasses[size], 
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
