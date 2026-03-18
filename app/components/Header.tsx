'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-primary text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-serif">
          Label N
        </Link>
        <div>
          <Link href="/collections" className="px-4">Collections</Link>
          <Link href="/about" className="px-4">About</Link>
          <Link href="/contact" className="px-4">Contact</Link>
          <Link href="https://calendly.com/your-username" legacyBehavior passHref>
            <a target="_blank" className="px-4 py-2 border rounded-full">
              Schedule a Consultation
            </a>
          </Link>
          {session ? (
            <Link href="/profile" className="px-4">Profile</Link>
          ) : (
            <Link href="/auth/signin" className="px-4">Sign In</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
