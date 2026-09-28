"use client";

import { useEffect, useRef, useState } from "react";
import { KineticText } from "@/components/motion/KineticText";
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
 * The 15-second films, back to back, like stories: they play (muted) while the
 * player is on screen, one hands over to the next, and the tabs double as progress.
 * Under reduced motion nothing starts until you press play.
 */
export function Showreel({ items }: { items: ReelItem[] }) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();
  const inView = useInView(frame, "0px", 0.35);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  // Play while on screen (unless paused by hand or reduced motion); pause when off.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && !userPaused && !reduced) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [inView, userPaused, reduced, current]);

  // Progress bars follow the playhead every frame.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const v = video.current;
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
    const v = video.current;
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

  return (
    <section aria-labelledby="reel-title" className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="section-number">In motion</span>
          <KineticText as="h2" id="reel-title" lines={["Fifteen seconds", "each"]} accent="." className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink" />
        </div>
        <p className="max-w-md font-swiss text-base leading-relaxed text-ink/70 md:col-span-5">
          Two short films, rendered frame by frame from the same 3D models on this page — written in React with Remotion and three.js.
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
              className={cn("group text-left transition-colors duration-fast", i === current ? "text-ink" : "text-ink/45 hover:text-ink/80")}
            >
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-ink/15">
                <span ref={(el) => { bars.current[i] = el; }} className="block h-full origin-left scale-x-0 bg-accent" />
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

        <div ref={frame} className="relative mt-5 overflow-hidden rounded-xl border border-ink/10 bg-black" data-cursor={playing ? "Pause" : "Play"}>
          <video
            key={item.slug}
            ref={video}
            className="aspect-video w-full cursor-pointer"
            poster={item.film.poster}
            muted
            playsInline
            preload={inView ? "auto" : "none"}
            onClick={toggle}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setCurrent((c) => (c + 1) % items.length)}
            aria-label={`${item.name} — ${item.caption}`}
          >
            <source src={item.film.mp4} type="video/mp4" />
            <source src={item.film.webm} type="video/webm" />
          </video>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? `Pause the ${item.name} film` : `Play the ${item.name} film`}
            className="t-label absolute bottom-4 right-4 inline-flex h-10 items-center gap-2 rounded-full bg-paper/80 px-4 text-ink backdrop-blur transition-colors hover:bg-accent hover:text-on-sheet"
          >
            <span aria-hidden="true" className={playing ? "pause-glyph" : "play-glyph"} />
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <p className="t-label mt-3 text-ink/55">{item.caption}</p>
      </div>
    </section>
  );
}
