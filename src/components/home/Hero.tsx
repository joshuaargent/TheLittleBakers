import Link from 'next/link';
import { ArrowRight, ShoppingBag, Heart, CheckCircle, Clock, MapPin, Star } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/lib/constants';

// ============================================
// Hero Component - The Little Bakers
// ============================================

export function Hero() {
  return (
    <>
      {/* Main Hero Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[var(--color-pink)]/10 text-[var(--color-pink)] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4 fill-current" />
                Handmade with Love • Fresh Daily
              </div>

              <h1 className="font-[family-name:var(--font-display)] text-[var(--color-cream)] text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl mb-6">
                Handmade Bakes,<br />
                <span className="text-[var(--color-pink)]">Crafted with Care</span>
              </h1>
              <p className="text-[var(--color-text-muted)] mx-auto mt-4 max-w-xl text-lg md:text-xl lg:mx-0">
                {siteConfig.description}
              </p>
              
              {/* Quick Benefits */}
              <div className="flex flex-wrap gap-6 text-[var(--color-text-muted)] text-sm mt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[var(--color-yellow)]" />
                  <span>Fresh Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--color-yellow)]" />
                  <span>Order Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--color-yellow)]" />
                  <span>Local Collection</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/products">
                  <Button variant="primary" size="lg" rightIcon={<ShoppingBag className="h-4 w-4" />}>
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>

            {/* Avatar / Logo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="bg-[var(--color-pink)]/20 absolute inset-0 rounded-full blur-3xl" />
                <Avatar
                  alt={siteConfig.name}
                  size="xl"
                  className="relative border-4 border-[var(--color-cream)] shadow-xl"
                >
                  <span className="text-4xl">🥐</span>
                </Avatar>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-2 -left-4 bg-[var(--color-bg-card)] rounded-xl shadow-lg px-4 py-3 border border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-[var(--color-pink)]" />
                  <span className="text-sm font-medium text-[var(--color-text)]">Family Owned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="pb-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-[var(--color-pink)]/20 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 text-[var(--color-pink)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Order Online</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Browse our range and order for collection. Freshly baked, ready for pickup.
              </p>
              <Link href="/products">
                <Button variant="primary" size="sm">Shop Now</Button>
              </Link>
            </Card>

            <Card hover className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-[var(--color-yellow)]/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-[var(--color-yellow)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Our Story</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Learn about our passion for baking and the love we put into every bake.
              </p>
              <Link href="/about">
                <Button variant="secondary" size="sm">Learn More</Button>
              </Link>
            </Card>

            <Card hover className="p-6 text-center">
              <div className="h-14 w-14 rounded-full bg-[var(--color-turquoise)]/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-[var(--color-turquoise)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">Find Us</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-4">
                Visit us at local markets or collect your online order from our location.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">Get in Touch</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
