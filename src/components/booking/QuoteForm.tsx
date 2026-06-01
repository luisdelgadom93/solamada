"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/cocktails";
import type { QuotePayload } from "@/app/api/quote/route";

const INCLUDED_MAX = 2;
const INCLUDED_WITH_VARIANT = "Each included cocktail comes with one flavor variation (if available).";

// ── Step 1: Cocktail card ──────────────────────────────────────────────────

function CocktailCard({
  cocktail,
  selected,
  selectionIndex,
  selectedVariant,
  onToggle,
  onVariantSelect,
}: {
  cocktail: Cocktail;
  selected: boolean;
  selectionIndex: number;
  selectedVariant?: string;
  onToggle: (slug: string) => void;
  onVariantSelect: (slug: string, variant: string) => void;
}) {
  const isExtra = selected && selectionIndex >= INCLUDED_MAX;
  const isIncluded = selected && selectionIndex < INCLUDED_MAX;
  const hasVariants = cocktail.variants && cocktail.variants.length > 0;

  return (
    <div
      className={`
        relative rounded-card overflow-hidden border transition-all duration-300 cursor-pointer
        ${selected
          ? "border-gold shadow-[0_0_0_2px_#D4A017] scale-[1.02]"
          : "border-light-gray shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-gold/50"}
      `}
      onClick={() => onToggle(cocktail.slug)}
    >
      {/* Photo or gradient placeholder */}
      <div className="relative">
        {cocktail.image ? (
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={cocktail.image}
              alt={cocktail.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div
            className="w-full aspect-square flex items-center justify-center text-4xl select-none"
            style={{ background: `linear-gradient(135deg, ${cocktail.placeholderGradient[0]}, ${cocktail.placeholderGradient[1]})` }}
            aria-hidden="true"
          >
            {cocktail.emoji}
          </div>
        )}

        {/* Selection overlay */}
        <div className={`absolute inset-0 flex items-end justify-end p-2 transition-all duration-200 ${selected ? "bg-gold/20" : "bg-black/10"}`}>
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shadow ${selected ? "bg-gold border-gold text-white" : "bg-white/90 border-white/60"}`}>
            {selected && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        {isIncluded && (
          <div className="absolute top-2 left-2 bg-gold text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            ✓ Included
          </div>
        )}
        {isExtra && (
          <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            + Extra
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="bg-white p-4">
        <h3 className="font-display text-base font-bold text-black mb-0.5">{cocktail.name}</h3>
        <p className="text-xs text-warm-gray leading-relaxed mb-3">
          {cocktail.ingredients.join(" · ")}
        </p>

        {/* Variant selector — only show when selected and has variants */}
        {selected && hasVariants && (
          <div
            className="mt-1"
            onClick={(e) => e.stopPropagation()} // don't deselect when clicking variants
          >
            <p className="text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Pick a flavor:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cocktail.variants!.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => onVariantSelect(cocktail.slug, variant)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 ${
                    selectedVariant === variant
                      ? "bg-gold text-white"
                      : "bg-warm-white border border-light-gray text-warm-gray hover:border-gold hover:text-gold"
                  }`}
                >
                  {variant}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function QuoteForm({
  cocktails,
  initialSlugs = [],
}: {
  cocktails: Cocktail[];
  initialSlugs?: string[];
}) {
  // ── Step state ──
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Step 1: Cocktail selection ──
  const [selected, setSelected] = useState<string[]>(() =>
    initialSlugs.filter((s) => cocktails.some((c) => c.slug === s))
  );
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // ── Step 2: Event details ──
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    location: "",
    notes: "",
  });

  const toggleDrink = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) {
        // Deselecting — also clear variant
        setSelectedVariants((v) => {
          const next = { ...v };
          delete next[slug];
          return next;
        });
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  }, []);

  const setVariant = useCallback((slug: string, variant: string) => {
    setSelectedVariants((prev) => ({ ...prev, [slug]: variant }));
  }, []);

  const includedCount = Math.min(selected.length, INCLUDED_MAX);
  const extraCount = Math.max(0, selected.length - INCLUDED_MAX);
  const remaining = Math.max(0, INCLUDED_MAX - selected.length);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const cocktailMap = new Map(cocktails.map((c) => [c.slug, c]));
    const payload: QuotePayload = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      eventDate: form.eventDate || undefined,
      eventType: form.eventType || undefined,
      guestCount: form.guestCount || undefined,
      location: form.location || undefined,
      notes: form.notes || undefined,
      cocktails: selected.map((slug, i) => {
        const c = cocktailMap.get(slug);
        return {
          name: c?.name ?? slug,
          variant: selectedVariants[slug],
          tag: i < INCLUDED_MAX ? "Included" : "Extra",
        };
      }),
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["classic", "spritz", "sangria"] as const;
  const categoryLabels = {
    classic: { title: "Classics", desc: "Timeless cocktails with a Solamada twist." },
    spritz: { title: "Spritz Collection", desc: "Light, bubbly, and perfect for celebrations." },
    sangria: { title: "Sangrias", desc: "Crowd-pleasing pitchers crafted with fresh fruits." },
  };

  // ── Step indicator ──
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-10">
      {([1, 2] as const).map((s) => (
        <div key={s} className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              s === step
                ? "bg-gold text-white"
                : s < step
                ? "bg-black text-white"
                : "bg-light-gray text-warm-gray"
            }`}
          >
            {s < step ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : s}
          </div>
          <span className={`text-sm font-medium hidden sm:block ${s === step ? "text-black" : "text-warm-gray"}`}>
            {s === 1 ? "Choose Cocktails" : "Event Details"}
          </span>
          {s < 2 && <div className="w-8 h-0.5 bg-light-gray hidden sm:block" />}
        </div>
      ))}
    </div>
  );

  // ── Success screen ─────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-bold text-black mb-3">
            Request received!
          </h2>
          <p className="text-warm-gray text-base leading-relaxed mb-2">
            Thanks, <strong>{form.name}</strong>. We&apos;ll review your event details and get back to you within 24 hours with a custom quote.
          </p>
          <p className="text-warm-gray/70 text-sm mb-8">
            A confirmation has been sent to <span className="font-medium text-black">{form.email}</span>.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-pill border-2 border-black px-8 py-3 font-body text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // ── Step 1 ─────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div>
        <StepIndicator />

        {/* Instruction */}
        <div className="text-center mb-8 max-w-xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-black mb-2">
            Choose your cocktails
          </h2>
          <p className="text-warm-gray text-sm">
            Your package includes <span className="font-semibold text-black">{INCLUDED_MAX} cocktails</span> — each with one flavor variation if available. You can add more at custom pricing.
          </p>
          <p className="text-warm-gray/70 text-xs mt-1">{INCLUDED_WITH_VARIANT}</p>
        </div>

        {/* Selection progress bar */}
        <div className="sticky top-14 z-30 bg-black">
          <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: INCLUDED_MAX }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all duration-200 ${i < includedCount ? "bg-gold" : "bg-white/25"}`}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-sm">
                {selected.length === 0
                  ? "Tap a cocktail to select it"
                  : includedCount < INCLUDED_MAX
                  ? `${includedCount} of ${INCLUDED_MAX} selected — ${remaining} more included`
                  : extraCount > 0
                  ? `${INCLUDED_MAX} included + ${extraCount} extra`
                  : `${INCLUDED_MAX} of ${INCLUDED_MAX} included`}
              </span>
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-pill px-5 py-2 font-body text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                selected.length > 0
                  ? "bg-gold text-white hover:bg-gold-light"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              Next: Event Details <span>→</span>
            </button>
          </div>
        </div>

        {/* Cocktail grid */}
        <div className="pb-20">
          {categories.map((cat) => {
            const drinks = cocktails.filter((c) => c.category === cat);
            const { title, desc } = categoryLabels[cat];
            return (
              <section key={cat} className="py-14 max-w-5xl mx-auto px-6">
                <div className="mb-8">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-black mb-1">
                    {title}
                  </h3>
                  <p className="text-warm-gray text-base">{desc}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {drinks.map((cocktail) => {
                    const selectionIndex = selected.indexOf(cocktail.slug);
                    return (
                      <CocktailCard
                        key={cocktail.slug}
                        cocktail={cocktail}
                        selected={selectionIndex !== -1}
                        selectionIndex={selectionIndex}
                        selectedVariant={selectedVariants[cocktail.slug]}
                        onToggle={toggleDrink}
                        onVariantSelect={setVariant}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Floating CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 shadow-2xl">
          <div className="mx-auto max-w-lg px-6 pt-4 pb-6 flex flex-col gap-3">
            <div className="text-center">
              {selected.length === 0 ? (
                <p className="text-white/50 text-sm">Select at least one cocktail to continue.</p>
              ) : extraCount === 0 ? (
                <p className="text-white font-semibold text-sm">
                  <span className="text-gold font-bold">{includedCount}</span> cocktail{includedCount !== 1 ? "s" : ""} selected
                  {remaining > 0 && <span className="text-white/50 font-normal"> — {remaining} more included</span>}
                </p>
              ) : (
                <p className="text-white font-semibold text-sm">
                  <span className="text-gold font-bold">{INCLUDED_MAX} included</span>
                  <span className="text-white/40"> + </span>
                  <span className="text-white font-bold">{extraCount} extra</span>
                  <span className="text-white/40 text-xs font-normal"> — pricing confirmed in your quote</span>
                </p>
              )}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-pill py-4 font-body text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                selected.length > 0
                  ? "bg-gold text-white hover:bg-gold-light hover:-translate-y-0.5"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {selected.length === 0 ? "Select cocktails to continue" : <>Next: Event Details <span>→</span></>}
            </button>
            <p className="text-center text-white/30 text-xs -mt-1">
              No credit card required &middot; Selection can be adjusted
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2 ─────────────────────────────────────────────────────────────

  const cocktailMap = new Map(cocktails.map((c) => [c.slug, c]));
  const includedDrinks = selected.slice(0, INCLUDED_MAX);
  const extraDrinks = selected.slice(INCLUDED_MAX);

  return (
    <div className="max-w-2xl mx-auto px-6 pb-20">
      <StepIndicator />

      {/* Cocktail summary */}
      <div className="bg-warm-white rounded-card border border-light-gray p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-warm-gray">
            Your cocktail selection
          </p>
          <button
            onClick={() => setStep(1)}
            className="text-xs font-bold text-gold hover:text-gold-light transition-colors uppercase tracking-wider"
          >
            Edit ↩
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {includedDrinks.map((slug) => {
            const c = cocktailMap.get(slug);
            if (!c) return null;
            const variant = selectedVariants[slug];
            return (
              <span key={slug} className="inline-flex items-center gap-1.5 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {c.emoji} {c.name}{variant ? ` · ${variant}` : ""}
                <span className="text-white/70 font-normal">Included</span>
              </span>
            );
          })}
          {extraDrinks.map((slug) => {
            const c = cocktailMap.get(slug);
            if (!c) return null;
            const variant = selectedVariants[slug];
            return (
              <span key={slug} className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {c.emoji} {c.name}{variant ? ` · ${variant}` : ""}
                <span className="text-white/60 font-normal">Extra</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Event details form */}
      <h2 className="font-display text-2xl font-bold text-black mb-6">
        Tell us about your event
      </h2>

      <div className="space-y-5">
        {/* Name + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Your Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Email <span className="text-red">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
            Phone (optional)
          </label>
          <input
            type="tel"
            placeholder="(713) 000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
          />
        </div>

        {/* Date + Event type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Event Date
            </label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black transition-colors focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Event Type
            </label>
            <select
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black transition-colors focus:border-gold focus:outline-none bg-white"
            >
              <option value="">Select type…</option>
              <option>Birthday Party</option>
              <option>Wedding / Reception</option>
              <option>Corporate Event</option>
              <option>Bachelorette / Bachelor Party</option>
              <option>Holiday Party</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Guest count + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Approximate Guest Count
            </label>
            <select
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black transition-colors focus:border-gold focus:outline-none bg-white"
            >
              <option value="">Select range…</option>
              <option>Under 20</option>
              <option>20 – 40</option>
              <option>41 – 75</option>
              <option>76 – 100</option>
              <option>100+</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Event City / Location
            </label>
            <input
              type="text"
              placeholder="Houston, TX"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
            Anything else we should know?
          </label>
          <textarea
            rows={4}
            placeholder="Venue type, vibe, questions, special requests…"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!form.name || !form.email || submitting}
            onClick={handleSubmit}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-pill py-4 font-body text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
              form.name && form.email && !submitting
                ? "bg-red text-white shadow-btn hover:bg-gold hover:shadow-btn-hover hover:-translate-y-0.5"
                : "bg-light-gray text-warm-gray cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Sending…
              </>
            ) : (
              <>Send Quote Request ✦</>
            )}
          </button>
          {submitError && (
            <p className="text-center text-sm text-red mt-3 font-medium">{submitError}</p>
          )}
          <p className="text-center text-xs text-warm-gray mt-3">
            No credit card required &middot; We&apos;ll respond within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}
