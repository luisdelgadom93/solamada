import Image from "next/image";
import Link from "next/link";
import { cocktails } from "@/lib/cocktails";

// Pick 4 showcase cocktails for the homepage preview
const FEATURED_SLUGS = ["paloma", "mojito", "aperol-spritz", "sangria-roja"];
const featuredDrinks = FEATURED_SLUGS.map((slug) => cocktails.find((c) => c.slug === slug)!).filter(Boolean);

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center bg-black text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-mobile-bar-setup.png"
            alt="Solamada mobile bar setup with crafted cocktails, fresh garnishes, and professional bar tools"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-2xl">
          <Image
            src="/images/logos/solamada-logo-blanco-sol.png"
            alt="Solamada"
            width={320}
            height={320}
            priority
            className="w-44 md:w-56 lg:w-64 h-auto"
          />

          {/* Tagline */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your event, elevated.
            </h1>
            <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-gold">
              Fresh Cocktails &nbsp;&middot;&nbsp; Mobile Bar &nbsp;&middot;&nbsp; TABC-certified bartender
            </p>
          </div>

          {/* CTAs — View Menu first (secondary), Get a Quote second (primary) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-pill border-2 border-white px-7 py-3.5 font-body text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              View Our Menu
            </Link>
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-pill bg-red px-7 py-3.5 font-body text-sm font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
              >
                Get a Quote
              </Link>
              <span className="text-white/50 text-xs">No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro / Brand Statement ── */}
      <section className="bg-warm-white py-20 md:py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-5">
            Houston&apos;s Mobile Bar Experience
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
            We bring the bar{" "}
            <span className="italic font-normal">right to your event.</span>
          </h2>
          <p className="text-warm-gray text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            Solamada is a professional mobile bar and bartending service serving Houston, TX and surrounding areas.
            We arrive with a beautiful bar setup, fresh juices, house-made syrups, and every garnish needed
            to craft the cocktails you&apos;ve chosen — all served by a TABC-certified bartender.
            You bring the spirits; we handle everything else at the bar.
          </p>

        </div>
      </section>

      {/* ── Dry Hire ── */}
      <section className="bg-black px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Clear, Simple &amp; Fully Supported
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            We Are Dry Hire
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-white/75">
            Solamada provides the full bartending experience, but{" "}
            <strong className="font-bold text-white">we do not provide or sell alcohol</strong>.
            You provide the spirits, and we take care of the rest. Don&apos;t worry about figuring out what to buy,{" "}
            <strong className="font-bold text-white">we&apos;ll create a customized liquor shopping list</strong>{" "}
            based on the cocktails you select and your event details.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white py-20 md:py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="font-mono text-xs text-gold tracking-widest uppercase mb-3">
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-black">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                step: "01",
                title: "Request a Quote",
                desc: "Tell us about your event — date, guest count, and which cocktails caught your eye. We'll get back to you with a custom proposal.",
              },
              {
                step: "02",
                title: "Finalize the Menu",
                desc: "Choose your cocktails from our curated menu. We'll guide your selection and provide a detailed alcohol shopping list.",
              },
              {
                step: "03",
                title: "Confirm & Deposit",
                desc: "Review your proposal, sign, and secure your date with a deposit. We'll confirm the details and save your date.",
              },
              {
                step: "04",
                title: "We Handle the Bar",
                desc: "We arrive, set up a beautiful bar, serve craft cocktails all evening, and handle full breakdown. You just celebrate.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <span className="font-mono text-sm font-medium text-gold tracking-wider">
                  {item.step}
                </span>
                <h3 className="font-display text-xl font-bold text-black">
                  {item.title}
                </h3>
                <p className="text-warm-gray text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Learn more link */}
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-widest text-black border-b-2 border-gold pb-0.5 hover:text-gold transition-colors duration-200"
            >
              See full service details & add-ons <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Signature Drinks Preview ── */}
      <section className="bg-black py-20 md:py-28 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-3">
            The Menu
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            A Menu Built for Celebration
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-12">
            From classic margaritas to bubbly spritz collections and crowd-pleasing sangrias — many with flavor variations to match your event&apos;s vibe.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {featuredDrinks.map((drink) => (
              <div
                key={drink.name}
                className="rounded-card overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                {drink.image ? (
                  <div className="relative w-full aspect-square">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center text-5xl"
                    style={{ background: `linear-gradient(135deg, ${drink.placeholderGradient[0]}, ${drink.placeholderGradient[1]})` }}
                    aria-hidden="true"
                  >
                    {drink.emoji}
                  </div>
                )}
                <div className="bg-white p-4 text-left">
                  <p className="font-display text-base font-bold text-black">
                    {drink.name}
                  </p>
                  <p className="text-xs text-warm-gray mt-0.5">{drink.baseSpirit}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-pill border-2 border-white px-8 py-4 font-body text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            Explore the Full Menu
          </Link>
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="bg-red py-20 md:py-24 px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Elevate Your Event?
          </h2>
          <p className="text-white/80 text-lg mb-6">
            Select your cocktails, tell us about your event, and we&apos;ll send you a custom quote.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 font-body text-base font-bold uppercase tracking-widest text-red transition-all duration-300 hover:bg-gold hover:text-white hover:shadow-btn-hover hover:-translate-y-0.5"
          >
            Get a Quote
          </Link>
          <p className="text-white/50 text-xs mt-3">No credit card required</p>
        </div>
      </section>
    </>
  );
}
