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
  const price = currencyCode === 'USD' ? `$${amount}` : `${amount} ${currencyCode}`;
  const image = product.images.edges[0]?.node;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <span className="text-text-secondary text-xs uppercase tracking-widest">No image</span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-serif text-base md:text-lg font-normal">{product.title}</h3>
        <p className="text-text-secondary text-sm">{price}</p>
      </div>
    </Link>
  );
}
