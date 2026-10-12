"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { type Command, useCommandPalette } from "@/hooks/useCommandPalette";
import { siteConfig } from "@/data/config";
import { isActivePath } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { ProjectSummary } from "@/lib/githubProjects";

/** Every page by its own name, with where it goes on the right. The page you're on has the ember dot. */
export function CommandPalette({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const commands: Command[] = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    ...projects.map((p) => ({ label: p.name, href: `/projects/${p.slug}` })),
    { label: "Downloads", href: "/downloads" },
    { label: "Docs", href: "/docs" },
    { label: "Releases", href: "/releases" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "GitHub", href: siteConfig.github.url, external: true },
  ];

  const run = (cmd: Command) => (cmd.external ? window.open(cmd.href, "_blank", "noopener") : router.push(cmd.href));
  const { isOpen, close, query, setQuery, filtered, selectedIndex, setSelectedIndex, handleKeyDown } = useCommandPalette(commands, run);

  // keep the picked row in view as the arrows move past the fold
  useEffect(() => {
    if (isOpen) document.getElementById(`command-${selectedIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [isOpen, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Jump to a page"
      className="fixed inset-0 z-50 flex items-start justify-center bg-paper/80 px-4 pt-[16vh] backdrop-blur-sm"
      onClick={close}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <div className="surface-elevated w-full max-w-lg overflow-hidden rounded-lg motion-safe:animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex h-14 items-center gap-3 border-b border-dotted border-ink/25 pl-4 pr-2">
          <input
            autoFocus
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered.length ? `command-${selectedIndex}` : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to…"
            aria-label="Jump to a page"
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/60"
          />
          <button type="button" onClick={close} className="t-label grid h-9 place-items-center rounded-md px-2 text-ink/60 transition-colors duration-fast hover:text-ink">
            <kbd className="rounded-sm border border-ink/20 px-1.5 font-mono">Esc</kbd>
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="t-label px-4 py-8 text-center text-ink/60">Nothing called “{query.trim()}”</p>
        ) : (
          <ul id="command-list" role="listbox" aria-label="Pages" className="max-h-[min(27rem,60vh)] overflow-y-auto overscroll-contain p-1.5 [scrollbar-color:rgb(var(--ink)/0.2)_transparent] [scrollbar-width:thin]">
            {filtered.map((cmd, i) => {
              const here = !cmd.external && (cmd.href === "/" ? pathname === "/" : isActivePath(pathname, cmd.href));
              return (
                <li
                  key={cmd.href}
                  id={`command-${i}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onMouseMove={() => i !== selectedIndex && setSelectedIndex(i)}
                  onClick={() => {
                    run(cmd);
                    close();
                  }}
                  className={cn("flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 text-[15px]", i === selectedIndex ? "bg-ink/[0.07] text-ink" : "text-ink/75")}
                >
                  <span aria-hidden="true" className={cn("h-1 w-1 shrink-0 rounded-full", here ? "bg-accent" : "bg-transparent")} />
                  <span className="flex-1">
                    {cmd.label}
                    {here && <span className="sr-only"> (you’re here)</span>}
                  </span>
                  <span className="t-label truncate text-ink/60">{cmd.external ? `${new URL(cmd.href).host} ↗` : cmd.href}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="t-label flex h-10 items-center gap-5 border-t border-dotted border-ink/25 px-4 text-ink/60">
          <span>↑↓ Move</span>
          <span>↵ Open</span>
        </div>
      </div>
    </div>
  );
}
