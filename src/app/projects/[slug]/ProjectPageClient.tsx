"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { BrowserPreview } from "@/components/ui/BrowserPreview";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { Surface } from "@/components/ui/Surface";
import { ChangelogView } from "@/components/project/ChangelogView";
import { PlatformDownloads } from "@/components/project/PlatformDownloads";
import { useReveal } from "@/hooks/useReveal";
import { hasDownloads, platformSummary, projectStatus } from "@/lib/projectDisplay";
import { cn, formatDate } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectPageClientProps {
  project: Project;
  next?: Pick<Project, "slug" | "name" | "tagline">;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Section({
  id,
  index,
  title,
  aside,
  className,
  children,
}: {
  id?: string;
  index: number;
  title: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id ?? title.toLowerCase().replace(/\s+/g, "-")}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("scroll-mt-20 border-t border-ink/10 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center gap-4">
              <span className="section-number">{pad(index)}</span>
              <span aria-hidden="true" className="h-px flex-1 border-t border-dotted border-ink/30" />
            </div>
            <h2 id={headingId} className="font-display font-light tracking-tight text-3xl text-swiss-fg md:text-4xl">
              {title}
            </h2>
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

function hostOf(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
}

export function ProjectPageClient({ project, next }: ProjectPageClientProps) {
  const heroRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const status = projectStatus(project.status);
  const downloadable = hasDownloads(project);
  const shipped = project.features.filter((f) => f.available).length;
  // The hero already shows heroImage — don't repeat it as the only screenshot.
  const screenshots = project.screenshots.filter((shot) => shot.src !== project.heroImage);

  const spec = [
    ["Version", project.version ? `v${project.version}` : "—"],
    ["Status", status.label],
    ["Platform", platformSummary(project)],
    ["Built with", project.technologies.join(" / ") || "—"],
    ["License", project.license],
    ["Updated", project.releaseDate ? formatDate(project.releaseDate) : "—"],
  ];

  // Section numbers follow whatever this project actually has.
  let n = 0;
  const num = () => ++n;

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
          <nav aria-label="Breadcrumb" className="reveal mb-12 flex items-center gap-3 md:mb-16">
            <Link
              href="/projects"
              className="t-label inline-flex items-center gap-2 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
            >
              <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
              Projects
            </Link>
            <span aria-hidden="true" className="text-swiss-fg/20">/</span>
            <span aria-current="page" className="font-mono text-[11px] text-swiss-fg/70">{project.slug}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="reveal mb-6">
                <Badge variant={status.variant}>
                  {project.version ? `v${project.version} · ` : ""}
                  {status.label}
                </Badge>
              </div>

              <h1 className="font-display font-light tracking-tight reveal text-6xl text-swiss-fg sm:text-7xl lg:text-8xl">
                {project.name}
              </h1>

              <p className="reveal mt-6 max-w-xl font-swiss text-xl leading-snug text-swiss-fg md:text-2xl">{project.tagline}</p>
              <p className="reveal mt-4 max-w-xl font-swiss text-base leading-relaxed text-swiss-fg/60">{project.description}</p>

              <div className="reveal mt-10 flex flex-wrap gap-3">
                {downloadable && (
                  <ButtonLink href="#download" variant="primary">
                    <ArrowDown size={14} strokeWidth={2.5} aria-hidden="true" />
                    Download
                  </ButtonLink>
                )}
                {project.demoUrl && (
                  <ButtonLink href={project.demoUrl} external variant={downloadable ? "secondary" : "primary"}>
                    Live demo
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </ButtonLink>
                )}
                <ButtonLink href={project.githubUrl} external variant="secondary">
                  Source
                  <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </ButtonLink>
                {project.documentationUrl && (
                  <ButtonLink href={project.documentationUrl} variant="ghost">
                    Docs
                  </ButtonLink>
                )}
              </div>
            </div>

            <Surface tier="glass" className="reveal self-end rounded-lg p-6 md:p-7 lg:col-span-5">
              <span className="section-number block">Spec sheet</span>
              <dl className="mt-5 divide-y divide-ink/10">
                {spec.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3 first:pt-0 last:pb-0">
                    <dt className="t-label leading-5 text-swiss-fg/60">{label}</dt>
                    <dd className="font-mono text-xs leading-5 text-swiss-fg">{value}</dd>
                  </div>
                ))}
              </dl>
            </Surface>
          </div>

          {project.heroImage && (
            <div className="reveal relative mt-16 md:mt-20">
              <BrowserPreview
                title={project.name}
                url={hostOf(project.demoUrl) ?? hostOf(project.githubUrl)}
                image={project.heroImage}
                imageAlt={`${project.name} application interface`}
                className="relative"
              />
            </div>
          )}
          {!project.heroImage && project.cover && (
            <div className="reveal relative mt-16 aspect-[16/10] overflow-hidden rounded-lg bg-sheet md:mt-20 md:aspect-[2/1]">
              <Image src={project.cover} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-contain p-6 md:p-10" />
            </div>
          )}
        </div>
      </section>

      {/* Story */}
      {project.story && (
        <Section index={num()} title="The story">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="t-label text-swiss-fg/60">Why it exists</span>
              <p className="mt-4 font-display text-2xl font-light leading-snug tracking-tight text-ink sm:text-3xl md:text-4xl">
                {project.story.whyItExists}
              </p>
            </div>
            <div className="lg:col-span-5 lg:pt-8">
              <p className="font-swiss text-base leading-relaxed text-swiss-fg/70">{project.story.content}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <Section
          index={num()}
          title="Features"
          aside={
            <span className="font-mono text-xs text-swiss-fg/50">
              <span className="text-swiss-fg">{pad(shipped)}</span> / {pad(project.features.length)} shipped
            </span>
          }
        >
          <ol className="grid gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {project.features.map((feature, i) => (
              <li key={feature.name} className="flex items-start gap-4 bg-swiss-bg p-4 md:p-5">
                <span className="mt-0.5 w-6 shrink-0 font-mono text-[11px] text-swiss-fg/35">{pad(i + 1)}</span>
                <div className="min-w-0 flex-1">
                  <span className="block font-swiss text-sm font-medium text-swiss-fg">{feature.name}</span>
                  {feature.description && (
                    <span className="mt-1 block font-swiss text-xs leading-relaxed text-swiss-fg/50">{feature.description}</span>
                  )}
                </div>
                {feature.available ? (
                  <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-swiss-accent" aria-label="Available" />
                ) : (
                  <Clock size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-swiss-fg/35" aria-label="Coming soon" />
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <Section index={num()} title="Screenshots">
          <div className={cn("grid gap-8", screenshots.length > 1 && "md:grid-cols-2")}>
            {screenshots.map((shot) => (
              <ImagePreview key={shot.src} src={shot.src} alt={shot.alt} caption={shot.caption} />
            ))}
          </div>
        </Section>
      )}

      {/* Changelog */}
      {project.changelog.length > 0 && (
        <Section
          index={num()}
          title="Changelog"
          aside={
            <Link
              href={project.slug === "tala" ? "/releases" : `/releases?project=${project.slug}`}
              className="t-label inline-flex items-center gap-2 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
            >
              All releases
              <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
            </Link>
          }
        >
          <ChangelogView entries={project.changelog} />
        </Section>
      )}

      {/* Downloads */}
      {downloadable && (
        <Section id="download" index={num()} title="Download">
          <PlatformDownloads project={project} />
        </Section>
      )}

      {/* Next project */}
      {next && (
        <section className="border-t border-ink/10">
          <Link
            href={`/projects/${next.slug}`}
            className="group mx-auto flex max-w-7xl flex-col gap-3 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8 md:py-20"
          >
            <div>
              <span className="t-label text-swiss-fg/60">Next project</span>
              <span className="font-display font-light tracking-tight mt-3 block text-4xl text-swiss-fg transition-colors duration-fast group-hover:text-swiss-accent md:text-6xl">
                {next.name}
              </span>
              <span className="mt-2 block font-swiss text-sm text-swiss-fg/60">{next.tagline}</span>
            </div>
            <ArrowRight
              size={40}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 text-swiss-fg/30 transition-all duration-normal ease-standard group-hover:translate-x-2 group-hover:text-swiss-accent"
            />
          </Link>
        </section>
      )}
    </>
  );
}
