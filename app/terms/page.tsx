import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Label N',
  description: 'Label N terms of service, including product policies and custom order terms.',
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light">Terms of Service</h1>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-12 text-text-secondary text-sm leading-[1.9]">
            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Overview</h2>
              <p>
                This website is operated by Label N. Throughout the site, the terms &ldquo;we&rdquo;,
                &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Label N. We offer this website,
                including all information, tools, and services available from this site to you, the
                user, conditioned upon your acceptance of all terms, conditions, policies, and notices
                stated here.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Products &amp; Custom Orders</h2>
              <p className="mb-4">
                We have made every effort to display as accurately as possible the colors and images
                of our products. We cannot guarantee that your computer monitor&apos;s display of any
                color will be accurate.
              </p>
              <p>
                <strong className="text-primary">Custom Outfits:</strong> These items are made
                specifically to your measurements. Because of this, they are final sale and cannot be
                returned or exchanged.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Accuracy of Billing</h2>
              <p>
                We reserve the right to refuse any order you place with us. In the event that we make
                a change to or cancel an order, we may attempt to notify you by contacting the email
                and/or billing address or phone number provided at the time the order was made.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Governing Law</h2>
              <p>
                These Terms of Service and any separate agreements whereby we provide you Services
                shall be governed by and construed in accordance with the laws of the United States.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Contact</h2>
              <p>
                Questions about the Terms of Service should be sent to us at{' '}
                <a href="mailto:labelnllc@gmail.com" className="text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                  labelnllc@gmail.com
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
