"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/Logo";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { COMMAND_PALETTE_EVENT } from "@/hooks/useCommandPalette";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { MobileMenu } from "./MobileMenu";
import { isActivePath, mainNav } from "@/data/navigation";
import type { ProjectSummary } from "@/lib/githubProjects";

interface NavigationProps {
  projects: ProjectSummary[];
}

/** Six even columns of mono links, like a spec sheet's header row. */
export function Navigation({ projects }: NavigationProps) {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 h-14 transition-colors duration-normal ease-standard",
          scrolled || isOpen ? "border-b border-dotted border-ink/25 bg-paper/90 backdrop-blur-md" : "border-b border-transparent"
        )}
      >
        <nav aria-label="Main" className="t-label mx-auto flex h-full max-w-7xl items-center px-5 md:px-8 lg:grid lg:grid-cols-6">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} aria-label="Lorenz.dev — home" className="group inline-flex items-center gap-2.5 text-ink">
            <LogoMark size={22} intro />
            <span className="roll" aria-hidden="true">
              <span>
                Lorenz<span className="text-accent">.</span>dev
              </span>
              <span>
                Lorenz<span className="text-ink">.</span>dev
              </span>
            </span>
          </Link>

          {mainNav.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group hidden items-center gap-2 text-ink lg:inline-flex lg:justify-self-start"
              >
                <span
                  aria-hidden="true"
                  className={cn("h-1.5 w-1.5 transition-all duration-normal", active ? "rotate-45 bg-accent" : "bg-transparent group-hover:rotate-45 group-hover:bg-ink/40")}
                />
                <span className="roll">
                  <span>{item.label}</span>
                  <span aria-hidden="true">{item.label}</span>
                </span>
              </Link>
            );
          })}

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="t-label -mr-2 h-11 px-2 text-ink transition-colors duration-fast hover:text-accent"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {/* ⌘K — the palette, pinned to the right edge on large screens. */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
          aria-label="Open command palette"
          className="t-label absolute right-5 top-1/2 hidden h-7 -translate-y-1/2 items-center rounded-sm border border-ink/25 px-2 text-ink/70 transition-colors duration-fast hover:border-ink/60 hover:text-ink md:right-8 lg:inline-flex"
        >
          ⌘K
        </button>
      </header>

      <MobileMenu isOpen={isOpen} onClose={close} />
      <CommandPalette projects={projects} />
    </>
  );
}
