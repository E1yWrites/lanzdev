"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { getFeaturedProject } from "@/data/projects";
import { useReveal } from "@/hooks/useReveal";

const PLATFORMS = [
  {
    key: "windows" as const,
    label: "Windows",
    detail: "Windows 10 / 11 · x64",
  },
  {
    key: "macos" as const,
    label: "macOS",
    detail: "Apple Silicon · ARM64",
  },
  {
    key: "linux" as const,
    label: "Linux",
    detail: "x86_64",
  },
];

export function DownloadSection() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const project = getFeaturedProject();

  if (!project) return null;

  return (
    <section ref={sectionRef} className="py-20 border-t-2 border-swiss-border">
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

        <div className="reveal border-2 border-swiss-border">
          <div className="p-6 md:p-8 border-b-2 border-swiss-border bg-swiss-muted">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-swiss-border">
              {PLATFORMS.map((platform, i) => {
                const dl = project.downloads[platform.key];
                return (
                  <div
                    key={platform.key}
                    className={`p-5 ${i < PLATFORMS.length - 1 ? "border-b-2 sm:border-b-0 sm:border-r-2 border-swiss-border" : ""} ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
                  >
                    <span className="font-swiss font-black text-xl tracking-tighter uppercase text-swiss-fg block mb-1">
                      {platform.label}
                    </span>
                    <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block mb-4">
                      {dl?.available ? platform.detail : `${platform.detail} — coming soon`}
                    </span>
                    <DownloadButton
                      url={dl?.available ? dl.url : undefined}
                      state={dl?.available ? "available" : "coming-soon"}
                      label="Download"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6 pt-5 border-t-2 border-swiss-border">
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
