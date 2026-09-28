"use client";

import { useCommandPalette } from "@/hooks/useCommandPalette";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Home,
  FolderGit2,
  Download,
  FileText,
  GitBranch,
  Tag,
  User,
  Mail,
} from "lucide-react";
import type { ProjectSummary } from "@/lib/githubProjects";

interface CommandPaletteProps {
  projects: ProjectSummary[];
  className?: string;
}

export function CommandPalette({ projects, className }: CommandPaletteProps) {
  const router = useRouter();

  const commands = [
    { label: "Go to Home", action: () => router.push("/"), icon: Home },
    { label: "View Projects", action: () => router.push("/projects"), icon: FolderGit2 },
    ...projects.map((p) => ({
      label: `Open ${p.name}`,
      action: () => router.push(`/projects/${p.slug}`),
      icon: FolderGit2,
    })),
    { label: "Download Software", action: () => router.push("/downloads"), icon: Download },
    { label: "Documentation", action: () => router.push("/docs"), icon: FileText },
    { label: "View Releases", action: () => router.push("/releases"), icon: Tag },
    { label: "GitHub", action: () => window.open("https://github.com/E1yWrites", "_blank"), icon: GitBranch },
    { label: "About", action: () => router.push("/about"), icon: User },
    { label: "Contact", action: () => router.push("/contact"), icon: Mail },
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[20vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        className={cn(
          "surface-glass w-full max-w-lg animate-slide-up overflow-hidden rounded-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-ink/10">
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-swiss-fg/50 shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            id="command-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TYPE A COMMAND..."
            className="flex-1 bg-transparent font-swiss text-sm font-bold tracking-widest uppercase outline-none focus-visible:outline-none text-swiss-fg placeholder:text-swiss-fg/30"
          />
          <kbd className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50 border border-ink/15 rounded px-2 py-1">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center font-swiss text-sm font-bold tracking-widest uppercase text-swiss-fg/30">
              No results found.
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((cmd, i) => {
                const Icon = cmd.icon || Home;
                return (
                  <li key={cmd.label} className="px-1">
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 h-12 text-left rounded-md",
                        "font-swiss text-sm font-bold tracking-widest uppercase transition-all duration-100",
                        i === selectedIndex
                          ? "bg-ink/[0.08] text-swiss-fg"
                          : "text-swiss-fg/70 hover:bg-ink/[0.04] hover:text-swiss-fg"
                      )}
                      onClick={() => {
                        cmd.action();
                        close();
                      }}
                    >
                      <Icon size={16} strokeWidth={2} className={cn("shrink-0", i === selectedIndex ? "text-swiss-accent" : "text-swiss-fg/40")} />
                      {cmd.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 h-10 border-t border-ink/10">
          <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50">
            <kbd className="border border-ink/15 rounded px-1.5 py-0.5 mr-1">↑↓</kbd>
            NAVIGATE
          </span>
          <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50">
            <kbd className="border border-ink/15 rounded px-1.5 py-0.5 mr-1">↵</kbd>
            SELECT
          </span>
          <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50">
            <kbd className="border border-ink/15 rounded px-1.5 py-0.5 mr-1">ESC</kbd>
            CLOSE
          </span>
        </div>
      </div>
    </div>
  );
}
