"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/config";
import { Hairline } from "@/components/ui/Hairline";
import { useReveal } from "@/hooks/useReveal";

export function ContactContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">
          <h1 className="reveal font-swiss font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-swiss-fg leading-[0.9] mb-8">
            Have a
            <br />
            project in mind<span className="text-swiss-accent">?</span>
          </h1>

          <p className="reveal font-swiss text-lg md:text-xl text-swiss-fg/70 mb-10 leading-relaxed">
            Let&apos;s build something worth using.
          </p>

          <div className="reveal flex flex-wrap gap-4 mb-12">
            <a href={`mailto:${siteConfig.email}`}>
              <Button variant="accent" size="lg" className="group/cta">
                Get in touch
                <span className="inline-block transition-transform duration-150 group-hover/cta:translate-x-1">→</span>
              </Button>
            </a>
            <Link
              href={siteConfig.github.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg" className="group/cta">
                GitHub
                <span className="inline-block transition-transform duration-150 group-hover/cta:translate-x-1">↗</span>
              </Button>
            </Link>
          </div>

          <div className="reveal">
            <Hairline className="mb-8" />
          </div>

          <div className="reveal border-t-2 border-swiss-border pt-8 mb-8">
            <span className="section-number block mb-2">
              Email
            </span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-swiss text-lg md:text-xl text-swiss-fg break-all hover:text-swiss-accent transition-colors duration-150"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="reveal">
            <span className="section-number block mb-4">
              Elsewhere
            </span>
            <div className="flex flex-wrap gap-6">
              <a
                href={siteConfig.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-swiss text-sm font-medium text-swiss-fg hover:text-swiss-accent transition-colors duration-150"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
