import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/lib/constants';

// ============================================
// Hero Component
// ============================================

export function Hero() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--color-cream)] text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
              Welcome to <span className="text-[var(--color-pink)]">{siteConfig.name}</span>
            </h1>
            <p className="text-[var(--color-text-muted)] mx-auto mt-6 max-w-xl text-lg md:text-xl lg:mx-0">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Order Now
              </Button>
              <Button variant="outline" size="lg" leftIcon={<Mail className="h-4 w-4" />}>
                Contact Us
              </Button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="bg-[var(--color-pink)]/20 absolute inset-0 rounded-full blur-3xl" />
              <Avatar
                alt={siteConfig.name}
                size="xl"
                className="relative border-4 border-[var(--color-cream)] shadow-xl"
              >
                <span className="text-4xl">🍞</span>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
