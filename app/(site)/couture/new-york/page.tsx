import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Couture — New York | Label N',
  description: 'Label N Couture in New York. Coming soon.',
};

export default function CoutureNewYorkPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
          Couture
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light mb-6">New York</h1>
        <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
          Coming soon. Stay tuned for our New York couture experience.
        </p>
      </div>
    </main>
  );
}
