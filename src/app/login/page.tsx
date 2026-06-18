'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Demo - just redirect for now
    setTimeout(() => {
      router.push('/account');
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="font-[family-name:var(--font-display)] text-[var(--color-cream)] text-3xl hover:text-[var(--color-pink)] transition-colors">
            The Little Bakers
          </Link>
        </div>

        <Card className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Welcome Back</h1>
            <p className="text-[var(--color-text-muted)]">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--color-border)]" />
                <span className="text-[var(--color-text-muted)]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--color-pink)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--color-text-muted)]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[var(--color-pink)] hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center mt-6 text-[var(--color-text-muted)] text-sm">
          <Link href="/" className="hover:text-[var(--color-text)]">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
