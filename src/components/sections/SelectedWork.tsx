"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { Badge } from "@/components/ui/Badge";
import { useReveal } from "@/hooks/useReveal";
import type { Project } from "@/types/project";

interface SelectedWorkProps {
  projects: Project[];
}

export function SelectedWork({ projects }: SelectedWorkProps) {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20 border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="03" title="Selected Work" />
        </div>

        {projects.length > 0 ? (
          <div className="reveal grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block"
              >
                <Surface tier="solid" tactile className="h-full p-6 md:p-7 rounded-lg">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="font-mono text-[11px] font-bold tracking-widest text-swiss-fg/40 group-hover:text-swiss-accent transition-colors duration-150">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge variant={project.status === "released" ? "released" : project.status === "archived" ? "archived" : "in-progress"}>
                      {project.status === "released" ? "Released" : project.status === "archived" ? "Archived" : "WIP"}
                    </Badge>
                  </div>

                  <h2 className="font-swiss font-black text-2xl md:text-3xl tracking-tighter uppercase mb-1 group-hover:text-swiss-accent transition-colors duration-150">
                    {project.name}
                  </h2>
                  <p className="font-swiss text-sm text-swiss-fg/70 mb-5 leading-relaxed">
                    {project.tagline}
                  </p>

                  <dl className="grid grid-cols-2 gap-y-2 border-t border-ink/10 pt-4">
                    <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">Platform</dt>
                    <dd className="font-mono text-xs font-medium text-swiss-fg">
                      {project.platforms.length ? project.platforms.join(" / ") : "Source"}
                    </dd>
                    <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">Tech</dt>
                    <dd className="font-mono text-xs font-medium text-swiss-fg">
                      {project.technologies.slice(0, 3).join(" / ") || "—"}
                    </dd>
                  </dl>

                  <span className="inline-block mt-4 font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 group-hover:text-swiss-accent transition-colors duration-150">
                    Take a look →
                  </span>
                </Surface>
              </Link>
            ))}
          </div>
        ) : (
          <div className="reveal mt-8 max-w-lg surface-solid rounded-lg p-6 md:p-8 swiss-grid-pattern">
            <p className="font-swiss text-base text-swiss-fg/70 mb-6 leading-relaxed">
              More software is in development and will be showcased here as it ships.
            </p>
            <Link href="/projects" className="inline-block">
              <Button variant="ghost">View all projects →</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}