"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { BrowserPreview } from "@/components/ui/BrowserPreview";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { CountUp } from "@/components/motion/CountUp";
import { FilmPlayer } from "@/components/motion/FilmPlayer";
import { KineticText } from "@/components/motion/KineticText";
import { ModelStage } from "@/components/three/ModelStage";
import { Roadmap } from "@/components/project/Roadmap";
import { useFinePointer } from "@/hooks/useMedia";
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

  const [night, setNight] = useState(false);
  const isTala = project.model === "tala";
  const fine = useFinePointer();
  const hint = isTala
    ? fine
      ? "Hover to write · click for night · drag to turn"
      : "Tap for night · drag to turn"
    : fine
      ? "Hover to play · drag to turn"
      : "Plays on its own · drag to turn";
  const spec = [
    ["Version", project.version ? `v${project.version}` : "—"],
    ["Status", status.label],
    ["Runs on", platformSummary(project)],
    ["Built with", project.technologies.join(" / ") || "—"],
    ["Licence", project.license],
    ["Updated", project.releaseDate ? formatDate(project.releaseDate) : "—"],
  ].filter(([, value]) => value);

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
              className="t-label inline-flex min-h-7 items-center gap-2 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
            >
              <ArrowLeft size={12} strokeWidth={2.5} aria-hidden="true" />
              Projects
            </Link>
            <span aria-hidden="true" className="text-swiss-fg/60">/</span>
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

              <KineticText lines={[project.name]} className="font-display text-6xl font-light tracking-tight text-swiss-fg sm:text-7xl lg:text-8xl" />

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
                    {project.model === "parada" ? "Landing page" : "Live demo"}
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </ButtonLink>
                )}
                {project.film && (
                  <ButtonLink href="#film" variant="secondary">
                    Watch the film
                  </ButtonLink>
                )}
                <ButtonLink href={project.githubUrl} external variant="secondary">
                  Source
                  <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                </ButtonLink>
                {project.links?.map((link) => (
                  <ButtonLink key={link.href} href={link.href} external variant="ghost">
                    {link.label}
                    <ArrowUpRight size={14} strokeWidth={2.5} aria-hidden="true" />
                  </ButtonLink>
                ))}
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
            <div className={cn("reveal relative mt-16 overflow-hidden rounded-xl md:mt-20", { accent: "bg-accent", solar: "bg-solar", stone: "bg-sheet-grey", sheet: "bg-sheet" }[project.tone ?? "sheet"])}>
              {project.model ? (
                <ModelStage
                  model={project.model}
                  poster={project.cover}
                  alt={`${project.name} as a 3D model`}
                  priority
                  sizes="(min-width: 1280px) 1024px, 100vw"
                  draggable
                  night={night}
                  cursor={isTala ? "Drag · click for night" : "Drag · hover to play"}
                  onClick={isTala ? () => setNight((v) => !v) : undefined}
                  className="mx-auto aspect-[4/3] w-full max-w-5xl"
                />
              ) : null}
              <p className="t-label pointer-events-none absolute left-5 top-5 text-on-sheet/70">
                {hint}
              </p>
            </div>
          )}

          {project.stats && (
            <dl className="reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-dotted border-ink/25 pt-8 md:grid-cols-4">
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="t-label mt-2 text-ink/60">{stat.label}</dt>
                  <dd className="font-display text-5xl font-light leading-none text-ink md:text-6xl">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Film */}
      {project.film && (
        <Section id="film" index={num()} title={`${project.film.duration} seconds of ${project.name}`}>
          <FilmPlayer film={project.film} title={project.name} className="rounded-xl border border-ink/10" />
          <p className="t-label mt-3 text-ink/60">Rendered with Remotion from the same 3D model as above. Sound on — the soundtrack is synthesised, not sampled.</p>
        </Section>
      )}

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

      {/* Roadmap */}
      {project.milestones && project.milestones.length > 0 && (
        <Section
          index={num()}
          title="Roadmap"
          aside={
            <span className="font-mono text-xs text-swiss-fg/60">
              <span className="text-swiss-fg">{pad(project.milestones.filter((m) => m.status === "done").length)}</span> / {pad(project.milestones.length)} phases done
            </span>
          }
        >
          <Roadmap milestones={project.milestones} />
        </Section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <Section
          index={num()}
          title="Features"
          aside={
            <span className="font-mono text-xs text-swiss-fg/60">
              <span className="text-swiss-fg">{pad(shipped)}</span> / {pad(project.features.length)} shipped
            </span>
          }
        >
          <ol className="grid gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {project.features.map((feature, i) => (
              <li key={feature.name} className="flex items-start gap-4 bg-swiss-bg p-4 md:p-5">
                <span className="mt-0.5 w-6 shrink-0 font-mono text-[11px] text-swiss-fg/60">{pad(i + 1)}</span>
                <div className="min-w-0 flex-1">
                  <span className="block font-swiss text-sm font-medium text-swiss-fg">{feature.name}</span>
                  {feature.description && (
                    <span className="mt-1 block font-swiss text-xs leading-relaxed text-swiss-fg/60">{feature.description}</span>
                  )}
                </div>
                {feature.available ? (
                  <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-swiss-accent" aria-label="Available" />
                ) : (
                  <Clock size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-swiss-fg/60" aria-label="Coming soon" />
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Screenshots */}
      {screenshots.length > 0 && (
        <Section index={num()} title="Inside the app">
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
              className="t-label inline-flex min-h-7 items-center gap-2 text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
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
              className="shrink-0 text-swiss-fg/60 transition-all duration-normal ease-standard group-hover:translate-x-2 group-hover:text-swiss-accent"
            />
          </Link>
        </section>
      )}
    </>
  );
}
