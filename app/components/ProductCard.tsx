import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProduct {
  id: string;
  handle: string;
  title: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>;
  };
}

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const price = `${amount} ${currencyCode}`;
  const image = product.images.edges[0]?.node;

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative w-full h-80">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold truncate">{product.title}</h3>
          <p className="mt-1 text-secondary font-semibold">{price}</p>
        </div>
      </div>
    </Link>
  );
}
