'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MeasurementForm from '../components/MeasurementForm';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-40" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Welcome, {session.user?.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
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
