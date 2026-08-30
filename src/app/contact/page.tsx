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
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-black mb-6">
                Get in Touch
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: "📸",
                    label: "Instagram",
                    value: "@solamada.bar",
                    href: "https://instagram.com/solamada.bar",
                    external: true,
                  },
                  {
                    icon: "📞",
                    label: "Phone",
                    value: "(786) 585-1769",
                    href: "tel:7865851769",
                    external: false,
                  },
                  {
                    icon: "📞",
                    label: "Phone (Alt)",
                    value: "(786) 212-0577",
                    href: "tel:7862120577",
                    external: false,
                  },
                  {
                    icon: "📍",
                    label: "Service Area",
                    value: "Houston & surrounding areas",
                    href: null,
                    external: false,
                  },
                ].map((contact) => (
                  <div key={contact.label} className="flex items-start gap-4">
                    <span className="text-2xl shrink-0">{contact.icon}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-0.5">
                        {contact.label}
                      </p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          target={contact.external ? "_blank" : undefined}
                          rel={contact.external ? "noopener noreferrer" : undefined}
                          className="text-black font-medium hover:text-red transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-black font-medium">{contact.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
          <div className="bg-white rounded-card border border-light-gray shadow-card p-8">
            <h2 className="font-display text-2xl font-bold text-black mb-6">
              Send a Message
            </h2>
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
                  htmlFor="event"
                  className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                >
                  Event Type
                </label>
                <input
                  id="event"
                  name="event"
                  type="text"
                  placeholder="Birthday, wedding, corporate event, bridal shower, holiday party? Tell us what you’re celebrating."
                  className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                >
                  Event Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black transition-colors focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2"
                >
                  Tell us about your event
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Guest count, venue, any questions…"
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
