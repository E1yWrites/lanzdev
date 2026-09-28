"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ProjectFilm } from "@/types/project";
import { FilmPlayer } from "./FilmPlayer";

/** Full-screen player for a project's 15-second film. Esc or the backdrop closes it. */
export function FilmDialog({ film, title, open, onClose }: { film: ProjectFilm; title: string; open: boolean; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      (returnTo.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${title} — film`} className="film-dialog fixed inset-0 z-[80] flex items-center justify-center bg-paper/90 p-4 backdrop-blur-sm md:p-10" onClick={onClose}>
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="t-label text-ink/70">
            {title} — {film.duration} s
          </span>
          <button ref={close} type="button" onClick={onClose} className="t-label rounded-md border border-ink/25 px-3 py-2 text-ink transition-colors hover:border-accent hover:text-accent">
            Close
          </button>
        </div>
        <FilmPlayer film={film} title={title} autoPlay className="rounded-lg" />
      </div>
    </div>,
    document.body
  );
}
