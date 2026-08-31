export interface ServicePackage {
  name: string;
  slug: string;
  minHours: number;
  maxGuests: number;
  description: string;
  features: string[];
}

export interface AddOn {
  name: string;
  description: string;
}

export const packages: ServicePackage[] = [
  {
    name: "The Solamada Experience",
    slug: "solamada-experience",
    minHours: 3,
    maxGuests: 40,
    description:
      "Our mobile bar package brings the craft, the setup, and the service. You bring the spirits and the celebration.",
    features: [
      "1 professional TABC-certified bartender",
      "2 cocktails of your choice from our menu",
      "General bartending for your provided beer, wine & soft drinks",
      "All non-alcoholic mixers, syrups, fresh juices & garnishes",
      "Coolers stocked with ice, still & sparkling water",
      "Water dispenser included",
      "Plastic drinkware included",
      "Delivery, full setup & breakdown",
      "3-hour minimum service window",
    ],
  },
];

export const addOns: AddOn[] = [
  {
    name: "Solamada mobile bar",
    description: "Our signature branded bar setup for a polished, professional look.",
  },
  {
    name: "Premium drinkware",
    description: "Upgrade to glassware as featured in our cocktail menu photos.",
  },
  {
    name: "Soft drinks",
    description: "Add up to 4 non-alcoholic drink choices for guests who prefer them.",
  },
  {
    name: "Additional cocktails",
    description: "Expand your selection beyond 2 cocktails — up to 4 total.",
  },
  {
    name: "Additional service hour",
    description: "Extend bartending coverage beyond the base service window.",
  },
];

export const terms = [
  "A 50% deposit is required to secure your event date; the remaining balance is due 2 days prior to the event.",
  "Cocktail selections must be finalized at least 1 week before your event date.",
  "You are responsible for purchasing all alcoholic beverages. After booking confirmation, we'll provide a detailed list with quantities and recommended brands.",
  "Our bartenders will also serve your guest-provided beverages (beer, wine, soft drinks) at no additional charge.",
  "A delivery or travel fee may apply based on the distance to your event location — we'll include this in your quote.",
  "All Solamada bartenders are TABC certified for responsible and professional service.",
];
