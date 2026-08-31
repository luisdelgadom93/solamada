import type { Metadata } from "next";
import Link from "next/link";
import { packages } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Solamada's Mobile Bar Experience and social Cocktail & Mixology Experience for private and corporate gatherings in Houston.",
};

// ── Icon components ────────────────────────────────────────────────────────

function IconBar() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <rect x="6" y="28" width="36" height="14" rx="2" />
      <path d="M10 28V18h28v10" />
      <path d="M6 18h36" />
      <path d="M16 28v-6M24 28v-6M32 28v-6" />
      <path d="M2 42h44" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <circle cx="24" cy="24" r="18" />
      <path d="M24 12v12l8 5" />
    </svg>
  );
}

function IconGlass() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <path d="M12 8h24l-6 20H18L12 8z" />
      <path d="M18 28v10M30 28v10" />
      <path d="M14 38h20" />
    </svg>
  );
}

function IconCup() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <path d="M14 10h20l-3 26H17L14 10z" />
      <path d="M11 16h4M33 16h4" />
      <path d="M17 36h14" />
      <path d="M20 10V7M28 10V7" />
    </svg>
  );
}

function IconCocktail() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <path d="M10 8h28L24 28v12" />
      <path d="M18 40h12" />
      <path d="M10 8l14 14" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <rect x="10" y="10" width="28" height="34" rx="2" />
      <path d="M18 10V7h12v3" />
      <path d="M16 22h16M16 28h10M16 34h12" />
    </svg>
  );
}

function IconEnvelope() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <rect x="6" y="12" width="36" height="26" rx="2" />
      <path d="M6 14l18 14L42 14" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto">
      <path d="M14 18V14a10 10 0 0120 0v4" />
      <rect x="8" y="18" width="32" height="24" rx="2" />
      <path d="M18 28h12" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

const addOns = [
  {
    icon: <IconBar />,
    name: "Solamada Signature Mobile Bar Stand",
    desc: "Our custom bar brings the look and feel to your event.",
  },
  {
    icon: <IconClock />,
    name: "Additional Service Hours",
    desc: "Extend the fun with extra service time.",
  },
  {
    icon: <IconGlass />,
    name: "Premium Drinkware",
    desc: "Upgrade to premium glassware instead of plastic.",
  },
  {
    icon: <IconCup />,
    name: "Soft Drinks & Non-Alcoholic Drinks",
    desc: "Coke, Sprite, juices, iced tea, lemonade & more. You choose — we bring and serve, or you provide and we serve.",
  },
  {
    icon: <IconCocktail />,
    name: "Additional Cocktails",
    desc: "Expand your selection beyond 2 — add up to 2 more cocktails to your package.",
  },
];

const bookingSteps = [
  {
    num: "01",
    icon: <IconClipboard />,
    title: "Request a Quote",
    desc: "Share your event details, guest count, and select your included cocktails plus any add-ons you'd like. We'll create a custom quote for you.",
    extra: null,
  },
  {
    num: "02",
    icon: <IconEnvelope />,
    title: "Review & Reserve",
    desc: "You'll receive your personalized quote by email. Approve it to secure your date with a 20% non-refundable deposit. We'll confirm and save your date.",
    extra: null,
  },
  {
    num: "03",
    icon: <IconBag />,
    title: "Prepare for the Event",
    desc: "We'll send you a detailed spirits shopping guide based on your guest count and selected cocktails. Remaining payments are made before the event.",
    extra: [
      { pct: "20%", label: "To reserve your date" },
      { pct: "30%", label: "1 week before the event" },
      { pct: "50%", label: "The day before the event" },
    ],
  },
  {
    num: "04",
    icon: <IconGlass />,
    title: "We Handle the Bar",
    desc: "We arrive, set up our bar, craft and serve your cocktails during the event, and handle the full breakdown. You just enjoy the experience.",
    extra: null,
  },
];

