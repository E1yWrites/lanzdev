"use client";

import { useRef, useEffect, useCallback } from "react";

interface UseRevealOptions {
  threshold?: number;
  stagger?: boolean;
  staggerDelay?: number;
  rootMargin?: string;
}

export function useReveal(options: UseRevealOptions = {}) {
  const {
    threshold = 0.05,
    stagger = true,
    staggerDelay = 80,
    rootMargin = "0px 0px -40px 0px",
  } = options;

  const sectionRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observe = useCallback(() => {
    if (!sectionRef.current) return;

    if (prefersReducedMotion) {
      const elements = sectionRef.current.querySelectorAll(".reveal");
      elements.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = sectionRef.current.querySelectorAll(".reveal");

    if (stagger && elements.length > 1) {
      elements.forEach((el, i) => {
        (el as HTMLElement).style.transitionDelay = `${i * staggerDelay}ms`;
        observer.observe(el);
      });
    } else {
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [threshold, stagger, staggerDelay, rootMargin, prefersReducedMotion]);

  useEffect(() => {
    const cleanup = observe();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [observe]);

  return sectionRef;
}
