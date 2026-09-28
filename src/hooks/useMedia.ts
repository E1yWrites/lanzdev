"use client";

import { useEffect, useState } from "react";

/** A media query as state; `false` on the server and the first client render. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
/** A mouse or trackpad — hover and a cursor exist. */
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
