"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { CountUp } from "@/components/motion/CountUp";
import { FilmDialog } from "@/components/motion/FilmDialog";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";
import { ModelStage } from "@/components/three/ModelStage";
import { useFinePointer } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";
import { hasDownloads, platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

// `panel` is the soft card the reading text sits on: a lighter wash of the folder's
// colour, so small text gets more contrast without the folder losing its colour.
const TONES = {
  accent: { surface: "bg-accent", rule: "border-on-sheet/30", muted: "text-on-sheet/90", chip: "bg-on-sheet text-accent", panel: "bg-sheet/[0.22] ring-on-sheet/10" },
  stone: { surface: "bg-sheet-grey", rule: "border-on-sheet/25", muted: "text-on-sheet/75", chip: "bg-on-sheet text-sheet-grey", panel: "bg-sheet/55 ring-on-sheet/[0.07]" },
  sheet: { surface: "bg-sheet", rule: "border-on-sheet/25", muted: "text-on-sheet/70", chip: "bg-on-sheet text-sheet", panel: "bg-white/60 ring-on-sheet/[0.07]" },
  solar: { surface: "bg-solar", rule: "border-on-sheet/30", muted: "text-on-sheet/85", chip: "bg-on-sheet text-solar", panel: "bg-sheet/30 ring-on-sheet/10" },
} as const;

const PANEL = "rounded-2xl ring-1 backdrop-blur-[2px]";

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

function Folder({ project, index, first, innerRef }: { project: Project; index: number; first: boolean; innerRef: (el: HTMLElement | null) => void }) {
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
    <article ref={innerRef} aria-labelledby={`work-${project.slug}`} className="folder text-on-sheet md:sticky md:top-14">
      {/* Tab row: transparent except the tab, so earlier folders' tabs stay visible. */}
      <div className="relative h-10 [--tab-step:calc(var(--tab-w)-10px)] [--tab-w:min(20rem,46vw)]">
        <span
          className={cn("folder-tab t-label absolute bottom-0 left-0 flex h-10 w-[var(--tab-w)] items-center gap-3 px-5 md:left-[calc(var(--i)*var(--tab-step))]", tone.surface)}
          style={{ ...TAB_CLIP, "--i": index } as React.CSSProperties}
        >
          Project {pad(index + 1)}
          <span className="hidden text-on-sheet/85 sm:inline">— {project.role?.split(" · ")[0]}</span>
        </span>
        {first && (
          <Link href="/projects" className="t-label absolute bottom-0 right-0 hidden h-10 w-[var(--tab-w)] items-center bg-paper-elevated px-5 text-ink transition-colors duration-fast hover:text-accent md:flex" style={TAB_CLIP}>
            All projects →
          </Link>
        )}
      </div>

      {/* On md+ each folder is at least one screen tall (minus nav and tab), with the model
          filling what's left — it grows rather than overflowing on short screens. */}
      <div className={cn(tone.surface, "relative md:flex md:min-h-[calc(100svh-6rem)] md:flex-col")}>
        {/* darkens as the next folder slides over this one (see WorkFolders) */}
        <div aria-hidden="true" className="folder-shade pointer-events-none absolute inset-0 z-[3]" />
        <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-6 px-5 pb-8 pt-6 md:grid-cols-12 md:gap-8 md:px-8 lg:px-12">
          {/* text column */}
          <div className="flex min-h-0 min-w-0 flex-col md:col-span-5 lg:col-span-4">
            <KineticText
              as="h3"
              id={`work-${project.slug}`}
              lines={[project.name]}
              className="font-display text-[clamp(3.25rem,7vw,7.25rem)] font-light leading-[0.9] tracking-[-0.04em]"
            />
            <p className={cn("t-label mt-3", tone.muted)}>{project.role}</p>
            {/* the reading text sits on a soft panel */}
            <div className={cn(PANEL, tone.panel, "mt-4 p-4 md:p-5")}>
              <p className="font-display text-2xl font-light leading-tight md:text-[1.7rem]">{project.tagline}</p>
              <p className={cn("mt-3 text-sm leading-relaxed [@media(max-height:820px)]:line-clamp-3", tone.muted)}>{project.description}</p>

              <dl className="t-label mt-4 grid gap-y-1.5">
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
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-auto md:pt-5">
              <Magnetic>
                <Link href={`/projects/${project.slug}`} className="t-label inline-flex h-11 items-center gap-2 rounded-full bg-on-sheet px-5 text-sheet transition-transform duration-fast active:scale-95">
                  View project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              {project.film && (
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => setFilm(true)}
                   
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
              <p className={cn("t-label rounded-full px-3 py-1.5 ring-1", tone.panel, tone.muted)}>{hint}</p>
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
                className="aspect-[4/3] w-full md:aspect-auto md:min-h-[22rem] md:flex-1"
              />
            ) : null}
            {project.stats && (
              <dl className={cn(PANEL, tone.panel, "mt-3 grid grid-cols-2 gap-x-6 gap-y-4 px-4 py-3.5 md:grid-cols-4 md:px-5")}>
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

/**
 * Projects as a stack of file folders. On md+ each folder pins under the nav and holds
 * for a moment (the spacer after it) before the next slides over it; the one being
 * covered dims and eases back, so the stack reads as one continuous move. Stop scrolling
 * just short of a folder on the way down and it glides the last few pixels into line —
 * never backwards, so a wheel or trackpad is never pulled against. Folders taller than the
 * screen pin by their bottom edge instead, so nothing is ever hidden under the next one.
 */
export function WorkFolders({ projects }: { projects: Project[] }) {
  const folders = useRef<(HTMLElement | null)[]>([]);
  const anchors = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const NAV = 56;
    let raf = 0;
    let tops: number[] = [];
    const update = () => {
      raf = 0;
      const list = folders.current.filter((f): f is HTMLElement => Boolean(f));
      if (!wide.matches) {
        list.forEach((f) => {
          f.style.removeProperty("top");
          f.style.setProperty("--cover", "0");
        });
        return;
      }
      const vh = window.innerHeight;
      tops = list.map((f) => Math.min(NAV, vh - f.offsetHeight));
      list.forEach((f, i) => {
        f.style.top = `${tops[i]}px`;
        const next = list[i + 1];
        let cover = 0;
        if (next) {
          const travel = Math.max(1, vh - tops[i + 1]);
          cover = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / travel));
        }
        f.style.setProperty("--cover", cover.toFixed(3));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Settle: when scrolling down stops a little short of a folder's pinned position,
    // glide the rest of the way. Only forwards, only a short way, and never mid-gesture.
    let lastY = window.scrollY;
    let dir = 0;
    let idle = 0;
    let settling = 0;
    const settle = () => {
      if (!wide.matches || still.matches || dir <= 0) return;
      const y = window.scrollY;
      const reach = Math.min(160, window.innerHeight * 0.18);
      for (let i = 0; i < anchors.current.length; i++) {
        const a = anchors.current[i];
        if (!a || tops[i] === undefined) continue;
        const target = Math.round(a.getBoundingClientRect().top + y - tops[i]);
        const gap = target - y;
        if (gap > 1 && gap <= reach) {
          settling = window.setTimeout(() => (settling = 0), 700);
          window.scrollTo({ top: target, behavior: "smooth" });
          return;
        }
      }
    };
    const onScroll = () => {
      schedule();
      const y = window.scrollY;
      if (y !== lastY) dir = Math.sign(y - lastY);
      lastY = y;
      if (settling) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, 180);
    };
    update();
    const ro = new ResizeObserver(schedule);
    folders.current.forEach((f) => f && ro.observe(f));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.clearTimeout(settling);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
    };
  }, [projects.length]);

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-4 pt-10">
      <h2 id="work-title" className="sr-only">
        Selected work
      </h2>
      {projects.map((project, i) => (
        <Fragment key={project.id}>
          {/* where the folder lines up under the nav */}
          <div
            aria-hidden="true"
            className="folder-snap"
            ref={(el) => {
              anchors.current[i] = el;
            }}
          />
          <Folder
            project={project}
            index={i}
            first={i === 0}
            innerRef={(el) => {
              folders.current[i] = el;
            }}
          />
          {/* the pause: the folder stays pinned, fully in view, while this scrolls by */}
          <div aria-hidden="true" className="folder-hold hidden md:block" />
        </Fragment>
      ))}
      <div className="mx-auto max-w-7xl px-5 py-8 md:hidden">
        <Link href="/projects" className="t-label inline-flex min-h-7 items-center text-ink">
          All projects →
        </Link>
      </div>
    </section>
  );
}
