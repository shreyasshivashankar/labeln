import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import { getProductByHandle } from '@/lib/shopify';
import { mockProducts } from '@/lib/mock-data';
import AddToCartButton from '../../components/AddToCartButton';

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
    priceRange: mock.priceRange,
    images: mock.images,
    variants: {
      edges: [{ node: { id: mock.id, title: 'Default', availableForSale: true, price: mock.priceRange.minVariantPrice } }],
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

  const price = product.priceRange.minVariantPrice;
  const formattedPrice = price.currencyCode === 'USD' ? `$${price.amount}` : `${price.amount} ${price.currencyCode}`;
  const image = product.images.edges[0]?.node;

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
          <div className="relative aspect-[3/4] bg-surface overflow-hidden">
            {image && (
              <Image
                src={image.url}
                alt={image.altText ?? product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>

          <div className="flex flex-col justify-center py-6">
            <h1 className="font-serif text-3xl md:text-4xl font-light">{product.title}</h1>
            <p className="mt-4 text-lg text-text-secondary">{formattedPrice}</p>

            {product.description && (
              <div
                className="mt-8 text-text-secondary text-sm leading-[1.9] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
              />
            )}

            {(() => {
              const variant = product.variants.edges[0]?.node;
              return variant ? (
                <div className="mt-10">
                  <AddToCartButton variantId={variant.id} availableForSale={variant.availableForSale} />
                </div>
              ) : null;
            })()}

            <div className="mt-12 pt-8 border-t border-border space-y-3">
              <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">
                Free shipping on orders over $200
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-text-secondary">
                Made to your measurements
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
