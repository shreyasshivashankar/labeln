import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { BRAND, FOUNDERS, SEO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About | ${BRAND.name}`,
  description: SEO.about,
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Our Story
          </p>
          <p className="font-serif text-xl md:text-2xl font-light text-text-secondary leading-relaxed italic">
            Where thread meets thought, and tradition finds tomorrow.
          </p>
        </div>
      </section>

      {/* Story — poetic narrative */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-6 text-text-secondary text-sm leading-[1.9]">
            <p>
              There is a quiet language in the way fabric falls — a whisper of hands that shaped it,
              of stories stitched into every seam. {BRAND.name} was born from that reverence. A belief that
              the garments we wear should carry meaning, not just beauty.
            </p>
            <p>
              We draw from the deep well of South Asian craftsmanship — the delicate patience of
              zardosi embroidery, the quiet rhythm of hand-loom silk, the warmth of generations passed
              down through needle and thread. And we shape these traditions with a modern eye, creating
              silhouettes that belong as much in the streets of New York as they do at a celebration
              back home.
            </p>
            <p>
              What we make is not fast. It is not mass-produced. Every {BRAND.name} piece is made to your
              exact measurements — because we believe that couture should never ask you to conform.
              It should meet you where you are, and make you feel like the most considered version of
              yourself.
            </p>
            <p>
              This is clothing as conversation — between heritage and the everyday, between artisan
              hands and the woman who wears their work. Between who you are and who you are becoming.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
            <div>
              <p className="font-serif text-2xl sm:text-4xl font-light mb-3">Pret</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Ready to Wear
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-4xl font-light mb-3">Couture</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Bespoke Craftsmanship
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-4xl font-light mb-3">Made to Measure</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-secondary">
                Tailored for You
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Letter */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
              A Note from Us
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light">From Our Hearts to Yours</h2>
          </div>

          <div className="space-y-6 text-text-secondary text-sm leading-[1.9] italic">
            <p>
              We started {BRAND.name} with a simple dream — to create something that felt like home,
              no matter where you wore it. Something that honored the hands that made it and the
              woman who chose it.
            </p>
            <p>
              Every collection is a love letter to the craft we grew up watching — our mothers&apos;
              dupattas, our grandmothers&apos; embroidery, the way light catches silk just right.
              We wanted to carry that forward, not as nostalgia, but as something alive and evolving.
            </p>
            <p>
              Thank you for being part of this journey. When you wear {BRAND.name}, you wear a piece
              of our story — and we hope it becomes a beautiful part of yours.
            </p>
          </div>

          {/* Founders Photo */}
          <div className="mt-10 flex flex-col items-center">
            <div className="relative w-64 h-80 mb-8">
              <Image
                src={FOUNDERS.photo}
                alt={`${FOUNDERS.names} — ${FOUNDERS.title}`}
                fill
                className="object-cover"
                sizes="256px"
              />
            </div>
            <p className="font-serif text-2xl font-light tracking-wide">
              {FOUNDERS.names}
            </p>
            <p className="font-serif text-lg text-secondary mt-1">&hearts;</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary mt-3">
              {FOUNDERS.title}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mb-10">
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
