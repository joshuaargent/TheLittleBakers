'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  Menu,
  X,
  MoreHorizontal,
} from 'lucide-react'
import { useState } from 'react'

// Main nav - only essential items
const mainNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Finance', href: '/admin/finance', icon: DollarSign },
]

// More nav - accessible via dropdown on desktop
const moreNav = [
  { name: 'Ingredients', href: '/admin/ingredients' },
  { name: 'Packaging', href: '/admin/packaging' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Suppliers', href: '/admin/suppliers' },
  { name: 'Purchases', href: '/admin/purchases' },
  { name: 'Production', href: '/admin/production' },
  { name: 'Waste', href: '/admin/waste' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header - Horizontal Navbar */}
      <header className="bg-[#C2703E] text-white sticky top-0 z-50 shadow-md">
        <div className="container">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl">🥐</span>
              <span className="font-serif font-bold">The Little Bakers</span>
            </Link>

            {/* Desktop Navigation - Compact */}
            <nav className="hidden lg:flex items-center gap-1">
              {mainNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
              
              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    showMoreMenu
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  More
                </button>
                
                {showMoreMenu && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-48 bg-[var(--color-bg-card)] rounded-lg shadow-lg border border-[var(--color-border)] py-1 z-50"
                    onMouseLeave={() => setShowMoreMenu(false)}
                  >
                    {moreNav.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname.startsWith(item.href)
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* View Website */}
              <Link
                href="/"
                target="_blank"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
              >
                View Site
              </Link>

              {/* Settings */}
              <Link
                href="/admin/settings"
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  pathname === '/admin/settings'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Full list */}
          {mobileMenuOpen && (
            <nav className="lg:hidden border-t border-white/10 py-3 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg mx-2 transition-colors text-sm ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  )
                })}
                
                <div className="border-t border-white/10 mx-3 my-2 pt-2">
                  <p className="px-3 py-1 text-xs text-white/50 uppercase tracking-wide">More</p>
                  {moreNav.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg mx-0 transition-colors text-sm ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                
                <div className="border-t border-white/10 mx-3 my-2 pt-2 space-y-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg mx-0 text-white/80 hover:bg-white/10 text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg mx-0 text-white/80 hover:bg-white/10 text-sm"
                  >
                    View Site
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}
