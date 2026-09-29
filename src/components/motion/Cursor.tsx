"use client";

import { useEffect, useRef } from "react";
import { cursorLabel } from "@/components/three/store";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";

/**
 * A small ring that trails the pointer (the system cursor stays). Over links and buttons
 * it turns accent. Labels are only for things nothing else on screen explains — a 3D
 * key, the colour lens (`data-cursor="Label"`) — and sit in a tag beside the pointer.
 * Where a visible hint or button already says it, the ring stays quiet.
 * Mouse/trackpad only, and off under reduced motion.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    const el = ring.current;
    const text = label.current;
    if (!el || !text) return;

    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let domLabel: string | null = null;
    let interactive = false;
    let visible = false;
    let raf = 0;

    const render = () => {
      cur.x += (pos.x - cur.x) * 0.38;
      cur.y += (pos.y - cur.y) * 0.38;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(render);
    };

    const paint = () => {
      const l = cursorLabel.get() ?? domLabel;
      text.textContent = l ?? "";
      el.dataset.state = l ? "label" : interactive ? "hover" : "idle";
      el.style.opacity = visible ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        cur.x = pos.x;
        cur.y = pos.y;
      }
      const target = e.target as Element | null;
      const labelled = target?.closest?.("[data-cursor]");
      domLabel = labelled?.getAttribute("data-cursor") || null;
      interactive = Boolean(target?.closest?.("a, button, [role='button'], summary, label, input, select, textarea"));
      paint();
    };
    const onLeave = () => {
      visible = false;
      paint();
    };

    raf = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    const unsub = cursorLabel.subscribe(paint);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      unsub();
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div ref={ring} aria-hidden="true" className="cursor-ring" data-state="idle" style={{ opacity: 0 }}>
      <span ref={label} className="cursor-ring-label" />
    </div>
  );
}
