"use client";

import { useReveal } from "@/hooks/useReveal";
import { useParallax } from "@/hooks/useParallax";

export function ClosingWordmark() {
  const sectionRef = useReveal({ threshold: 0.05 });
  const parallaxRef = useParallax({ speed: 0.1, direction: "down" });

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-ink/10 overflow-hidden bg-black text-swiss-fg"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-24 opacity-[0.08] pointer-events-none animate-drift"
        style={{
          background:
            "radial-gradient(600px circle at 30% 40%, rgb(var(--accent)), transparent 60%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
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
