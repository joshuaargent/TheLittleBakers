'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  DollarSign,
  Users,
  Truck,
  ShoppingBag,
  Factory,
  Trash2,
  Settings,
  Menu,
  X,
  FileText,
} from 'lucide-react'
import { useState } from 'react'

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Ingredients', href: '/admin/ingredients', icon: Boxes },
  { name: 'Packaging', href: '/admin/packaging', icon: ShoppingBag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { name: 'Purchases', href: '/admin/purchases', icon: FileText },
  { name: 'Production', href: '/admin/production', icon: Factory },
  { name: 'Waste', href: '/admin/waste', icon: Trash2 },
  { name: 'Finance', href: '/admin/finance', icon: DollarSign },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Header - Horizontal Navbar */}
      <header className="bg-[#C2703E] text-white sticky top-0 z-50 shadow-md">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3">
              <span className="text-2xl">🥐</span>
              <div>
                <span className="font-serif font-bold text-lg">The Little Bakers</span>
                <span className="block text-xs text-white/70">Admin</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
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
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Settings */}
              <Link
                href="/admin/settings"
                className={`hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  pathname === '/admin/settings'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              {/* View Website */}
              <Link
                href="/"
                target="_blank"
                className="hidden xl:flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm"
              >
                View Website →
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-white/80 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="xl:hidden border-t border-white/10 py-4 max-h-[80vh] overflow-y-auto">
              {adminNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
              <div className="border-t border-white/10 mt-2 pt-2">
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  View Website →
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  )
}
