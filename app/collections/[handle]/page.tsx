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
    <main className="container mx-auto px-4 py-16">
      <Link href="/collections" className="text-sm text-gray-500 hover:underline mb-6 inline-block">
        ← All Collections
      </Link>

      <h1 className="text-5xl font-bold mb-3">{collection.title}</h1>
      {collection.description && (
        <p className="text-gray-600 mb-10 max-w-2xl">{collection.description}</p>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500 mt-12 text-center">No products in this collection yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
