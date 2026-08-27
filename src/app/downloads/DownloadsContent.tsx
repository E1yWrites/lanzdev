"use client";

import { getFeaturedProject } from "@/data/projects";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Hairline } from "@/components/ui/Hairline";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/Badge";

const PLATFORM_CARDS = [
  {
    key: "windows" as const,
    label: "Windows",
    details: ["Windows 10 / 11", "x64"],
  },
  {
    key: "macos" as const,
    label: "macOS",
    details: ["Apple Silicon", "ARM64"],
  },
  {
    key: "linux" as const,
    label: "Linux",
    details: ["x86_64", "AppImage / DEB / RPM"],
  },
];

export function DownloadsContent() {
  const project = getFeaturedProject();
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  if (!project) return null;

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-10">
          <h1 className="reveal font-swiss font-black text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-swiss-fg mb-3">
            Download
            <br />
            the software<span className="text-swiss-accent">.</span>
          </h1>
          <p className="reveal font-swiss text-base text-swiss-fg/70 max-w-md mt-4 leading-relaxed">
            Download the latest builds of software designed and maintained
            independently.
          </p>
        </div>

        <div className="reveal">
          <div className="border-2 border-swiss-border">
            <div className="p-6 md:p-8 border-b-2 border-swiss-border bg-swiss-muted">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h2 className="font-swiss font-black text-3xl tracking-tighter uppercase text-swiss-fg">{project.name}</h2>
                  <Badge variant={project.status === "released" ? "released" : "in-progress"}>
                    {project.status === "released" ? "Released" : "Coming soon"}
                  </Badge>
                </div>
                <p className="font-swiss text-sm text-swiss-fg/70 max-w-md leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-swiss-border">
                {PLATFORM_CARDS.map((platform, i) => {
                  const dl = project.downloads[platform.key];
                  return (
                    <div
                      key={platform.key}
                      className={`p-5 ${i < PLATFORM_CARDS.length - 1 ? "border-b-2 sm:border-b-0 sm:border-r-2 border-swiss-border" : ""} ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
                    >
                      <span className="font-swiss font-black text-xl tracking-tighter uppercase text-swiss-fg block mb-2">
                        {platform.label}
                      </span>
                      {platform.details.map((d) => (
                        <span key={d} className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block">
                          {d}
                        </span>
                      ))}
                      <div className="mt-4">
                        {dl?.available ? (
                          <>
                            <DownloadButton
                              url={dl.url}
                              platform={platform.label}
                              className="w-full"
                            />
                            <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 mt-2 block">
                              {dl.fileSize}
                            </span>
                          </>
                        ) : (
                          <DownloadButton state="coming-soon" className="w-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Hairline className="my-6" />

              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {[
                  { href: "/releases", label: "Release notes" },
                  { href: project.githubUrl, label: "Source code", external: true },
                  { href: project.documentationUrl || "/docs", label: "Documentation" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
