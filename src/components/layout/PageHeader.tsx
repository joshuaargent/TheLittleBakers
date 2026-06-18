import { cn } from '@/lib/utils';
import { Container } from '@/components/layout/Container';

// ============================================
// Types
// ============================================

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
  size?: 'default' | 'large';
  /** Use display font (Pacifico) for script headings */
  display?: boolean;
}

// ============================================
// Component
// ============================================

export function PageHeader({
  title,
  description,
  children,
  className,
  align = 'center',
  size = 'default',
  display = false,
}: PageHeaderProps) {
  return (
    <header className={cn('py-12 md:py-16', size === 'large' && 'py-16 md:py-24', className)}>
      <div className={cn('container', align === 'center' && 'text-center')}>
        <h1
          className={cn(
            display
              ? 'font-[family-name:var(--font-display)] text-[var(--color-beige)]'
              : 'text-[var(--color-text)] font-bold',
            'tracking-tight',
            size === 'default' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'text-[var(--color-text-muted)] mt-4 max-w-2xl text-lg',
              align === 'center' && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}
