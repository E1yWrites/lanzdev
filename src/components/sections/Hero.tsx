"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TerminalPreview } from "@/components/ui/TerminalPreview";
import { useReveal } from "@/hooks/useReveal";

export function Hero() {
  const sectionRef = useReveal({ threshold: 0.1, stagger: true, staggerDelay: 60 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-64px)] overflow-hidden swiss-grid-pattern"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 min-h-[calc(100vh-64px)] flex items-center py-16 md:py-20 lg:py-0">
        <div className="w-full relative">
          {/* Section label */}
          <div className="reveal mb-8 md:mb-10">
            <span className="section-number">01. Introduction</span>
          </div>

          {/* Asymmetrical hero composition */}
          <div className="relative">
            {/* Typography — editorial poster layout */}
            <div className="relative z-[2]">
              {/* Line 1: BUILDING — strong horizontal presence */}
              <div className="reveal overflow-visible">
                <span
                  className="font-swiss font-black uppercase text-swiss-fg leading-[0.88] tracking-[-0.04em] inline-block"
                  style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
                >
                  Building
                </span>
              </div>

              {/* Line 2: SOFTWARE — extends to the right, crossing boundary */}
              <div className="reveal overflow-visible -mt-1 md:-mt-2">
                <span
                  className="font-swiss font-black uppercase text-swiss-fg leading-[0.88] tracking-[-0.04em] inline-flex items-center"
                  style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
                >
                  Software
                  {/* Decorative extension line */}
                  <span className="hidden md:inline-block ml-4 md:ml-6 lg:ml-8 h-[3px] bg-swiss-accent flex-shrink-0" style={{ width: "clamp(2rem, 8vw, 12rem)" }} />
                </span>
              </div>

              {/* Terminal — overlaps right side on desktop */}
              <div className="reveal relative lg:absolute lg:top-[55%] lg:right-0 lg:-translate-y-1/2 lg:w-[45%] xl:w-[42%] mt-8 lg:mt-0 z-[3]">
                <TerminalPreview className="w-full" />
              </div>

              {/* Line 3: FOR — small, offset */}
              <div className="reveal overflow-visible mt-8 md:mt-10 lg:mt-8">
                <span
                  className="font-swiss font-black uppercase text-swiss-fg/50 leading-[0.88] tracking-[-0.04em] inline-block"
                  style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
                >
                  For
                </span>
              </div>

              {/* Line 4: CURIOUS — accent color, horizontal extension */}
              <div className="reveal overflow-visible -mt-1">
                <span
                  className="font-swiss font-black uppercase text-swiss-accent leading-[0.88] tracking-[-0.04em] inline-flex items-center"
                  style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
                >
                  Curious
                  {/* Decorative extension line */}
                  <span className="hidden md:inline-block ml-4 md:ml-6 lg:ml-8 h-[3px] bg-swiss-accent/30 flex-shrink-0" style={{ width: "clamp(1.5rem, 6vw, 9rem)" }} />
                </span>
              </div>

              {/* Line 5: PEOPLE — anchors the composition */}
              <div className="reveal overflow-visible -mt-1 md:-mt-2">
                <span
                  className="font-swiss font-black uppercase text-swiss-fg leading-[0.88] tracking-[-0.04em] inline-block"
                  style={{ fontSize: "clamp(3rem, 7.5vw, 8rem)" }}
                >
                  People
                </span>
              </div>
            </div>

            {/* Supporting content — positioned below the composition */}
            <div className="reveal mt-10 md:mt-14 max-w-md lg:max-w-lg">
              <p className="font-swiss text-base md:text-lg text-swiss-fg/70 mb-8 leading-relaxed">
                Independent developer designing and building modern software
                across productivity, creative tools, web applications and desktop
                experiences.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link href="/projects">
                  <Button variant="primary" size="lg">View Projects</Button>
                </Link>
                <Link href="/downloads">
                  <Button variant="secondary" size="lg">Download Software</Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                {["Software", "Design", "Development"].map((label) => (
                  <span
                    key={label}
                    className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
