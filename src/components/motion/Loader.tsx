import { cn } from "@/lib/utils";

/**
 * A small pill with the brand star turning — shown while a 3D scene or a film is
 * still loading. `progress` (0–1) adds a percentage when it's known.
 */
export function Loader({ label = "Loading", progress, className }: { label?: string; progress?: number; className?: string }) {
  const pct = progress === undefined ? undefined : Math.min(99, Math.max(0, Math.round(progress * 100)));
  return (
    <div role="status" aria-live="polite" className={cn("loader t-label inline-flex items-center gap-2.5 rounded-full bg-paper/80 px-3.5 py-2 text-ink backdrop-blur-sm", className)}>
      <svg aria-hidden="true" viewBox="-1 -1 2 2" className="loader-star h-3.5 w-3.5 shrink-0 text-accent">
        <path d="M0-1C.1-.2.2-.1 1 0 .2.1.1.2 0 1-.1.2-.2.1-1 0-.2-.1-.1-.2 0-1Z" fill="currentColor" />
      </svg>
      <span>{label}</span>
      {pct !== undefined && <span className="tabular text-ink/60">{pct}%</span>}
    </div>
  );
}
