import type { Metadata } from 'next';
import { BRAND, CONTACT, CONTACT_ADDRESS_FULL, POLICY, SEO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Returns & Refunds | ${BRAND.name}`,
  description: SEO.returns,
};

export default function ReturnsPage() {
  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Policies
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light">Returns &amp; Refunds</h1>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-12 text-text-secondary text-sm leading-[1.9]">
            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Return Windows</h2>
              <p className="mb-4">
                We offer a general 14-day return policy for most items. However, please note the
                following specific timelines and exceptions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-primary">Ready-to-wear items:</strong> Eligible for return within {POLICY.returnWindow} of delivery.</li>
                <li><strong className="text-primary">Custom outfits:</strong> Because these are made specifically to your measurements and specifications, they are strictly final sale and cannot be returned or exchanged.</li>
              </ul>
              <p className="mt-4">
                To be eligible for a return, your item must be in the same condition that you received
                it — unworn or unused, with tags, and in its original packaging. You will also need
                the receipt or proof of purchase.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Return Shipping &amp; Restocking</h2>
              <p>
                We are pleased to offer free return shipping. Please note that all returns are subject
                to a {POLICY.restockingFee} restocking fee, which will be automatically deducted from your final refund
                amount.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">How to Start a Return</h2>
              <p className="mb-4">
                To start a return, please contact us at{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                  {CONTACT.email}
                </a>. Returns will need to be sent to the following address:
              </p>
              <p className="text-primary">
                {CONTACT_ADDRESS_FULL}
              </p>
              <p className="mt-4">
                If your return is accepted, we will send you a free return shipping label, as well as
                instructions on how and where to send your package. Items sent back to us without first
                requesting a return will not be accepted.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Damages &amp; Issues</h2>
              <p>
                Please inspect your order upon reception and contact us immediately if the item is
                defective, damaged, or if you receive the wrong item, so that we can evaluate the
                issue and make it right.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Non-Returnable Items</h2>
              <p>
                Custom products (such as special orders, custom outfits, or personalized items) cannot
                be returned. We also cannot accept returns on sale items or gift cards. Please get in
                touch if you have questions about your specific item.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Exchanges</h2>
              <p>
                The fastest way to ensure you get what you want is to return the item you have, and
                once the return is accepted, make a separate purchase for the new item.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">European Union — 14-Day Cooling Off Period</h2>
              <p>
                If the merchandise is being shipped into the European Union, you have the right to
                cancel or return your order within 14 days, for any reason and without justification.
                Your item must be in the same condition that you received it — unworn or unused, with
                tags, and in its original packaging. You will also need the receipt or proof of purchase.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Refunds</h2>
              <p>
                We will notify you once we have received and inspected your return, and let you know
                if the refund was approved. If approved, you will be automatically refunded on your
                original payment method (minus the {POLICY.restockingFee} restocking fee) within 10 business days. Please
                remember it can take some time for your bank or credit card company to process the
                refund.
              </p>
              <p className="mt-4">
                If more than 15 business days have passed since we approved your return, please
                contact us at{' '}
                <a href={`mailto:${CONTACT.email}`} className="text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                  {CONTACT.email}
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
