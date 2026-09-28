"use client";

import { Fragment, useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

interface KineticTextProps {
  /** Each string is one line. */
  lines: string[];
  /** Appended to the last line in the accent colour, e.g. "." */
  accent?: string;
  className?: string;
  /** Delay before the letters rise in, ms. */
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
}

/** How much the letter under the pointer grows (1 + LENS). */
const LENS = 0.2;

/**
 * Display type whose letters rise into place, line by line, the first time it
 * scrolls into view. Once settled, it becomes a lens: letters near the pointer grow
 * and spread apart, like a loupe dragged across the word. The lens is transform-only
 * (no weight change, so nothing reflows), and the line masks are gone by then, so an
 * enlarged letter is never clipped. Screen readers get the plain text.
 */
export function KineticText({ lines, accent, className, delay = 0, as: Tag = "h1", id }: KineticTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  // Letters wait (paused, via `.js .kinetic:not([data-play])`) until the text is on
  // screen; once the last one has landed the heading is "settled".
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        root.dataset.play = "";
        io.disconnect();
        const letters = root.querySelectorAll(".kinetic-letter").length;
        timer = window.setTimeout(() => (root.dataset.settled = ""), delay + letters * 28 + 1000);
      },
      { threshold: 0.2 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  // The lens. Letter centres come from layout offsets (not bounding boxes), so the
  // lens's own transforms never feed back into the measurement.
  useEffect(() => {
    const root = ref.current;
    if (!root || !fine || reduced) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>(".kinetic-letter"));
    let px = 0;
    let py = 0;
    let raf = 0;
    let active = false;
    const apply = () => {
      raf = 0;
      if (root.dataset.settled === undefined) return;
      const box = root.getBoundingClientRect();
      const radius = Math.max(90, parseFloat(getComputedStyle(root).fontSize) * 1.5);
      letters.forEach((l) => {
        if (!active) {
          l.style.removeProperty("--ls");
          l.style.removeProperty("--lx");
          l.style.removeProperty("--ly");
          return;
        }
        const cx = box.left + l.offsetLeft + l.offsetWidth / 2;
        const cy = box.top + l.offsetTop + l.offsetHeight / 2;
        const d = Math.hypot(px - cx, (py - cy) * 1.4) / radius;
        const e = Math.exp(-d * d * 1.6);
        const grow = LENS * e;
        l.style.setProperty("--ls", (1 + grow).toFixed(3));
        // spread from the pointer by as much as the letters grew, so neighbours make room
        l.style.setProperty("--lx", `${((cx - px) * grow).toFixed(1)}px`);
        l.style.setProperty("--ly", `${(-grow * 0.12).toFixed(3)}em`);
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      px = e.clientX;
      py = e.clientY;
      active = true;
      schedule();
    };
    const onLeave = () => {
      active = false;
      schedule();
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      letters.forEach((l) => ["--ls", "--lx", "--ly"].forEach((v) => l.style.removeProperty(v)));
    };
  }, [fine, reduced]);

  let index = 0;
  const letter = (ch: string, extra?: string) => {
    const i = index++;
    return (
      <span key={i} className={cn("kinetic-letter", extra)} style={{ "--i": i, "--delay": `${delay}ms` } as React.CSSProperties}>
        {ch}
      </span>
    );
  };

  return (
    <Tag ref={ref} id={id} className={cn("kinetic", className)}>
      <span className="sr-only">{lines.join(" ") + (accent ?? "")}</span>
      {lines.map((line, li) => (
        <span key={li} className="kinetic-line" aria-hidden="true">
          {line.split(" ").map((word, wi, words) => (
            <Fragment key={wi}>
              <span className="kinetic-word">
                {Array.from(word).map((ch) => letter(ch))}
                {li === lines.length - 1 && wi === words.length - 1 && accent ? Array.from(accent).map((ch) => letter(ch, "text-accent")) : null}
              </span>
              {/* the space sits between the inline-blocks, where it can't be trimmed */}
              {wi < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  );
}
