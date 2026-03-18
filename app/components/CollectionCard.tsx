import Link from 'next/link';
import Image from 'next/image';

interface Collection {
  id: string;
  title: string;
  handle: string;
  image: {
    url: string;
    altText: string;
  };
}

export default function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.handle}`} className="group">
      <div className="relative w-full h-80 rounded-lg overflow-hidden">
        <Image
          src={collection.image.url}
          alt={collection.image.altText}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-3xl font-bold font-serif">{collection.title}</h3>
        </div>
      </div>
    </Link>
  );
}
