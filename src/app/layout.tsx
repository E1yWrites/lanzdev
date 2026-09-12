import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { InitialLoader } from "@/components/ui/InitialLoader";
import { getProjectSummaries } from "@/lib/githubProjects";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lorenz.dev — Software Studio",
    template: "%s — Lorenz.dev",
  },
  description:
    "Software made by a maker, for people who need something. Independent developer building practical software across web, desktop, and security.",
  metadataBase: new URL("https://lorenzmalabanan.dev"),
  openGraph: {
    title: "Lorenz.dev — Software Studio",
    description:
      "Software made by a maker, for people who need something.",
    url: "https://lorenzmalabanan.dev",
    siteName: "Lorenz.dev",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const summaries = await getProjectSummaries();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen relative swiss-noise">
        <InitialLoader />
        <Navigation projects={summaries} />
        <main className="relative z-[1] pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
