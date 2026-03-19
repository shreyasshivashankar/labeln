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
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] mb-5">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/collections/corsets" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  The Corset Core
                </Link>
              </li>
              <li>
                <Link href="/collections/redefined-drapes-the-contemporary-edit" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Drape Theory
                </Link>
              </li>
              <li>
                <Link href="/collections/layered-fits" className="text-text-secondary text-xs hover:text-primary transition-colors">
                  Layered Fits
                </Link>
              </li>
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
            </ul>
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
