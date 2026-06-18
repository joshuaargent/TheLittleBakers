import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

// ============================================
// 404 Page
// ============================================

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--color-text)] md:text-8xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text)]">
          Page not found
        </h2>
        <p className="text-[var(--color-text-muted)] mx-auto mt-2 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline">
            <Link href="javascript:history.back()" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
