"use client";

import { useEffect } from "react";

// The home page is a walk through the house, one room to a screen: on a desktop, one
// wheel gesture, swipe or page key moves exactly one scene, with an eased glide. A
// trackpad's momentum after a step is ignored until the hand comes off or swipes again.
// Past the last scene the page scrolls freely (the footer). Touch, reduced motion and
// anything typed into or scrolled inside are left alone.

const GLIDE_MS = 650;
/** Leaves at once and settles softly: the page answers the hand, then lands. */
const ease = (t: number) => 1 - Math.pow(1 - t, 4);
/** How far a gesture has to travel before it's a step, so a nudge isn't a whole scene. */
const NUDGE = 30;

export function SceneScroll() {
  useEffect(() => {
    const wanted = matchMedia("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let gliding = false;
    let lastWheel = 0;
    let lastDelta = 0;
    let travelled = 0;
    let stepped = false;
    /** Where the glide in progress is heading, so a new swipe during it goes one scene further. */
    let target = 0;

    const tops = () => Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"), (s) => s.getBoundingClientRect().top + scrollY);
    const blocked = (target: EventTarget | null) => {
      if (document.querySelector("dialog[open]")) return true;
      const el = target instanceof Element ? target : null;
      return Boolean(el?.closest("input, textarea, select, [contenteditable], [data-scroll-own]"));
    };

    /** Moves one scene in `dir` (by about `by` px); false when the page should scroll on its own instead. */
    const step = (dir: 1 | -1, by: number) => {
      const t = tops();
      if (!t.length) return false;
      const last = t[t.length - 1];
      // below the last scene's top (in the footer) the page is free, until a move up would cross back into it
      if (scrollY > last + 2) {
        if (dir > 0 || scrollY - by > last) return false;
        glide(last);
        return true;
      }
      const from = gliding ? target : scrollY;
      const here = t.reduce((best, top, i) => (Math.abs(top - from) < Math.abs(t[best] - from) ? i : best), 0);
      const next = here + dir;
      if (next < 0) return true;
      if (next >= t.length) return false;
      glide(t[next]);
      return true;
    };

    let run = 0;
    const glide = (to: number) => {
      const from = scrollY;
      const start = performance.now();
      const id = ++run;
      gliding = true;
      target = to;
      const frame = (now: number) => {
        if (id !== run) return; // a newer glide took over
        const p = Math.min(1, (now - start) / GLIDE_MS);
        scrollTo({ top: from + (to - from) * ease(p), behavior: "instant" });
        if (p < 1) requestAnimationFrame(frame);
        else gliding = false;
      };
      requestAnimationFrame(frame);
    };

    const onWheel = (e: WheelEvent) => {
      if (!wanted.matches || e.ctrlKey || blocked(e.target) || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const t = tops();
      if (!t.length || (scrollY > t[t.length - 1] + 2 && (e.deltaY > 0 || scrollY + e.deltaY > t[t.length - 1]))) return;
      const now = performance.now();
      // a new gesture: the wheel paused, or the swipe got stronger than the momentum it follows
      const fresh = now - lastWheel > 160 || Math.abs(e.deltaY) > lastDelta * 1.6;
      lastWheel = now;
      lastDelta = Math.abs(e.deltaY);
      if (fresh) {
        travelled = 0;
        stepped = false;
      }
      travelled += e.deltaY;
      // one step per gesture, once it has travelled far enough; the rest of it (momentum) is swallowed
      if (stepped || Math.abs(travelled) < NUDGE) {
        e.preventDefault();
        return;
      }
      stepped = true;
      if (step(travelled > 0 ? 1 : -1, Math.abs(e.deltaY))) e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      if (!wanted.matches || e.altKey || e.ctrlKey || e.metaKey || blocked(e.target)) return;
      const down = e.key === "PageDown" || e.key === "ArrowDown" || (e.key === " " && !e.shiftKey);
      const up = e.key === "PageUp" || e.key === "ArrowUp" || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      // Space on a button or link presses it
      if (e.key === " " && e.target instanceof Element && e.target.closest("a, button, summary")) return;
      if (step(down ? 1 : -1, e.key.startsWith("Arrow") ? 40 : innerHeight)) e.preventDefault();
    };

    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("wheel", onWheel);
      removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
