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
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-all duration-200',
          isScrolled
            ? 'bg-var(--color-bg)]/95 border-var(--color-border)] border-b backdrop-blur-md'
            : 'bg-var(--color-bg)]'
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - "Admin" with brand styling */}
            <Link
              href="/admin"
              className="font-[family-name:var(--font-display)] text-xl text-var(--color-cream)] hover:text-var(--color-pink)] transition-colors"
            >
              Admin
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {mainNav.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                        : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
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
                    'flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors',
                    showMoreMenu
                      ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                      : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                  )}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  More
                </button>
                
                {showMoreMenu && (
                  <div 
                    className="absolute right-0 top-full mt-1 w-48 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-var(--color-border)] bg-var(--color-bg-card)] py-1 z-50"
                    onMouseLeave={() => setShowMoreMenu(false)}
                  >
                    {moreNav.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'block px-4 py-2 text-sm transition-colors',
                          pathname.startsWith(item.href)
                            ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                            : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* View Website */}
              <Link
                href="/"
                target="_blank"
                className="ml-2 text-var(--color-text-muted)] hover:text-var(--color-pink)] text-sm transition-colors"
              >
                View Site
              </Link>

              {/* Settings */}
              <Link
                href="/admin/settings"
                className={cn(
                  'flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors ml-1',
                  pathname === '/admin/settings'
                    ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                    : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-var(--color-cream)]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Same styling as normal Navbar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[45] bg-var(--color-bg)] pt-16 md:hidden overflow-y-auto"
            style={{ transform: 'translateZ(0)' }}
          >
            <nav className="container py-6 pb-12">
              <div className="flex flex-col gap-2">
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
                          'flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                            : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}

                {/* More Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: mainNav.length * 0.05 }}
                  className="border-var(--color-border)] mt-4 border-t pt-4"
                >
                  <p className="px-4 py-2 text-xs text-var(--color-text-muted)] uppercase tracking-wide font-medium">More</p>
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
                            'flex items-center rounded-[var(--radius-md)] px-4 py-3 text-base font-medium transition-colors',
                            isActive
                              ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                              : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                          )}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}
                </motion.div>

                {/* Footer links */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (mainNav.length + moreNav.length + 1) * 0.05 }}
                  className="border-var(--color-border)] mt-4 border-t pt-4"
                >
                  <Link
                    href="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-base font-medium transition-colors',
                      pathname === '/admin/settings'
                        ? 'text-var(--color-pink)] bg-var(--color-pink-light)]'
                        : 'text-var(--color-text-muted)] hover:text-var(--color-text)] hover:bg-var(--color-bg-secondary)]'
                    )}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-base font-medium text-var(--color-text-muted)] hover:text-var(--color-pink)] hover:bg-var(--color-bg-secondary)] transition-colors"
                  >
                    View Site
                  </Link>
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Main Content - Less padding now */}
      <main className="container py-4">
        {children}
      </main>
    </>
  )
}
