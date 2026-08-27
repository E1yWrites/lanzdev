"use client";

import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

type DownloadButtonState = "available" | "coming-soon" | "loading" | "error";

interface DownloadButtonProps {
  state?: DownloadButtonState;
  url?: string;
  label?: string;
  platform?: string;
  className?: string;
  onClick?: () => void;
}

const disabledStyles =
  "inline-flex items-center justify-center gap-2 h-12 px-5 font-swiss text-xs font-bold tracking-widest uppercase text-swiss-fg/40 border-2 border-swiss-border/30 bg-swiss-muted cursor-not-allowed";

export function DownloadButton({
  state = "available",
  url,
  label,
  platform,
  className,
  onClick,
}: DownloadButtonProps) {
  const displayLabel = label || (platform ? `Download for ${platform}` : "Download");

  if (state === "coming-soon") {
    return (
      <div className={cn(disabledStyles, className)}>
        Coming soon
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div className={cn(disabledStyles, "animate-pulse", className)}>
        Loading...
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={cn(disabledStyles, className)}>
        Unavailable
      </div>
    );
  }

  return (
    <a
      href={url}
      download
      onClick={onClick}
      className={cn(
        "group/btn inline-flex items-center justify-center gap-2 h-12 px-6",
        "font-swiss text-xs font-bold tracking-widest uppercase",
        "bg-swiss-fg text-swiss-bg border-2 border-swiss-border",
        "hover:bg-swiss-accent hover:border-swiss-accent",
        "active:bg-swiss-fg",
        "transition-all duration-150",
        className
      )}
    >
      <Download
        size={14}
        strokeWidth={2.5}
      />
      {displayLabel}
    </a>
  );
}
