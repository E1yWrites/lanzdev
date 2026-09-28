"use client";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ProjectSummary } from "@/lib/githubProjects";

interface CommandPaletteProps {
  projects: ProjectSummary[];
  className?: string;
}

export function CommandPalette({ projects, className }: CommandPaletteProps) {
  const router = useRouter();

  const commands = [
    { label: "Go to Home", action: () => router.push("/") },
    { label: "View Projects", action: () => router.push("/projects") },
    ...projects.map((p) => ({
      label: `Open ${p.name}`,
      action: () => router.push(`/projects/${p.slug}`),
    })),
    { label: "Download Software", action: () => router.push("/downloads") },
    { label: "Documentation", action: () => router.push("/docs") },
    { label: "View Releases", action: () => router.push("/releases") },
    { label: "GitHub", action: () => window.open("https://github.com/E1yWrites", "_blank") },
    { label: "About", action: () => router.push("/about") },
    { label: "Contact", action: () => router.push("/contact") },
  ];

  const {
    isOpen,
    close,
    query,
    setQuery,
    filtered,
    selectedIndex,
    handleKeyDown,
  } = useCommandPalette(commands);

  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById("command-input");
      input?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[18vh]"
      onClick={close}
    >
      <div
        className={cn("surface-elevated w-full max-w-lg animate-slide-up overflow-hidden rounded-lg", className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-14 items-center gap-3 border-b border-dotted border-ink/25 px-4">
          <span aria-hidden="true" className="t-label text-accent">
            ⌘K
          </span>
          <input
            id="command-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to…"
            aria-label="Search commands"
            className="flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/60 focus-visible:outline-none"
          />
          <kbd className="t-label rounded-sm border border-ink/20 px-1.5 text-ink/60">Esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="t-label px-4 py-8 text-center text-ink/60">No matches</p>
          ) : (
            <ul className="py-1.5">
              {filtered.map((cmd, i) => (
                <li key={cmd.label} className="px-1.5">
                  <button
                    className={cn(
                      "flex h-11 w-full items-center gap-4 rounded-md px-3 text-left text-sm transition-colors duration-instant",
                      i === selectedIndex ? "bg-ink/[0.07] text-ink" : "text-ink/75 hover:bg-ink/[0.04] hover:text-ink"
                    )}
                    onClick={() => {
                      cmd.action();
                      close();
                    }}
                  >
                    <span className={cn("t-label w-5", i === selectedIndex ? "text-accent" : "text-ink/60")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {cmd.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="t-label flex h-10 items-center gap-5 border-t border-dotted border-ink/25 px-4 text-ink/60">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
