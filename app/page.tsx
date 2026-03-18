import Link from 'next/link';
import { getCollections, getProducts } from '@/lib/shopify';
import { mockCollections, mockProducts } from '../lib/mock-data';
import CollectionCard from './components/CollectionCard';
import ProductCard from './components/ProductCard';

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
      {/* Hero */}
      <section className="relative h-[calc(100vh-64px)] min-h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/9827020/pexels-photo-9827020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black/50 px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-center tracking-wide">
            Label N
          </h1>
          <p className="mt-4 text-lg md:text-xl text-center text-white/90 max-w-xl">
            Discover the art of South Asian couture — made for you, made to last.
          </p>
          <Link
            href="/collections"
            className="mt-10 px-10 py-3 bg-white text-black font-semibold rounded-full hover:bg-secondary hover:text-white transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/collections"
              className="inline-block px-8 py-3 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Fit CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Made for You, Precisely</h2>
          <p className="max-w-2xl mx-auto text-white/80 mb-10 leading-relaxed">
            Every Label N garment is crafted to your exact measurements. Book a virtual consultation
            and our designers will guide you through a personal fitting over a video call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="px-8 py-3 bg-secondary text-white font-semibold rounded-full hover:opacity-90 transition"
            >
              My Measurements
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white rounded-full hover:bg-white hover:text-primary transition"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">About Label N</h2>
          <p className="max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Label N is where South Asian heritage meets contemporary design. We believe every
            garment should be a perfect expression of who you are — crafted with intention,
            precision, and love.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block px-8 py-3 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>
    </main>
  );
}
