"use client";

import { useEffect, useState } from "react";

/**
 * The site's mono face (next/font's generated family list) for canvas-drawn text,
 * and whether it has loaded — canvas text drawn before that falls back silently.
 */
export function useCanvasFont() {
  const [state, setState] = useState({ font: "ui-monospace, monospace", ready: false });
  useEffect(() => {
    let alive = true;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
    Promise.all([document.fonts.load(`500 40px ${family}`), document.fonts.load(`700 40px ${family}`)])
      .catch(() => undefined)
      .then(() => alive && setState({ font: family, ready: true }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
