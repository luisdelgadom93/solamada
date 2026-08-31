import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Solamada's Mobile Bar Experience and social Cocktail & Mixology Experience for private and corporate gatherings in Houston.",
};

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
