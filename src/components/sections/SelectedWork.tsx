"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/project/ProjectCard";
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
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="reveal mt-8 max-w-lg surface-solid rounded-lg p-6 md:p-8 swiss-grid-pattern">
            <p className="font-swiss text-base text-swiss-fg/70 mb-6 leading-relaxed">
              More software is in development and will be showcased here as it ships.
            </p>
            <ButtonLink href="/projects" variant="ghost">View all projects →</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
