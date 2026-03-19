import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Label N',
  description: 'The story behind Label N — bespoke South Asian couture.',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-8">About Label N</h1>
          <p className="font-serif text-xl md:text-2xl font-light text-text-secondary leading-relaxed">
            A celebration of South Asian heritage reinterpreted for the modern wardrobe.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-8 text-text-secondary text-sm leading-[1.9]">
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
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
            <div>
              <p className="font-serif text-4xl font-light mb-3">100%</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Made to Measure
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl font-light mb-3">Artisan</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Handcrafted with Care
              </p>
            </div>
            <div>
              <p className="font-serif text-4xl font-light mb-3">Global</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Shipped Worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light mb-10">
            Let&apos;s Create Something Beautiful
          </h2>
          <Link
            href="/contact"
            className="inline-block px-10 py-3.5 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
