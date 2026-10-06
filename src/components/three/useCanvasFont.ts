"use client";

import { useEffect, useState } from "react";

/**
 * The site's mono and display faces (next/font's generated family lists) for canvas-drawn
 * text, and whether they have loaded — canvas text drawn before that falls back silently.
 */
export function useCanvasFont() {
  const [state, setState] = useState({ font: "ui-monospace, monospace", display: "Georgia, serif", ready: false });
  useEffect(() => {
    let alive = true;
    const css = getComputedStyle(document.documentElement);
    const family = css.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace";
    const display = css.getPropertyValue("--font-display").trim() || "Georgia, serif";
    Promise.all([document.fonts.load(`500 40px ${family}`), document.fonts.load(`700 40px ${family}`), document.fonts.load(`300 40px ${display}`)])
      .catch(() => undefined)
      .then(() => alive && setState({ font: family, display, ready: true }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
