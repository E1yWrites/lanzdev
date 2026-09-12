"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Surface } from "@/components/ui/Surface";
import { siteConfig } from "@/data/config";
import { useReveal } from "@/hooks/useReveal";
import { asset } from "@/lib/constants";

export function AboutPreview() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20 border-t border-ink/10 bg-ink/[0.02] swiss-grid-pattern">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="06" title="About Lorenz" />
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left — Profile card */}
          <Surface tier="elevated" className="reveal p-6 md:p-8 md:col-span-5 rounded-lg">
            {/* Profile image */}
            <div className="mb-6 w-20 h-20 relative overflow-hidden rounded-full border border-ink/10">
              <Image
                src={asset("/images/profilepic.png")}
                alt="Lorenz Malabanan"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <h2 className="font-swiss font-black text-3xl md:text-4xl tracking-tighter uppercase text-swiss-fg mb-4">
              Lorenz
              <br />
              Malabanan
            </h2>

            <ul className="space-y-1 mb-8">
              {[siteConfig.education.level + " year BSIT", siteConfig.education.institution, "Independent software developer", siteConfig.education.location].map(
                (line, i) => (
                  <li key={i} className="font-swiss text-sm text-swiss-fg/70 flex items-start gap-2">
                    <span className="text-swiss-accent font-bold">—</span>
                    {line}
                  </li>
                )
              )}
            </ul>

            <Link href="/about" className="inline-block">
              <Button variant="secondary">More about me</Button>
            </Link>
          </Surface>

          {/* Right — Details */}
          <div className="reveal md:col-span-7 space-y-4">
            <div className="surface-solid rounded-lg p-5">
              <span className="section-number mb-4 block">
                Focus
              </span>
              <div className="flex flex-wrap gap-2">
                {siteConfig.focus.map((item) => (
                  <span
                    key={item}
                    className="tactile font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg border border-ink/15 rounded-full px-3 py-2 hover:bg-swiss-fg hover:text-swiss-bg hover:border-swiss-fg transition-colors duration-fast"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-solid rounded-lg p-5">
              <span className="section-number mb-4 block">
                Certifications
              </span>
              <ul className="space-y-2">
                {siteConfig.certifications.map((cert) => (
                  <li key={cert} className="font-swiss text-sm text-swiss-fg flex items-start gap-2">
                    <span className="text-swiss-accent font-bold">—</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-subtle rounded-lg border border-dashed border-ink/15 p-5 swiss-dots">
              <span className="section-number mb-2 block">
                Resume
              </span>
              <span className="font-swiss text-sm text-swiss-fg/50">
                Download CV — coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
