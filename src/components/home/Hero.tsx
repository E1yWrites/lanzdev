"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { KineticText } from "@/components/motion/KineticText";
import { ModelStage } from "@/components/three/ModelStage";
import { heroKey, heroPointer, useStore } from "@/components/three/store";
import { PAD_KEYS } from "@/three/padKeys";
import { siteConfig } from "@/data/config";
import { asset } from "@/lib/constants";
import { cn } from "@/lib/utils";

const INDEX_NAME: Record<string, string> = { parada: "PARADA", tala: "Tala", about: "About", contact: "Say hi" };

const INDEX_DETAIL: Record<string, string> = {
  parada: "Smart parking",
  tala: "Notes + handwriting",
  about: "BSIT · LPU-Batangas",
  contact: "Open to an internship",
};

function ManilaClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular">{time ?? "--:--"} PHT</span>;
}

/**
 * The hero is the index: a macropad whose keys are the site's four destinations,
 * mirrored by a plain list of links. Hovering either side lights the other.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const hovered = useStore(heroKey);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroPointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const h = section.current?.offsetHeight ?? window.innerHeight;
      heroPointer.scroll = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      heroKey.set(-1);
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100svh-56px)] max-w-[1600px] flex-col px-5 md:px-8 lg:px-12">
        {/* top rail */}
        <div className="t-label grid grid-cols-2 gap-4 border-b border-dotted border-ink/25 py-4 text-ink/70 md:grid-cols-3">
          <span>
            {siteConfig.personalName} <span className="text-ink/40">·</span> {siteConfig.alias}
          </span>
          <span className="hidden text-center md:block">Portfolio — 2026</span>
          <span className="text-right">
            Batangas <span className="text-ink/40">·</span> <ManilaClock />
          </span>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-8 py-8 lg:grid-cols-12 lg:gap-6 lg:py-6">
          <div className="relative z-[2] min-w-0 lg:col-span-5">
            <p className="hero-fade t-label text-accent" style={{ animationDelay: "120ms" }}>
              <span className="section-number">Independent developer · BSIT</span>
            </p>
            <KineticText
              id="hero-title"
              lines={["Software", "for curious", "people"]}
              accent="."
              delay={180}
              className="mt-5 font-display text-[clamp(3.4rem,8.2vw,8.75rem)] font-light leading-[0.92] tracking-[-0.035em] text-ink"
            />
            <p className="hero-fade mt-7 max-w-md font-swiss text-base leading-relaxed text-ink/70 md:text-lg" style={{ animationDelay: "700ms" }}>
              I’m {siteConfig.alias} — a 3rd-year IT student in Batangas building web, mobile and desktop apps. Two of them live on these keys.
            </p>

            {/* The index: the same four destinations as the keys. */}
            <nav aria-label="Index" className="hero-fade mt-8 max-w-md" style={{ animationDelay: "850ms" }}>
              <ol className="border-t border-dotted border-ink/25">
                {PAD_KEYS.map((k, i) => (
                  <li key={k.id} className="border-b border-dotted border-ink/25">
                    <Link
                      href={k.href}
                      data-cursor={k.id === "contact" ? "Say hi" : "Open"}
                      onPointerEnter={() => heroKey.set(i)}
                      onPointerLeave={() => heroKey.get() === i && heroKey.set(-1)}
                      onFocus={() => heroKey.set(i)}
                      onBlur={() => heroKey.get() === i && heroKey.set(-1)}
                      className={cn("index-row group flex items-baseline gap-4 py-3 transition-colors duration-fast", hovered === i ? "text-accent" : "text-ink")}
                    >
                      <span className="t-label w-6 text-ink/50">{k.index}</span>
                      <span className="font-display text-2xl font-light md:text-[1.7rem]">{INDEX_NAME[k.id]}</span>
                      <span className="t-label ml-auto text-right text-ink/50">{INDEX_DETAIL[k.id]}</span>
                      <span aria-hidden="true" className="index-arrow t-label">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="relative min-w-0 lg:col-span-7">
            <ModelStage
              model="macropad"
              poster={asset("/art/macropad.webp")}
              alt="A four-key macropad: keys for PARADA, Tala, About and Say hi, a small orange screen and a knurled knob."
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="hero-stage mx-auto aspect-[4/3] w-full max-w-[980px] lg:-mr-8"
            />
            <p className="t-label pointer-events-none absolute bottom-2 right-2 hidden text-ink/45 md:block">Hover a key — click to open</p>
          </div>
        </div>

        {/* bottom rail */}
        <div className="t-label flex items-center justify-between gap-4 border-t border-dotted border-ink/25 py-4 text-ink/70">
          <a href="#work" className="group inline-flex items-center gap-3 transition-colors duration-fast hover:text-accent">
            <span className="scroll-cue" aria-hidden="true" />
            Scroll to work
          </a>
          <span className="inline-flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            {siteConfig.availability}
          </span>
        </div>
      </div>
    </section>
  );
}
