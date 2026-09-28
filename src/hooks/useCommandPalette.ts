"use client";

import { useState, useEffect, useCallback } from "react";

import type { LucideIcon } from "lucide-react";

export const COMMAND_PALETTE_EVENT = "command-palette:open";

interface Command {
  label: string;
  action: () => void;
  category?: string;
  icon?: LucideIcon;
}

export function useCommandPalette(commands: Command[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
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

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      close();
    } else if (e.key === "Escape") {
      close();
    }
  };

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    filtered,
    selectedIndex,
    handleKeyDown,
  };
}
