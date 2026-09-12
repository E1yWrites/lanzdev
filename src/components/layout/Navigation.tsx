"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { rightNav } from "@/data/navigation";
import { Menu, X } from "lucide-react";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { MobileMenu } from "./MobileMenu";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { RouteLoader } from "@/components/ui/RouteLoader";
import { ProjectDropdown } from "./ProjectDropdown";
import type { ProjectSummary } from "@/lib/githubProjects";

const DESKTOP_NAV_ITEMS = [
  { label: "ABOUT", href: "/about" },
  { label: "DOWNLOADS", href: "/downloads" },
  { label: "DOCS", href: "/docs" },
  { label: "CONTACT", href: "/contact" },
];

interface NavigationProps {
  projects: ProjectSummary[];
}

export function Navigation({ projects }: NavigationProps) {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useLayoutEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    // Find the active link or dropdown trigger
    const activeLink = navRef.current.querySelector('[data-active="true"]');
    if (activeLink) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      indicatorRef.current.style.width = `${rect.width}px`;
      indicatorRef.current.style.transform = `translateX(${rect.left - navRect.left}px)`;
      indicatorRef.current.style.opacity = "1";
    } else {
      indicatorRef.current.style.opacity = "0";
    }
  }, [pathname, isOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-14",
          "flex items-center justify-between px-5 md:px-8",
          "bg-paper/70 backdrop-blur-xl backdrop-saturate-150",
          "border-b border-ink/10",
          "transition-all duration-normal ease-standard",
          scrolled && "shadow-[0_1px_0_0_rgb(var(--ink)/0.1),0_12px_24px_-16px_rgb(var(--ink)/0.25)]"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group font-swiss font-black text-xl tracking-tighter uppercase text-swiss-fg shrink-0"
        >
          Lorenz
          <span className="text-swiss-accent">.</span>
          <span className="transition-colors duration-150 group-hover:text-swiss-accent">
            dev
          </span>
        </Link>

        {/* Center nav — desktop */}
        <div
          ref={navRef}
          className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2"
        >
          <ProjectDropdown projects={projects} />
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive}
                className={cn(
                  "font-swiss text-[11px] font-bold tracking-widest uppercase py-1",
                  "relative transition-colors duration-150",
                  isActive ? "text-swiss-fg" : "text-swiss-fg/50 hover:text-swiss-fg"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="absolute bottom-[-8px] left-0 h-[6px] rounded-full bg-accent/15 shadow-[0_0_0_1px_rgb(var(--accent)/0.25)] transition-all duration-normal ease-out-back pointer-events-none opacity-0"
          />
        </div>

        {/* Right nav — desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {rightNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={cn(
                "font-swiss text-[11px] font-bold tracking-widest uppercase py-1",
                "text-swiss-fg/50 hover:text-swiss-fg transition-colors duration-150"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="tactile w-12 h-12 flex items-center justify-center text-swiss-fg border border-ink/15 rounded-md hover:bg-swiss-fg hover:text-swiss-bg transition-all duration-fast"
          >
            {isOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      <RouteLoader />
      <MobileMenu isOpen={isOpen} onClose={close} projects={projects} />
      <CommandPalette projects={projects} />
    </>
  );
}