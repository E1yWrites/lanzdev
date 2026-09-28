"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import type { ProjectMilestone } from "@/types/project";

const STATE = {
  done: { cell: "bg-ink", label: "Done" },
  active: { cell: "bg-accent roadmap-active", label: "In progress" },
  next: { cell: "border border-dashed border-ink/40 bg-transparent", label: "Next" },
} as const;

/**
 * A project's phases as one track: each cell is a phase, filled when done. Pointing at
 * (or focusing) a cell reads it out below; the full list follows for scanning.
 */
export function Roadmap({ milestones }: { milestones: ProjectMilestone[] }) {
  const firstOpen = Math.max(0, milestones.findIndex((m) => m.status !== "done"));
  const [focus, setFocus] = useState(firstOpen);
  const current = milestones[focus];

  return (
    <div>
      <ol className="flex gap-1 md:gap-1.5" aria-label="Phases">
        {milestones.map((m, i) => (
          <li key={m.id} className="flex-1">
            <button
              type="button"
              aria-label={`Phase ${m.id}: ${m.title} — ${STATE[m.status].label}`}
              aria-pressed={i === focus}
              onPointerEnter={() => setFocus(i)}
              onFocus={() => setFocus(i)}
              onClick={() => setFocus(i)}
              className={cn(
                "roadmap-cell block h-12 w-full rounded-[3px] transition-transform duration-normal ease-out md:h-16",
                STATE[m.status].cell,
                i === focus && "roadmap-focus"
              )}
            />
          </li>
        ))}
      </ol>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-ink/40">
        <span>Phase {milestones[0]?.id}</span>
        <span>Phase {milestones[milestones.length - 1]?.id}</span>
      </div>

      {current && (
        <div aria-live="polite" className="mt-6 grid gap-2 border-t border-dotted border-ink/25 pt-5 md:grid-cols-[8rem_1fr_auto] md:items-baseline">
          <span className="t-label text-accent">Phase {current.id}</span>
          <span className="font-display text-3xl font-light text-ink md:text-4xl">{current.title}</span>
          <span className="t-label text-ink/60">
            {STATE[current.status].label}
            {current.date ? ` · ${current.status === "active" ? "since" : "landed"} ${formatDate(current.date)}` : ""}
          </span>
        </div>
      )}

      <ol className="mt-8 grid gap-x-8 border-t border-dotted border-ink/25 sm:grid-cols-2 lg:grid-cols-3">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-baseline gap-3 border-b border-dotted border-ink/15 py-2.5">
            <span className="w-6 shrink-0 font-mono text-[11px] text-ink/40">{m.id.padStart(2, "0")}</span>
            <span className={cn("flex-1 text-sm", m.status === "next" ? "text-ink/45" : "text-ink/85")}>{m.title}</span>
            <span aria-hidden="true" className={cn("h-2 w-2 shrink-0 rounded-full", m.status === "done" ? "bg-ink/70" : m.status === "active" ? "bg-accent" : "border border-ink/40")} />
          </li>
        ))}
      </ol>
    </div>
  );
}
