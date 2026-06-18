'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Banknote, Calendar } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

type CheckoutStep = 'cart' | 'details' | 'confirmation';

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getItemCount } = useCartStore();
  
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    preferredDate: '',
    preferredTime: '',
  });

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to place an order');
      router.push('/login?callback=/cart');
      return;
    }
    // Pre-fill from session
    if (session.user?.name) {
      const nameParts = session.user.name.split(' ');
      setCustomerDetails(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user?.email || '',
      }));
    }
    setStep('details');
  };

  const handlePlaceOrder = async () => {
    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
          customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customerEmail: customerDetails.email,
          customerPhone: customerDetails.phone,
          notes: customerDetails.notes,
          preferredDate: customerDetails.preferredDate,
          preferredTime: customerDetails.preferredTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderNumber(data.order.orderNumber);
      clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'cart' && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-[var(--color-text-muted)]" />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-3">Your cart is empty</h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            Looks like you haven't added any delicious bakes yet. Let's fix that!
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">Browse Our Bakes</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center">
            <span className="text-5xl">✓</span>
          </div>
          <h1 className="text-3xl font-semibold text-[var(--color-text)] mb-3">Order Placed!</h1>
          <p className="text-[var(--color-text-muted)] mb-2">Thank you for your order! Your order number is:</p>
          <p className="text-2xl font-bold text-[var(--color-pink)] mb-6">{orderNumber}</p>
          <Card className="p-6 text-left mb-8">
            <h3 className="font-semibold text-[var(--color-text)] mb-3">What's next?</h3>
            <ul className="space-y-3 text-[var(--color-text-muted)] text-sm">
              <li className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-[var(--color-pink)] mt-0.5 flex-shrink-0" />
                We'll confirm your preferred collection date via email
              </li>
              <li className="flex items-start gap-3">
                <span className="h-5 w-5 text-[var(--color-yellow)] mt-0.5 flex-shrink-0">📱</span>
                We'll text you when your order is ready
              </li>
              <li className="flex items-start gap-3">
                <Banknote className="h-5 w-5 text-[var(--color-turquoise)] mt-0.5 flex-shrink-0" />
                Pay by cash or bank transfer when you collect
              </li>
            </ul>
          </Card>
          <div className="flex justify-center gap-4">
            <Link href="/products">
              <Button variant="outline">Order More</Button>
            </Link>
            <Link href="/account">
              <Button variant="primary">View My Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-3xl md:text-4xl mb-8">
          {step === 'cart' ? 'Your Cart' : 'Complete Your Order'}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'cart' && (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4 flex gap-4">
                    <div className="w-24 h-24 rounded-xl bg-[var(--color-bg-secondary)] overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🧁</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-text)] truncate">{item.name}</h3>
                      <p className="text-[var(--color-yellow)] font-medium">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-pink)]/20 transition-colors">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-pink)]/20 transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="ml-auto text-red-400 hover:text-red-300">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-text)]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {step === 'details' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Your Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="First Name *" value={customerDetails.firstName} onChange={(e) => setCustomerDetails({ ...customerDetails, firstName: e.target.value })} required />
                  <Input label="Last Name *" value={customerDetails.lastName} onChange={(e) => setCustomerDetails({ ...customerDetails, lastName: e.target.value })} required />
                  <Input label="Email *" type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} required className="md:col-span-2" />
                  <Input label="Phone *" type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} required className="md:col-span-2" />
                  <Input label="Preferred Collection Date" type="date" value={customerDetails.preferredDate} onChange={(e) => setCustomerDetails({ ...customerDetails, preferredDate: e.target.value })} className="md:col-span-2" />
                  <Input label="Preferred Time" value={customerDetails.preferredTime} onChange={(e) => setCustomerDetails({ ...customerDetails, preferredTime: e.target.value })} placeholder="e.g. After 2pm" className="md:col-span-2" />
                  <div className="md:col-span-2">
                    <label className="block text-sm text-[var(--color-text-muted)] mb-1">Special Requests</label>
                    <textarea value={customerDetails.notes} onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })} placeholder="Allergies, dietary requirements, gift wrapping, etc." className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-pink)] focus:outline-none" rows={3} />
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <Button variant="outline" onClick={() => setStep('cart')} leftIcon={<ArrowLeft className="h-4 w-4" />}>Back</Button>
                  <Button variant="primary" onClick={handlePlaceOrder} isLoading={isSubmitting} className="flex-1">Place Order</Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Items ({itemCount})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Collection</span>
                  <span className="text-[var(--color-turquoise)]">Free</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-3 flex justify-between text-lg font-semibold text-[var(--color-text)]">
                  <span>Total</span>
                  <span className="text-[var(--color-yellow)]">{formatPrice(subtotal)}</span>
                </div>
              </div>

              {step === 'cart' && (
                <>
                  <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-[var(--color-turquoise)] mb-2">
                      <Banknote className="h-5 w-5" />
                      <span className="font-medium">Pay on Collection</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)]">Pay by cash or bank transfer when you pick up your order.</p>
                  </div>
                  <Button variant="primary" size="lg" className="w-full" onClick={handleCheckout}>
                    {session ? 'Continue to Checkout' : 'Sign In to Checkout'}
                  </Button>
                  <Link href="/products" className="block text-center mt-4 text-[var(--color-text-muted)] hover:text-[var(--color-pink)] text-sm">
                    Continue Shopping
                  </Link>
                </>
              )}

              {step === 'details' && (
                <div className="bg-[var(--color-pink)]/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[var(--color-pink)] mb-2">
                    <Banknote className="h-5 w-5" />
                    <span className="font-medium">Payment</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    You'll pay when you collect your order. We accept cash and bank transfer.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
