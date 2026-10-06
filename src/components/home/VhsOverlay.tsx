"use client";

import { useEffect, useRef, useState } from "react";
import { useFilmLoading, useFilmSource } from "@/components/motion/FilmPlayer";
import { Loader } from "@/components/motion/Loader";
import { heroPointer, roomLive, roomTape, useStore } from "@/components/three/store";
import { useReducedMotion } from "@/hooks/useMedia";
import { TAPE_INSERT_MS, type TapeId } from "@/three/roomObjects";
import type { ProjectFilm } from "@/types/project";

export interface ReelItem {
  slug: string;
  name: string;
  caption: string;
  film: ProjectFilm;
}

/**
 * The films, played off a tape: a CRT-style player with scanlines, a moment of tracking
 * wobble and a "▶ PLAY" readout each time a tape goes in. It opens once the tape has slid
 * into the deck (straight away without the live room), starts muted with a Sound on
 * button, and the other tape swaps the film. Esc, Close or a click outside ejects it.
 */
export function VhsOverlay({ reel }: { reel: ReelItem[] }) {
  const tape = useStore(roomTape);
  const live = useStore(roomLive);
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const [osd, setOsd] = useState(false);
  const item = reel.find((r) => r.slug === tape) ?? null;
  // keep the last film mounted while closing, so the source doesn't flip to the first one
  const shown = useRef<ReelItem | null>(null);
  if (item) shown.current = item;
  const film = (item ?? shown.current ?? reel[0])?.film;

  // Open once the tape is in; close when it's ejected.
  useEffect(() => {
    if (!tape) return setOpen(false);
    if (open) return;
    // wait for the tape to slide into the deck, when the room is there to show it
    const t = window.setTimeout(() => setOpen(true), live && !reduced && heroPointer.scroll < 0.5 ? TAPE_INSERT_MS : 0);
    return () => window.clearTimeout(t);
  }, [tape, open, live, reduced]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) video.current?.pause();
  }, [open]);

  // Each tape that goes in: the readout shows, and the picture wobbles while it tracks.
  useEffect(() => {
    if (!open || !tape) return;
    setOsd(true);
    const t = window.setTimeout(() => setOsd(false), 1800);
    if (!reduced) {
      screen.current?.animate(
        [
          { transform: "none" },
          { transform: "translateX(-7px) skewX(1.6deg)", filter: "brightness(1.35) saturate(1.3)" },
          { transform: "translateX(5px) skewX(-1.2deg)" },
          { transform: "translateX(-2px) skewX(0.5deg)" },
          { transform: "none" },
        ],
        { duration: 420, easing: "steps(8)" }
      );
      band.current?.animate([{ transform: "translateY(-30%)", opacity: 1 }, { transform: "translateY(420%)", opacity: 0 }], { duration: 650, easing: "ease-in" });
    }
    return () => window.clearTimeout(t);
  }, [open, tape, reduced]);

  const { ready, buffering, progress } = useFilmLoading(video, open);
  const src = useFilmSource(video, film ?? { mp4: "", webm: "", poster: "", duration: 15 });

  useEffect(() => {
    const v = video.current;
    if (v) v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = video.current;
    if (!open || !ready || !v) return;
    v.currentTime = 0;
    v.play().catch(() => undefined);
  }, [open, ready, src]);

  if (!film) return null;
  const name = (item ?? shown.current)?.name ?? "";

  return (
    <dialog
      ref={dialog}
      aria-label={`${name} — ${film.duration}-second film`}
      className="vhs"
      onCancel={(e) => {
        e.preventDefault();
        roomTape.set(null);
      }}
      onClick={(e) => e.target === e.currentTarget && roomTape.set(null)}
    >
      <div className="vhs-body">
        <div ref={screen} className="vhs-screen">
          <video ref={video} onPlay={() => setPaused(false)} onPause={() => setPaused(true)} src={src} poster={film.poster} muted playsInline loop preload="none" className="h-full w-full object-cover" aria-label={`${name} — ${(item ?? shown.current)?.caption ?? ""}`} />
          <div aria-hidden="true" className="vhs-lines" />
          <div ref={band} aria-hidden="true" className="vhs-band" />
          {osd && (
            <>
              <p aria-hidden="true" className="vhs-osd">
                ▶ PLAY
              </p>
              <p aria-hidden="true" className="vhs-osd vhs-osd-right">
                SP 0:{String(film.duration).padStart(2, "0")}
              </p>
            </>
          )}
          {(!ready || buffering) && open && <Loader label="Loading film" progress={progress} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Tapes" className="flex gap-2">
            {reel.map((r) => (
              <button key={r.slug} type="button" aria-pressed={tape === r.slug} onClick={() => roomTape.set(r.slug as TapeId)} className="vhs-button" data-tape={r.slug}>
                {r.name} · {r.film.duration} s
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => (paused ? video.current?.play().catch(() => undefined) : video.current?.pause())} className="vhs-button">
              {paused ? "Play" : "Pause"}
            </button>
            <button type="button" aria-pressed={!muted} onClick={() => setMuted((m) => !m)} className="vhs-button">
              {muted ? "Sound on" : "Sound off"}
            </button>
            <button type="button" onClick={() => roomTape.set(null)} className="vhs-button">
              Eject
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
