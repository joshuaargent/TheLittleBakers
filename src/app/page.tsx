import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Heart, Truck, Clock, Award, Star } from 'lucide-react';

// ============================================
// Homepage
// ============================================

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Why Choose Us */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-4">
              Why Choose The Little Bakers?
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              We're not just a bakery — we're your neighbours, crafting treats that bring people together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Handmade Daily', desc: 'Every item is made from scratch using traditional recipes and fresh ingredients.', color: 'var(--color-pink)' },
              { icon: Truck, title: 'Collection Only', desc: 'Order online, pick up fresh. No delivery fees, no cold food.', color: 'var(--color-turquoise)' },
              { icon: Clock, title: 'Pay on Pickup', desc: 'Cash or bank transfer when you collect. Simple, no-fuss ordering.', color: 'var(--color-yellow)' },
              { icon: Award, title: 'Local & Fresh', desc: 'Supporting local suppliers. Baked with love in our kitchen.', color: 'var(--color-pink)' },
            ].map((item, i) => (
              <Card key={i} hover className="p-6 text-center">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <item.icon className="h-7 w-7" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-4">
              What We're Baking
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              From everyday essentials to special occasion treats, we've got something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '🍞', title: 'Artisan Bread', desc: 'Sourdough, focaccia, bloomers and more. The foundation of every good meal.' },
              { emoji: '🥐', title: 'Pastries', desc: 'Flaky croissants, Danish pastries, and buttery danishes. Perfect with your morning coffee.' },
              { emoji: '🍰', title: 'Cakes & Desserts', desc: 'Celebration cakes, brownies, cheesecakes. Made to make moments special.' },
              { emoji: '🍪', title: 'Cookies & Biscuits', desc: 'Chunky cookies, shortbread, and everything in between. Great for snacking.' },
              { emoji: '🥪', title: 'Savoury Treats', desc: 'Scones, sausage rolls, and savory bakes. Hearty and delicious.' },
              { emoji: '🎁', title: 'Gift Boxes', desc: 'Curated selections perfect for gifting or treating yourself.' },
            ].map((item, i) => (
              <Card key={i} hover className="p-6 flex gap-4 items-start">
                <span className="text-5xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/products">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-[var(--color-pink)]/5 to-[var(--color-yellow)]/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-4">
              How to Order
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              Ordering is simple. Browse, add to cart, and pick up when it's ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Browse & Select', desc: 'Explore our range of fresh bakes and add your favourites to the cart.' },
              { step: '2', title: 'Place Your Order', desc: 'Complete checkout with your details. We\'ll confirm via email.' },
              { step: '3', title: 'Collect Fresh', desc: 'Pick up your order at the agreed time. Pay by cash or bank transfer.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-[var(--color-pink)] text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                {i < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-[var(--color-border)]" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', text: 'The best croissants I\'ve had outside of France! Fresh, flaky and absolutely delicious.', rating: 5 },
              { name: 'James P.', text: 'Ordered a birthday cake and it was a huge hit. Will definitely be back!', rating: 5 },
              { name: 'Emma L.', text: 'Love that I can order online and pick up fresh. The sourdough is incredible.', rating: 5 },
            ].map((item, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-[var(--color-yellow)] text-[var(--color-yellow)]" />
                  ))}
                </div>
                <p className="text-[var(--color-text-muted)] mb-4">"{item.text}"</p>
                <p className="font-semibold text-[var(--color-text)]">{item.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-4">
              Ready to Taste the Difference?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Join our growing family of happy customers. Browse our range and order your first bake today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
