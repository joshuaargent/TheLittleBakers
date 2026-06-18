'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

// ============================================
// Error Page
// ============================================

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md px-4 text-center">
        <div className="mb-6 inline-flex rounded-full bg-red-500/10 p-4 text-[var(--color-danger)]">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Something went wrong</h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          Sorry, an unexpected error occurred. Please try again or go back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 border-[var(--color-cream)] bg-transparent px-5 text-base font-semibold text-[var(--color-cream)] transition-all duration-200 hover:bg-[var(--color-cream)] hover:text-black focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
