import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the team behind Solamada — a Houston-based mobile bar service born from Venezuelan roots. Learn the story behind the name.",
};

export default function AboutPage() {
  return (
    <main className="pt-28 pb-20">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-6 text-center">
        <p className="font-mono text-sm text-gold tracking-widest uppercase mb-4">
          Our Story
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
          About Solamada
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
          Born from Venezuelan roots. Built for Houston celebrations.
        </p>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-12">
            <Image
              src="/images/logos/solamada-logo-negro-sol.png"
              alt="Solamada"
              width={180}
              height={180}
              className="h-36 w-auto opacity-90"
            />
          </div>

          <div className="prose prose-lg max-w-none space-y-6 text-warm-gray leading-relaxed">
            <p className="text-xl text-black font-medium leading-relaxed">
              The name <em>Solamada</em> carries a story that starts thousands of miles away — in Maracaibo, Venezuela.
            </p>
            <p>
              Maracaibo is known as <em>&ldquo;La tierra del Sol amada&rdquo;</em> — the beloved land of the sun. It&apos;s a city of warmth, color, and a deep culture of gathering around good food, music, and drinks. <em>Sol Amada</em>: the beloved sun. That&apos;s where our name comes from, and it&apos;s the spirit we carry into every event we serve.
            </p>
            <p>
              We brought that Venezuelan warmth to Houston, TX — and turned it into a mobile bar experience. Solamada is a professional mobile bartending service for private and corporate events, built on the belief that the bar shouldn&apos;t just be functional — it should be an experience. If there&apos;s a reason to celebrate, we want to be a part of it.
            </p>
            <p>
              We work with you ahead of your event to define the cocktail menu — choosing from our curated selection of classics, spritz cocktails, and sangrias. On the day of the event, we arrive with everything needed to serve with craft and care: fresh juices, house-made syrups, garnishes, ice, and a TABC-certified bartender ready to bring it all to life. You bring the spirits; we take care of everything else at the bar.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-warm-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-black text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🍹",
                title: "Craft First",
                desc: "Every cocktail is made with fresh ingredients, house-made syrups, and real technique. No shortcuts, no pre-mixes — just well-made drinks.",
              },
              {
                icon: "☀️",
                title: "Warm Hospitality",
                desc: "We show up with energy, genuine care, and the soul of Venezuelan hospitality. We&apos;re not just behind the bar — we&apos;re part of your celebration.",
              },
              {
                icon: "🎯",
                title: "Built Around You",
                desc: "We customize everything to your event — the cocktail selection, the setup, the style. Your vision guides every decision we make.",
              },
            ].map((value) => (
              <div key={value.title} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  {value.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-black mb-6">
            Professional &amp; Certified
          </h2>
          <div className="inline-flex items-center gap-3 bg-white border border-light-gray rounded-card px-8 py-5 shadow-card">
            <span className="text-2xl">🏅</span>
            <div className="text-left">
              <p className="font-semibold text-black">TABC Certified</p>
              <p className="text-sm text-warm-gray">
                All Solamada bartenders are Texas Alcoholic Beverage
                Commission certified for responsible and professional service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to work together?
          </h2>
          <p className="text-white/70 mb-8">
            Tell us about your event and the cocktails you have in mind — we&apos;ll put together a quote just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-pill bg-gold px-8 py-4 font-body text-base font-bold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-light hover:shadow-btn-hover hover:-translate-y-0.5"
            >
              Get a Quote
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-pill border-2 border-white px-8 py-4 font-body text-base font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
