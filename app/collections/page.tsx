import { getCollections } from '@/lib/shopify';
import { mockCollections } from '../../lib/mock-data';
import CollectionCard from '../components/CollectionCard';

async function getAllCollections() {
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getCollections(20);
  }
  return mockCollections;
}

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-4">Our Collections</h1>
      <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
        Explore our curated collections — each one a distinct expression of South Asian artistry.
      </p>
      {collections.length === 0 ? (
        <p className="text-center text-gray-500">No collections available yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </main>
  );
}
