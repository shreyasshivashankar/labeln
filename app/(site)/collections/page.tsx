import Link from 'next/link';
import { getCollections } from '@/lib/shopify';
import { mockCollections } from '@/lib/mock-data';
import CollectionCard from '@/app/components/CollectionCard';
import { BRAND, SEO } from '@/lib/constants';

export const metadata = {
  title: `Collections | ${BRAND.name}`,
  description: SEO.collections,
};

async function getAllCollections() {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getCollections(20);
  }
  return mockCollections;
}

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Explore
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light">Our Collections</h1>
          <p className="mt-6 text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
            Each collection is a distinct expression of South Asian artistry and modern design.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {collections.length === 0 ? (
            <p className="text-center text-text-secondary text-sm">
              No collections available yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shop All — always first */}
              <Link href="/collections/all" className="group block">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-primary">
                  <div className="absolute inset-0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-end p-6 md:p-8">
                    <h3 className="text-white font-serif text-2xl md:text-3xl font-light tracking-wide">
                      Shop All
                    </h3>
                  </div>
                </div>
              </Link>
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
