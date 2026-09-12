"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { docsByProject } from "@/data/docs";
import { projectLabel } from "@/data/docMeta";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();
  const isIndex = pathname === "/docs";
  const activeSlug = pathname.startsWith("/docs/") ? pathname.slice("/docs/".length) : null;
  const groups = Object.entries(docsByProject);
  const activeGroup = groups.find(([, d]) => d.navItems.some((it) => it.slug === activeSlug));

  return (
    <>
      {/* Mobile — native disclosure listing the current project's docs (article pages only). */}
      {activeGroup && (
        <details className="group border-b border-ink/10 md:hidden">
          <summary className="flex h-12 cursor-pointer list-none items-center justify-between px-5 font-swiss text-[11px] font-bold uppercase tracking-widest text-swiss-fg/70 [&::-webkit-details-marker]:hidden">
            <span>
              Browse docs <span className="text-swiss-fg/40">/</span>{" "}
              <span className="text-swiss-accent">{projectLabel(activeGroup[0])}</span>
            </span>
            <ChevronDown size={14} className="transition-transform duration-normal group-open:rotate-180" />
          </summary>
          <nav className="surface-subtle px-5 pb-4 pt-2">
            {activeGroup[1].navItems.map((item) => (
              <Link
                key={item.slug}
                href={`/docs/${item.slug}`}
                aria-current={activeSlug === item.slug ? "page" : undefined}
                className={cn(
                  "block border-l-2 py-2 pl-4 text-sm transition-colors duration-fast",
                  activeSlug === item.slug
                    ? "border-swiss-accent text-swiss-fg"
                    : "border-ink/10 text-swiss-fg/60 hover:text-swiss-fg"
                )}
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/docs"
              className="mt-3 block font-swiss text-[11px] font-bold uppercase tracking-widest text-swiss-fg/50 hover:text-swiss-accent"
            >
              ← All documentation
            </Link>
          </nav>
        </details>
      )}

      {/* Desktop — sticky rail. All groups stay expanded: 16 links fit without an accordion. */}
      <aside className="scrollbar-hide sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto border-r border-ink/10 px-5 py-8 md:block">
        {isIndex ? (
          <span className="editorial-label block">Documentation</span>
        ) : (
          <>
            <Link
              href="/docs"
              className="editorial-label block text-swiss-fg/50 transition-colors duration-fast hover:text-swiss-accent"
            >
              ← All docs
            </Link>
            <div className="mt-5">
              <DocsSearch compact />
            </div>
          </>
        )}

        {groups.map(([projectKey, projectDocs], i) => (
          <div key={projectKey} className="mt-8">
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-[10px] text-swiss-fg/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-swiss text-[11px] font-bold uppercase tracking-widest text-swiss-fg/60">
                {projectLabel(projectKey)}
              </span>
            </div>
            <nav className="border-l border-ink/10" aria-label={`${projectLabel(projectKey)} documentation`}>
              {projectDocs.navItems.map((item) => {
                const isActive = activeSlug === item.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/docs/${item.slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "-ml-px block border-l-2 py-1.5 pl-4 text-[13px] transition-colors duration-fast",
                      isActive
                        ? "border-swiss-accent font-medium text-swiss-fg"
                        : "border-transparent text-swiss-fg/60 hover:border-ink/30 hover:text-swiss-fg"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </aside>
    </>
  );
}
