'use client';

import { useState } from 'react';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/labeln';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire up to email API or Supabase contact_messages table
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-600 mb-10">
          Have a question or want to book a custom consultation? We&apos;d love to hear from you.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-lg">
            <h2 className="font-bold text-xl mb-2">Message sent!</h2>
            <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border rounded-lg p-3 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-10">
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-gray-600 text-sm">info@labeln.com</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Book a Consultation</h3>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 text-sm hover:opacity-80"
            >
              Schedule via Calendly →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
