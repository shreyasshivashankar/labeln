import type { Metadata } from 'next';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shipping | Label N',
  description: 'Label N shipping information, processing times, and order tracking.',
};

export default function ShippingPage() {
  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Delivery
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light">Shipping</h1>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-12 text-text-secondary text-sm leading-[1.9]">
            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Processing Times</h2>
              <p>
                All orders for ready-to-wear items are processed within 3 to 5 business days
                (excluding weekends and holidays) after receiving your order confirmation email.
                You will receive another notification when your order has shipped.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Custom Outfits</h2>
              <p>
                Custom outfits are handcrafted specifically for you and require additional production
                time. Please allow 2 to 3 weeks for custom orders to be created before they are
                shipped.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Domestic Shipping</h2>
              <p>
                Shipping charges for your order will be calculated and displayed at checkout.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">International Shipping</h2>
              <p>
                We offer international shipping worldwide. Please note that your order may be subject
                to import duties and taxes (including VAT), which are incurred once a shipment reaches
                your destination country. We are not responsible for these charges — they are your
                responsibility as the customer.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Order Tracking</h2>
              <p>
                When your order has shipped, you will receive an email notification with a tracking
                number you can use to check its status. Please allow 48 hours for the tracking
                information to become available.
              </p>
              <p className="mt-4">
                If you haven&apos;t received your order within 14 days of receiving your shipping
                confirmation email, please contact us at{' '}
                <a href={`mailto:${BRAND.email}`} className="text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                  {BRAND.email}
                </a>{' '}
                with your name and order number, and we will look into it for you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
