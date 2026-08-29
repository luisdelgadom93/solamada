import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solamada.com"),
  title: {
    default: "Solamada | Mobile Cocktail Cart & Bartending for Events",
    template: "%s | Solamada",
  },
  description:
    "Elevate your event with Solamada's mobile cocktail cart and professional bartending service. Crafted cocktails, full bar setup, and seamless service for your celebration.",
  keywords: [
    "mobile bartending",
    "cocktail cart",
    "event bartending",
    "mobile bar",
    "party bartender",
    "cocktail catering",
    "Houston bartending service",
  ],
  openGraph: {
    title: "Solamada | Mobile Cocktail Cart & Bartending for Events",
    description:
      "Crafted cocktails, professional bartending, and a mobile bar setup to elevate your celebration.",
    type: "website",
    locale: "en_US",
    siteName: "Solamada",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solamada | Mobile Cocktail Cart & Bartending",
    description:
      "Crafted cocktails, professional bartending, and a mobile bar setup to elevate your celebration.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
