'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useCart } from './CartProvider';

const NAV_LINKS = [
  { href: '/collections', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const { cart, openDrawer } = useCart();
  const [open, setOpen] = useState(false);
  const [coutureOpen, setCoutureOpen] = useState(false);
  const coutureTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartBadge = cart?.totalQuantity ?? 0;

  const handleCoutureEnter = () => {
    if (coutureTimeout.current) clearTimeout(coutureTimeout.current);
    setCoutureOpen(true);
  };

  const handleCoutureLeave = () => {
    coutureTimeout.current = setTimeout(() => setCoutureOpen(false), 150);
  };

  const CartIcon = (
    <button onClick={openDrawer} className="relative p-2 hover:opacity-60 transition-opacity" aria-label="Open cart">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartBadge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
          {cartBadge}
        </span>
      )}
    </button>
  );

  return (
    <header className="bg-white text-primary sticky top-0 z-50 border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Top bar */}
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Left nav - desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
              >
                {label}
              </Link>
            ))}
            {/* Couture dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCoutureEnter}
              onMouseLeave={handleCoutureLeave}
            >
              <button className="text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity flex items-center gap-1">
                Couture
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${coutureOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {coutureOpen && (
                <div
                  className="absolute top-full left-0 pt-2"
                  onMouseEnter={handleCoutureEnter}
                  onMouseLeave={handleCoutureLeave}
                >
                  <div className="bg-white border border-border shadow-sm py-2 min-w-[160px]">
                    <Link
                      href="/couture/new-york"
                      className="block px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-surface transition-colors"
                      onClick={() => setCoutureOpen(false)}
                    >
                      New York
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <span className="font-logo text-2xl lg:text-3xl tracking-[0.15em] font-normal">
              LABEL N
            </span>
          </Link>

          {/* Right actions - desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/contact"
              className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent hover:opacity-70 transition-opacity"
            >
              Made to Order
            </Link>
            {CartIcon}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex lg:hidden items-center gap-2 ml-auto">
            {CartIcon}
            <button
              className="flex flex-col gap-[5px] p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span
                className={`block w-5 h-[1px] bg-primary transition-transform duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`}
              />
              <span
                className={`block w-5 h-[1px] bg-primary transition-opacity duration-300 ${open ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-[1px] bg-primary transition-transform duration-300 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-5">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[12px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/couture/new-york"
              className="text-[12px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
              onClick={() => setOpen(false)}
            >
              Couture — New York
            </Link>
            <Link
              href="/contact"
              className="text-[12px] font-medium uppercase tracking-[0.2em] text-accent hover:opacity-70 transition-opacity"
              onClick={() => setOpen(false)}
            >
              Made to Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
