'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MeasurementForm from '../components/MeasurementForm';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Welcome, {session.user?.name}</h1>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 text-white p-2 rounded"
            >
              Sign Out
            </button>
          </div>
          <MeasurementForm />
        </div>
      </div>
    );
  }

  return null;
}
