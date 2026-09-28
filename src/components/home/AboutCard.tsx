"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/config";
import { asset } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Stepped by hand with ‹ › — nothing moves on its own.
const WORDS = ["desktop software", "web apps", "secure systems", "useful tools"];

const pad = (n: number) => String(n).padStart(2, "0");
const cell = "border-dotted border-on-sheet/45";

function Hole() {
  return <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-on-sheet" />;
}

/** A spec sheet about the person: portrait left, statement right, location in the footer row. */
export function AboutCard() {
  const [i, setI] = useState(0);
  const step = (d: number) => setI((v) => (v + d + WORDS.length) % WORDS.length);

  return (
    <section aria-labelledby="about-title" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <article className="grid overflow-hidden rounded-lg bg-sheet text-on-sheet md:grid-cols-[2.75rem_minmax(0,5fr)_minmax(0,7fr)_2.75rem]">
        {/* Header row */}
        <div className={cn("hidden items-center justify-center border-b border-r md:flex", cell)}>
          <Hole />
        </div>
        <div className={cn("t-label hidden items-center justify-between border-b border-r px-4 py-2.5 md:flex", cell)}>
          <span>02</span>
          <span>Portrait</span>
        </div>
        <div className={cn("t-label flex items-center justify-between border-b px-4 py-2.5", cell)}>
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-on-sheet" />
          <span>About</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-on-sheet" />
        </div>
        <div className={cn("hidden border-b border-l md:block", cell)} />

        {/* Body */}
        <div className={cn("hidden flex-col items-center justify-around border-r py-10 md:flex", cell)}>
          <Hole />
          <Hole />
          <Hole />
        </div>
        <div className={cn("relative border-b md:border-b-0 md:border-r", cell)}>
          <div className="relative aspect-[4/5] md:absolute md:inset-0 md:aspect-auto">
            <Image
              src={asset("/images/profilepic.png")}
              alt="Lorenz Malabanan, seated, in a black-and-white studio portrait"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-[50%_18%] grayscale"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 id="about-title" className="px-5 pb-6 pt-8 font-display text-5xl font-light leading-[1.02] tracking-tight md:px-6 md:text-6xl">
            Lorenz Malabanan builds
          </h2>

          <div className={cn("flex items-center justify-between border-y px-3 py-4", cell)}>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous"
              className="t-label h-10 w-10 rounded-sm transition-colors duration-fast hover:bg-on-sheet/[0.08]"
            >
              ‹
            </button>
            <p aria-live="polite" className="font-hand text-3xl leading-none md:text-4xl">
              {WORDS[i]}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next"
              className="t-label h-10 w-10 rounded-sm transition-colors duration-fast hover:bg-on-sheet/[0.08]"
            >
              ›
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4 px-5 py-6 font-mono text-[13px] leading-relaxed md:px-6">
            <p>
              An independent developer and {siteConfig.education.level.toLowerCase()} IT student at {siteConfig.education.institution}.
              I design and build practical software across desktop, web and security.
            </p>
            <p className="text-on-sheet/70">
              Tala, a note-taking app, is out now. PARADA, a smart-parking capstone, is in progress.
            </p>
            <Link href="/about" className="t-label mt-auto self-start pt-4 underline decoration-on-sheet/40 underline-offset-[6px] hover:decoration-on-sheet">
              More about me →
            </Link>
          </div>
        </div>
        <div className={cn("hidden flex-col items-center justify-around border-l py-10 md:flex", cell)} />

        {/* Footer row */}
        <div className={cn("hidden items-center justify-center border-r border-t md:flex", cell)}>
          <Hole />
        </div>
        <div className={cn("t-label hidden items-center justify-center border-r border-t px-4 py-2.5 tabular md:flex", cell)}>
          {pad(i + 1)} / {pad(WORDS.length)}
        </div>
        <div className={cn("t-label flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t px-4 py-2.5", cell)}>
          <span>Currently in</span>
          <span>{siteConfig.education.location}</span>
          <span className="tabular">13.7565° N, 121.0583° E</span>
        </div>
        <div className={cn("hidden border-l border-t md:block", cell)} />
      </article>
    </section>
  );
}
