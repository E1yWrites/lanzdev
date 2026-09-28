import { cn } from "@/lib/utils";
import { MARK_L, MARK_STAR } from "./mark";

interface LogoMarkProps {
  /** Pixel size; "css" leaves sizing to className. */
  size?: number | "css";
  className?: string;
  /** Plays the draw-in once on mount. */
  intro?: boolean;
}

/**
 * The L and star, no tile. The L takes `currentColor`; the star is always the accent.
 * Hovering any ancestor with `group` spins the star (see `.logo-*` in globals.css).
 */
export function LogoMark({ size = 28, className, intro = false }: LogoMarkProps) {
  return (
    <svg
      width={size === "css" ? undefined : size}
      height={size === "css" ? undefined : size}
      viewBox="6 5 52 53"
      aria-hidden="true"
      className={cn("logo shrink-0 overflow-visible", intro && "logo-intro", className)}
    >
      <path className="logo-l" d={MARK_L} fill="currentColor" />
      <path className="logo-star" d={MARK_STAR} fill="rgb(var(--accent))" />
    </svg>
  );
}

/** Mark + "lorenz.dev" wordmark, as used in the header and footer. */
export function Wordmark({ className, intro = false }: { className?: string; intro?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={22} intro={intro} />
      <span className="t-label text-ink">
        lorenz<span className="text-accent">.</span>dev
      </span>
    </span>
  );
}
