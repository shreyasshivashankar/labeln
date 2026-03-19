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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-40" />
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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {name}</h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push('/');
            }}
            className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Sign Out
          </button>
        </div>
        <MeasurementForm />
      </div>
    </div>
  );
}
