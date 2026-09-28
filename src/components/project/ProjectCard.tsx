"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { platformSummary, projectStatus } from "@/lib/projectDisplay";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index: number;
  /** h2 on the projects index, h3 under a section heading. */
  headingLevel?: "h2" | "h3";
  className?: string;
}

export function ProjectCard({ project, index, headingLevel: Heading = "h3", className }: ProjectCardProps) {
  const status = projectStatus(project.status);
  const meta = [
    ["Platform", platformSummary(project)],
    ["Stack", project.technologies.slice(0, 3).join(" / ")],
    ["Updated", project.releaseDate && formatDate(project.releaseDate)],
  ].filter(([, value]) => value);

  return (
    <Link href={`/projects/${project.slug}`} className={`group block rounded-lg ${className ?? ""}`}>
      <Surface tier="solid" tactile className="flex h-full flex-col rounded-lg p-6 transition-colors duration-normal group-hover:border-ink/20 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <span className="t-label text-swiss-fg/60 transition-colors duration-fast group-hover:text-swiss-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <Heading className="font-display font-light tracking-tight text-2xl text-swiss-fg transition-colors duration-fast group-hover:text-swiss-accent md:text-3xl">
          {project.name}
        </Heading>
        <p className="mb-6 mt-2 font-swiss text-sm leading-relaxed text-swiss-fg/70">{project.tagline}</p>

        <dl className="mt-auto grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-ink/10 pt-4">
          {meta.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="t-label leading-5 text-swiss-fg/60">{label}</dt>
              <dd className="truncate font-mono text-xs leading-5 text-swiss-fg">{value}</dd>
            </div>
          ))}
        </dl>

        <span className="t-label mt-5 inline-flex items-center gap-2 text-swiss-fg/60 transition-colors duration-fast group-hover:text-swiss-accent">
          Take a look
          <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" className="transition-transform duration-fast group-hover:translate-x-1" />
        </span>
      </Surface>
    </Link>
  );
}
