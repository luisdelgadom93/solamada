import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Solamada for event inquiries, mobile bar bookings, and more. Based in Houston, TX.",
};

export default function ContactPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Hero */}
      <section className="bg-black text-white py-16 px-6 text-center">
        <p className="font-mono text-sm text-gold tracking-widest uppercase mb-4">
          We&apos;d Love to Hear From You
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
          Contact Us
        </h1>
        <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
          Have a question or ready to book? Reach out and we&apos;ll get back
          to you within 24 hours.
        </p>
      </section>

      {/* Contact Grid */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          {/* Contact Info */}
          <div className="w-full max-w-xl mx-auto">
            {/* Book CTA */}
            <div className="bg-warm-white rounded-card p-6 border border-light-gray">
              <h3 className="font-display text-lg font-bold text-black mb-2">
                Ready to book?
              </h3>
              <p className="text-warm-gray text-sm mb-4">
                Tell us about your event and your cocktail preferences — we&apos;ll put together a custom quote for you.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-pill bg-red px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Get a Quote
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full max-w-xl mx-auto bg-white rounded-card border border-light-gray shadow-card p-8">
            <div className="mb-8 pb-8 border-b border-light-gray">
              <p className="font-mono text-xs text-gold tracking-widest uppercase mb-3">
                Planning an Event?
              </p>
              <h2 className="font-display text-2xl font-bold text-black mb-3">
                Start With Get a Quote
              </h2>
              <p className="text-sm text-warm-gray leading-relaxed mb-5">
                Select your cocktails, share your event details, choose any extras,
                and send us everything we need to prepare your custom quote.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-pill bg-red px-6 py-3 font-body text-sm font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Get a Quote
              </Link>
            </div>

            <h2 className="font-display text-xl font-bold text-black mb-2">
              Have a Question?
            </h2>
            <p className="text-sm text-warm-gray leading-relaxed mb-6">
              Have a question before getting started? Send us a message below —
              we&apos;re happy to help.
            </p>
            <form className="space-y-5" action="#" method="POST">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Questions about our service, availability, cocktails, or anything else..."
                  required
                  className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-pill bg-red px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Send Message
              </button>
              <p className="text-xs text-warm-gray text-center">
                We&apos;ll respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
