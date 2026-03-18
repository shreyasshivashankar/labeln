import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const price = `${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}`;
  
  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="w-full bg-white rounded-lg overflow-hidden">
        <div className="relative w-full h-80">
          <Image
            src={product.images.edges[0].node.url}
            alt={product.images.edges[0].node.altText}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold">{product.title}</h3>
          <p className="mt-2 text-gray-600">{price}</p>
        </div>
      </div>
    </Link>
  );
}
