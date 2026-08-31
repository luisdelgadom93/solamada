import type { Metadata } from "next";
import Link from "next/link";
import { cocktails } from "@/lib/cocktails";
import MenuClient from "@/components/menu/MenuClient";

export const metadata: Metadata = {
  title: "Cocktail Menu",
  description:
    "Explore Solamada's full cocktail menu — crafted drinks including classics, spritz, and sangria. Choose your favorites for your event.",
};

export default function MenuPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <p className="font-mono text-sm text-gold tracking-widest uppercase mb-4">
          Crafted Cocktails
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
          Our Cocktail Menu
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed mb-2">
          Your package includes{" "}
          <span className="text-gold font-semibold">2 signature cocktails</span>{" "}
          of your choice. We handle all the mixers, garnishes, and fresh juices
          — you bring the spirits.
        </p>
        <p className="text-white/40 text-sm">
          Want more variety? Add up to 2 additional cocktails via add-ons — mention it in your quote request.
        </p>
      </section>

      {/* Interactive menu — client component */}
      <MenuClient cocktails={cocktails} />

      {/* CTA */}
      <section className="bg-warm-white border-t border-light-gray py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-black mb-4">
            Ready to pick your cocktails?
          </h2>
          <p className="text-warm-gray mb-6">
            Book a free consultation and we&apos;ll help you choose the perfect
            combination for your event.
          </p>
          <Link
            href="/services#choose-experience"
            className="inline-flex items-center justify-center rounded-pill bg-red px-8 py-4 font-body text-base font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
          >
            Get a Quote
          </Link>
          <p className="text-warm-gray/60 text-xs mt-3">No credit card required</p>
        </div>
      </section>
    </main>
  );
}
