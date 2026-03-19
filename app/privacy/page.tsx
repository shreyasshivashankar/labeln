import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Label N',
  description: 'Label N privacy policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light">Privacy Policy</h1>
          <p className="text-text-secondary text-xs mt-6">Last updated: March 19, 2026</p>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <div className="space-y-12 text-text-secondary text-sm leading-[1.9]">
            <p>
              Label N operates this store and website, including all related information, content,
              features, tools, products and services, in order to provide you, the customer, with a
              curated shopping experience (the &ldquo;Services&rdquo;). Label N is powered by Shopify,
              which enables us to provide the Services to you. This Privacy Policy describes how we
              collect, use, and disclose your personal information when you visit, use, or make a
              purchase or other transaction using the Services or otherwise communicate with us.
            </p>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Personal Information We Collect</h2>
              <p className="mb-4">
                When we use the term &ldquo;personal information,&rdquo; we are referring to information
                that identifies or can reasonably be linked to you. We may collect the following
                categories of personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-primary">Contact details:</strong> name, address, billing address, shipping address, phone number, and email address.</li>
                <li><strong className="text-primary">Financial information:</strong> payment card information, transaction details, and payment confirmation.</li>
                <li><strong className="text-primary">Account information:</strong> username, password, preferences and settings.</li>
                <li><strong className="text-primary">Transaction information:</strong> items you view, add to cart, wishlist, purchase, return, exchange or cancel.</li>
                <li><strong className="text-primary">Communications:</strong> information you include in communications with us, such as customer support inquiries.</li>
                <li><strong className="text-primary">Device information:</strong> information about your device, browser, IP address, and other unique identifiers.</li>
                <li><strong className="text-primary">Usage information:</strong> how and when you interact with or navigate the Services.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-3">
                <li><strong className="text-primary">Provide &amp; improve the Services:</strong> Process payments, fulfill orders, manage your account, arrange shipping, facilitate returns and exchanges, and create a personalized shopping experience.</li>
                <li><strong className="text-primary">Marketing:</strong> Send promotional communications by email, text message, or postal mail. You may opt out at any time.</li>
                <li><strong className="text-primary">Security:</strong> Authenticate your account, detect fraudulent or illegal activity, and protect public safety.</li>
                <li><strong className="text-primary">Communication:</strong> Provide customer support and maintain our business relationship with you.</li>
                <li><strong className="text-primary">Legal reasons:</strong> Comply with applicable law, respond to valid legal process, and enforce our terms.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">How We Disclose Information</h2>
              <p>
                We may disclose your personal information to third parties in certain circumstances:
                with Shopify and service providers who perform services on our behalf; with business
                partners for marketing; when you direct us to; with our affiliates; and in connection
                with business transactions or legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Shopify</h2>
              <p>
                The Services are hosted by Shopify, which collects and processes personal information
                about your access to and use of the Services. Information you submit will be
                transmitted to and shared with Shopify as well as third parties located in countries
                other than where you reside.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Your Rights</h2>
              <p className="mb-4">Depending on where you live, you may have some or all of the following rights:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-primary">Right to Access:</strong> Request access to personal information we hold about you.</li>
                <li><strong className="text-primary">Right to Delete:</strong> Request that we delete personal information we maintain about you.</li>
                <li><strong className="text-primary">Right to Correct:</strong> Request that we correct inaccurate personal information.</li>
                <li><strong className="text-primary">Right of Portability:</strong> Receive a copy of your personal information in a portable format.</li>
                <li><strong className="text-primary">Right to Opt Out:</strong> Opt out of the sale or sharing of your personal information for targeted advertising.</li>
              </ul>
              <p className="mt-4">
                We will not discriminate against you for exercising any of these rights.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Children&apos;s Data</h2>
              <p>
                The Services are not intended to be used by children, and we do not knowingly collect
                any personal information about children under the age of majority.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">International Transfers</h2>
              <p>
                We may transfer, store and process your personal information outside the country you
                live in. If we transfer your personal information out of the European Economic Area or
                the United Kingdom, we will rely on recognized transfer mechanisms like the European
                Commission&apos;s Standard Contractual Clauses.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will post the revised Privacy
                Policy on this website and update the &ldquo;Last updated&rdquo; date.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-serif text-2xl font-light mb-4">Contact</h2>
              <p>
                Should you have any questions about our privacy practices or this Privacy Policy,
                please email us at{' '}
                <a href="mailto:labelnllc@gmail.com" className="text-primary border-b border-primary pb-0.5 hover:opacity-50 transition-opacity">
                  labelnllc@gmail.com
                </a>{' '}
                or contact us at 1378 Bridle Boulevard, Frisco, TX 75036, US.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
