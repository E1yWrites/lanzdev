"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createStore, useStore } from "@/components/three/store";
import { HOUSE, roomForPath } from "@/data/house";

// Every link is a door you walk through: the next room's light blooms out of the doorway
// while the screen dips to the page's own night, the page changes behind it, and the new
// room fades up out of the dark. (No flat colour fill: the light is a glow, never a wall.) Any internal link to another page opens this way (its own box is the
// doorway); the house's rooms pass their floor instead. Under reduced motion it's a plain
// navigation.

interface Entry {
  href: string;
  /** The doorway on screen, in px. */
  rect: { x: number; y: number; w: number; h: number };
  light: string;
}

const entering = createStore<Entry | null>(null);

/** Walks through a door; returns false when the visitor would rather not see it (the caller just navigates). */
export function enterDoor(entry: Entry) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  entering.set(entry);
  return true;
}

export function DoorTransition() {
  const entry = useStore(entering);
  const router = useRouter();
  const pathname = usePathname();
  const el = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const from = useRef<string | null>(null);

  // Every internal link to another page is a door. Capture phase, so it runs before
  // next/link's own handler (which would navigate at once); links marked data-door open
  // their own door.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.dataset.door !== undefined || a.target || a.hasAttribute("download") || a.origin !== location.origin) return;
      // the page you're on (and its #sections), or a file rather than a page
      if (a.pathname === location.pathname || /\.\w+$/.test(a.pathname)) return;
      const r = a.getBoundingClientRect();
      const href = a.pathname + a.search + a.hash;
      if (enterDoor({ href, rect: { x: r.left, y: r.top, w: r.width, h: r.height }, light: HOUSE[roomForPath(a.pathname)].light })) e.preventDefault();
    };
    // Back mid-walk: drop the light rather than leave it over the page
    const clear = () => entering.set(null);
    document.addEventListener("click", onClick, true);
    addEventListener("popstate", clear);
    return () => {
      document.removeEventListener("click", onClick, true);
      removeEventListener("popstate", clear);
    };
  }, []);

  // light blooms out of the doorway, the screen dips to night, then go
  useEffect(() => {
    const node = el.current;
    const lamp = glow.current;
    if (!entry || !node || !lamp) return;
    const { w, h } = entry.rect;
    // the glow starts about the doorway's size and spreads; its box is the screen's diagonal across
    const start = Math.max(w, h) / Math.hypot(innerWidth, innerHeight);
    const ease = { duration: 620, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" as const };
    from.current = location.pathname;
    const dip = node.animate([{ backgroundColor: "rgb(var(--paper) / 0)" }, { backgroundColor: "rgb(var(--paper) / 1)" }], ease);
    lamp.animate([{ transform: `scale(${start})`, opacity: 0.95 }, { transform: "scale(0.8)", opacity: 0.5 }], ease);
    let stuck = 0;
    dip.onfinish = () => {
      router.push(entry.href);
      // a page that never arrives must not leave the screen covered
      stuck = window.setTimeout(() => entering.get() === entry && entering.set(null), 5000);
    };
    return () => {
      dip.cancel();
      clearTimeout(stuck);
    };
  }, [entry, router]);

  // the new room is here: let its light go
  useEffect(() => {
    const node = el.current;
    if (!entry || !node || pathname === from.current) return;
    const fade = node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 80, easing: "ease-out", fill: "forwards" });
    fade.onfinish = () => entering.set(null);
  }, [pathname, entry]);

  if (!entry) return null;
  const d = Math.hypot(innerWidth, innerHeight);
  const cx = entry.rect.x + entry.rect.w / 2;
  const cy = entry.rect.y + entry.rect.h / 2;
  return (
    <div ref={el} aria-hidden="true" className="door-transition">
      <div
        ref={glow}
        className="absolute rounded-full"
        style={{ width: 2 * d, height: 2 * d, left: cx - d, top: cy - d, background: `radial-gradient(closest-side, ${entry.light}, ${entry.light}55 35%, transparent)` }}
      />
    </div>
  );
}
