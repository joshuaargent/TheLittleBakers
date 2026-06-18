'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

// ============================================
// Toaster Configuration
// ============================================

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--color-bg-card)',
          color: 'var(--color-text)',
          fontSize: '14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: 'var(--color-turquoise)',
            secondary: 'var(--color-text)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--color-danger)',
            secondary: 'var(--color-text)',
          },
        },
      }}
    />
  );
}
