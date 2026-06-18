'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: { name: string; color: string | null };
  items: Array<{
    id: string;
    quantity: number;
    product: { name: string };
  }>;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.orders) {
            setOrders(data.orders);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <section className="py-8">
          <div className="container">
            <Skeleton className="h-10 w-64" />
          </div>
        </section>
        <section className="pb-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <Skeleton className="h-64" />
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <>
        <section className="py-12">
          <div className="container">
            <Card className="p-12 text-center max-w-md mx-auto">
              <User className="h-16 w-16 mx-auto mb-6 text-[var(--color-text-muted)]" />
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">Sign in to your account</h2>
              <p className="text-[var(--color-text-muted)] mb-6">View your orders and manage your account</p>
              <div className="flex justify-center gap-4">
                <Link href="/login">
                  <Button variant="primary">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </>
    );
  }

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || '';

  return (
    <>
      {/* Header */}
      <section className="py-8">
        <div className="container">
          <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-3xl md:text-4xl">
            My Account
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--color-border)]">
                  <div className="h-16 w-16 rounded-full bg-[var(--color-pink)]/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-[var(--color-pink)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">{userName}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="pt-6 space-y-1">
                  <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-pink)]/10 text-[var(--color-pink)]">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Orders</span>
                  </Link>
                  <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                    <MapPin className="h-5 w-5" />
                    <span>Addresses</span>
                  </Link>
                  <Link href="/account/settings" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>

                <div className="pt-6 border-t border-[var(--color-border)] mt-6">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-400 hover:text-red-300"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Orders Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Order History</h2>
                <Link href="/products" className="text-[var(--color-pink)] hover:underline text-sm">
                  Browse Products →
                </Link>
              </div>

              {/* Orders List */}
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} hover className="p-0">
                      <div className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[var(--color-text-muted)] text-sm">Order {order.orderNumber}</p>
                            <p className="text-lg font-semibold text-[var(--color-text)]">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[var(--color-text-muted)] text-sm">{order.items.length} items</p>
                            <p className="text-lg font-semibold text-[var(--color-yellow)]">£{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-[var(--radius-pill)] text-xs font-medium bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)]"
                          >
                            {order.status.name}
                          </span>
                          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No Orders Yet</h3>
                  <p className="text-[var(--color-text-muted)] mb-6">When you place an order, it will appear here.</p>
                  <Link href="/products">
                    <Button variant="primary">Browse Products</Button>
                  </Link>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="font-semibold text-[var(--color-text)] mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/products" className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-pink)]/10 transition-colors group">
                    <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-pink)]">New Order</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Browse & order</p>
                  </Link>
                  <Link href="/account/settings" className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-pink)]/10 transition-colors group">
                    <p className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-pink)]">Update Profile</p>
                    <p className="text-sm text-[var(--color-text-muted)]">Manage details</p>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
