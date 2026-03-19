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
    <Link href={`/collections/${collection.handle}`} className="group block">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface">
        {collection.image ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
        <div className="absolute inset-0 flex items-end p-6 md:p-8">
          <h3 className="text-white font-serif text-2xl md:text-3xl font-light tracking-wide">
            {collection.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
