'use client';

import { useState } from 'react';
import { CONTACT } from '@/lib/constants';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main>
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-secondary mb-6">
            Reach Out
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light">Contact Us</h1>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-lg mx-auto px-6">
          {submitted ? (
            <div className="text-center py-12">
              <p className="font-serif text-2xl font-light mb-4">Thank you</p>
              <p className="text-text-secondary text-sm">
                We&apos;ve received your message and will respond within {CONTACT.responseTime}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-3" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-3" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.15em] mb-3" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border-b border-border bg-transparent py-3 text-sm h-32 resize-none focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white text-[11px] font-medium uppercase tracking-[0.25em] hover:bg-secondary transition-colors duration-300 disabled:opacity-50"
              >
                {submitting ? 'Sending\u2026' : 'Send Message'}
              </button>
            </form>
          )}

          <div className="mt-20 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Email</h3>
              <a href={`mailto:${CONTACT.email}`} className="text-text-secondary text-sm hover:text-primary transition-colors">
                {CONTACT.email}
              </a>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] mb-2">Phone</h3>
              <a href={CONTACT.phoneTel} className="text-text-secondary text-sm hover:text-primary transition-colors">
                {CONTACT.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
