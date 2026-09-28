"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

/**
 * A band of text that drifts on its own and speeds up (and leans) with scroll velocity,
 * reversing when you scroll back up. Still, and wrapped, under reduced motion.
 */
export function VelocityMarquee({ items, className, speed = 40 }: { items: React.ReactNode[]; className?: string; speed?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = track.current;
    if (!el || reduced) return;
    let x = 0;
    let dir = -1;
    let lastY = window.scrollY;
    let velocity = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      velocity += (dy / Math.max(dt, 1 / 120) - velocity) * 0.1;
      if (Math.abs(dy) > 0.5) dir = dy > 0 ? -1 : 1;
      if (visible) {
        const half = el.scrollWidth / 2;
        x += dir * (speed + Math.min(Math.abs(velocity) * 0.35, 900)) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        const skew = Math.max(-8, Math.min(8, -velocity * 0.006));
        el.style.transform = `translate3d(${x}px, 0, 0) skewX(${skew}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced, speed]);

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={track} className={cn("flex w-max will-change-transform", reduced && "w-auto flex-wrap")}>
        {[0, 1].map((copy) => (
          <div key={copy} className={cn("flex shrink-0 items-center", copy === 1 && (reduced ? "hidden" : ""))} aria-hidden={copy === 1 ? true : undefined}>
            {items.map((item, i) => (
              <span key={i} className="flex shrink-0 items-center">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
