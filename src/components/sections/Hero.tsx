"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { asset } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

export function Hero() {
  const sectionRef = useReveal({ threshold: 0.1, stagger: true, staggerDelay: 60 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-black"
    >
      {/* Generated hero art — cinematic backdrop, pushed right so it clears the text column */}
      <div className="absolute inset-0 z-0 animate-drift">
        <Image
          src={asset("/images/tala-hero-cinematic.webp")}
          alt="Tala — a handwriting-inspired note-taking app, shown floating in a dark cinematic studio"
          fill
          priority
          className="object-cover object-[85%_center] opacity-90"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] surface-glow"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black from-0% via-black/95 via-40% to-transparent to-75% lg:via-45% lg:to-70%"
      />

      <div className="relative z-[2] max-w-7xl mx-auto px-5 md:px-8 min-h-[calc(100vh-56px)] flex items-center py-16 md:py-20 lg:py-0">
        <div className="w-full max-w-2xl">
          <div className="reveal mb-8 md:mb-10">
            <span className="section-number">01. Introduction</span>
          </div>

          <div className="reveal overflow-visible">
            <span className="font-swiss font-black uppercase text-swiss-fg text-display inline-block">
              Building
            </span>
          </div>

          <div className="reveal overflow-visible -mt-1 md:-mt-2">
            <span className="font-swiss font-black uppercase text-swiss-fg text-display inline-flex items-center">
              Software
              <span className="hidden md:inline-block ml-4 md:ml-6 lg:ml-8 h-[3px] bg-swiss-accent flex-shrink-0" style={{ width: "clamp(2rem, 8vw, 12rem)" }} />
            </span>
          </div>

          <div className="reveal overflow-visible mt-8 md:mt-6">
            <span className="font-swiss font-black uppercase text-swiss-fg/50 leading-[0.88] tracking-[-0.04em] inline-block text-4xl md:text-6xl">
              For
            </span>
          </div>

          <div className="reveal overflow-visible -mt-1">
            <span className="font-swiss font-black uppercase text-swiss-accent text-display inline-block">
              Curious
            </span>
          </div>

          <div className="reveal overflow-visible -mt-1 md:-mt-2">
            <span className="font-swiss font-black uppercase text-swiss-fg text-display inline-block">
              People
            </span>
          </div>

          <div className="reveal mt-10 md:mt-14">
            <p className="font-swiss text-base md:text-lg text-swiss-fg/70 mb-8 leading-relaxed">
              Independent developer designing and building modern software
              across productivity, creative tools, web applications and desktop
              experiences. Currently shipping{" "}
              <span className="text-swiss-fg">Tala</span> — pagtatala, made simple.
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
    </section>
  );
}
