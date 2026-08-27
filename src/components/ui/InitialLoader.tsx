"use client";

import { useEffect, useState } from "react";

export function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timeout = mql.matches ? 0 : 400;
    const timer = setTimeout(() => setVisible(false), timeout);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-swiss-bg flex items-center justify-center animate-fade-out">
      <div className="max-w-md w-full px-8">
        <div className="mb-8">
          <span className="font-swiss font-black text-2xl tracking-tighter uppercase text-swiss-fg">
            Lorenz<span className="text-swiss-accent">.</span>dev
          </span>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-[3px] w-full" />
          <div className="skeleton h-[3px] w-3/4" />
          <div className="skeleton h-[3px] w-1/2" />
        </div>
      </div>
    </div>
  );
}
