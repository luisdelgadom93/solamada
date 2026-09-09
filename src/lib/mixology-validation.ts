export const MAX_MIXOLOGY_PARTICIPANTS = 10;
export const MIXOLOGY_PARTICIPANT_ERROR = "Please enter between 1 and 10 participants (whole numbers only).";

export function isValidMixologyParticipantCount(value: unknown): boolean {
  return typeof value === "string" && /^\d+$/.test(value)
    && Number(value) >= 1 && Number(value) <= MAX_MIXOLOGY_PARTICIPANTS;
}

export function isMixologyCocktailAvailable(cocktail: { category: string; slug: string }): boolean {
  return cocktail.category === "classic" && cocktail.slug !== "cielito-anaranjado";
}
import { validateQuoteFields, type QuoteFieldErrors } from "@/lib/quote-validation";

export const mixologyEventFields = ["eventDate", "eventTime", "eventType", "location"] as const;

export function validateMixologyEventFields(values: Partial<Record<typeof mixologyEventFields[number], unknown>>): QuoteFieldErrors {
  const allErrors = validateQuoteFields(values);
  const errors: QuoteFieldErrors = {};
  for (const field of mixologyEventFields) {
    if (allErrors[field]) errors[field] = allErrors[field];
  }
  return errors;
}
