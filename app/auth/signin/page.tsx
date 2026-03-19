'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setSubmitting(false);
    } else {
      router.push('/profile');
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-light">Sign In</h1>
          <p className="mt-3 text-text-secondary text-sm">
            Access your measurements and orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-600 text-xs text-center py-3 border border-red-200 bg-red-50/50">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-border bg-transparent py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-3">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-border bg-transparent py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300 disabled:opacity-50"
          >
            {submitting ? 'Signing in\u2026' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="border-b border-primary pb-0.5 text-primary hover:opacity-50 transition-opacity">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
