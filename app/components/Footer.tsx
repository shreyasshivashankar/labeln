import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-xl font-bold font-serif mb-3">Label N</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Bespoke South Asian couture crafted with intention, precision, and heritage.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <p className="text-sm text-white/70 mb-1">info@labeln.com</p>
            <p className="text-sm text-white/70 mb-4">Response within 24 hours</p>
            <Link
              href="/contact"
              className="inline-block text-sm border border-white/50 rounded-full px-5 py-2 hover:bg-white hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center text-xs text-white/50">
          <p>&copy; {year} Label N. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
