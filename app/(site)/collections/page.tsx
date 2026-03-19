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
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-white border border-border">
                  {/* Subtle decorative elements */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                    <span className="font-serif text-[12rem] md:text-[16rem] font-light select-none leading-none tracking-tight">N</span>
                  </div>
                  <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8">
                    <div className="w-8 h-px bg-primary/20" />
                  </div>
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
                    <div className="w-8 h-px bg-primary/20" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:bg-surface/50 transition-colors duration-500">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-secondary mb-3">
                      Explore
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl font-light tracking-wide text-primary">
                      Shop All
                    </h3>
                    <div className="mt-4 w-6 h-px bg-primary/30 group-hover:w-10 transition-all duration-500" />
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
