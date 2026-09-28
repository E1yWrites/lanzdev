"use client";

import { Fragment, useEffect, useRef } from "react";
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
 * Display type whose letters rise into place, line by line, the first time it
 * scrolls into view. Only the entrance moves — once settled, the type stays put
 * (no hover distortion), so it always reads cleanly. Screen readers get the plain text.
 */
export function KineticText({ lines, accent, className, delay = 0, as: Tag = "h1", id }: KineticTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);

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
