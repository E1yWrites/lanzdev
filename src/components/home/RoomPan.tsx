"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/config";
import { ROOM_OBJECTS, ROOM_VIEW, projectToStage } from "@/three/roomObjects";
import { Title } from "./Facts";
import type { RoomFacts } from "./RoomCard";

// Phones look around the room instead of picking from it: the stage stands at the
// screen's full height and a sideways swipe pans it from object to object (native
// scroll-snap). Once a swipe settles on an object the camera dollies in on it, and pulls
// back out as soon as the room moves again. The object in view stays lit, the rest dims,
// and a paper note docked at the bottom says what you're looking at. The names along the
// top jump. From md up this is a plain wrapper.

/** Each object's spot on the poster, left to right. */
const STOPS = ROOM_OBJECTS.map((o) => ({ o, at: projectToStage(ROOM_VIEW, o.anchor) })).sort((a, b) => a.at[0] - b.at[0]);
/** Stop 0, the opening view: the headline painted on the wall (its spot on room.webp). */
const WALL: [number, number] = [0.29, 0.3];
const xOf = (i: number) => (i === 0 ? WALL : STOPS[i - 1].at)[0];

/** The deck has no page; on phones the films play under the room (UnderRoom). */
const REEL_CTA = { label: "Play the films", href: "#reel" };
/** What the names along the top call each object. */
const nameOf = (s: (typeof STOPS)[number]) => (s.o.id === "reel" ? "Films" : s.o.label);
/** How far the camera dollies in on an object, and how long the room has to be still first (ms). */
const ZOOM = 1.4;
const SETTLE = 140;

/** The pan's track width: its layout box, which the zoom inside it never changes. */
const trackWidth = (pan: HTMLElement) => (pan.firstElementChild as HTMLElement).offsetWidth;

function scrollToStop(pan: HTMLElement | null, i: number, behavior?: ScrollBehavior) {
  pan?.scrollTo({ left: xOf(i) * trackWidth(pan) - pan.clientWidth / 2, behavior });
}

export function RoomPan({ facts, children }: { facts: RoomFacts; children: React.ReactNode }) {
  const pan = useRef<HTMLDivElement>(null);
  const settle = useRef(0);
  const [at, setAt] = useState(0);
  const [zoom, setZoom] = useState(false);

  const go = (i: number) => scrollToStop(pan.current, i);

  const onScroll = () => {
    const el = pan.current!;
    const w = trackWidth(el);
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    for (let i = 1; i <= STOPS.length; i++) if (Math.abs(xOf(i) * w - mid) < Math.abs(xOf(best) * w - mid)) best = i;
    setAt(best);
    // back out while it moves; in again once it's been still a moment (not on the wall, nor under reduced motion)
    setZoom(false);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => setZoom(best > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches), SETTLE);
  };

  useEffect(() => () => window.clearTimeout(settle.current), []);

  // open on the wall, or on ?focus=<id>
  useEffect(() => {
    if (matchMedia("(min-width: 768px)").matches) return;
    const focus = new URLSearchParams(location.search).get("focus");
    scrollToStop(pan.current, STOPS.findIndex((s) => s.o.id === focus) + 1, "instant");
  }, []);

  const stop = STOPS[at - 1];
  const [x, y] = stop?.at ?? WALL;
  const cta = stop?.o.id === "reel" ? REEL_CTA : stop?.o.card.cta;
  const status = stop && facts[stop.o.id]?.find(([k]) => k === "Status")?.[1];

  return (
    <>
      <div ref={pan} onScroll={onScroll} className="room-pan" style={{ "--ix": `${x * 100}%`, "--iy": `${y * 100 + 6}%` } as React.CSSProperties}>
        <div className="room-pan-track">
          <div className="room-zoom" style={zoom ? { transform: `scale(${ZOOM})`, transformOrigin: `${x * 100}% ${y * 100 + 6}%` } : { transformOrigin: `${x * 100}% ${y * 100 + 6}%` }}>
            {children}
          </div>
          {[WALL, ...STOPS.map((s) => s.at)].map(([sx], i) => (
            <span key={i} aria-hidden="true" className="room-snap" style={{ left: `${sx * 100}%` }} />
          ))}
        </div>
      </div>

      <div role="group" aria-label="Look at" className="room-names md:hidden">
        {STOPS.map((s, i) => (
          <button key={s.o.id} type="button" className="room-name t-label" aria-current={at === i + 1 || undefined} onClick={() => go(i + 1)}>
            {nameOf(s)}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="room-note md:hidden">
        {stop ? (
          <>
            <Title text={stop.o.card.title} className="text-[2rem] leading-none text-on-sheet" />
            <p className="mt-2 text-[15px] leading-snug text-on-sheet/75">{stop.o.card.body}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              {cta && (
                <Link href={cta.href} className="room-cta t-label">
                  {cta.label} <span aria-hidden="true">→</span>
                </Link>
              )}
              {status && <span className="t-label text-on-sheet/75">{status}</span>}
            </div>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-snug">Hi, I’m {siteConfig.alias}, a 3rd-year IT student in Batangas building web, mobile and desktop apps.</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="t-label inline-flex items-center gap-2 text-on-sheet/75">
                <span className="live-dot" aria-hidden="true" />
                {siteConfig.availability}
              </p>
              <button type="button" className="t-label min-h-11 shrink-0" onClick={() => go(1)}>
                Look around <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
