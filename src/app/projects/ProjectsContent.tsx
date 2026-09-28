"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";
import { ProjectCard } from "@/components/project/ProjectCard";
import { siteConfig } from "@/data/config";
import { platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

interface ProjectsContentProps {
  projects: Project[];
}

const pad = (n: number) => String(n).padStart(2, "0");

function LeadProject({ project }: { project: Project }) {
  const status = projectStatus(project.status);
  const meta = [
    ["Version", project.version && `v${project.version}`],
    ["Platform", platformSummary(project)],
    ["Stack", project.technologies.slice(0, 4).join(" / ")],
  ].filter(([, value]) => value);

  return (
    <Link href={`/projects/${project.slug}`} className="group block rounded-lg">
      <Surface tier="elevated" className="grid overflow-hidden rounded-lg transition-colors duration-normal group-hover:border-ink/20 lg:grid-cols-12">
        <div className="relative order-1 aspect-[16/10] overflow-hidden border-b border-ink/10 bg-ink/[0.02] lg:order-2 lg:col-span-7 lg:aspect-auto lg:min-h-[420px] lg:border-b-0 lg:border-l">
          {project.heroImage ? (
            <Image
              src={project.heroImage}
              alt={`${project.name} application interface`}
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover object-left-top transition-transform duration-slow ease-standard group-hover:scale-[1.02]"
            />
          ) : (
            <span className="font-display font-light tracking-tight absolute inset-0 flex items-end p-8 text-6xl leading-none text-swiss-fg/10">
              {project.name}
            </span>
          )}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-black/30" />
        </div>

        <div className="order-2 flex flex-col p-6 md:p-10 lg:order-1 lg:col-span-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <span className="t-label text-swiss-accent">01 — Featured</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <h2 className="font-display font-light tracking-tight text-5xl text-swiss-fg transition-colors duration-fast group-hover:text-swiss-accent md:text-6xl">
            {project.name}
          </h2>
          <p className="mt-4 font-swiss text-lg leading-snug text-swiss-fg">{project.tagline}</p>
          <p className="mt-3 line-clamp-3 font-swiss text-sm leading-relaxed text-swiss-fg/60">{project.description}</p>

          <div aria-hidden="true" className="min-h-8 flex-1" />
          <dl className="mb-8 grid grid-cols-[5.5rem_1fr] gap-y-2 border-t border-ink/10 pt-5">
            {meta.map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="t-label leading-5 text-swiss-fg/60">{label}</dt>
                <dd className="font-mono text-xs leading-5 text-swiss-fg">{value}</dd>
              </div>
            ))}
          </dl>

          <span className="t-label inline-flex items-center gap-2 text-swiss-fg/60 transition-colors duration-fast group-hover:text-swiss-accent">
            Open project
            <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" className="transition-transform duration-fast group-hover:translate-x-1" />
          </span>
        </div>
      </Surface>
    </Link>
  );
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const lead = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== lead);
  const released = projects.filter((p) => p.status === "released").length;

  return (
    <div ref={sectionRef}>
      <PageHeader
        reveal
        eyebrow="Index / Projects"
        title="Projects"
        lede="Software I've designed and built — shipped apps, work in progress and the experiments along the way."
        stats={[
          ["Projects", pad(projects.length)],
          ["Released", pad(released)],
          ["Synced from", "GitHub"],
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        {lead && (
          <div className="reveal">
            <LeadProject project={lead} />
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + 1} headingLevel="h2" className="reveal" />
            ))}
          </div>
        )}

        <div className="reveal mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center">
          <span className="t-label text-swiss-fg/60">
            More software in development
          </span>
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="t-label inline-flex items-center gap-1.5 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
          >
            All repositories on GitHub
            <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
