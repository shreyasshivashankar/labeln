import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Label N',
  description: 'The story behind Label N — bespoke South Asian couture.',
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">Our Story</h1>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Label N is a celebration of South Asian heritage reinterpreted for the modern wardrobe.
        </p>

        <div className="space-y-6 text-gray-700 leading-loose">
          <p>
            Born from a desire to bridge tradition and contemporary aesthetics, Label N creates
            garments that honor the artistry of South Asian craftsmanship while embracing the
            sensibilities of a global citizen.
          </p>
          <p>
            Each piece is handcrafted using time-honored techniques — from delicate zardosi
            embroidery to fine silk weaving — and finished with modern tailoring that moves with
            your lifestyle. We work with master artisans across India and Pakistan to ensure that
            every thread tells a story.
          </p>
          <p>
            What truly sets Label N apart is our commitment to fit. We believe that couture should
            not demand that you conform to it. Through our bespoke measurement process, every
            garment is tailored precisely to your body, ensuring comfort, confidence, and elegance
            in equal measure.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">100%</h3>
            <p className="text-gray-600 text-sm">Made to measure</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">Artisan</h3>
            <p className="text-gray-600 text-sm">Handcrafted with care</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <h3 className="text-3xl font-bold text-primary mb-2">Global</h3>
            <p className="text-gray-600 text-sm">Shipped worldwide</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-white rounded-full hover:opacity-90 transition"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </main>
  );
}
