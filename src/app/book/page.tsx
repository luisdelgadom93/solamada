import type { Metadata } from "next";
import { cocktails } from "@/lib/cocktails";
import { packages } from "@/lib/packages";
import QuoteForm from "@/components/booking/QuoteForm";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a custom quote for your event. Select your cocktails and tell us the details — we'll get back to you within 24 hours.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const menuParam = params.menu;
  const initialSlugs =
    typeof menuParam === "string"
      ? menuParam.split(",").filter(Boolean)
      : [];
  const solamadaExperience = packages[0];

  return (
    <main className="pt-16 pb-8">
      {/* Hero */}
      <section className="bg-black text-white py-16 px-6 text-center">
        <p className="font-mono text-sm text-gold tracking-widest uppercase mb-4">
          No Credit Card Required
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
          Get a Quote
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
          Select the cocktails you love, tell us about your event, and we&apos;ll send you a custom proposal within 24 hours.
        </p>
      </section>

      {/* Base package overview */}
      <section className="bg-warm-white py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs text-gold tracking-widest uppercase mb-3">
            Your Starting Package
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-black mb-4">
            {solamadaExperience.name}
          </h2>
          <p className="text-warm-gray text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            {solamadaExperience.description}
          </p>

          <div className="bg-white rounded-card border-2 border-gold shadow-card p-7 md:p-10 text-left">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solamadaExperience.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-gold shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 10l4 4 8-8" />
                  </svg>
                  <span className="text-black text-sm leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-light-gray mt-8 pt-7 text-center">
              <p className="font-display text-3xl font-bold text-black mb-3">
                Starting at <span className="text-gold">$300</span>
              </p>
              <p className="text-sm text-warm-gray leading-relaxed max-w-2xl mx-auto">
                The Solamada Experience includes everything listed above. Any additional selections or services outside of the base experience will be considered add-ons or extras and may increase the final price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-step form */}
      <section className="py-12 bg-white">
        <QuoteForm cocktails={cocktails} initialSlugs={initialSlugs} />
      </section>
    </main>
  );
}
