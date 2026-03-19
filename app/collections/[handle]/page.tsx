import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionByHandle } from '@/lib/shopify';
import { mockCollections, mockProducts } from '../../../lib/mock-data';
import ProductCard from '../../components/ProductCard';

async function getCollectionData(handle: string) {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getCollectionByHandle(handle, 20);
  }

  const collection = mockCollections.find((c) => c.handle === handle);
  if (!collection) return null;

  return {
    collection: { ...collection, description: '' },
    products: mockProducts,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollectionData(handle);

  if (!data) notFound();

  const { collection, products } = data;

  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/collections"
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors mb-6 inline-block"
          >
            &larr; All Collections
          </Link>
          <h1 className="font-serif text-5xl md:text-6xl font-light">{collection.title}</h1>
          {collection.description && (
            <p className="mt-6 text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {products.length === 0 ? (
            <p className="text-center text-text-secondary text-sm">
              No products in this collection yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
