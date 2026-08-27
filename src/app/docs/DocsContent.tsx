"use client";

import Link from "next/link";
import { docsByProject } from "@/data/docs";
import { Card } from "@/components/ui/Card";
import { useReveal } from "@/hooks/useReveal";

export function DocsContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  const projects = Object.entries(docsByProject);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12">
          <h1 className="reveal font-swiss font-black text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-swiss-fg mb-4">
            Documentation
          </h1>
          <p className="reveal font-swiss text-base text-swiss-fg/70 leading-relaxed">
            Everything you need to get started with our software.
          </p>
        </div>

        {projects.map(([projectKey, projectDocs]) => (
          <div key={projectKey} className="reveal mb-14">
            <div className="flex items-center gap-4 mb-6">
              <span className="section-number">{projectKey}</span>
              <span className="flex-1 h-[2px] bg-swiss-border" />
            </div>

            <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3 border-2 border-swiss-border">
              {projectDocs.navItems.map((item, i) => (
                <Link key={item.slug} href={`/docs/${item.slug}`} className="group">
                  <Card className={`h-full p-5 border-0 ${i < projectDocs.navItems.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2" : ""} ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}>
                    <h3 className="font-swiss font-bold text-sm uppercase tracking-tight text-swiss-fg mb-2 group-hover:text-swiss-accent transition-colors duration-150">
                      {item.title}
                    </h3>
                    <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50 inline-flex items-center gap-1.5 group-hover:text-swiss-accent transition-colors duration-150">
                      Read
                      <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
