export type CocktailCategory = "classic" | "spritz" | "sangria";

export interface Cocktail {
  name: string;
  slug: string;
  category: CocktailCategory;
  baseSpirit: string;
  ingredients: string[];
  /** Selectable flavor variations for this cocktail (if any) */
  variants?: string[];
  /** Path to product photo under /public (e.g. /images/cocktails/mojito.png) */
  image?: string;
  placeholderGradient: [string, string];
  emoji: string;
}

export const cocktails: Cocktail[] = [
  // ── Classic ──────────────────────────────────────────────
  {
    name: "Cuba Libre",
    slug: "cuba-libre",
    category: "classic",
    baseSpirit: "Dark Rum",
    ingredients: ["Dark rum", "Lime juice", "Bitters", "Coke"],
    image: "/images/cocktails/cuba-libre.png",
    placeholderGradient: ["#3D1A00", "#7B4500"],
    emoji: "🥃",
  },
  {
    name: "Paloma",
    slug: "paloma",
    category: "classic",
    baseSpirit: "Tequila",
    ingredients: ["Tequila", "Grapefruit liqueur", "Lime juice", "Grapefruit soda", "Tajin"],
    image: "/images/cocktails/paloma.png",
    placeholderGradient: ["#FF6B6B", "#FFB347"],
    emoji: "🍊",
  },
  {
    name: "Margarita",
    slug: "margarita",
    category: "classic",
    baseSpirit: "Tequila",
    ingredients: ["Tequila", "Orange liqueur", "Lime juice", "Agave syrup", "Salt"],
    variants: ["Classic", "Spicy", "Guava"],
    image: "/images/cocktails/margarita.png",
    placeholderGradient: ["#2D8A4E", "#7EC8A0"],
    emoji: "🍹",
  },
  {
    name: "Spicy Passion",
    slug: "spicy-passion",
    category: "classic",
    baseSpirit: "Varies",
    ingredients: ["Fresh fruit purée", "Lime juice", "Tajin rim"],
    variants: ["Mango", "Guava"],
    image: "/images/cocktails/spicy-passion.png",
    placeholderGradient: ["#FF6B35", "#FFB347"],
    emoji: "🥭",
  },
  {
    name: "Old Fashioned",
    slug: "old-fashioned",
    category: "classic",
    baseSpirit: "Bourbon",
    ingredients: ["Bourbon", "Bitters", "Honey syrup"],
    image: "/images/cocktails/old-fashioned.png",
    placeholderGradient: ["#6B3A2A", "#C17D24"],
    emoji: "🥃",
  },
  {
    name: "Carajillo",
    slug: "carajillo",
    category: "classic",
    baseSpirit: "Coffee",
    ingredients: ["Coffee", "Licor 43", "Orange liqueur", "Piloncillo"],
    image: "/images/cocktails/carajillo.png",
    placeholderGradient: ["#1A0800", "#4A2500"],
    emoji: "☕",
  },
  {
    name: "Mojito",
    slug: "mojito",
    category: "classic",
    baseSpirit: "White Rum",
    ingredients: ["White rum", "Lime juice", "Mint", "Simple syrup", "Soda water"],
    variants: ["Original", "Passion Fruit", "Coconut"],
    image: "/images/cocktails/mojito.png",
    placeholderGradient: ["#1A7A4A", "#56CCB2"],
    emoji: "🌿",
  },
  {
    name: "Moscow Mule",
    slug: "moscow-mule",
    category: "classic",
    baseSpirit: "Vodka",
    ingredients: ["Cucumber-mint vodka", "Lime juice", "Simple syrup", "Ginger beer"],
    variants: ["Original", "Pineapple", "Watermelon"],
    image: "/images/cocktails/moscow-mule.png",
    placeholderGradient: ["#B8860B", "#D4A017"],
    emoji: "🫚",
  },
  {
    name: "Negroni",
    slug: "negroni",
    category: "classic",
    baseSpirit: "Gin",
    ingredients: ["Campari", "Sweet vermouth", "Gin"],
    image: "/images/cocktails/negroni.png",
    placeholderGradient: ["#7B1010", "#CC3333"],
    emoji: "🍸",
  },
  {
    name: "Cielito Anaranjado",
    slug: "cielito-anaranjado",
    category: "classic",
    baseSpirit: "Gin",
    ingredients: ["Aperol", "Gin", "Sweet vermouth", "Lime juice", "Simple syrup", "Egg white", "Bitters"],
    image: "/images/cocktails/cielito-anaranjado.png",
    placeholderGradient: ["#C44B1A", "#F4956A"],
    emoji: "🌅",
  },

  // ── Spritz ───────────────────────────────────────────────
  {
    name: "Aperol Spritz",
    slug: "aperol-spritz",
    category: "spritz",
    baseSpirit: "Aperol",
    ingredients: ["Aperol", "Prosecco", "Soda water"],
    image: "/images/cocktails/aperol-spritz.png",
    placeholderGradient: ["#E05A10", "#FFB347"],
    emoji: "🍊",
  },
  {
    name: "Limoncello Spritz",
    slug: "limoncello-spritz",
    category: "spritz",
    baseSpirit: "Limoncello",
    ingredients: ["Limoncello", "Prosecco", "Soda water"],
    image: "/images/cocktails/limoncello-spritz.png",
    placeholderGradient: ["#C8A800", "#F7E474"],
    emoji: "🍋",
  },
  {
    name: "Sunday Passion Spritz",
    slug: "sunday-passion-spritz",
    category: "spritz",
    baseSpirit: "Passion Fruit Liqueur",
    ingredients: ["Passion fruit liqueur", "Aperol", "Orange liqueur", "Lime juice", "Prosecco", "Soda water"],
    image: "/images/cocktails/sunday-passion-spritz.png",
    placeholderGradient: ["#C2185B", "#FF80AB"],
    emoji: "🌸",
  },
  {
    name: "Midnight Grapes Spritz",
    slug: "midnight-grapes-spritz",
    category: "spritz",
    baseSpirit: "Cassis Liqueur",
    ingredients: ["Cassis liqueur", "Sweet vermouth", "Lime juice", "Prosecco", "Soda water"],
    image: "/images/cocktails/midnight-grapes-spritz.png",
    placeholderGradient: ["#3A0070", "#8E24AA"],
    emoji: "🍇",
  },

  // ── Sangria ──────────────────────────────────────────────
  {
    name: "Sangria Roja",
    slug: "sangria-roja",
    category: "sangria",
    baseSpirit: "Dark Rum",
    ingredients: ["Dark rum", "Orange liqueur", "Red wine", "Orange juice", "Sprite", "Fresh fruits"],
    image: "/images/cocktails/sangria-roja.png",
    placeholderGradient: ["#6A1010", "#B52A2D"],
    emoji: "🍷",
  },
  {
    name: "Sangria Blanca",
    slug: "sangria-blanca",
    category: "sangria",
    baseSpirit: "Vermouth",
    ingredients: ["Vermouth", "Orange liqueur", "White wine", "Moscato", "Sprite", "Fresh fruits"],
    image: "/images/cocktails/sangria-blanca.png",
    placeholderGradient: ["#A07820", "#E8D5A3"],
    emoji: "🥂",
  },
];

export function getCocktailsByCategory(category: CocktailCategory): Cocktail[] {
  return cocktails.filter((c) => c.category === category);
}
