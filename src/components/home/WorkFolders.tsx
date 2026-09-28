"use client";

import Link from "next/link";
import { useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { FilmDialog } from "@/components/motion/FilmDialog";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";
import { ModelStage } from "@/components/three/ModelStage";
import { useFinePointer } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";
import { hasDownloads, platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

const TONES = {
  accent: { surface: "bg-accent", rule: "border-on-sheet/40", muted: "text-on-sheet/85", chip: "bg-on-sheet text-accent" },
  sheet: { surface: "bg-sheet", rule: "border-on-sheet/30", muted: "text-on-sheet/65", chip: "bg-on-sheet text-sheet" },
  solar: { surface: "bg-solar", rule: "border-on-sheet/35", muted: "text-on-sheet/75", chip: "bg-on-sheet text-solar" },
} as const;

const pad = (n: number) => String(n).padStart(2, "0");
const TAB_CLIP = { clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 100%, 0 100%)" };

function Ticker({ items, rule }: { items: string[]; rule: string }) {
  const line = items.join(" · ");
  return (
    <div aria-hidden="true" className={cn("ticker t-label overflow-hidden whitespace-nowrap border-y border-dotted py-1.5", rule)}>
      <div className="inline-flex animate-ticker">
        <span className="pr-8">{line}</span>
        <span className="ticker-dup pr-8">{line}</span>
      </div>
    </div>
  );
}

function Folder({ project, index, first }: { project: Project; index: number; first: boolean }) {
  const tone = TONES[project.tone ?? "sheet"];
  const status = projectStatus(project.status);
  const [film, setFilm] = useState(false);
  const [night, setNight] = useState(false);
  const spec = [
    ["Status", status.label],
    ["Runs on", platformSummary(project)],
    ["Version", project.version && `v${project.version}`],
    ["Licence", project.license],
  ].filter(([, v]) => v);

  const isTala = project.model === "tala";
  const fine = useFinePointer();
  const hint = isTala
    ? fine
      ? "Hover to write · click for night · drag to turn"
      : "Tap for night · drag to turn"
    : fine
      ? "Hover to play · drag to turn"
      : "Plays on its own · drag to turn";

  return (
    <article aria-labelledby={`work-${project.slug}`} className="folder text-on-sheet md:sticky md:top-14">
      {/* Tab row: transparent except the tab, so earlier folders' tabs stay visible. */}
      <div className="relative h-10 [--tab-step:calc(var(--tab-w)-10px)] [--tab-w:min(20rem,46vw)]">
        <span
          className={cn("folder-tab t-label absolute bottom-0 left-0 flex h-10 w-[var(--tab-w)] items-center gap-3 px-5 md:left-[calc(var(--i)*var(--tab-step))]", tone.surface)}
          style={{ ...TAB_CLIP, "--i": index } as React.CSSProperties}
        >
          Project {pad(index + 1)}
          <span className="hidden text-on-sheet/60 sm:inline">— {project.role?.split(" · ")[0]}</span>
        </span>
        {first && (
          <Link href="/projects" className="t-label absolute bottom-0 right-0 hidden h-10 w-[var(--tab-w)] items-center bg-paper-elevated px-5 text-ink transition-colors duration-fast hover:text-accent md:flex" style={TAB_CLIP}>
            All projects →
          </Link>
        )}
      </div>

      {/* On md+ each folder is exactly one screen tall (minus nav and tab), so the whole
          folder — model included — is on screen before the next one slides over it. */}
      <div className={cn(tone.surface, "md:h-[calc(100svh-6rem)]")}>
        <div className="mx-auto grid h-full w-full max-w-[1600px] grid-cols-1 gap-6 px-5 pb-8 pt-6 md:grid-cols-12 md:gap-8 md:px-8 lg:px-12">
          {/* text column */}
          <div className="flex min-h-0 min-w-0 flex-col md:col-span-5 lg:col-span-4">
            <KineticText
              as="h3"
              id={`work-${project.slug}`}
              lines={[project.name]}
              className="font-display text-[clamp(3.25rem,7vw,7.25rem)] font-light leading-[0.9] tracking-[-0.04em]"
            />
            <p className={cn("t-label mt-3", tone.muted)}>{project.role}</p>
            <p className="mt-5 font-display text-2xl font-light leading-tight md:text-[1.7rem]">{project.tagline}</p>
            <p className={cn("mt-3 text-sm leading-relaxed [@media(max-height:820px)]:line-clamp-3", tone.muted)}>{project.description}</p>

            <dl className="t-label mt-5 grid gap-y-1.5">
              {spec.map(([label, value]) => (
                <div key={label} className={cn("flex justify-between gap-4 border-b border-dotted pb-1.5", tone.rule)}>
                  <dt className={tone.muted}>{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
            {project.technologies.length > 0 && (
              <div className="mt-3 [@media(max-height:760px)]:hidden">
                <Ticker items={project.technologies} rule={tone.rule} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-auto md:pt-5">
              <Magnetic>
                <Link href={`/projects/${project.slug}`} data-cursor="Open" className="t-label inline-flex h-11 items-center gap-2 rounded-full bg-on-sheet px-5 text-sheet transition-transform duration-fast active:scale-95">
                  View project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              {project.film && (
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => setFilm(true)}
                    data-cursor="Play"
                    className="t-label inline-flex h-11 items-center gap-2 rounded-full border border-on-sheet/50 px-5 transition-colors duration-fast hover:bg-on-sheet hover:text-sheet"
                  >
                    <span aria-hidden="true" className="play-glyph" />
                    Film · {project.film.duration} s
                  </button>
                </Magnetic>
              )}
            </div>
            <div className="t-label mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {hasDownloads(project) && (
                <Link href="/downloads" className="link-underline">
                  Download ↓
                </Link>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {project.model === "parada" ? "Landing page ↗" : "Live demo ↗"}
                </a>
              )}
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="link-underline">
                Source ↗
              </a>
            </div>
          </div>

          {/* model column */}
          <div className={cn("relative flex min-h-0 min-w-0 flex-col border-t border-dotted pt-4 md:col-span-7 md:border-l md:border-t-0 md:pl-8 md:pt-0 lg:col-span-8", tone.rule)}>
            <div className="flex items-center justify-between gap-4">
              <p className={cn("t-label", tone.muted)}>{hint}</p>
              {isTala && (
                <button type="button" onClick={() => setNight((v) => !v)} aria-pressed={night} className={cn("t-label shrink-0 rounded-full px-3 py-1.5", tone.chip)}>
                  {night ? "☾ Night" : "☀ Day"}
                </button>
              )}
            </div>
            {project.model && project.cover ? (
              <ModelStage
                model={project.model}
                poster={project.cover}
                alt={isTala ? "Tala as a desk: an open notebook with “tala” handwritten, a pencil, and a sun" : "PARADA as a model parking lot: a car at the gate, a camera reading its plate, and the Zone A sign"}
                sizes="(min-width: 768px) 60vw, 100vw"
                draggable
                night={night}
                cursor={isTala ? "Drag · click for night" : "Drag · hover to play"}
                onClick={isTala ? () => setNight((v) => !v) : undefined}
                className="aspect-[4/3] w-full md:aspect-auto md:min-h-0 md:flex-1"
              />
            ) : null}
            {project.stats && (
              <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dotted pt-4 md:grid-cols-4", tone.rule)}>
                {project.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse">
                    <dt className={cn("t-label mt-1.5", tone.muted)}>{stat.label}</dt>
                    <dd className="font-display text-3xl font-light leading-none md:text-4xl">
                      <CountUp value={stat.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
      {project.film && <FilmDialog film={project.film} title={project.name} open={film} onClose={() => setFilm(false)} />}
    </article>
  );
}

/** Projects as a stack of file folders: each slides over the last; every tab stays in view. */
export function WorkFolders({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-4 pt-10">
      <h2 id="work-title" className="sr-only">
        Selected work
      </h2>
      {projects.map((project, i) => (
        <Folder key={project.id} project={project} index={i} first={i === 0} />
      ))}
      <div className="mx-auto max-w-7xl px-5 py-8 md:hidden">
        <Link href="/projects" className="t-label text-ink">
          All projects →
        </Link>
      </div>
    </section>
  );
}
