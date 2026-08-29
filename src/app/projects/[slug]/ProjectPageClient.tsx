"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrowserPreview } from "@/components/ui/BrowserPreview";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { ChangelogView } from "@/components/project/ChangelogView";
import type { Project } from "@/types/project";

interface ProjectPageClientProps {
  project: Project;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="section-number inline-block mb-6">
      {children}
    </span>
  );
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const meta = [
    { label: "Project", value: project.name },
    { label: "Version", value: project.version ? `v${project.version}` : "—" },
    { label: "Platform", value: project.platforms.length ? project.platforms.join(" / ") : "Source" },
    { label: "Status", value: project.status, capitalize: true },
    { label: "Built with", value: project.technologies.length ? project.technologies.join(" / ") : "—" },
    { label: "License", value: project.license },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 border-b-2 border-swiss-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-6">
            <Badge variant={project.status === "released" ? "released" : project.status === "in-progress" ? "in-progress" : project.status === "archived" ? "archived" : "planned"}>
              {project.version ? `v${project.version} ` : ""}
              {project.status === "released" ? "released" : project.status === "in-progress" ? "in progress" : project.status === "archived" ? "archived" : "planned"}
            </Badge>
          </div>

          <h1 className="font-swiss font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter uppercase text-swiss-fg mb-4">
            {project.name}
          </h1>

          <p className="font-swiss text-xl md:text-2xl text-swiss-fg/70 mb-8 max-w-lg leading-relaxed">
            {project.tagline}
          </p>

          <p className="font-swiss text-base text-swiss-fg/70 max-w-xl mb-10 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {project.downloads.windows?.available && (
              <a
                href={project.downloads.windows.url}
                download
                className="inline-flex items-center justify-center gap-2 h-12 px-6 font-swiss text-xs font-bold tracking-widest uppercase bg-swiss-fg text-swiss-bg border-2 border-swiss-border hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150"
              >
                Download for Windows
              </a>
            )}
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary">View on GitHub</Button>
            </Link>
            {project.documentationUrl && (
              <Link href={project.documentationUrl}>
                <Button variant="secondary">Documentation</Button>
              </Link>
            )}
          </div>

          {/* Browser preview */}
          {project.heroImage && (
            <BrowserPreview
              title={project.name}
              url={`${project.name.toLowerCase()}.app`}
              image={project.heroImage}
              imageAlt={`${project.name} application interface`}
              className="max-w-4xl"
            />
          )}
        </div>
      </section>

      {/* Metadata */}
      <section className="py-12 md:py-16 border-b-2 border-swiss-border bg-swiss-muted swiss-dots">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block mb-1">
                  {m.label}
                </dt>
                <dd className={`font-swiss text-sm font-medium text-swiss-fg ${m.capitalize ? "capitalize" : ""}`}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      {project.story && (
        <section className="py-16 md:py-24 border-b-2 border-swiss-border">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <SectionLabel>Why it exists</SectionLabel>
                <h2 className="font-swiss font-black text-2xl md:text-3xl tracking-tighter uppercase text-swiss-fg leading-snug">
                  {project.story.whyItExists}
                </h2>
              </div>
              <div>
                <SectionLabel>The story</SectionLabel>
                <p className="font-swiss text-base text-swiss-fg/70 leading-relaxed">
                  {project.story.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <section className="py-16 md:py-24 border-b-2 border-swiss-border bg-swiss-muted swiss-grid-pattern">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionLabel>Features</SectionLabel>

            <ol className="border-2 border-swiss-border">
              {project.features.map((feature, i) => (
                <li
                  key={feature.name}
                  className={`flex items-center justify-between py-4 gap-4 border-b-2 border-swiss-border last:border-0 px-5 ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-swiss text-[11px] font-bold tracking-widest text-swiss-fg/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-swiss text-sm font-medium text-swiss-fg truncate">
                      {feature.name}
                    </span>
                  </div>
                  <span
                    className={`font-swiss text-[10px] font-bold tracking-widest uppercase shrink-0 ${
                      feature.available ? "text-swiss-accent" : "text-swiss-fg/40"
                    }`}
                  >
                    {feature.available ? "Available" : "Coming soon"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Screenshots */}
      {project.screenshots.length > 0 && (
        <section className="py-16 md:py-24 border-b-2 border-swiss-border">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <SectionLabel>Screenshots</SectionLabel>

            <div className="space-y-10">
              {project.screenshots.map((shot) => (
                <ImagePreview
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  caption={shot.caption}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Changelog */}
      {project.changelog.length > 0 && (
        <section className="py-16 md:py-24 border-b-2 border-swiss-border bg-swiss-muted swiss-diagonal">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <ChangelogView entries={project.changelog} />
          </div>
        </section>
      )}

      {/* Downloads */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionLabel>Download</SectionLabel>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-swiss-border">
            {(["windows", "macos", "linux"] as const).map((key, i) => {
              const dl = project.downloads[key];
              if (!dl) return null;
              return (
                <div
                  key={key}
                  className={`p-5 ${i < 2 ? "border-b-2 sm:border-b-0 sm:border-r-2 border-swiss-border" : ""} ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
                >
                  <span className="font-swiss font-black text-xl tracking-tighter uppercase text-swiss-fg block mb-3">
                    {key === "macos" ? "macOS" : key[0].toUpperCase() + key.slice(1)}
                  </span>
                  {dl.available ? (
                    <>
                      <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block mb-3">
                        {dl.architecture ?? "x64"} · {dl.fileSize}
                      </span>
                      <DownloadButton
                        url={dl.url}
                        platform={key.toUpperCase()}
                      />
                    </>
                  ) : (
                    <DownloadButton state="coming-soon" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
