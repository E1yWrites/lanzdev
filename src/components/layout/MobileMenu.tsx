"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ProjectDropdown } from "./ProjectDropdown";
import type { ProjectSummary } from "@/lib/githubProjects";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectSummary[];
}

const MOBILE_NAV_ITEMS = [
  { label: "ABOUT", href: "/about" },
  { label: "DOWNLOADS", href: "/downloads" },
  { label: "DOCS", href: "/docs" },
  { label: "CONTACT", href: "/contact" },
];

export function MobileMenu({ isOpen, onClose, projects }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 lg:hidden">
      <div
        className="absolute inset-0 bg-swiss-fg/20"
        onClick={onClose}
      />
      <div
        id="mobile-menu"
        className="surface-glass absolute top-14 left-3 right-3 rounded-lg overflow-hidden flex flex-col"
      >
        <div className="flex flex-col py-2 gap-0 overflow-y-auto max-h-[calc(100dvh-56px)]">
          {/* Project dropdown — mobile mode */}
          <ProjectDropdown mobile projects={projects} onItemSelect={onClose} />

          {MOBILE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-swiss text-lg font-bold tracking-widest uppercase py-3 px-5",
                "border-b border-ink/10 last:border-0",
                "transition-colors duration-150",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-swiss-accent"
                  : "text-swiss-fg hover:text-swiss-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 px-5 pb-4 flex items-center justify-between">
            <Link
              href="https://github.com/E1yWrites"
              target="_blank"
              rel="noopener noreferrer"
              className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150"
            >
              GitHub
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center h-12 px-6 font-swiss text-xs font-bold tracking-widest uppercase bg-swiss-fg text-swiss-bg border-2 border-swiss-border hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150"
            >
              Download
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}