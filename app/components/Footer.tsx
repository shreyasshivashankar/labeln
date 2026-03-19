import Link from 'next/link';
import { BRAND, CONTACT, FOOTER_SHOP_LINKS } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-logo text-xl tracking-[0.15em] font-normal whitespace-nowrap">
              {BRAND.name.toUpperCase()}
            </Link>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary text-xs hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Customer Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Returns &amp; Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* The Brand */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">The Brand</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Get in Touch</h4>
            <a href={`mailto:${CONTACT.email}`} className="text-text-secondary text-xs hover:text-primary transition-colors">
              {CONTACT.email}
            </a>
            <p className="text-text-secondary text-[10px] mt-1 mb-3">Response within {CONTACT.responseTime}</p>
            <a href={CONTACT.phoneTel} className="text-text-secondary text-xs hover:text-primary transition-colors block mb-5">
              {CONTACT.phone}
            </a>
            <Link
              href="/contact"
              className="text-[11px] font-medium uppercase tracking-[0.2em] border-b border-primary pb-0.5 hover:opacity-50 transition-opacity"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 text-center">
          <p className="text-text-secondary text-[10px] uppercase tracking-[0.2em]">
            &copy; {year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
