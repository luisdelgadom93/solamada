export const quoteFieldLabels = {
  name: "Your Name",
  email: "Email",
  eventDate: "Event Date",
  eventTime: "Event Start Time",
  eventDuration: "Event Duration",
  eventType: "Event Type",
  guestCount: "Guest Count",
  eventAddress: "Event Address",
  city: "City",
  zipCode: "ZIP Code",
} as const;

export type QuoteField = keyof typeof quoteFieldLabels;
export type QuoteFieldErrors = Partial<Record<QuoteField, string>>;

export function validateQuoteFields(values: Partial<Record<QuoteField, unknown>>): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  for (const field of Object.keys(quoteFieldLabels) as QuoteField[]) {
    const value = values[field];
    if (typeof value !== "string" || !value.trim()) {
      errors[field] = `Please complete ${quoteFieldLabels[field]}.`;
      continue;
    }
    let valid = true;
    if (field === "eventAddress") valid = /\d/.test(value) && /[a-zA-Z]/.test(value) && value.trim().length >= 5;
    if (field === "city") valid = /^[\p{L}\p{M} .'-]+$/u.test(value.trim()) && /\p{L}/u.test(value);
    if (field === "zipCode") valid = /^\d{5}(-\d{4})?$/.test(value.trim());
    if (field === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    if (field === "eventTime") valid = /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    if (field === "eventDate") {
      const date = new Date(`${value}T00:00:00Z`);
      valid = /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(date.getTime())
        && date.toISOString().slice(0, 10) === value && Number(value.slice(0, 4)) > 0;
    }
    if (field === "eventDuration" || field === "guestCount") {
      const number = Number(value);
      valid = /^\d+$/.test(value) && Number.isInteger(number) && number >= 1
        && number <= (field === "eventDuration" ? 24 : 999);
    }
    if (!valid) errors[field] = `Please enter a valid ${quoteFieldLabels[field]}${field === "eventDuration" ? " (1–24 whole hours)" : field === "guestCount" ? " (1–999 whole guests)" : ""}.`;
  }
  return errors;
}
