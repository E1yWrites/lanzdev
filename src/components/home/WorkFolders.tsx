import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { hasDownloads, platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

// One accent folder, then paper, then grey — color stays scarce.
const TONES = [
  { surface: "bg-accent", rule: "border-on-sheet/40", muted: "text-on-sheet/85" },
  { surface: "bg-sheet", rule: "border-on-sheet/30", muted: "text-on-sheet/65" },
  { surface: "bg-sheet-grey", rule: "border-on-sheet/35", muted: "text-on-sheet/70" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const TAB_CLIP = { clipPath: "polygon(0 0, calc(100% - 28px) 0, 100% 100%, 0 100%)" };

function Cover({ project }: { project: Project }) {
  if (project.heroImage) {
    return (
      <div className="relative h-full min-h-[16rem] overflow-hidden rounded-md border border-on-sheet/15 bg-sheet md:min-h-[20rem]">
        <Image
          src={project.heroImage}
          alt={`${project.name} interface`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-left-top"
        />
      </div>
    );
  }
  if (project.cover) {
    return (
      <div className="relative h-full min-h-[16rem] md:min-h-[20rem]">
        <Image src={project.cover} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" />
      </div>
    );
  }
  return null;
}

function Ticker({ items, rule }: { items: string[]; rule: string }) {
  const line = items.join(", ");
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
  const tone = TONES[index % TONES.length];
  const status = projectStatus(project.status);
  const year = project.releaseDate ? new Date(project.releaseDate).getFullYear() : undefined;
  const spec = [
    ["Status", status.label],
    ["Platform", platformSummary(project)],
    ["Version", project.version && `v${project.version}`],
    ["License", project.license],
  ].filter(([, v]) => v);

  return (
    <article aria-labelledby={`work-${project.slug}`} className="text-on-sheet md:sticky md:top-14">
      {/* Tab row: transparent except the tab, so earlier folders' tabs stay visible. */}
      <div className="relative h-10 [--tab-step:calc(var(--tab-w)-10px)] [--tab-w:min(20rem,46vw)]">
        <span
          className={cn(
            "t-label absolute bottom-0 left-0 flex h-10 w-[var(--tab-w)] items-center px-5 md:left-[calc(var(--i)*var(--tab-step))]",
            tone.surface
          )}
          style={{ ...TAB_CLIP, "--i": index } as React.CSSProperties}
        >
          Project {pad(index + 1)}
        </span>
        {first && (
          <Link
            href="/projects"
            className="t-label absolute bottom-0 right-0 hidden h-10 w-[var(--tab-w)] items-center bg-paper-elevated px-5 text-ink transition-colors duration-fast hover:text-accent md:flex"
            style={TAB_CLIP}
          >
            All projects →
          </Link>
        )}
      </div>

      <div className={cn(tone.surface, "flex flex-col md:min-h-[calc(100svh-6rem)]")}>
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-12 pt-8 md:px-8 md:pb-16">
          <div className="grid gap-6 md:grid-cols-12">
            <h3 id={`work-${project.slug}`} className="font-display text-5xl font-light tracking-tight md:col-span-8 md:text-7xl">
              <Link href={`/projects/${project.slug}`} className="transition-opacity duration-fast hover:opacity-70">
                {project.name}
              </Link>
            </h3>
            <div className="t-label flex flex-col gap-3 md:col-span-4">
              <div className="flex justify-between gap-4">
                <span>{year ?? status.label}</span>
                <span className={tone.muted}>{platformSummary(project)}</span>
              </div>
              {project.technologies.length > 0 && <Ticker items={project.technologies} rule={tone.rule} />}
            </div>
          </div>

          <div className={cn("mt-8 grid flex-1 gap-8 border-t border-dotted pt-8 md:grid-cols-12", tone.rule)}>
            <div className="flex flex-col gap-5 md:col-span-3">
              <p className="text-lg leading-snug">{project.tagline}</p>
              <p className={cn("line-clamp-6 text-sm leading-relaxed", tone.muted)}>{project.description}</p>
              <div className="t-label mt-auto flex flex-col gap-2 pt-2">
                <Link href={`/projects/${project.slug}`} className="underline decoration-on-sheet/40 underline-offset-[6px] hover:decoration-on-sheet">
                  View project →
                </Link>
                {hasDownloads(project) && (
                  <Link href="/downloads" className="hover:underline hover:underline-offset-[6px]">
                    Download ↓
                  </Link>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:underline-offset-[6px]">
                    Live demo ↗
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-6">
              <Cover project={project} />
            </div>

            <dl className="t-label grid content-start gap-y-3 md:col-span-3">
              {spec.map(([label, value]) => (
                <div key={label} className={cn("flex justify-between gap-4 border-b border-dotted pb-3", tone.rule)}>
                  <dt className={tone.muted}>{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
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
