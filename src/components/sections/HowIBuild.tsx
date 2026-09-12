"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/config";
import { useReveal } from "@/hooks/useReveal";

export function HowIBuild() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  const tech = siteConfig.technologies;

  const categories = [
    { label: "Frontend", items: tech.frontend },
    { label: "Desktop", items: tech.desktop },
    { label: "Database", items: tech.database },
    { label: "Version control", items: tech.versionControl },
    { label: "Focus", items: tech.focus },
  ];

  return (
    <section ref={sectionRef} className="py-20 border-t border-ink/10 bg-ink/[0.02] swiss-diagonal">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="04" title="How I Build" />
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left — Title */}
          <div className="reveal md:col-span-5">
            <h2 className="font-swiss font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-swiss-fg leading-[0.9]">
              How
              <br />
              I build
            </h2>
            <p className="font-swiss text-base text-swiss-fg/70 mt-6 max-w-sm leading-relaxed">
              The technologies and tools I use to design, develop, and ship
              software.
            </p>
          </div>

          {/* Right — Tech list */}
          <div className="reveal md:col-span-7 surface-solid rounded-lg overflow-hidden divide-y divide-ink/10">
            {categories.map((cat, i) => (
              <div key={cat.label} className={`p-5 ${i % 2 === 0 ? "" : "bg-ink/[0.02]"}`}>
                <span className="section-number mb-3 block">
                  {cat.label}
                </span>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  {cat.items.map((item) => (
                    <span key={item} className="font-swiss text-sm font-medium text-swiss-fg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
