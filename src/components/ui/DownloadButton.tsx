"use client";

import { cn } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/Button";
import { Download } from "lucide-react";

type DownloadButtonState = "available" | "coming-soon" | "loading" | "error";

interface DownloadButtonProps {
  state?: DownloadButtonState;
  url?: string;
  label?: string;
  platform?: string;
  /** Primary (solid) for the recommended build, secondary otherwise. */
  emphasis?: "primary" | "secondary";
  /** Accessible name when the visible label alone is ambiguous ("Download" ×3). */
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
}

const disabledStyles =
  "inline-flex items-center justify-center gap-2 h-12 px-5 font-swiss text-xs font-bold tracking-widest uppercase text-swiss-fg/40 border border-dashed border-ink/20 cursor-not-allowed select-none";

export function DownloadButton({
  state = "available",
  url,
  label,
  platform,
  emphasis = "primary",
  ariaLabel,
  className,
  onClick,
}: DownloadButtonProps) {
  const displayLabel = label || (platform ? `Download for ${platform}` : "Download");

  if (state !== "available" || !url) {
    const text = state === "loading" ? "Loading…" : state === "error" ? "Unavailable" : "Coming soon";
    return (
      <span aria-disabled="true" className={cn(disabledStyles, state === "loading" && "animate-pulse", className)}>
        {text}
      </span>
    );
  }

  return (
    <a
      href={url}
      download
      aria-label={ariaLabel}
      onClick={onClick}
      className={buttonStyles({ variant: emphasis, className: cn("text-xs", className) })}
    >
      <Download size={14} strokeWidth={2.5} aria-hidden="true" />
      {displayLabel}
    </a>
  );
}
