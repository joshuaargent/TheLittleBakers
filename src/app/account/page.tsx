'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { User, Package, LogOut, ChevronRight, ShoppingBag } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: { name: string };
  items: Array<{ id: string; quantity: number; product: { name: string } }>;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => setOrders(data.orders || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (cents: number) => `£${(cents / 100).toFixed(2)}`;

  if (status === 'loading' || loading) {
    return (
      <div className="py-12">
        <div className="container">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <Card className="p-12 text-center max-w-md mx-auto">
          <User className="h-16 w-16 mx-auto mb-6 text-[var(--color-text-muted)]" />
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">Sign in to your account</h2>
          <p className="text-[var(--color-text-muted)] mb-6">View your orders and manage your account</p>
          <div className="flex justify-center gap-4">
            <Link href="/login"><Button variant="primary">Sign In</Button></Link>
            <Link href="/register"><Button variant="outline">Create Account</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const userName = session?.user?.name || 'Customer';
  const userEmail = session?.user?.email || '';

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-3xl md:text-4xl mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[var(--color-border)]">
                <div className="h-16 w-16 rounded-full bg-[var(--color-pink)]/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-[var(--color-pink)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{userName}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{userEmail}</p>
                </div>
              </div>

              <nav className="pt-6 space-y-1">
                <Link href="/account" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-pink)]/10 text-[var(--color-pink)]">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">My Orders</span>
                </Link>
                <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Continue Shopping</span>
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">Order History</h2>
              <Link href="/products" className="text-[var(--color-pink)] hover:underline text-sm">
                Browse Products →
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} hover className="p-0">
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[var(--color-text-muted)] text-sm">Order {order.orderNumber}</p>
                          <p className="text-lg font-semibold text-[var(--color-text)]">{formatDate(order.createdAt)}</p>
                          <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-[var(--color-yellow)]">{formatPrice(order.total)}</p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-turquoise)]/20 text-[var(--color-turquoise)]">
                            {order.status.name}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                        </p>
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
                <Link href="/products"><Button variant="primary">Browse Our Bakes</Button></Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
