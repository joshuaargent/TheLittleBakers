import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cart | The Little Bakers',
  description: 'View and manage your basket.',
};

// Demo cart items
const cartItems = [
  { id: '1', name: 'Chocolate Fudge Cake', price: 28.00, quantity: 1, image: '🎂' },
  { id: '2', name: 'Butter Croissants', price: 3.50, quantity: 4, image: '🥐' },
  { id: '3', name: 'Artisan Sourdough', price: 6.50, quantity: 1, image: '🍞' },
];

export default function CartPage() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const collectionFee = 0; // Free collection
  const total = subtotal + collectionFee;

  return (
    <>
      {/* Header */}
      <section className="py-8">
        <div className="container">
          <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-3xl md:text-4xl">
            Your Basket
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="container">
          {cartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-0">
                    <div className="p-4 md:p-6">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)] flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl md:text-4xl">{item.image}</span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-[var(--color-text)]">{item.name}</h3>
                              <p className="text-[var(--color-text-muted)] text-sm">Each: £{item.price.toFixed(2)}</p>
                            </div>
                            <button className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-pink)]/20 transition-colors">
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium text-[var(--color-text)]">{item.quantity}</span>
                              <button className="h-8 w-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-pink)]/20 transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Line Total */}
                            <p className="text-lg font-semibold text-[var(--color-yellow)]">
                              £{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="flex justify-between items-center pt-4">
                  <Link href="/products">
                    <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Subtotal</span>
                      <span className="text-[var(--color-text)]">£{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Collection</span>
                      <span className="text-[var(--color-turquoise)]">Free</span>
                    </div>
                    <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                      <span className="font-semibold text-[var(--color-text)]">Total</span>
                      <span className="font-semibold text-[var(--color-yellow)] text-xl">£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link href="/checkout">
                      <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-[var(--color-text-muted)]">
                      Secure checkout powered by Stripe
                    </p>
                  </div>

                  {/* Collection Info */}
                  <div className="mt-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-secondary)]">
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-[var(--color-turquoise)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">Collection</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Collect your order from our location</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center max-w-md mx-auto">
              <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-[var(--color-text-muted)]" />
              <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-3">Your basket is empty</h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Looks like you haven't added any bakes to your basket yet.
              </p>
              <Link href="/products">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Browse Products
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
