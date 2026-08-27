"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";

export function SelectedWork() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20 border-t-2 border-swiss-border">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="03" title="Selected Work" />
        </div>

        <div className="reveal mt-8 max-w-lg border-2 border-swiss-border p-6 md:p-8 bg-swiss-muted swiss-grid-pattern">
          <p className="font-swiss text-base text-swiss-fg/70 mb-6 leading-relaxed">
            Tala is the flagship project — a note-taking app built around the
            idea of pagtatala. More software is in development and will be
            showcased here as it ships.
          </p>
          <Link href="/projects/tala" className="inline-block">
            <Button variant="ghost">View Tala →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
