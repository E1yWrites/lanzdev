"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useFilmLoading, useFilmSource, type FilmState } from "@/components/motion/FilmPlayer";
import { KineticText } from "@/components/motion/KineticText";
import { Loader } from "@/components/motion/Loader";
import { useReducedMotion } from "@/hooks/useMedia";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { ProjectFilm } from "@/types/project";

export interface ReelItem {
  slug: string;
  name: string;
  caption: string;
  film: ProjectFilm;
}

/**
 * One film in the stack. The current film buffers as the player nears the screen and
 * the next one while it plays, so the hand-over is instant without downloading films
 * nobody reaches; the active one reports when it can play straight through.
 */
function ReelVideo({
  item,
  active,
  load,
  videoRef,
  onState,
  onEnded,
  onToggle,
}: {
  item: ReelItem;
  active: boolean;
  load: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  onState: (s: FilmState) => void;
  onEnded: () => void;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const state = useFilmLoading(ref, load);
  const src = useFilmSource(ref, item.film);
  useEffect(() => {
    if (active) onState(state);
  }, [active, state, onState]);

  return (
    <video
      ref={(el) => {
        ref.current = el;
        videoRef(el);
      }}
      className={cn("absolute inset-0 h-full w-full cursor-pointer transition-opacity duration-500", active ? "opacity-100" : "pointer-events-none opacity-0")}
      src={src}
      poster={item.film.poster}
      muted
      playsInline
      preload="none"
      onClick={onToggle}
      onEnded={onEnded}
      aria-hidden={!active}
      aria-label={`${item.name} — ${item.caption}`}
    />
  );
}

/**
 * The 15-second films, back to back, like stories. They buffer before the player
 * reaches the screen, each starts only once it can play through without stalling
 * (a loader shows until then), and one hands over to the next. Under reduced motion
 * nothing starts until you press play.
 */
export function Showreel({ items }: { items: ReelItem[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();
  const near = useInView(frame, "900px 0px");
  const inView = useInView(frame, "0px", 0.35);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  // Auto-play has to start muted (browser policy); sound is one tap away.
  const [sound, setSound] = useState(false);
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (v) v.muted = !(sound && i === current);
    });
  }, [sound, current]);
  const [status, setStatus] = useState<FilmState>({ ready: false, buffering: false, progress: 0 });

  // Auto-play the current film while on screen, once it's ready, and keep the others
  // still. This only ever *starts* a film on its own; it pauses only when you do or when
  // the reel leaves the screen, so pressing Play is never undone (under reduced motion
  // nothing starts by itself, but Play still plays).
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i !== current) {
        v.pause();
        if (v.currentTime) v.currentTime = 0;
        return;
      }
      if (!inView || userPaused) v.pause();
      else if (!reduced && status.ready) v.play().catch(() => undefined);
    });
  }, [current, inView, userPaused, reduced, status.ready]);

  // Play state and progress bars follow the current video every frame.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = videos.current[current];
      setPlaying(Boolean(v && !v.paused));
      bars.current.forEach((bar, i) => {
        if (!bar) return;
        const p = i < current ? 1 : i > current ? 0 : v && v.duration ? v.currentTime / v.duration : 0;
        bar.style.transform = `scaleX(${p})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current]);

  const toggle = () => {
    const v = videos.current[current];
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  const item = items[current];
  if (!item) return null;
  // Waiting for a smooth start (auto-play only), or stalled mid-play.
  const loading = status.buffering || (inView && !reduced && !userPaused && !status.ready);

  return (
    <section aria-labelledby="reel-title" className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="section-number">In motion</span>
          <KineticText as="h2" id="reel-title" lines={["Fifteen seconds", "each"]} accent="." className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink" />
        </div>
        <p className="max-w-md font-swiss text-base leading-relaxed text-ink/70 md:col-span-5">
          Two short films: PARADA’s motion reel, and Tala rendered frame by frame from the 3D model on this page — written in React with Remotion and three.js.
        </p>
      </div>

      <div className="mt-10">
        {/* story tabs */}
        <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Films">
          {items.map((it, i) => (
            <button
              key={it.slug}
              type="button"
              role="tab"
              aria-selected={i === current}
              onClick={() => {
                setCurrent(i);
                setUserPaused(false);
              }}
              className={cn("group text-left transition-colors duration-fast", i === current ? "text-ink" : "text-ink/60 hover:text-ink/80")}
            >
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-ink/15">
                <span
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  className="block h-full origin-left scale-x-0 bg-accent"
                />
              </span>
              <span className="t-label mt-3 flex justify-between gap-3">
                <span>
                  {String(i + 1).padStart(2, "0")} {it.name}
                </span>
                <span className="hidden sm:inline">{it.film.duration} s</span>
              </span>
            </button>
          ))}
        </div>

        <div ref={frame} className="relative mt-5 aspect-video overflow-hidden rounded-xl border border-ink/10 bg-black">
          {items.map((it, i) => (
            <ReelVideo
              key={it.slug}
              item={it}
              active={i === current}
              // only the current film buffers ahead; the next joins once this one is playing
              load={near && (i === current || (playing && i === (current + 1) % items.length))}
              videoRef={(el) => {
                videos.current[i] = el;
              }}
              onState={setStatus}
              onEnded={() => setCurrent((c) => (c + 1) % items.length)}
              onToggle={toggle}
            />
          ))}
          {loading && <Loader label="Loading film" progress={status.progress} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                const next = !sound;
                setSound(next);
                const v = videos.current[current];
                // Turning sound on is a request to hear it — start playing if paused.
                if (next && v?.paused) {
                  setUserPaused(false);
                  v.muted = false;
                  v.play().catch(() => undefined);
                }
              }}
              aria-pressed={sound}
              aria-label={sound ? "Mute the films" : "Turn sound on"}
              className={cn(
                "t-label inline-flex h-10 items-center gap-2 rounded-full px-4 backdrop-blur transition-colors",
                sound ? "bg-accent text-on-sheet" : "bg-paper/80 text-ink hover:bg-accent hover:text-on-sheet"
              )}
            >
              {sound ? <Volume2 size={14} strokeWidth={2} aria-hidden="true" /> : <VolumeX size={14} strokeWidth={2} aria-hidden="true" />}
              {sound ? "Sound on" : "Sound off"}
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? `Pause the ${item.name} film` : `Play the ${item.name} film`}
              className="t-label inline-flex h-10 items-center gap-2 rounded-full bg-paper/80 px-4 text-ink backdrop-blur transition-colors hover:bg-accent hover:text-on-sheet"
            >
              <span aria-hidden="true" className={playing ? "pause-glyph" : "play-glyph"} />
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <p className="t-label mt-3 text-ink/60">{item.caption}</p>
      </div>
    </section>
  );
}
