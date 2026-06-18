import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

// ============================================
// Types
// ============================================

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
  align?: 'left' | 'center';
  /** Use display font (Pacifico) for script headings */
  display?: boolean;
  className?: string;
}

// ============================================
// Component
// ============================================

export function SectionHeading({
  title,
  subtitle,
  action,
  align = 'left',
  display = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      <div
        className={cn(
          'flex items-end justify-between',
          align === 'center' && 'flex-col items-center gap-2'
        )}
      >
        <div>
          <h2 
            className={cn(
              display
                ? 'font-[family-name:var(--font-display)] text-[var(--color-beige)]'
                : 'text-[var(--color-text)] font-semibold',
              'text-2xl tracking-tight md:text-3xl'
            )}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--color-text-muted)] mt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="text-[var(--color-pink)] hover:text-[var(--color-pink-hover)] shrink-0 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}