"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/config";
import { isActivePath, mainNav } from "@/data/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Full-width sheet under the bar: numbered rows on dotted rules. */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-14 z-30 overflow-y-auto bg-paper lg:hidden">
      <nav aria-label="Mobile" className="px-5 pt-6">
        <ol>
          {mainNav.map((item, i) => {
            const active = isActivePath(pathname, item.href);
            return (
              <li key={item.href} className="border-b border-dotted border-ink/25">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex items-baseline gap-5 py-5 text-ink transition-colors duration-fast hover:text-accent"
                >
                  <span className={cn("t-label w-6", active ? "text-accent" : "text-ink/60")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-4xl font-light tracking-tight">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="t-label flex items-center justify-between py-6 text-ink/60">
          <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" className="transition-colors duration-fast hover:text-ink">
            GitHub ↗
          </a>
          <a href={`mailto:${siteConfig.email}`} className="transition-colors duration-fast hover:text-ink">
            Email ↗
          </a>
        </div>
      </nav>
    </div>
  );
}
