"use client";

import { useRef, useEffect, useCallback } from "react";

interface UseParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.15, direction = "up" } = options;
  const elementRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleScroll = useCallback(() => {
    if (!elementRef.current || prefersReducedMotion) return;

    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distance = elementCenter - viewportCenter;
    const offset = distance * speed * (direction === "up" ? -1 : 1);

    elementRef.current.style.transform = `translateY(${offset}px)`;
  }, [speed, direction, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, prefersReducedMotion]);

  return elementRef;
}
