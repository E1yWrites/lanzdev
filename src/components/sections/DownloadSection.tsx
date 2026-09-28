"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlatformDownloads } from "@/components/project/PlatformDownloads";
import { useReveal } from "@/hooks/useReveal";
import type { Project } from "@/types/project";

interface DownloadSectionProps {
  project: Project;
}

export function DownloadSection({ project }: DownloadSectionProps) {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20 border-t border-ink/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="05" title="Download Software" />
        </div>

        <div className="reveal mb-10">
          <h2 className="font-swiss font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-swiss-fg mb-4">
            Grab the
            <br />
            software<span className="text-swiss-accent">.</span>
          </h2>
          <p className="font-swiss text-base text-swiss-fg/70 max-w-md leading-relaxed">
            Download the latest builds of software designed and maintained
            independently.
          </p>
        </div>

        <div className="reveal surface-solid rounded-lg overflow-hidden">
          <div className="p-6 md:p-8 border-b border-ink/10 bg-ink/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-swiss font-black text-2xl tracking-tighter uppercase text-swiss-fg">{project.name}</h3>
                <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
                  v{project.version}
                </span>
              </div>
              <p className="font-swiss text-sm text-swiss-fg/70 max-w-xs leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PlatformDownloads project={project} />

            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 pt-5 border-t border-ink/10">
              {[
                { href: "/releases", label: "Release notes" },
                { href: project.githubUrl, label: "Source code", external: true },
                { href: project.documentationUrl || "/docs", label: "Documentation" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
