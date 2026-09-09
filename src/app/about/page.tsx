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
      <section className="relative overflow-clip bg-black text-white">
        <Image
          src="/images/about/lake-maracaibo-bridge-v7-desktop-4k.png"
          alt="Lake Maracaibo and the General Rafael Urdaneta Bridge beneath a bright golden-hour sky"
          fill
          sizes="100vw"
          className="hidden object-cover object-bottom md:block"
          priority
          unoptimized
        />
        <Image
          src="/images/about/lake-maracaibo-bridge-v7-mobile-4k.png"
          alt="Lake Maracaibo and the General Rafael Urdaneta Bridge beneath a bright golden-hour sky"
          fill
          sizes="100vw"
          className="object-cover object-center md:hidden"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/25" aria-hidden="true" />

        <div className="relative z-10 py-20 px-6 text-center">
          <p className="font-mono text-sm text-gold tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 drop-shadow-md">
            About Solamada
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Born from Venezuelan roots. Made for moments that bring people together.
          </p>
        </div>

      {/* Maracaibo story opener */}
        <div className="sticky top-20 z-20 flex justify-center py-8 md:top-24 md:py-10">
          <div className="px-6 py-4">
            <Image
              src="/images/logos/solamada-logo-blanco-sol.png"
              alt="Solamada"
              width={180}
              height={180}
              className="h-36 w-auto"
              priority
            />
          </div>
        </div>

        <div className="relative -mt-4 h-[92svh] min-h-[620px] overflow-hidden md:-mt-8 md:h-[110svh] md:min-h-[760px]">
          <p className="absolute bottom-6 left-1/2 w-[calc(100%-3rem)] -translate-x-1/2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/80 drop-shadow-md md:bottom-8 md:text-xs">
            Lake Maracaibo • Maracaibo, Zulia, Venezuela
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-6 md:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none space-y-6 text-warm-gray leading-relaxed">
            <p className="text-xl text-black font-medium leading-relaxed">
              The name <em>Solamada</em> carries a story that starts thousands of miles away — in Maracaibo, Venezuela.
            </p>
            <p>
              <strong>Solamada was born from our roots in Maracaibo, Venezuela</strong>, a city known as <em>&ldquo;La Tierra del Sol Amada,&rdquo;</em> or the beloved land of the sun. It&apos;s a place of warmth, color, and a deep culture of gathering with family and friends over music, drinks, and good food. Our name comes from bringing together the last two words of that phrase, <em>Sol Amada</em>, carrying a little piece of where we come from into every event we serve.
            </p>
            <p>
              Today, we bring that Venezuelan warmth to your event through a mobile bar experience built around more than just serving drinks. At Solamada, we believe the bar shouldn&apos;t just be functional. <strong>It should be part of the experience.</strong> If there&apos;s a reason to celebrate, we want to be a part of it.
            </p>
            <p>
              We work with you ahead of your event to create the cocktail menu, choosing from our curated selection of classics, spritzes, sangrias, and signature cocktails. On the day of the event, we arrive ready to bring it all to life with fresh juices, house-made syrups, garnishes, ice, and a TABC-certified bartender serving every drink with craft and care.
            </p>
            <p>
              <strong>You bring the spirits. We take care of everything else at the bar.</strong>
            </p>
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
              href="/services#choose-experience"
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
