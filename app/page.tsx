import CollectionCard from "./components/CollectionCard";
import ProductCard from "./components/ProductCard";
import { mockCollections, mockProducts } from "../lib/mock-data";

export default function Home() {
  return (
    <main>
      <section className="relative h-[calc(100vh-80px)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/9827020/pexels-photo-9827020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white bg-black bg-opacity-50">
          <h1 className="text-6xl font-bold font-serif">Graceful Threads</h1>
          <p className="mt-4 text-xl">Discover the art of South Asian couture</p>
          <button className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200">
            Shop Now
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">Best Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">About Label N</h2>
          <p className="max-w-2xl mx-auto">
            A brief and enticing introduction to the brand&apos;s story, vision, and craftsmanship. 
            Highlighting what makes Label N unique.
          </p>
          <button className="mt-8 px-8 py-3 border border-black rounded-full hover:bg-black hover:text-white">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}
