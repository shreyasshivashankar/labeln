import Link from 'next/link';
import Image from 'next/image';
import { getCollections, getProducts } from '@/lib/shopify';
import { mockCollections, mockProducts } from '../lib/mock-data';
import CollectionCard from './components/CollectionCard';
import ProductCard from './components/ProductCard';
import VideoShowcase from './components/VideoShowcase';

async function getFeaturedCollections() {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getCollections(3);
  }
  return mockCollections;
}

async function getBestSellers() {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getProducts(4);
  }
  return mockProducts;
}

export default async function Home() {
  const [collections, products] = await Promise.all([
    getFeaturedCollections(),
    getBestSellers(),
  ]);

  return (
    <main>
      {/* Hero — full bleed editorial */}
      <section className="relative w-full" style={{ aspectRatio: '1868 / 1680' }}>
        <Image
          src="/images/backdrop.jpg"
          alt="South Asian couture"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-24 px-6 text-white text-center">
          <p className="text-sm md:text-base font-light tracking-[0.15em] uppercase max-w-lg">
            The art of South Asian couture — made for you
          </p>
          <Link
            href="/collections"
            className="mt-5 px-10 py-3.5 border border-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light">Collections</h2>
            <Link
              href="/collections"
              className="text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity border-b border-primary pb-0.5"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <VideoShowcase />

      {/* Best Sellers */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-light">Best Sellers</h2>
            <Link
              href="/collections"
              className="text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-50 transition-opacity border-b border-primary pb-0.5"
            >
              Shop All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Fit CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Bespoke Experience
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">Made for You, Precisely</h2>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-12">
            Every Label N garment is crafted to your exact measurements. Book a virtual consultation
            and our designers will guide you through a personal fitting over a video call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300"
            >
              My Measurements
            </Link>
            <Link
              href="/contact"
              className="px-10 py-3.5 border border-primary text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-all duration-300"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser — editorial split */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
              Our Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6">
              South Asian Heritage,<br />Contemporary Design
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-lg">
              Label N is where tradition meets the contemporary. We believe every garment should be
              a perfect expression of who you are — handcrafted using time-honored techniques
              and finished with modern sensibility.
            </p>
            <Link
              href="/about"
              className="text-[11px] font-medium uppercase tracking-[0.2em] border-b border-primary pb-0.5 hover:opacity-50 transition-opacity"
            >
              Read More
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
