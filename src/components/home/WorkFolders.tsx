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

// `fill` is the folder's colour (its tab and its sheet share it). `panel` is the soft
// card the reading text sits on, so small text gets more contrast without the folder
// losing its colour. `night` is Tala's folder after its moon comes up.
const TONES = {
  accent: {
    fill: "rgb(var(--accent))",
    text: "text-on-sheet",
    rule: "border-on-sheet/30",
    muted: "text-on-sheet/90",
    chip: "bg-on-sheet text-accent",
    panel: "bg-sheet/[0.22] ring-on-sheet/10",
    solid: "bg-on-sheet text-sheet",
    ghost: "border-on-sheet/50 hover:bg-on-sheet hover:text-sheet",
  },
  sheet: {
    fill: "rgb(var(--sheet))",
    text: "text-on-sheet",
    rule: "border-on-sheet/20",
    muted: "text-on-sheet/70",
    chip: "bg-on-sheet text-sheet",
    panel: "bg-white/60 ring-on-sheet/[0.07]",
    solid: "bg-on-sheet text-sheet",
    ghost: "border-on-sheet/50 hover:bg-on-sheet hover:text-sheet",
  },
  solar: {
    fill: "rgb(var(--solar))",
    text: "text-on-sheet",
    rule: "border-on-sheet/30",
    muted: "text-on-sheet/85",
    chip: "bg-on-sheet text-solar",
    panel: "bg-sheet/30 ring-on-sheet/10",
    solid: "bg-on-sheet text-sheet",
    ghost: "border-on-sheet/50 hover:bg-on-sheet hover:text-sheet",
  },
  night: {
    fill: "rgb(var(--night))",
    text: "text-ink",
    rule: "border-ink/15",
    muted: "text-ink/70",
    chip: "bg-solar text-on-sheet",
    panel: "bg-ink/[0.05] ring-ink/10",
    solid: "bg-ink text-on-sheet",
    ghost: "border-ink/40 hover:bg-ink hover:text-on-sheet",
  },
} as const;

const PANEL = "rounded-2xl ring-1 backdrop-blur-[2px] transition-colors duration-700";

/** Each project's own colour, carried by a small mark on its tab. */
const MARK = { parada: "bg-accent", tala: "bg-solar", macropad: "bg-ink" } as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** The stack, still and whole: a line that wraps, never a marquee that cuts words off. */
function Stack({ items, muted }: { items: string[]; muted: string }) {
  const MAX = 8;
  const shown = items.slice(0, MAX);
  const rest = items.length - shown.length;
  return (
    <p className="t-label mt-3 leading-relaxed">
      <span className={cn("mr-2", muted)}>Built with</span>
      {/* each item keeps its separator, so a line never starts with a stray dot */}
      {shown.map((t, i) => (
        <Fragment key={t}>
          <span className="whitespace-nowrap">
            {t}
            {(i < shown.length - 1 || rest > 0) && " ·"}
          </span>{" "}
        </Fragment>
      ))}
      {rest > 0 && <span className={muted}>+{rest}</span>}
    </p>
  );
}

function Folder({ project, index, first, innerRef }: { project: Project; index: number; first: boolean; innerRef: (el: HTMLElement | null) => void }) {
  const [night, setNight] = useState(false);
  const isTala = project.model === "tala";
  // Tala's moon turns the whole folder to night, not just the sky over the desk.
  const tone = TONES[isTala && night ? "night" : (project.tone ?? "sheet")];
  const status = projectStatus(project.status);
  const [film, setFilm] = useState(false);
  const spec = [
    ["Status", status.label],
    ["Runs on", platformSummary(project)],
    ["Version", project.version && `v${project.version}`],
    ["Licence", project.license],
  ].filter(([, v]) => v);

  const fine = useFinePointer();
  const hint = isTala
    ? fine
      ? `Hover to write, click for ${night ? "day" : "night"}, drag to turn`
      : `Tap for ${night ? "day" : "night"}, drag to turn`
    : fine
      ? "Hover to play, drag to turn"
      : "Plays on its own, drag to turn";

  return (
    <article
      ref={innerRef}
      aria-labelledby={`work-${project.slug}`}
      className={cn("folder transition-colors duration-700 md:sticky md:top-14", tone.text, !first && "folder-arrive")}
      style={{ "--fill": tone.fill } as React.CSSProperties}
    >
      {/* Tab row: transparent except the tab, so earlier folders' tabs stay visible
          beside it. Tabs sit edge to edge and share their curved shoulders. */}
      <div className="relative z-[4] mx-auto h-11 w-full max-w-[1600px] px-5 md:px-8 lg:px-12">
        <div className="relative h-full [--tab-step:calc(var(--tab-w)+14px)] [--tab-w:min(19rem,calc(50vw-2.5rem))]">
          <span
            className="folder-tab absolute bottom-0 left-0 flex h-full w-[var(--tab-w)] items-center gap-3 px-4 md:left-[calc(var(--i)*var(--tab-step))]"
            style={{ "--i": index } as React.CSSProperties}
          >
            {project.model && <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-[2px]", MARK[project.model])} />}
            <span className="t-label">{pad(index + 1)}</span>
            <span className="truncate font-display text-lg font-light leading-none">{project.name}</span>
            <span className={cn("t-label ml-auto hidden truncate lg:inline", tone.muted)}>{project.role?.split(" · ")[0]}</span>
          </span>
        </div>
      </div>

      {/* On md+ each folder is at least one screen tall (minus nav and tab), with the model
          filling what's left, so it grows rather than overflowing on short screens. */}
      <div className="folder-sheet relative md:flex md:min-h-[calc(100svh-6.25rem)] md:flex-col">
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
              {project.technologies.length > 0 && <Stack items={project.technologies} muted={tone.muted} />}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-auto md:pt-5">
              <Magnetic>
                <Link href={`/projects/${project.slug}`} className={cn("t-label inline-flex h-11 items-center gap-2 rounded-full px-5 transition duration-fast active:scale-95", tone.solid)}>
                  View project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              {project.film && (
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => setFilm(true)}
                    className={cn("t-label inline-flex h-11 items-center gap-2 rounded-full border px-5 transition-colors duration-fast", tone.ghost)}
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
                <button type="button" onClick={() => setNight((v) => !v)} aria-pressed={night} className={cn("t-label shrink-0 rounded-full px-3 py-1.5 transition-colors duration-700", tone.chip)}>
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
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 lg:px-12">
        <Link href="/projects" className="t-label group inline-flex min-h-7 items-center gap-2 text-ink transition-colors duration-fast hover:text-accent">
          All projects <span aria-hidden="true" className="transition-transform duration-normal group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
