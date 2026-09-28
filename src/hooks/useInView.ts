"use client";

import { useEffect, useState, type RefObject } from "react";

/** Whether `ref` intersects the viewport (grown by `margin`). */
export function useInView(ref: RefObject<Element>, margin = "0px", threshold = 0) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, threshold]);
  return inView;
}
