'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
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
import { useState, useEffect } from 'react'

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 bg-[#C2703E] text-white shadow-md">
        <nav className="container">
          <div className="flex h-14 items-center justify-between">
            {/* Logo - "Admin" */}
            <Link href="/admin" className="flex items-center gap-2 text-white font-semibold">
              Admin
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
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )}
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
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm',
                    showMoreMenu
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
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
                        className={cn(
                          'block px-4 py-2 text-sm transition-colors',
                          pathname.startsWith(item.href)
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                        )}
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
                className={cn(
                  'hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm',
                  pathname === '/admin/settings'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
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
        </nav>
      </header>

      {/* Mobile Menu - Smooth animation like normal Navbar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-[#C2703E] pt-14 lg:hidden"
          >
            <nav className="container py-6 overflow-y-auto h-[calc(100vh-3.5rem)]">
              <div className="flex flex-col gap-1">
                {mainNav.map((item, index) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href))

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mainNav.length * 0.05 }}
                  className="border-t border-white/20 mt-4 pt-4"
                >
                  <p className="px-4 py-2 text-xs text-white/50 uppercase tracking-wide font-medium">More</p>
                  {moreNav.map((item, index) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (mainNav.length + 1 + index) * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'text-white/80 hover:bg-white/10'
                          )}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (mainNav.length + moreNav.length + 1) * 0.05 }}
                  className="border-t border-white/20 mt-4 pt-4 space-y-1"
                >
                  <Link
                    href="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:bg-white/10 transition-colors"
                  >
                    View Site
                  </Link>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container py-6 pt-20">
        {children}
      </main>
    </>
  )
}
