import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, Clock, Award, Users, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | The Little Bakers',
  description: 'Learn about The Little Bakers - handmade bakes crafted with love using the finest ingredients.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-4xl md:text-5xl mb-4">
              Our Story
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg">
              Handmade bakes crafted with love, using recipes passed down through generations.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="pb-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-6">
                A Passion for Baking
              </h2>
              <div className="space-y-4 text-[var(--color-text-muted)]">
                <p>
                  The Little Bakers was born from a love of traditional baking. Every morning, we wake before dawn to ensure our bakes are fresh and ready for you.
                </p>
                <p>
                  We believe that great baking starts with great ingredients. That's why we source locally wherever possible - from free-range eggs to European butter and artisan flour.
                </p>
                <p>
                  Whether it's a celebration cake for a special occasion or a warm croissant for your morning coffee, every item we create is made with the same care and attention.
                </p>
              </div>
            </div>
            <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-card)] aspect-video flex items-center justify-center">
              <span className="text-6xl">👨‍🍳</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] text-center mb-12">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-[var(--color-pink)]/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-[var(--color-pink)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Made with Love</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Every bake is handcrafted with care and attention.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-[var(--color-yellow)]/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-[var(--color-yellow)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Fresh Daily</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Baked fresh every morning for that just-out-of-the-oven taste.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-[var(--color-turquoise)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Quality First</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                We never compromise on ingredients or technique.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="h-14 w-14 rounded-full bg-[var(--color-cream)]/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-[var(--color-cream)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Community</h3>
              <p className="text-[var(--color-text-muted)] text-sm">
                Supporting local suppliers and serving our community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-4">
              Try Our Bakes Today
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Order online for collection or find us at local markets near you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Shop Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
