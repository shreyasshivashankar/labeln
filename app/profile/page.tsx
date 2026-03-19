'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import MeasurementForm from '../components/MeasurementForm';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded w-64" />
          <div className="h-4 bg-surface rounded w-40" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split('@')[0] ??
    'User';

  return (
    <main>
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-serif text-4xl font-light">Welcome, {name}</h1>
              <p className="text-text-secondary text-sm mt-2">{user.email}</p>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push('/');
              }}
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors border-b border-border pb-0.5"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <MeasurementForm />
        </div>
      </section>
    </main>
  );
}
