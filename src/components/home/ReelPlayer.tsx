"use client";

import { useState } from "react";
import { FilmPlayer } from "@/components/motion/FilmPlayer";
import type { ReelItem } from "./VhsOverlay";

/** One tape: the film's name, its length and a line about it. */
export function TapeButton({ item, pressed, onClick }: { item: ReelItem; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="room-tape" data-tape={item.slug}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-display text-xl font-light text-ink">{item.name}</span>
        <span className="t-label text-ink/60">{item.film.duration} s</span>
      </span>
      <span className="mt-1 block text-left text-sm leading-snug text-ink/70">{item.caption}</span>
    </button>
  );
}

/**
 * The films on phones, in the page rather than over it: a CRT with the browser's own
 * controls (so play, sound, fullscreen and rotation work the way the phone expects) and a
 * tape for each film. Nothing downloads until play is pressed. `children` is the
 * section's heading, set between the screen and the tapes.
 */
export function ReelPlayer({ reel, children }: { reel: ReelItem[]; children: React.ReactNode }) {
  const [slug, setSlug] = useState(reel[0]?.slug);
  const item = reel.find((r) => r.slug === slug) ?? reel[0];
  if (!item) return null;
  return (
    <>
      <div className="px-5">
        <div className="vhs-body">
          <div className="vhs-screen">
            {/* a new tape is a new player: the last film stops and nothing of it keeps loading */}
            <FilmPlayer key={item.slug} film={item.film} title={item.name} className="h-full" />
            <div aria-hidden="true" className="vhs-lines" />
          </div>
        </div>
      </div>
      <div className="px-5 pt-7">
        {children}
        <div role="group" aria-label="Tapes" className="mt-6 grid gap-2">
          {reel.map((r) => (
            <TapeButton key={r.slug} item={r} pressed={r.slug === item.slug} onClick={() => setSlug(r.slug)} />
          ))}
        </div>
      </div>
    </>
  );
}
