import type { Metadata } from 'next';
import { searchProducts } from '@/lib/shopify';
import ProductCard from '@/app/components/ProductCard';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Search | ${BRAND.name}`,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  const products = query ? await searchProducts(query) : [];

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
      <h1 className="text-[11px] font-medium uppercase tracking-[0.3em] text-text-secondary mb-8">
        {query
          ? `Search results for "${query}"`
          : 'Search'}
      </h1>

      {query && products.length === 0 && (
        <p className="text-text-secondary text-sm">
          No products found for &ldquo;{query}&rdquo;. Try a different search term.
        </p>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!query && (
        <p className="text-text-secondary text-sm">
          Enter a search term to find products.
        </p>
      )}
    </main>
  );
}
