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
  const image = product.images.edges[0]?.node;

  return (
    <main className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square">
          {image && (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>
        <div>
          <Link href="/" className="text-sm text-gray-600 hover:underline mb-4 inline-block">
            ← Back to products
          </Link>
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="mt-4 text-2xl font-semibold">
            {price.amount} {price.currencyCode}
          </p>
          {product.description && (
            <div
              className="mt-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
            />
          )}
          {(() => {
            const variant = product.variants.edges[0]?.node;
            return variant ? (
              <AddToCartButton variantId={variant.id} availableForSale={variant.availableForSale} />
            ) : null;
          })()}
        </div>
      </div>
    </main>
  );
}
