"use client";

import { useState, useEffect, useCallback } from "react";

export const COMMAND_PALETTE_EVENT = "command-palette:open";

/** The palette shortcut as it's printed on this keyboard: "⌘K" on Apple devices, "Ctrl K" elsewhere. */
export function useShortcutLabel() {
  const [label, setLabel] = useState("Ctrl K");
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    if (/mac|iphone|ipad/i.test(nav.userAgentData?.platform ?? navigator.platform)) setLabel("⌘K");
  }, []);
  return label;
}

export interface Command {
  label: string;
  href: string;
  /** Opens in a new tab (off the site). */
  external?: boolean;
}

export function useCommandPalette(commands: Command[], run: (cmd: Command) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // matches the name or the path it opens
  const q = query.trim().toLowerCase();
  const filtered = commands.filter((cmd) => `${cmd.label} ${cmd.href}`.toLowerCase().includes(q));

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
    };
    window.addEventListener("keydown", handler);
    // Lets a visible button (the nav's ⌘K key) open the palette.
    window.addEventListener(COMMAND_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener(COMMAND_PALETTE_EVENT, open);
    };
  }, [isOpen, open, close]);

  useEffect(() => setSelectedIndex(0), [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      run(filtered[selectedIndex]);
      close();
    }
  };

  return { isOpen, close, query, setQuery, filtered, selectedIndex, setSelectedIndex, handleKeyDown };
}
