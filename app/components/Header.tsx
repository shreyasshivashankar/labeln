'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/labeln';

const NAV_LINKS = [
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-primary text-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-serif tracking-wide">
          Label N
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 hover:text-secondary transition-colors text-sm"
            >
              {label}
            </Link>
          ))}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 border border-white/70 rounded-full text-sm hover:bg-white hover:text-primary transition-colors"
          >
            Schedule a Consultation
          </a>
          {session ? (
            <Link href="/profile" className="ml-2 px-4 py-2 hover:text-secondary transition-colors text-sm">
              Profile
            </Link>
          ) : (
            <Link href="/auth/signin" className="ml-2 px-4 py-2 hover:text-secondary transition-colors text-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/20 bg-primary">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-2 py-3 hover:text-secondary transition-colors border-b border-white/10"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-2 py-3 border border-white/60 rounded-full text-center text-sm hover:bg-white hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Schedule a Consultation
            </a>
            {session ? (
              <Link
                href="/profile"
                className="px-2 py-3 hover:text-secondary transition-colors"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="px-2 py-3 hover:text-secondary transition-colors"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
