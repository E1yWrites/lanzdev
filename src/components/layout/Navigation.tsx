"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

/**
 * The mark on the left, the index in the middle as one capsule (a highlight slides to
 * whichever link is under the pointer, and rests on the current page), and Contact on
 * the right as the one button.
 */
export function Navigation({ projects }: NavigationProps) {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);
  const links = mainNav.filter((item) => item.href !== "/contact");
  const contact = mainNav.find((item) => item.href === "/contact");
  const contactActive = contact ? isActivePath(pathname, contact.href) : false;

  // The sliding highlight: measured from the link it rests on, never animated on first paint.
  const group = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number; ready: boolean } | null>(null);
  const activeIndex = links.findIndex((item) => isActivePath(pathname, item.href));
  const target = hover ?? (activeIndex >= 0 ? activeIndex : null);

  const measure = useCallback(() => {
    const el = target === null ? null : group.current?.querySelectorAll<HTMLElement>("[data-nav-link]")[target];
    setPill((prev) => (el ? { x: el.offsetLeft, w: el.offsetWidth, ready: Boolean(prev) } : null));
  }, [target]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

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
          "fixed inset-x-0 top-0 z-40 h-14 border-b transition-colors duration-normal ease-standard",
          scrolled || isOpen ? "border-ink/10 bg-paper/85 backdrop-blur-md" : "border-transparent"
        )}
      >
        <nav aria-label="Main" className="t-label mx-auto flex h-full max-w-[1600px] items-center gap-6 px-5 md:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-12">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} aria-label="Lorenz.dev, home" className="group -my-1 inline-flex items-center gap-2.5 justify-self-start py-2 text-ink">
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

          <div
            ref={group}
            onPointerLeave={() => setHover(null)}
            className="relative hidden items-center rounded-full p-1 ring-1 ring-ink/10 lg:flex"
          >
            {pill && (
              <span
                aria-hidden="true"
                className={cn("nav-pill absolute inset-y-1 left-0 rounded-full bg-ink/[0.08]", pill.ready && "nav-pill-move")}
                style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
              />
            )}
            {links.map((item, i) => {
              const active = i === activeIndex;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-link
                  aria-current={active ? "page" : undefined}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className={cn("relative inline-flex h-8 items-center gap-2 rounded-full px-4 transition-colors duration-fast", active ? "text-ink" : "text-ink/70 hover:text-ink")}
                >
                  {active && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-self-end">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))}
              aria-label="Search, or press ⌘K"
              className="t-label hidden h-8 items-center gap-2 rounded-full px-3 text-ink/70 ring-1 ring-ink/10 transition-colors duration-fast hover:text-ink hover:ring-ink/30 lg:inline-flex"
            >
              Search <kbd className="rounded-[4px] bg-ink/10 px-1.5 py-px font-mono text-[10px] text-ink/80">⌘K</kbd>
            </button>
            {contact && (
              <Link
                href={contact.href}
                aria-current={contactActive ? "page" : undefined}
                className="hidden h-8 items-center gap-2 rounded-full bg-ink px-4 text-paper transition-colors duration-normal hover:bg-accent hover:text-on-sheet lg:inline-flex"
              >
                {contact.label} <span aria-hidden="true">→</span>
              </Link>
            )}
            <button
              type="button"
              onClick={toggle}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="t-label -mr-2 h-11 px-2 text-ink transition-colors duration-fast hover:text-accent lg:hidden"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu isOpen={isOpen} onClose={close} />
      <CommandPalette projects={projects} />
    </>
  );
}
