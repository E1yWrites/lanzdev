"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import { ChevronDown } from "lucide-react";

interface ProjectDropdownProps {
  mobile?: boolean;
  onItemSelect?: () => void;
}

export function ProjectDropdown({ mobile = false, onItemSelect }: ProjectDropdownProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const isProjectsActive = pathname === "/projects" || pathname.startsWith("/projects/");

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(-1);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setActiveIndex(-1);
  }, []);

  // Close on outside click (desktop only)
  useEffect(() => {
    if (mobile || !isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, close, mobile]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev < projects.length - 1 ? prev + 1 : 0;
            itemRefs.current[next]?.focus();
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => {
            const next = prev > 0 ? prev - 1 : projects.length - 1;
            itemRefs.current[next]?.focus();
            return next;
          });
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          itemRefs.current[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(projects.length - 1);
          itemRefs.current[projects.length - 1]?.focus();
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
        case "Tab":
          close();
          break;
      }
    },
    [isOpen, open, close]
  );

  if (mobile) {
    return (
      <div className="border-b-2 border-swiss-border">
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={cn(
            "w-full flex items-center justify-between font-swiss text-lg font-bold tracking-widest uppercase py-3",
            "transition-colors duration-150",
            isProjectsActive ? "text-swiss-accent" : "text-swiss-fg hover:text-swiss-accent"
          )}
        >
          Projects
          <ChevronDown
            size={16}
            strokeWidth={2.5}
            className={cn(
              "transition-transform duration-150",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="pb-3 space-y-0">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                onClick={onItemSelect}
                className={cn(
                  "flex items-start gap-3 py-2 px-4 font-swiss text-sm transition-all duration-150",
                  "border-l-2",
                  pathname === `/projects/${project.slug}`
                    ? "border-swiss-accent text-swiss-accent bg-swiss-accent/5"
                    : "border-transparent text-swiss-fg/70 hover:text-swiss-fg hover:border-swiss-fg/30"
                )}
              >
                <span className="font-swiss text-[10px] font-bold tracking-widest text-swiss-fg/30 mt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="font-bold tracking-wider uppercase block">{project.name}</span>
                  <span className="text-[11px] text-swiss-fg/40 font-medium tracking-wide normal-case">
                    {project.tagline}
                  </span>
                </div>
              </Link>
            ))}
            <Link
              href="/projects"
              onClick={onItemSelect}
              className="block py-2 px-4 font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150"
            >
              View all projects →
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "font-swiss text-[11px] font-bold tracking-widest uppercase py-1",
          "relative transition-colors duration-150",
          "flex items-center gap-1",
          isProjectsActive ? "text-swiss-fg" : "text-swiss-fg/50 hover:text-swiss-fg"
        )}
      >
        Projects
        <ChevronDown
          size={10}
          strokeWidth={3}
          className={cn(
            "transition-transform duration-150 mt-px",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Projects"
          className="absolute top-full left-0 mt-2 w-80 border-2 border-swiss-border bg-swiss-bg z-50"
          onMouseLeave={() => setActiveIndex(-1)}
        >
          <div className="px-4 py-3 border-b-2 border-swiss-border">
            <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
              Projects
            </span>
          </div>
          <div className="py-1">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                href={`/projects/${project.slug}`}
                role="menuitem"
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => {
                  setActiveIndex(i);
                  itemRefs.current[i]?.focus();
                }}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 transition-all duration-100",
                  "group",
                  activeIndex === i
                    ? "bg-swiss-fg text-swiss-bg"
                    : pathname === `/projects/${project.slug}`
                      ? "bg-swiss-muted text-swiss-fg"
                      : "text-swiss-fg hover:bg-swiss-muted"
                )}
              >
                <span className={cn(
                  "font-swiss text-[10px] font-bold tracking-widest mt-0.5 shrink-0 w-5",
                  activeIndex === i ? "text-swiss-accent" : "text-swiss-fg/30"
                )}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <span className="font-swiss text-xs font-bold tracking-widest uppercase block">
                    {project.name}
                  </span>
                  <span className={cn(
                    "font-swiss text-[11px] font-medium block mt-0.5",
                    activeIndex === i ? "text-swiss-bg/70" : "text-swiss-fg/50"
                  )}>
                    {project.tagline}
                  </span>
                  <div className="flex flex-wrap gap-x-2 mt-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          "font-swiss text-[9px] font-bold tracking-widest uppercase",
                          activeIndex === i ? "text-swiss-bg/50" : "text-swiss-fg/30"
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {pathname === `/projects/${project.slug}` && (
                  <span className="ml-auto mt-1 w-1.5 h-1.5 bg-swiss-accent shrink-0" />
                )}
              </Link>
            ))}
          </div>
          <div className="border-t-2 border-swiss-border px-4 py-2.5">
            <Link
              href="/projects"
              className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 hover:text-swiss-accent transition-colors duration-150"
              onClick={close}
            >
              View all projects →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
