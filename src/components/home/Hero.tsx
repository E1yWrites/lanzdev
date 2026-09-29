"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { KineticText } from "@/components/motion/KineticText";
import { ModelStage } from "@/components/three/ModelStage";
import { heroKey, heroPointer, useStore } from "@/components/three/store";
import { PAD_KEYS, type Finish } from "@/three/padKeys";
import { siteConfig } from "@/data/config";
import { asset } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/useMedia";

interface Readout {
  kicker: string;
  title: string;
  body: string;
}

/** What the readout says with no key under the pointer. */
const INTRO: Readout = {
  kicker: "Independent developer",
  title: `Hi, I’m ${siteConfig.alias}.`,
  body: "A 3rd-year IT student in Batangas building web, mobile and desktop apps. Each key opens a part of this site.",
};

/** What it says for each key: the same destination, introduced rather than listed. */
const READOUT: Record<string, Readout> = {
  parada: { kicker: "01  Smart parking", title: "PARADA", body: "Know which zone has space before you drive in. Cameras at the gate, one number everyone trusts." },
  tala: { kicker: "02  Notes + handwriting", title: "Tala", body: "A local-first notebook for Windows and the web. Type, write by hand, import PDFs. No account." },
  about: { kicker: "03  BSIT, LPU-Batangas", title: "About", body: "Who I am, what I study, the student orgs I help run and what I’m learning next." },
  contact: { kicker: "04  Open to an internship", title: "Say hi", body: "Write to me about an internship, a project or anything you’re building." },
};

/** Each key's colour, for the swatch on its button. */
const SWATCH: Record<Finish, string> = {
  accent: "bg-accent",
  solar: "bg-solar",
  white: "bg-ink",
  grey: "bg-ink/45",
};

/**
 * The hero is the macropad. It sits in the middle, its four keys are the site's four
 * destinations, and the readout underneath introduces whichever key is under the
 * pointer. The row of keycap buttons is the same set of keys for touch and keyboard;
 * hovering either lights the other.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const hovered = useStore(heroKey);
  const finePointer = useFinePointer();
  const key = hovered >= 0 ? PAD_KEYS[hovered] : null;
  const readout = key ? READOUT[key.id] : INTRO;

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
    <section ref={section} aria-labelledby="hero-title" className="hero relative overflow-hidden">
      {/* a low glow behind the pad, so it sits on something rather than floating in black */}
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex min-h-[calc(100svh-56px)] max-w-[1600px] flex-col px-5 md:px-8 lg:px-12">
        <KineticText
          id="hero-title"
          lines={["Software for curious people"]}
          accent="."
          delay={180}
          className="relative z-[2] mx-auto mt-8 max-w-[14ch] text-center font-display text-[clamp(3rem,6.4vw,6.75rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink md:mt-10 lg:max-w-none"
        />

        {/* the pad, centred and as large as the screen allows */}
        <div className="relative -mx-5 aspect-[4/3] md:-mx-8 lg:mx-0 lg:-mt-14 lg:aspect-auto lg:min-h-[28rem] lg:flex-1">
          <ModelStage
            model="macropad"
            poster={asset("/art/macropad.webp")}
            alt="A four-key macropad: keys for PARADA, Tala, About and Say hi, a small orange screen and a knurled knob."
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="hero-stage absolute inset-0"
          />
        </div>

        {/* the readout and the keys */}
        <div className="relative z-[2] grid gap-6 border-t border-ink/10 pb-8 pt-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div aria-live="polite" className="hero-fade min-h-[8.5rem] lg:col-span-5 lg:min-h-[7.5rem]" style={{ animationDelay: "700ms" }}>
            <p key={`k-${readout.title}`} className="readout-line t-label whitespace-pre text-accent">
              {readout.kicker}
            </p>
            <p key={`t-${readout.title}`} className="readout-line mt-2 font-display text-3xl font-light leading-none text-ink md:text-4xl">
              {readout.title}
            </p>
            <p key={`b-${readout.title}`} className="readout-line mt-3 max-w-md text-[15px] leading-relaxed text-ink/70 md:text-base">
              {readout.body}
            </p>
          </div>

          <nav aria-label="Index" className="hero-fade lg:col-span-7" style={{ animationDelay: "850ms" }}>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAD_KEYS.map((k, i) => (
                <li key={k.id}>
                  <Link
                    href={k.href}
                    onPointerEnter={() => heroKey.set(i)}
                    onPointerLeave={() => heroKey.get() === i && heroKey.set(-1)}
                    onFocus={() => heroKey.set(i)}
                    onBlur={() => heroKey.get() === i && heroKey.set(-1)}
                    data-on={hovered === i || undefined}
                    className="keycap group flex h-full flex-col justify-between gap-4 rounded-xl p-3.5 md:gap-6"
                  >
                    <span className="flex items-center justify-between">
                      <span className="t-label text-ink/60">{k.index}</span>
                      <span aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-[3px]", SWATCH[k.finish])} />
                    </span>
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-xl font-light leading-none text-ink md:text-2xl">{READOUT[k.id].title}</span>
                      <span aria-hidden="true" className="keycap-arrow t-label text-accent">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="t-label mt-3 flex items-center justify-between gap-4 text-ink/60">
              <span>{finePointer ? "Hover a key to read it, click to open" : "Tap a key to open"}</span>
              <span className="inline-flex items-center gap-2 text-ink/70">
                <span className="live-dot" aria-hidden="true" />
                {siteConfig.availability}
              </span>
            </p>
          </nav>
        </div>
      </div>
    </section>
  );
}
