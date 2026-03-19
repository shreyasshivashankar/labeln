import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-logo text-xl tracking-[0.15em] font-normal">
              LABEL N
            </Link>
            <p className="mt-4 text-text-secondary text-xs leading-relaxed max-w-xs">
              Bespoke South Asian couture crafted with intention, precision, and heritage.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/collections" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Get in Touch</h4>
            <p className="text-text-secondary text-xs mb-1">info@labeln.com</p>
            <p className="text-text-secondary text-xs mb-5">Response within 24 hours</p>
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
            &copy; {year} Label N. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
