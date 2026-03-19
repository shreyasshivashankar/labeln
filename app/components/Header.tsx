'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/labeln';

const NAV_LINKS = [
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, loading } = useAuth();
  const { cart, openDrawer } = useCart();
  const [open, setOpen] = useState(false);

  const cartBadge = cart?.totalQuantity ?? 0;

  const CartIcon = (
    <button onClick={openDrawer} className="relative p-2 hover:text-secondary transition-colors" aria-label="Open cart">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartBadge > 0 && (
        <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {cartBadge}
        </span>
      )}
    </button>
  );

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

          {CartIcon}

          {!loading &&
            (user ? (
              <Link
                href="/profile"
                className="ml-2 px-4 py-2 hover:text-secondary transition-colors text-sm"
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="ml-2 px-4 py-2 hover:text-secondary transition-colors text-sm"
              >
                Sign In
              </Link>
            ))}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex md:hidden items-center gap-1">
          {CartIcon}
          <button
            className="flex flex-col gap-1.5 p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
        </div>
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
            {!loading &&
              (user ? (
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
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
