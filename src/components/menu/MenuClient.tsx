"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Cocktail, CocktailCategory } from "@/lib/cocktails";

const INCLUDED_MAX = 2;

const categoryLabels: Record<CocktailCategory, { title: string; desc: string }> = {
  classic: { title: "Classics", desc: "Timeless cocktails with a Solamada twist." },
  spritz: { title: "Spritz Collection", desc: "Light, bubbly, and perfect for celebrations." },
  sangria: { title: "Sangrias", desc: "Crowd-pleasing pitchers crafted with fresh fruits." },
};

function CocktailPhoto({
  image,
  gradient,
  emoji,
  name,
}: {
  image?: string;
  gradient: [string, string];
  emoji: string;
  name: string;
}) {
  if (image) {
    return (
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center scale-[1.08]"
        />
      </div>
    );
  }
  return (
    <div
      className="w-full aspect-square flex items-center justify-center text-4xl select-none"
      style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      aria-hidden="true"
    >
      {emoji}
    </div>
  );
}

function CocktailCard({
  cocktail,
  selectionMode,
  selected,
  onToggle,
  selectionIndex,
  selectedVariant,
  onVariantSelect,
}: {
  cocktail: Cocktail;
  selectionMode: boolean;
  selected: boolean;
  onToggle: (slug: string) => void;
  selectionIndex: number;
  selectedVariant?: string;
  onVariantSelect: (slug: string, variant: string) => void;
}) {
  const isExtra = selected && selectionIndex >= INCLUDED_MAX;
  const isIncluded = selected && selectionIndex < INCLUDED_MAX;
  const hasVariants = cocktail.variants && cocktail.variants.length > 0;

  return (
    <div
      onClick={selectionMode ? () => onToggle(cocktail.slug) : undefined}
      className={`
        relative rounded-card overflow-hidden border transition-all duration-300
        ${selectionMode ? "cursor-pointer" : ""}
        ${selected
          ? "border-gold shadow-[0_0_0_2px_#D4A017] scale-[1.02]"
          : "border-light-gray shadow-card hover:shadow-card-hover hover:-translate-y-1"}
        ${selectionMode && !selected ? "hover:border-gold/50" : ""}
      `}
    >
      {/* Photo or gradient placeholder */}
      <div className="relative">
        <CocktailPhoto
          image={cocktail.image}
          gradient={cocktail.placeholderGradient}
          emoji={cocktail.emoji}
          name={cocktail.name}
        />

        {/* Selection overlay */}
        {selectionMode && (
          <div
            className={`absolute inset-0 flex items-end justify-end p-2 transition-all duration-200 ${
              selected ? "bg-gold/20" : "bg-black/10"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow ${
                selected
                  ? "bg-gold border-gold text-white"
                  : "bg-white/90 border-white/60"
              }`}
            >
              {selected && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Badge — top-left */}
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
      <div className="bg-white p-5">
        <h3 className="font-display text-base font-bold text-black mb-0.5">{cocktail.name}</h3>
        <p className="text-sm text-warm-gray leading-relaxed mb-3">
          {cocktail.ingredients.join(" · ")}
        </p>

        {/* Variant chips — shown when selected and has variants */}
        {selectionMode && selected && hasVariants && (
          <div
            className="mt-1"
            onClick={(e) => e.stopPropagation()} // prevent card toggle when clicking variant
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

export default function MenuClient({ cocktails }: { cocktails: Cocktail[] }) {
  const router = useRouter();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const toggleDrink = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) {
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

  const handleProceed = () => {
    // Encode selection as "slug" or "slug:Variant" entries
    const encoded = selected.map((slug) => {
      const variant = selectedVariants[slug];
      return variant ? `${slug}:${encodeURIComponent(variant)}` : slug;
    });
    const params = encoded.length > 0 ? `?menu=${encoded.join(",")}` : "";
    router.push(`/book${params}`);
  };

  const handleCancel = () => {
    setSelectionMode(false);
    setSelected([]);
    setSelectedVariants({});
  };

  const categories: CocktailCategory[] = ["classic", "spritz", "sangria"];

  return (
    <div className="relative">

      {/* ── Sticky bar ── */}
      <div
        className={`sticky top-14 z-30 transition-colors duration-300 ${
          selectionMode ? "bg-gold" : "bg-black"
        }`}
      >
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between gap-4">
          {!selectionMode ? (
            <>
              <p className="text-white/70 text-sm hidden sm:block">
                Explore the menu, then build your cocktail list.
              </p>
              <button
                onClick={() => setSelectionMode(true)}
                className="ml-auto inline-flex items-center gap-2 rounded-pill bg-gold px-5 py-2 font-body text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold-light shrink-0"
              >
                <span>✦</span> Build My Event Menu
              </button>
            </>
          ) : (
            <>
              {/* Selection mode: count pill on left, Cancel on right */}
              <div className="flex items-center gap-3">
                {/* Progress dots */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: INCLUDED_MAX }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        i < includedCount ? "bg-black" : "bg-black/25"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-black font-bold text-sm">
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
                onClick={handleCancel}
                className="text-black/60 text-xs font-bold uppercase tracking-wider hover:text-black transition-colors shrink-0"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Cocktail Grid ── */}
      <div className={`px-6 ${selectionMode ? "pb-52" : "pb-16"}`}>
        {categories.map((cat) => {
          const drinks = cocktails.filter((c) => c.category === cat);
          const { title, desc } = categoryLabels[cat];
          return (
            <section key={cat} className="py-14 max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-black mb-1">
                  {title}
                </h2>
                <p className="text-warm-gray text-base">{desc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {drinks.map((cocktail) => {
                  const selectionIndex = selected.indexOf(cocktail.slug);
                  return (
                    <CocktailCard
                      key={cocktail.slug}
                      cocktail={cocktail}
                      selectionMode={selectionMode}
                      selected={selectionIndex !== -1}
                      onToggle={toggleDrink}
                      selectionIndex={selectionIndex}
                      selectedVariant={selectedVariants[cocktail.slug]}
                      onVariantSelect={setVariant}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Floating bottom bar (selection mode only) ── */}
      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-white/10 shadow-2xl">
          <div className="mx-auto max-w-lg px-6 pt-4 pb-6 flex flex-col gap-3">

            {/* Info text — full width, always on top */}
            <div className="text-center">
              {selected.length === 0 ? (
                <p className="text-white/50 text-sm">
                  Select up to {INCLUDED_MAX} cocktails included in your package.
                </p>
              ) : extraCount === 0 ? (
                <>
                  <p className="text-white font-semibold text-sm">
                    <span className="text-gold font-bold">{includedCount}</span> cocktail{includedCount !== 1 ? "s" : ""} selected
                    {remaining > 0 && (
                      <span className="text-white/50 font-normal"> — {remaining} more included in your package</span>
                    )}
                  </p>
                  {remaining === 0 && (
                    <p className="text-white/40 text-xs mt-1">
                      All {INCLUDED_MAX} included slots filled. You can still add more at extra cost.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-white font-semibold text-sm">
                    <span className="text-gold font-bold">{INCLUDED_MAX} included</span>
                    <span className="text-white/40"> + </span>
                    <span className="text-white font-bold">{extraCount} extra</span>
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Extra cocktails are priced individually — we&apos;ll confirm costs in your quote.
                  </p>
                </>
              )}
            </div>

            {/* CTA — full width */}
            <button
              onClick={handleProceed}
              disabled={selected.length === 0}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-pill py-4 font-body text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                selected.length > 0
                  ? "bg-gold text-white hover:bg-gold-light hover:-translate-y-0.5"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {selected.length === 0 ? "Select cocktails to continue" : (
                <>Get a Quote with This Selection <span>→</span></>
              )}
            </button>

            {/* Disclaimer */}
            <p className="text-center text-white/30 text-xs -mt-1">
              No credit card required &middot; You can update your selection during the quote process
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
