"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { ProjectFilm } from "@/types/project";
import { Loader } from "./Loader";

export interface FilmState {
  ready: boolean;
  buffering: boolean;
  progress: number;
}

/**
 * Buffering bookkeeping for a <video>: starts downloading when `load` turns true,
 * reports how much is buffered, and whether it can play through without stalling.
 * Some browsers never pre-buffer (data saver, iOS, a slow link), so `ready` also turns
 * true after a short wait; playing then fetches the film, and `buffering` covers stalls.
 */
export function useFilmLoading(video: React.RefObject<HTMLVideoElement>, load: boolean) {
  const [state, setState] = useState<FilmState>({ ready: false, buffering: false, progress: 0 });

  useEffect(() => {
    const v = video.current;
    if (!v || !load) return;
    if (v.preload !== "auto") {
      v.preload = "auto";
      // Kick off the download, but never while a play is pending: load() would abort it
      // and the film would snap back to paused.
      if (v.readyState === 0 && v.paused) v.load();
    }
    const progress = () => {
      if (!v.duration || !v.buffered.length) return;
      setState((s) => ({ ...s, progress: v.buffered.end(v.buffered.length - 1) / v.duration }));
    };
    const ready = () => setState((s) => ({ ...s, ready: true, buffering: false, progress: 1 }));
    const waiting = () => setState((s) => ({ ...s, buffering: true }));
    const playing = () => setState((s) => ({ ...s, buffering: false }));
    if (v.readyState >= 4) ready();
    const giveUp = window.setTimeout(() => setState((s) => (s.ready ? s : { ...s, ready: true, buffering: v.readyState < 3 })), 2500);
    v.addEventListener("progress", progress);
    v.addEventListener("canplaythrough", ready);
    v.addEventListener("waiting", waiting);
    v.addEventListener("playing", playing);
    return () => {
      window.clearTimeout(giveUp);
      v.removeEventListener("progress", progress);
      v.removeEventListener("canplaythrough", ready);
      v.removeEventListener("waiting", waiting);
      v.removeEventListener("playing", playing);
    };
  }, [video, load]);

  return state;
}

interface FilmPlayerProps {
  film: ProjectFilm;
  title: string;
  /** Start playing — but only once enough is buffered to play straight through.
   *  Sound is tried first (it follows a click); if the browser refuses, it plays muted. */
  autoPlay?: boolean;
  className?: string;
}

/**
 * A film with native controls that preloads as it nears the viewport, so pressing
 * play starts instantly. With `autoPlay` it waits for a smooth start, showing the loader.
 */
export function FilmPlayer({ film, title, autoPlay = false, className }: FilmPlayerProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useInView(wrap, "600px 0px");
  const { ready, buffering, progress } = useFilmLoading(video, near || autoPlay);
  const started = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!autoPlay || !ready || !v || started.current) return;
    started.current = true;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => undefined);
    });
  }, [autoPlay, ready]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-black", className)}>
      <video ref={video} className="aspect-video w-full" poster={film.poster} controls playsInline preload="none" aria-label={`${title} — ${film.duration}-second film, with sound`}>
        <source src={film.webm} type="video/webm" />
        <source src={film.mp4} type="video/mp4" />
      </video>
      {((autoPlay && !ready) || buffering) && (
        <Loader label="Loading film" progress={progress} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}
