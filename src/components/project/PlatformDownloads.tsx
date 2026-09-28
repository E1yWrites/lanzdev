"use client";

import { useEffect, useState } from "react";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { PLATFORMS, detectPlatform } from "@/lib/projectDisplay";
import { cn } from "@/lib/utils";
import type { Platform, Project } from "@/types/project";

interface PlatformDownloadsProps {
  project: Project;
  className?: string;
}

/** Windows / macOS / Linux build cards. The visitor's own OS, when it has a build, gets the solid button. */
export function PlatformDownloads({ project, className }: PlatformDownloadsProps) {
  const [detected, setDetected] = useState<Platform | null>(null);

  useEffect(() => {
    setDetected(detectPlatform(navigator.userAgent));
  }, []);

  return (
    <div className={cn("grid gap-3 md:grid-cols-3", className)}>
      {PLATFORMS.map(({ key, label, detail }) => {
        const dl = project.downloads[key];
        const available = Boolean(dl?.available && dl.url);
        const recommended = available && detected === key;
        const fileMeta = [dl?.version && `v${dl.version}`, dl?.fileSize].filter(Boolean).join(" · ");

        return (
          <div
            key={key}
            className={cn(
              "flex flex-col rounded-md border p-5 transition-colors duration-normal ease-standard",
              recommended ? "border-accent/40 bg-accent/[0.06]" : "border-ink/10 bg-ink/[0.03]"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display font-light tracking-tight text-xl text-swiss-fg">{label}</h3>
              {recommended && (
                <span className="t-label shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-swiss-accent">
                  Your system
                </span>
              )}
            </div>
            <p className="mt-2 font-mono text-[11px] text-swiss-fg/50">{detail}</p>
            <p className="mt-1 font-mono text-[11px] text-swiss-fg/50">
              {available ? fileMeta || "Latest build" : "Not yet available"}
            </p>
            <DownloadButton
              url={available ? dl?.url : undefined}
              state={available ? "available" : "coming-soon"}
              label="Download"
              ariaLabel={`Download ${project.name} for ${label}`}
              emphasis={recommended ? "primary" : "secondary"}
              className="mt-6 w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
