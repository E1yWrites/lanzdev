"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsByProject } from "@/data/docs";
import { cn } from "@/lib/utils";

const groupLabels: Record<string, string> = {
  tala: "Tala",
  "parada-landing": "PARADA",
  "modpack-development": "Modpack",
};

export function DocsSidebar() {
  const pathname = usePathname();
  const groups = Object.entries(docsByProject);

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r-2 border-swiss-border py-8 px-5 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto bg-swiss-muted swiss-dots">
      <Link
        href="/docs"
        className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent block mb-6 transition-colors duration-150"
      >
        ← All docs
      </Link>

      {groups.map(([projectKey, projectDocs]) => (
        <div key={projectKey} className="mb-6">
          <span className="section-number inline-block mb-3">
            {groupLabels[projectKey] ?? projectKey}
          </span>
          <nav className="space-y-0 border-2 border-swiss-border">
            {projectDocs.navItems.map((item) => {
              const isActive = pathname === `/docs/${item.slug}`;
              return (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block py-3 px-4 font-swiss text-sm font-medium transition-all duration-150 border-b-2 border-swiss-border last:border-0",
                    isActive
                      ? "text-swiss-bg bg-swiss-fg font-bold"
                      : "text-swiss-fg/70 hover:text-swiss-fg hover:bg-swiss-bg"
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
  );
}
