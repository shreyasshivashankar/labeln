import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { getProductByHandle } from '@/lib/shopify';
import { mockProducts } from '@/lib/mock-data';
import ProductDetails from './ProductDetails';

async function getCachedProduct(handle: string) {
  const hasShopify = process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (hasShopify) {
    return unstable_cache(
      async () => getProductByHandle(handle),
      [`product-${handle}`],
      { tags: [`product-${handle}`, 'products', 'shopify'], revalidate: false }
    )();
  }

  const mock = mockProducts.find((p) => p.handle === handle);
  if (!mock) return null;

  return {
    id: mock.id,
    handle: mock.handle,
    title: mock.title,
    description: '',
    descriptionHtml: '',
    productType: '',
    vendor: '',
    tags: [],
    options: [],
    priceRange: { minVariantPrice: mock.priceRange.minVariantPrice, maxVariantPrice: mock.priceRange.minVariantPrice },
    images: mock.images,
    variants: {
      edges: [{ node: { id: mock.id, title: 'Default', availableForSale: true, price: mock.priceRange.minVariantPrice, selectedOptions: [] } }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);

  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);

  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20">
        <Link
          href="/collections"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors mb-10 inline-block"
        >
          &larr; Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div className="space-y-2">
            {images.length > 0 ? (
              images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] bg-surface overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-[3/4] bg-surface" />
            )}
          </div>

          {/* Product info — client component for interactivity */}
          <ProductDetails product={product} />
        </div>
      </div>
    </main>
  );
}
