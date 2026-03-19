import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCollectionByHandle, getAllProducts } from '@/lib/shopify';
import { mockCollections, mockProducts } from '@/lib/mock-data';
import ProductCard from '@/app/components/ProductCard';

const PRODUCTS_PER_PAGE = 24;

async function getCollectionData(handle: string) {
  // "all" is a virtual collection showing every product
  if (handle === 'all') {
    const products = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
      ? await getAllProducts()
      : mockProducts;
    return {
      collection: { title: 'Shop All', description: 'Browse our entire collection.' },
      products,
    };
  }

  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return getCollectionByHandle(handle, 100);
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
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { handle } = await params;
  const { page: pageParam } = await searchParams;
  const data = await getCollectionData(handle);

  if (!data) notFound();

  const { collection, products: allProducts } = data;

  // Pagination
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = allProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);

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
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light">{collection.title}</h1>
          {collection.description && (
            <p className="mt-6 text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
          {totalProducts > PRODUCTS_PER_PAGE && (
            <p className="mt-4 text-text-secondary text-xs tracking-wide">
              {totalProducts} products
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
                  {currentPage > 1 && (
                    <Link
                      href={`/collections/${handle}${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`}
                      className="px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] border border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all"
                    >
                      Previous
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Link
                      key={page}
                      href={`/collections/${handle}${page === 1 ? '' : `?page=${page}`}`}
                      className={`w-10 h-10 flex items-center justify-center text-xs font-medium tracking-wide transition-all ${
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'border border-primary/20 hover:border-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {page}
                    </Link>
                  ))}

                  {currentPage < totalPages && (
                    <Link
                      href={`/collections/${handle}?page=${currentPage + 1}`}
                      className="px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] border border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