export default function ServicesPage() {
  const solamadaExperience = packages[0];

  return (
    <main className="pt-28 pb-20">

      {/* ── Experience Selector ── */}
      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-gold">
            Choose Your Experience
          </p>
          <h1 className="mb-4 font-display text-5xl font-bold md:text-6xl">
            Two Ways to Celebrate
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Whether you want the bar fully handled or want to make cocktails together,
            Solamada brings the craft, warmth, and atmosphere to your gathering.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <a
              href="#mobile-bar"
              className="group rounded-card border border-white/20 bg-white/5 p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white/10"
            >
              <div className="mb-5 inline-flex rounded-full bg-gold/15 p-3">
                <IconBar />
              </div>
              <h2 className="mb-2 font-display text-2xl font-bold text-white">
                Mobile Bar Experience
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-white/65">
                A full-service bartending experience for your event.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-gold">
                Explore the experience ↓
              </span>
            </a>

            <a
              href="#mixology"
              className="group rounded-card border border-white/20 bg-white/5 p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white/10"
            >
              <div className="mb-5 inline-flex rounded-full bg-gold/15 p-3">
                <IconCocktail />
              </div>
              <h2 className="mb-2 font-display text-2xl font-bold text-white">
                Cocktail &amp; Mixology Experience
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-white/65">
                An interactive cocktail-making gathering combining mixology, drinks, and music.
              </p>
              <span className="text-xs font-bold uppercase tracking-widest text-gold">
                Explore the experience ↓
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Section 1: Our Signature Package ── */}
      <section id="mobile-bar" className="scroll-mt-24 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-4">
            Our Signature Package
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-black mb-4">
            {solamadaExperience.name}
          </h2>
          <p className="text-warm-gray text-lg max-w-xl mx-auto leading-relaxed mb-10">
            {solamadaExperience.description}
          </p>

          {/* Feature grid in bordered box */}
          <div className="bg-white rounded-card border-2 border-gold shadow-card p-8 md:p-10 text-left mb-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solamadaExperience.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10l4 4 8-8" />
                  </svg>
                  <span className="text-black text-sm leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Callout */}
          <div className="bg-gold/10 border border-gold/30 rounded-card px-6 py-4 flex items-center gap-3 text-left">
            <span className="text-gold text-lg shrink-0">✦</span>
            <p className="text-sm font-semibold text-black">
              Start with The Solamada Experience, then customize it with add-ons below.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 2: Add-Ons ── */}
      <section className="bg-warm-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-4">
            Make It Yours
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            Customize With Add-Ons
          </h2>
          <p className="text-warm-gray text-base max-w-lg mx-auto mb-12">
            Enhance your bar experience with add-ons.
            You choose what fits your event.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="bg-white rounded-card p-6 shadow-card border border-light-gray text-center"
              >
                <div className="mb-4">{addon.icon}</div>
                <h3 className="font-display text-base font-bold text-black mb-2">
                  {addon.name}
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed">{addon.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-warm-gray mt-8">
            Pricing for add-ons is included in your custom quote. A travel fee may apply depending on your event location.
          </p>
        </div>
      </section>

      {/* ── Section 3: How Booking Works ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-4">
            Simple &amp; Clear
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-14">
            How Booking Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
            {bookingSteps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center relative">
                {/* Dotted connector line — desktop only */}
                {i < bookingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-[-50%] border-t-2 border-dashed border-gold/30" />
                )}
                <span className="font-mono text-sm font-bold text-gold mb-3">{step.num}</span>
                <div className="mb-4">{step.icon}</div>
                <h3 className="font-display text-lg font-bold text-black mb-2">{step.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{step.desc}</p>
                {step.extra && (
                  <ul className="mt-4 space-y-1 text-left w-full max-w-[180px] mx-auto">
                    {step.extra.map((row) => (
                      <li key={row.pct} className="flex items-baseline gap-2">
                        <span className="font-mono text-sm font-bold text-gold shrink-0">{row.pct}</span>
                        <span className="text-xs text-warm-gray">{row.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-pill border-2 border-black px-10 py-4 font-body text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              Request a Quote
            </Link>
            <p className="text-xs text-warm-gray">Let&apos;s start planning your perfect bar.</p>
          </div>
        </div>
      </section>

      {/* ── Section 4: Cocktail & Mixology Experience ── */}
      <section id="mixology" className="scroll-mt-24 bg-warm-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-gold">
              Shake, Learn, Sip &amp; Enjoy
            </p>
            <h2 className="mb-4 font-display text-4xl font-bold text-black md:text-5xl">
              Cocktail &amp; Mixology Experience
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-warm-gray">
              Turn your gathering into an interactive cocktail experience made for
              birthdays, friend groups, private celebrations, and corporate gatherings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-card border border-light-gray bg-white p-7 shadow-card md:p-9">
              <div className="space-y-5 text-sm leading-relaxed text-warm-gray md:text-base">
                <p>
                  Choose up to <strong className="text-black">3 classic cocktails</strong> from
                  the Solamada menu and learn how to prepare them step-by-step while making
                  and enjoying your own drinks.
                </p>
                <p>
                  We guide the group through the ingredients, techniques, proportions,
                  tools, and little details that make each cocktail come together.
                </p>
                <p>
                  This is not a rigid class. After preparing each drink, everyone gets time
                  to relax, enjoy their creation, talk, and have fun while Solamada keeps the
                  atmosphere going with music. When the group is ready, we come back together
                  and learn the next cocktail.
                </p>
              </div>

              <div className="mt-7 rounded-card border border-gold/30 bg-gold/10 p-5">
                <p className="font-display text-lg font-bold text-black">
                  DJ &amp; music ambiance is included.
                </p>
                <p className="mt-1 text-sm text-warm-gray">
                  The experience stays social, relaxed, and moving at your group&apos;s pace.
                </p>
              </div>
            </div>

            <div className="rounded-card bg-black p-7 text-white shadow-card md:p-9">
              <p className="mb-6 font-mono text-xs uppercase tracking-widest text-gold">
                The Rhythm of the Experience
              </p>
              <div className="mb-8 flex flex-wrap items-center gap-2 font-display text-xl font-bold">
                {['Learn', 'Make', 'Sip', 'Music', 'Repeat'].map((item, index) => (
                  <span key={item} className="contents">
                    <span>{item}</span>
                    {index < 4 && <span className="text-gold">→</span>}
                  </span>
                ))}
              </div>

              <ol className="space-y-5">
                {[
                  'We introduce a cocktail and demonstrate how to make it.',
                  'Everyone prepares their own drink with our guidance.',
                  'The group sips and socializes with DJ and music ambiance.',
                  'After about 20–30 minutes, we gather for the next cocktail.',
                ].map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70">
                    <span className="font-mono font-bold text-gold">0{index + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <Link
                href="/book?experience=mixology"
                className="mt-9 inline-flex w-full items-center justify-center rounded-pill bg-red px-7 py-4 font-body text-sm font-bold uppercase tracking-widest text-white shadow-btn transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold hover:shadow-btn-hover"
              >
                Get a Mixology Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
