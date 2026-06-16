'use client';

import { Bell, Search, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routeNames: Record<string, string> = {
  admin: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  ingredients: 'Ingredients',
  packaging: 'Packaging',
  finance: 'Finance',
  settings: 'Settings',
};

export function Header() {
  const pathname = usePathname();
  
  // Build breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label, isCurrent: index === segments.length - 1 };
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-card)] px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
          Home
        </Link>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
            {crumb.isCurrent ? (
              <span className="font-medium text-[var(--color-text-primary)]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] pl-9 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)]" />
        </button>

        {/* User Menu */}
        <button className="flex items-center gap-3 rounded-lg px-3 py-1.5 hover:bg-[var(--color-bg-secondary)]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium text-[var(--color-text-primary)] md:block">
            Admin
          </span>
        </button>
      </div>
    </header>
  );
}