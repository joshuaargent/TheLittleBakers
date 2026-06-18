'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-var(--color-bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-var(--color-text-primary)] mb-2">
          Database Connection Error
        </h1>
        <p className="text-var(--color-text-secondary)] mb-6">
          Unable to connect to the database. The admin dashboard requires a properly configured database.
        </p>
        <div className="bg-var(--color-bg-secondary)] rounded-lg p-4 text-left mb-6">
          <h2 className="font-semibold text-var(--color-text-primary)] mb-2">Setup Required:</h2>
          <ol className="text-sm text-var(--color-text-secondary)] space-y-1 list-decimal list-inside">
            <li>Set up a PostgreSQL database (Supabase, Neon, Railway, etc.)</li>
            <li>Add <code className="bg-var(--color-bg-card)] px-1 rounded">DATABASE_URL</code> environment variable</li>
            <li>Run <code className="bg-var(--color-bg-card)] px-1 rounded">npx prisma db push</code></li>
            <li>Redeploy the application</li>
          </ol>
        </div>
        <button
          onClick={reset}
          className="px-4 py-2 bg-var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}