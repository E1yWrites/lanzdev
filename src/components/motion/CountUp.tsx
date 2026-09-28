"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMedia";

const NUMERIC = /^[\d,\s/]+$/;

/**
 * Counts the numbers in `value` up from zero the first time it scrolls into view
 * ("801", "1,250", "14 / 16"). Anything else ("v1.1.0", "MIT") is shown as is.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const animatable = NUMERIC.test(value);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animatable || reduced) {
      // Nothing to count (or motion is off): show the real value.
      setShown(value);
      return;
    }
    const parts = value.split(/(\d[\d,]*)/);
    const render = (t: number) =>
      parts.map((p) => (/^\d[\d,]*$/.test(p) ? Math.round(Number(p.replace(/,/g, "")) * t).toLocaleString("en-US") : p)).join("");
    setShown(render(0));
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(render(1 - Math.pow(1 - t, 4)));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, animatable, reduced, duration]);

  return (
    <span ref={ref} className="tabular">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
