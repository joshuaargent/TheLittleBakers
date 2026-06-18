'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

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
            <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Create Account</h1>
            <p className="text-[var(--color-text-muted)]">Join us and start ordering</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone Number (optional)"
              type="tel"
              placeholder="07700 900000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <p className="text-xs text-[var(--color-text-muted)]">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-[var(--color-pink)] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[var(--color-pink)] hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--color-text-muted)]">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--color-pink)] hover:underline font-medium">
                Sign in
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
