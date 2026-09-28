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

/**
 * Display type made of letters: they rise in on load, and near the pointer the
 * variable font thickens and the letters lift — a lens you can drag across a word.
 * Screen readers get the plain text.
 */
export function KineticText({ lines, accent, className, delay = 0, as: Tag = "h1", id }: KineticTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  // Letters wait (paused, via `.js .kinetic:not([data-play])`) until the text is on screen.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        root.dataset.play = "";
        io.disconnect();
      },
      { threshold: 0.2 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || !fine || reduced) return;
    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"));
    let centres: { x: number; y: number }[] = [];
    let raf = 0;
    let px = -9999;
    let py = -9999;
    const measure = () => {
      centres = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    const apply = () => {
      raf = 0;
      letters.forEach((l, i) => {
        const c = centres[i];
        if (!c) return;
        const k = Math.max(0, 1 - Math.hypot(px - c.x, py - c.y) / 240);
        const e = k * k * (3 - 2 * k);
        l.style.setProperty("--w", String(Math.round(300 + e * 420)));
        l.style.setProperty("--lift", `${(-e * 0.06).toFixed(3)}em`);
      });
    };
    const onMove = (e: PointerEvent) => {
      if (!centres.length) measure();
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = py = -9999;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const invalidate = () => (centres = []);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [fine, reduced]);

  let index = 0;
  const letter = (ch: string, extra?: string) => {
    const i = index++;
    return (
      <span key={i} data-letter className={cn("kinetic-letter", extra)} style={{ "--i": i, "--delay": `${delay}ms` } as React.CSSProperties}>
        {ch}
      </span>
    );
  };

  return (
    <Tag ref={ref} id={id} className={cn("kinetic", className)} aria-label={lines.join(" ") + (accent ?? "")}>
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
