import Link from 'next/link';
import Image from 'next/image';

interface CollectionCardCollection {
  id: string;
  handle: string;
  title: string;
  image: { url: string; altText: string | null } | null;
}

export default function CollectionCard({ collection }: { collection: CollectionCardCollection }) {
  return (
    <Link href={`/collections/${collection.handle}`} className="group">
      <div className="relative w-full h-80 rounded-lg overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-3xl font-bold font-serif drop-shadow-lg">
            {collection.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
