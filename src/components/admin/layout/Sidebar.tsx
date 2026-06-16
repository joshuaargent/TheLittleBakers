'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Carrot,
  Box,
  Banknote,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChefHat,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: ChefHat },
  { name: 'Ingredients', href: '/admin/ingredients', icon: Carrot },
  { name: 'Packaging', href: '/admin/packaging', icon: Box },
  { name: 'Finance', href: '/admin/finance', icon: Banknote },
];

const bottomNav = [
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300',
        'bg-[var(--color-bg-sidebar)] text-[var(--color-text-inverse)]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)]">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">The Little</span>
              <span className="text-xs text-white/70">Bakers</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Add Button */}
        {!collapsed && (
          <div className="mt-6 px-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]">
              <Plus className="h-4 w-4" />
              Quick Add
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 py-4 px-2">
        {bottomNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title={collapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
        
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}