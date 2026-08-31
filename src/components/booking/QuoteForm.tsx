"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/cocktails";
import { addOns as availableAddOns, packages } from "@/lib/packages";
import type { QuotePayload } from "@/app/api/quote/route";

const INCLUDED_MAX = 2;
const INCLUDED_HOURS = packages[0]?.minHours ?? 3;
const ADDITIONAL_COCKTAILS = "Additional cocktails";
const ADDITIONAL_SERVICE_HOUR = "Additional service hour";
const SOFT_DRINKS = "Soft drinks";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getFlavorOptions = (cocktail: Cocktail) =>
  cocktail.variants?.map((variant) => variant === "Original" ? "Classic" : variant) ?? [];

// ── Step 1: Cocktail card ──────────────────────────────────────────────────

function CocktailCard({
  cocktail,
  selected,
  selectionIndex,
  selectedVariants,
  onToggle,
  onVariantSelect,
}: {
  cocktail: Cocktail;
  selected: boolean;
  selectionIndex: number;
  selectedVariants: string[];
  onToggle: (slug: string) => void;
  onVariantSelect: (slug: string, variant: string) => void;
}) {
  const isExtra = selected && selectionIndex >= INCLUDED_MAX;
  const isIncluded = selected && selectionIndex < INCLUDED_MAX;
  const flavorOptions = getFlavorOptions(cocktail);
  const hasVariants = flavorOptions.length > 0;

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
              {isExtra ? "Choose flavors · cocktail add-on:" : "Choose flavors · 2 included:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {flavorOptions.map((variant) => {
                const flavorIndex = selectedVariants.indexOf(variant);
                const isSelected = flavorIndex !== -1;
                const isFlavorExtra = isSelected && (isExtra || flavorIndex >= 2);
                return (
                <button
                  key={variant}
                  type="button"
                  onClick={() => onVariantSelect(cocktail.slug, variant)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 ${
                    isSelected
                      ? isFlavorExtra
                        ? "bg-black text-white"
                        : "bg-gold text-white"
                      : "bg-warm-white border border-light-gray text-warm-gray hover:border-gold hover:text-gold"
                  }`}
                >
                  {variant}
                  {isSelected && (
                    <span className={`font-normal ${isFlavorExtra ? "text-white/60" : "text-white/75"}`}>
                      {isFlavorExtra ? "Add-on" : "Included"}
                    </span>
                  )}
                </button>
                );
              })}
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
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      initialSlugs.flatMap((slug) => {
        const cocktail = cocktails.find((item) => item.slug === slug);
        return cocktail && getFlavorOptions(cocktail).length > 0 ? [[slug, ["Classic"]]] : [];
      })
    )
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [softDrinkPreferences, setSoftDrinkPreferences] = useState("");

  // ── Step 2: Event details ──
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventTime: "",
    eventDuration: String(INCLUDED_HOURS),
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
      const cocktail = cocktails.find((item) => item.slug === slug);
      if (cocktail && getFlavorOptions(cocktail).length > 0) {
        setSelectedVariants((variants) => ({ ...variants, [slug]: ["Classic"] }));
      }
      return [...prev, slug];
    });
  }, [cocktails]);

  const setVariant = useCallback((slug: string, variant: string) => {
    setSelectedVariants((prev) => {
      const current = prev[slug] ?? [];
      return {
        ...prev,
        [slug]: current.includes(variant)
          ? current.filter((item) => item !== variant)
          : [...current, variant],
      };
    });
  }, []);

  const toggleAddOn = useCallback((name: string) => {
    if (name === ADDITIONAL_COCKTAILS || name === ADDITIONAL_SERVICE_HOUR) return;
    setSelectedAddOns((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  }, []);

  const adjustGuestCount = useCallback((amount: number) => {
    setForm((current) => {
      const guestCount = Number.parseInt(current.guestCount, 10) || 0;
      const nextGuestCount = Math.min(999, Math.max(1, guestCount + amount));

      return { ...current, guestCount: String(nextGuestCount) };
    });
  }, []);

  const adjustEventDuration = useCallback((amount: number) => {
    setForm((current) => {
      const duration = Number.parseInt(current.eventDuration, 10) || INCLUDED_HOURS;
      return { ...current, eventDuration: String(Math.min(24, Math.max(1, duration + amount))) };
    });
  }, []);

  const includedCount = Math.min(selected.length, INCLUDED_MAX);
  const extraCount = Math.max(0, selected.length - INCLUDED_MAX);
  const remaining = Math.max(0, INCLUDED_MAX - selected.length);
  const eventDuration = Number.parseInt(form.eventDuration, 10) || 0;
  const additionalHours = Math.max(0, eventDuration - INCLUDED_HOURS);

  const handleSubmit = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!EMAIL_PATTERN.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const cocktailMap = new Map(cocktails.map((c) => [c.slug, c]));
    const automaticFlavorAddOns = selected.flatMap((slug) => {
      const cocktail = cocktailMap.get(slug);
      return (selectedVariants[slug] ?? []).slice(2).map((flavor) =>
        `${cocktail?.name ?? slug} · ${flavor} flavor`
      );
    });
    const extraCocktailNames = selected.slice(INCLUDED_MAX).map((slug) => cocktailMap.get(slug)?.name ?? slug);
    const automaticPackageAddOns = [
      ...(extraCocktailNames.length > 0
        ? [`Additional cocktails · ${extraCocktailNames.join(", ")}`]
        : []),
      ...(additionalHours > 0
        ? [`Additional service ${additionalHours === 1 ? "hour" : "hours"} · ${additionalHours}`]
        : []),
    ];
    const manualAddOns = selectedAddOns.map((name) =>
      name === SOFT_DRINKS && softDrinkPreferences.trim()
        ? `${name} · ${softDrinkPreferences.trim()}`
        : name
    );
    const payload: QuotePayload = {
      name,
      email,
      phone: form.phone.trim() || undefined,
      eventDate: form.eventDate || undefined,
      eventTime: form.eventTime || undefined,
      eventDuration: form.eventDuration || undefined,
      eventType: form.eventType || undefined,
      guestCount: form.guestCount || undefined,
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
      cocktails: selected.flatMap((slug, cocktailIndex) => {
        const c = cocktailMap.get(slug);
        const flavors = selectedVariants[slug] ?? [];
        if (flavors.length === 0) return [{
          name: c?.name ?? slug,
          tag: cocktailIndex < INCLUDED_MAX ? "Included" as const : "Extra" as const,
        }];
        return flavors.map((flavor, flavorIndex) => ({
          name: c?.name ?? slug,
          variant: flavor,
          tag: cocktailIndex < INCLUDED_MAX && flavorIndex < 2 ? "Included" as const : "Extra" as const,
        }));
      }),
      addOns: [...manualAddOns, ...automaticPackageAddOns, ...automaticFlavorAddOns],
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
            Your package includes <span className="font-semibold text-black">{INCLUDED_MAX} cocktails</span> — each with one flavor variation if available. Additional cocktails can be added as an upgrade to your package.
          </p>
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
                        selectedVariants={selectedVariants[cocktail.slug] ?? []}
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
  const flavorAddOns = includedDrinks.flatMap((slug) => {
    const cocktail = cocktailMap.get(slug);
    return (selectedVariants[slug] ?? []).slice(2).map((flavor) =>
      `${cocktail?.name ?? slug} · ${flavor} flavor`
    );
  });

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
            const flavors = selectedVariants[slug] ?? [];
            if (flavors.length === 0) return (
              <span key={slug} className="inline-flex items-center gap-1.5 bg-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {c.emoji} {c.name} <span className="text-white/70 font-normal">Included</span>
              </span>
            );
            return flavors.map((flavor, flavorIndex) => (
              <span key={`${slug}-${flavor}`} className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full ${flavorIndex < 2 ? "bg-gold" : "bg-black"}`}>
                {c.emoji} {c.name} · {flavor}
                <span className="text-white/70 font-normal">{flavorIndex < 2 ? "Included" : "Add-on"}</span>
              </span>
            ));
          })}
          {extraDrinks.map((slug) => {
            const c = cocktailMap.get(slug);
            if (!c) return null;
            const flavors = selectedVariants[slug] ?? [];
            return (
              <span key={slug} className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {c.emoji} {c.name}{flavors.length > 0 ? ` · ${flavors.join(" + ")}` : ""}
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

        {/* Date + Start time + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              Event Start Time
            </label>
            <input
              type="time"
              value={form.eventTime}
              onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
              aria-label="Event start time"
              className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black transition-colors focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Event Duration
            </label>
            <div className="flex w-full overflow-hidden rounded-input border-2 border-light-gray bg-white transition-colors focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]">
              <button
                type="button"
                onClick={() => adjustEventDuration(-1)}
                disabled={eventDuration <= 1}
                aria-label="Reduce event duration by one hour"
                className="flex min-h-12 w-12 shrink-0 items-center justify-center border-r-2 border-light-gray text-2xl font-medium text-red transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
              >
                <span aria-hidden="true">−</span>
              </button>
              <div className="relative min-w-0 flex-1">
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="1"
                  inputMode="numeric"
                  value={form.eventDuration}
                  onChange={(e) => setForm({ ...form, eventDuration: e.target.value })}
                  aria-label="Event duration in hours"
                  className="h-full w-full px-2 py-3 pr-8 text-center text-base font-bold text-black outline-none"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-warm-gray">hrs</span>
              </div>
              <button
                type="button"
                onClick={() => adjustEventDuration(1)}
                disabled={eventDuration >= 24}
                aria-label="Increase event duration by one hour"
                className="flex min-h-12 w-12 shrink-0 items-center justify-center border-l-2 border-light-gray text-2xl font-medium text-red transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
            <p className={`mt-1.5 text-xs ${additionalHours > 0 ? "font-bold text-gold" : "text-warm-gray"}`}>
              {additionalHours > 0
                ? `${additionalHours} additional ${additionalHours === 1 ? "hour" : "hours"} · Add-on`
                : `${INCLUDED_HOURS} hours included`}
            </p>
          </div>
        </div>

        {/* Event type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
            Event Type
          </label>
          <input
            type="text"
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            placeholder="Birthday, wedding, corporate event, bridal shower, holiday party? Tell us what you’re celebrating."
            className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
          />
        </div>

        {/* Guest count + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-warm-gray mb-2">
              Approximate Guest Count
            </label>
            <div className="flex w-full overflow-hidden rounded-input border-2 border-light-gray bg-white transition-colors focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]">
              <button
                type="button"
                onClick={() => adjustGuestCount(-1)}
                disabled={!form.guestCount || Number(form.guestCount) <= 1}
                aria-label="Remove one guest"
                className="flex min-h-12 w-14 shrink-0 items-center justify-center border-r-2 border-light-gray text-2xl font-medium text-red transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
              >
                <span aria-hidden="true">−</span>
              </button>
              <input
                type="number"
                min="1"
                max="999"
                step="1"
                inputMode="numeric"
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                placeholder="0"
                aria-label="Approximate guest count"
                className="min-w-0 flex-1 px-3 py-3 text-center text-base font-bold text-black outline-none placeholder:text-medium-gray"
              />
              <button
                type="button"
                onClick={() => adjustGuestCount(1)}
                disabled={Number(form.guestCount) >= 999}
                aria-label="Add one guest"
                className="flex min-h-12 w-14 shrink-0 items-center justify-center border-l-2 border-light-gray text-2xl font-medium text-red transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
              >
                <span aria-hidden="true">+</span>
              </button>
            </div>
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

        {/* Add-ons */}
        <section className="pt-4" aria-labelledby="add-ons-heading">
          <div className="mb-4">
            <h2 id="add-ons-heading" className="font-display text-2xl font-bold text-black mb-1">
              Add-ons
            </h2>
            <p className="text-sm text-warm-gray">
              Select any extras you&apos;d like us to include in your custom quote.
            </p>
          </div>

          {flavorAddOns.length > 0 && (
            <div className="mb-4 rounded-card border border-gold/40 bg-gold/10 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">
                Flavor add-ons from your cocktails
              </p>
              <div className="flex flex-wrap gap-2">
                {flavorAddOns.map((addOn) => (
                  <span key={addOn} className="rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white">
                    {addOn}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-warm-gray">
                The first 2 flavors for each included cocktail are included. Additional flavors are added to your quote automatically.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {availableAddOns.map((addOn) => {
              const isAutomaticCocktail = addOn.name === ADDITIONAL_COCKTAILS && extraDrinks.length > 0;
              const isAutomaticHours = addOn.name === ADDITIONAL_SERVICE_HOUR && additionalHours > 0;
              const isDynamic = addOn.name === ADDITIONAL_COCKTAILS || addOn.name === ADDITIONAL_SERVICE_HOUR;
              const isAutomatic = isAutomaticCocktail || isAutomaticHours;
              const isSelected = isAutomatic || selectedAddOns.includes(addOn.name);
              return (
                <div key={addOn.name} className={`rounded-card border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-gold bg-gold/10 shadow-[0_0_0_1px_#D4A017]"
                    : "border-light-gray bg-white"
                }`}>
                  <button
                    type="button"
                    onClick={() => !isDynamic && toggleAddOn(addOn.name)}
                    aria-pressed={isSelected}
                    aria-disabled={isDynamic}
                    className={`flex min-h-28 w-full items-start gap-3 p-4 text-left ${
                      isDynamic ? "cursor-default" : "hover:bg-gold/5"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      isSelected ? "border-gold bg-gold text-white" : "border-medium-gray text-transparent"
                    }`}>
                      ✓
                    </span>
                    <span>
                      <span className="block font-display text-base font-bold text-black">{addOn.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-warm-gray">{addOn.description}</span>
                      {isAutomaticCocktail && (
                        <span className="mt-2 block text-xs leading-relaxed text-black">
                          <strong>Included:</strong> {includedDrinks.map((slug) => cocktailMap.get(slug)?.name ?? slug).join(", ")}
                          <br />
                          <strong className="text-gold">Add-ons:</strong> {extraDrinks.map((slug) => cocktailMap.get(slug)?.name ?? slug).join(", ")}
                        </span>
                      )}
                      {isAutomaticHours && (
                        <span className="mt-2 block text-xs font-bold text-gold">
                          {additionalHours} additional {additionalHours === 1 ? "hour" : "hours"}
                        </span>
                      )}
                      <span className={`mt-2 block text-xs font-bold uppercase tracking-wider ${isSelected ? "text-gold" : "text-medium-gray"}`}>
                        {isAutomatic ? "Added automatically" : isDynamic ? "Added automatically when needed" : isSelected ? "Selected" : "Optional"}
                      </span>
                    </span>
                  </button>

                  {addOn.name === SOFT_DRINKS && isSelected && (
                    <div className="border-t border-gold/30 px-4 pb-4 pt-3">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">
                        Which soft drinks would you like?
                      </label>
                      <input
                        type="text"
                        value={softDrinkPreferences}
                        onChange={(e) => setSoftDrinkPreferences(e.target.value)}
                        placeholder="Soda, juices, tea, lemonade, etc."
                        className="w-full rounded-input border-2 border-light-gray bg-white px-4 py-3 text-sm text-black placeholder-medium-gray transition-colors focus:border-gold focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,160,23,0.15)]"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

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
            disabled={!form.name.trim() || !form.email.trim() || submitting}
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
