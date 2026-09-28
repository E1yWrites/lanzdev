"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";
import { PlatformDownloads } from "@/components/project/PlatformDownloads";
import { platformSummary, projectStatus } from "@/lib/projectDisplay";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types/project";

interface DownloadsContentProps {
  project: Project;
  others: Project[];
}

const linkClass =
  "t-label inline-flex min-h-7 items-center gap-1.5 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent";

export function DownloadsContent({ project, others }: DownloadsContentProps) {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const status = projectStatus(project.status);

  return (
    <div ref={sectionRef}>
      <PageHeader
        reveal
        eyebrow="Downloads"
        title={["Download", "the software"]}
        accent="."
        lede="The latest builds of software designed and maintained independently — straight from GitHub Releases."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <Surface tier="solid" className="reveal overflow-hidden rounded-lg">
          <div className="flex flex-col gap-6 border-b border-ink/10 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-center gap-5">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-swiss-fg shadow-[0_12px_30px_-12px_rgb(var(--glow)/0.5)]">
                {project.icon ? (
                  <Image src={project.icon} alt="" fill sizes="64px" className="object-contain p-1.5" />
                ) : (
                  <span aria-hidden="true" className="font-display font-light tracking-tight text-3xl text-swiss-bg">
                    {project.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-light tracking-tight text-3xl text-swiss-fg">{project.name}</h2>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className="mt-1.5 font-mono text-xs text-swiss-fg/60">
                  {[project.version && `v${project.version}`, project.releaseDate && formatDate(project.releaseDate), project.license]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
            <p className="max-w-md font-swiss text-sm leading-relaxed text-swiss-fg/70">{project.description}</p>
          </div>

          <div className="p-6 md:p-8">
            <PlatformDownloads project={project} />

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6">
              <Link href="/releases" className={linkClass}>
                Release notes
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Source code
                <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </a>
              <Link href={project.documentationUrl || "/docs"} className={linkClass}>
                Documentation
                <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Surface>

        {others.length > 0 && (
          <div className="reveal mt-16 md:mt-20">
            <div className="mb-6 flex items-center gap-4">
              <span className="section-number">Also available</span>
              <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
            </div>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {others.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group grid gap-1 py-5 sm:grid-cols-12 sm:items-center sm:gap-6"
                  >
                    <span className="font-display font-light tracking-tight text-lg text-swiss-fg transition-colors duration-fast group-hover:text-swiss-accent sm:col-span-4">
                      {p.name}
                    </span>
                    <span className="font-swiss text-sm text-swiss-fg/60 sm:col-span-5">{p.tagline}</span>
                    <span className="flex items-center justify-between gap-4 font-mono text-[11px] text-swiss-fg/60 sm:col-span-3">
                      {platformSummary(p)}
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform duration-fast group-hover:translate-x-1 group-hover:text-swiss-accent" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
