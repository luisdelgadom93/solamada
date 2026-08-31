"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/cocktails";
import type { QuotePayload } from "@/app/api/quote/route";

const MAX_COCKTAILS = 3;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function MixologyCocktailCard({
  cocktail,
  selected,
  disabled,
  onToggle,
}: {
  cocktail: Cocktail;
  selected: boolean;
  disabled: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(cocktail.slug)}
      aria-pressed={selected}
      disabled={disabled}
      className={`relative overflow-hidden rounded-card border text-left transition-all duration-300 ${
        selected
          ? "scale-[1.02] border-gold shadow-[0_0_0_2px_#D4A017]"
          : "border-light-gray shadow-card hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
      } ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"}`}
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {cocktail.image ? (
          <Image
            src={cocktail.image}
            alt={cocktail.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center scale-[1.08]"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-4xl"
            style={{ background: `linear-gradient(135deg, ${cocktail.placeholderGradient[0]}, ${cocktail.placeholderGradient[1]})` }}
            aria-hidden="true"
          >
            {cocktail.emoji}
          </div>
        )}

        <div className={`absolute inset-0 flex items-end justify-end p-2 ${selected ? "bg-gold/20" : "bg-black/10"}`}>
          <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold shadow ${
            selected ? "border-gold bg-gold text-white" : "border-white/60 bg-white/90 text-transparent"
          }`}>
            ✓
          </span>
        </div>

        {selected && (
          <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-white shadow">
            ✓ Selected
          </span>
        )}
      </div>

      <div className="bg-white p-4">
        <h3 className="mb-0.5 font-display text-base font-bold text-black">{cocktail.name}</h3>
        <p className="text-xs leading-relaxed text-warm-gray">
          {cocktail.ingredients.join(" · ")}
        </p>
      </div>
    </button>
  );
}

export default function MixologyQuoteForm({ cocktails }: { cocktails: Cocktail[] }) {
  const classicCocktails = cocktails.filter((cocktail) => cocktail.category === "classic");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [participants, setParticipants] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    location: "",
    notes: "",
  });

  const participantCount = Number.parseInt(participants, 10) || 0;

  const adjustParticipants = useCallback((amount: number) => {
    setParticipants((current) => {
      const count = Number.parseInt(current, 10) || 0;
      return String(Math.min(999, Math.max(1, count + amount)));
    });
  }, []);

  const toggleCocktail = useCallback((slug: string) => {
    setSelected((current) => {
      if (current.includes(slug)) {
        setSelectionMessage(null);
        return current.filter((item) => item !== slug);
      }
      if (current.length >= MAX_COCKTAILS) {
        setSelectionMessage("You can select up to 3 cocktails for this experience.");
        return current;
      }
      setSelectionMessage(null);
      return [...current, slug];
    });
  }, []);

  const handleSubmit = async () => {
    const name = form.name.trim();
    const email = form.email.trim();

    if (!EMAIL_PATTERN.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const cocktailMap = new Map(classicCocktails.map((cocktail) => [cocktail.slug, cocktail]));
    const payload: QuotePayload = {
      service: "Cocktail & Mixology Experience",
      participantCount: participants,
      name,
      email,
      phone: form.phone.trim() || undefined,
      eventDate: form.eventDate || undefined,
      eventTime: form.eventTime || undefined,
      eventType: form.eventType.trim() || undefined,
      location: form.location.trim() || undefined,
      notes: form.notes.trim() || undefined,
      cocktails: selected.map((slug) => ({
        name: cocktailMap.get(slug)?.name ?? slug,
        tag: "Included",
      })),
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="mb-10 flex items-center justify-center gap-3">
      {([1, 2, 3] as const).map((item) => (
        <div key={item} className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            item === step ? "bg-gold text-white" : item < step ? "bg-black text-white" : "bg-light-gray text-warm-gray"
          }`}>
            {item < step ? "✓" : item}
          </div>
          <span className={`hidden text-sm font-medium sm:block ${item === step ? "text-black" : "text-warm-gray"}`}>
            {item === 1 ? "Participants" : item === 2 ? "Choose Cocktails" : "Event Details"}
          </span>
          {item < 3 && <div className="hidden h-0.5 w-8 bg-light-gray sm:block" />}
        </div>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-20">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold">✓</div>
          <h2 className="mb-3 font-display text-3xl font-bold text-black">Request received!</h2>
          <p className="leading-relaxed text-warm-gray">
            We&apos;ll review your Cocktail &amp; Mixology Experience details and get back to you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="mx-auto max-w-xl px-6 pb-20">
        <StepIndicator />
        <div className="rounded-card border border-light-gray bg-white p-7 text-center shadow-card md:p-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-gold">Your Group</p>
          <h2 className="mb-3 font-display text-3xl font-bold text-black">How many people will participate?</h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-warm-gray">
            This helps us prepare the right tools, ingredients, and setup for everyone to make their own cocktails.
          </p>

          <div className="mx-auto flex max-w-xs overflow-hidden rounded-input border-2 border-light-gray bg-white focus-within:border-gold">
            <button
              type="button"
              onClick={() => adjustParticipants(-1)}
              disabled={participantCount <= 1}
              aria-label="Remove one participant"
              className="flex min-h-14 w-16 items-center justify-center border-r-2 border-light-gray text-2xl text-red hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              max="999"
              inputMode="numeric"
              value={participants}
              onChange={(event) => setParticipants(event.target.value)}
              placeholder="0"
              aria-label="Number of participants"
              className="min-w-0 flex-1 px-3 py-3 text-center text-lg font-bold text-black outline-none placeholder:text-medium-gray"
            />
            <button
              type="button"
              onClick={() => adjustParticipants(1)}
              disabled={participantCount >= 999}
              aria-label="Add one participant"
              className="flex min-h-14 w-16 items-center justify-center border-l-2 border-light-gray text-2xl text-red hover:bg-cream disabled:cursor-not-allowed disabled:text-medium-gray"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={participantCount < 1}
            className={`mt-8 inline-flex w-full items-center justify-center rounded-pill py-4 text-sm font-bold uppercase tracking-widest transition-all ${
              participantCount >= 1 ? "bg-red text-white shadow-btn hover:bg-gold" : "cursor-not-allowed bg-light-gray text-warm-gray"
            }`}
          >
            Next: Choose Cocktails →
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <StepIndicator />
        <div className="mb-9 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-gold">Cocktail Lineup</p>
          <h2 className="mb-3 font-display text-3xl font-bold text-black md:text-4xl">Choose your cocktails</h2>
          <p className="text-sm text-warm-gray">Select up to 3 cocktails you&apos;d like your group to learn.</p>
          <p className="mt-3 text-sm font-bold text-gold">{selected.length} of {MAX_COCKTAILS} selected</p>
          {selectionMessage && <p className="mt-2 text-sm font-medium text-red">{selectionMessage}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classicCocktails.map((cocktail) => (
            <MixologyCocktailCard
              key={cocktail.slug}
              cocktail={cocktail}
              selected={selected.includes(cocktail.slug)}
              disabled={selected.length >= MAX_COCKTAILS && !selected.includes(cocktail.slug)}
              onToggle={toggleCocktail}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-pill border-2 border-black px-8 py-4 text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white"
          >
            ← Participants
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            disabled={selected.length === 0}
            className={`rounded-pill px-8 py-4 text-sm font-bold uppercase tracking-widest ${
              selected.length > 0 ? "bg-red text-white shadow-btn hover:bg-gold" : "cursor-not-allowed bg-light-gray text-warm-gray"
            }`}
          >
            Next: Event Details →
          </button>
        </div>
      </div>
    );
  }

  const cocktailMap = new Map(classicCocktails.map((cocktail) => [cocktail.slug, cocktail]));

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20">
      <StepIndicator />

      <div className="mb-8 rounded-card border border-light-gray bg-warm-white p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-warm-gray">Your mixology experience</p>
            <p className="mt-1 text-sm font-bold text-black">{participants} participants</p>
          </div>
          <button type="button" onClick={() => setStep(2)} className="text-xs font-bold uppercase tracking-wider text-gold hover:text-gold-light">
            Edit ↩
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.map((slug) => {
            const cocktail = cocktailMap.get(slug);
            return cocktail ? (
              <span key={slug} className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white">
                {cocktail.emoji} {cocktail.name}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold text-black">Tell us about your event</h2>
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Your Name <span className="text-red">*</span></label>
            <input type="text" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Jane Smith" className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Email <span className="text-red">*</span></label>
            <input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@email.com" className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Phone (optional)</label>
          <input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="(713) 000-0000" className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Event Date</label>
            <input type="date" value={form.eventDate} onChange={(event) => setForm({ ...form, eventDate: event.target.value })} className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Event Start Time</label>
            <input type="time" value={form.eventTime} onChange={(event) => setForm({ ...form, eventTime: event.target.value })} className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black focus:border-gold focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Event Type</label>
          <input type="text" value={form.eventType} onChange={(event) => setForm({ ...form, eventType: event.target.value })} placeholder="Birthday, friends night, corporate gathering..." className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Event City / Location</label>
          <input type="text" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Houston, TX" className="w-full rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-warm-gray">Anything else we should know?</label>
          <textarea rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Venue type, indoor or outdoor setup, vibe, questions, special requests..." className="w-full resize-none rounded-input border-2 border-light-gray px-4 py-3 text-sm text-black placeholder-medium-gray focus:border-gold focus:outline-none" />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.email.trim() || submitting}
          className={`inline-flex w-full items-center justify-center rounded-pill py-4 text-sm font-bold uppercase tracking-widest transition-all ${
            form.name.trim() && form.email.trim() && !submitting ? "bg-red text-white shadow-btn hover:bg-gold" : "cursor-not-allowed bg-light-gray text-warm-gray"
          }`}
        >
          {submitting ? "Sending…" : "Send Mixology Quote Request ✦"}
        </button>
        {submitError && <p className="text-center text-sm font-medium text-red">{submitError}</p>}
        <p className="text-center text-xs text-warm-gray">No credit card required · We&apos;ll respond within 24 hours</p>
      </div>
    </div>
  );
}
