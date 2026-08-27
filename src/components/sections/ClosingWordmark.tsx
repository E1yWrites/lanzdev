"use client";

import { useReveal } from "@/hooks/useReveal";
import { useParallax } from "@/hooks/useParallax";

export function ClosingWordmark() {
  const sectionRef = useReveal({ threshold: 0.05 });
  const parallaxRef = useParallax({ speed: 0.1, direction: "down" });

  return (
    <section
      ref={sectionRef}
      className="relative border-t-2 border-swiss-border overflow-hidden bg-swiss-fg text-swiss-bg"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="reveal relative">
          <h2
            ref={parallaxRef}
            className="font-swiss font-black leading-[0.88] tracking-tighter uppercase select-none"
            style={{
              fontSize: "clamp(3rem, 10vw, 140px)",
            }}
          >
            Building
            <br />
            <span className="text-swiss-accent">software</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
