"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/config";
import { HOUSE, roomForPath } from "@/data/house";
import { isActivePath, mainNav } from "@/data/navigation";
import { useReducedMotion } from "@/hooks/useMedia";

// The phone menu, after the Sterling Gate kinetic nav: three layers of paint slide in
// from the right one after another (ember, raised midnight, midnight), then the links
// rise out of their rows, then the way out (GitHub, email). Each row's number lights in
// the light of the room it leads to. GSAP loads the first time the Menu button is
// touched, not with the page; under reduced motion it never loads and the menu just shows.

type Gsap = typeof import("gsap").gsap;
let gsapReady: Promise<Gsap> | null = null;

/** Start fetching GSAP (and its ease) ahead of the first open; never under reduced motion. */
export function prefetchMenuMotion() {
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) loadMenuMotion();
}

function loadMenuMotion() {
  return (gsapReady ??= Promise.all([import("gsap"), import("gsap/CustomEase")]).then(([{ gsap }, { CustomEase }]) => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("door", "0.65, 0.01, 0.05, 0.99");
    return gsap;
  }));
}

export function KineticMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  // mounted and visible: stays true through the closing animation
  const [shown, setShown] = useState(false);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (reduced) {
      setShown(isOpen);
      return;
    }
    // nothing to close yet (first render): don't fetch GSAP for it
    if (!isOpen && root.current?.hidden) return;
    let alive = true;
    let tl: gsap.core.Timeline | undefined;
    loadMenuMotion().then((gsap) => {
      const el = root.current;
      if (!alive || !el) return;
      const q = gsap.utils.selector(el);
      tl = gsap.timeline({ defaults: { ease: "door", duration: 0.7 } });
      if (isOpen) {
        // from-states apply now, before the menu is shown, so it never flashes open
        // the rows wait under the paint until the last layer has nearly landed
        tl.set(q(".kmenu-panel"), { xPercent: 0 })
          .set(q(".kmenu-body"), { autoAlpha: 0 })
          .fromTo(q(".kmenu-shade"), { autoAlpha: 0 }, { autoAlpha: 1 })
          .fromTo(q(".kmenu-layer"), { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .set(q(".kmenu-body"), { autoAlpha: 1 }, "<+=0.35")
          .fromTo(q(".kmenu-link"), { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<")
          .fromTo(q(".kmenu-fade"), { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
        setShown(true);
      } else {
        tl.to(q(".kmenu-shade"), { autoAlpha: 0 })
          .to(q(".kmenu-panel"), { xPercent: 120 }, "<")
          .call(() => setShown(false));
      }
    });
    return () => {
      alive = false;
      tl?.kill();
    };
  }, [isOpen, reduced]);

  return (
    <div ref={root} id="mobile-menu" hidden={!shown} className="kmenu md:hidden">
      <div aria-hidden="true" className="kmenu-shade" onClick={onClose} />
      <nav aria-label="Mobile" className="kmenu-panel">
        <div aria-hidden="true" className="kmenu-layer bg-accent" />
        <div aria-hidden="true" className="kmenu-layer bg-paper-elevated" />
        <div aria-hidden="true" className="kmenu-layer bg-paper" />

        <div className="kmenu-body relative">
          <ol className="px-5 pt-6">
            {mainNav.map((item, i) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-dotted border-ink/25">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="kmenu-row flex items-baseline gap-5 overflow-hidden py-5 text-ink"
                    style={{ "--light": HOUSE[roomForPath(item.href)].light } as React.CSSProperties}
                  >
                    <span className={cn("kmenu-index t-label w-6", active ? "text-accent" : "text-ink/60")}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="kmenu-link inline-block font-display text-[2.75rem] font-light leading-none tracking-[-0.03em]">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="t-label flex items-center justify-between px-5 py-6 text-ink/60">
            <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" className="kmenu-fade transition-colors duration-fast hover:text-ink">
              GitHub ↗
            </a>
            <a href={`mailto:${siteConfig.email}`} className="kmenu-fade transition-colors duration-fast hover:text-ink">
              Email ↗
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
