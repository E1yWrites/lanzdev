import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono, Kalam, Newsreader } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { siteConfig } from "@/data/config";
import { getProjectSummaries } from "@/lib/githubProjects";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Variable with the optical-size axis: light and delicate at display sizes.
const display = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Tala's own handwriting face — used once, so not preloaded.
const hand = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Lorenz Malabanan — Software for curious people",
    template: "%s — Lorenz.dev",
  },
  description: siteConfig.description,
  metadataBase: new URL("https://lorenzmalabanan.dev"),
  openGraph: {
    title: "Lorenz Malabanan — Software for curious people",
    description: siteConfig.description,
    url: "https://lorenzmalabanan.dev",
    siteName: "Lorenz.dev",
    locale: "en_US",
    type: "website",
    images: [{ url: "/art/og.jpg", width: 1200, height: 630, alt: "Lorenz.dev — software for curious people" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/art/og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const summaries = await getProjectSummaries();

  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hold entrance animations until JS can start them on scroll (no-JS visitors see everything). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="grain min-h-screen">
        <ScrollProgress />
        <Cursor />
        <a
          href="#main"
          className="t-label sr-only z-[70] rounded-sm bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Skip to content
        </a>
        <Navigation projects={summaries} />
        <main id="main" className="relative z-[1] pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
