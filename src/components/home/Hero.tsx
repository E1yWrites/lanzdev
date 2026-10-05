"use client";

import { useEffect, useRef } from "react";
import { ModelStage } from "@/components/three/ModelStage";
import { heroPointer, openRoom, roomFocus, roomHover, roomLive, roomPins, roomTape, syncRoomFromUrl, useStore } from "@/components/three/store";
import { ROOM_OBJECTS, ROOM_VIEW, projectToStage, roomObject } from "@/three/roomObjects";
import { siteConfig } from "@/data/config";
import { asset } from "@/lib/constants";
import { useFinePointer, useMedia } from "@/hooks/useMedia";
import type { ReelItem } from "./Showreel";
import { RoomCard, type RoomFacts } from "./RoomCard";
import { VhsOverlay } from "./VhsOverlay";

/** Where the pins sit over the poster — the same camera as the render, so they line up before WebGL. */
const POSTER_PINS = ROOM_OBJECTS.map((o) => projectToStage(ROOM_VIEW, o.anchor));

/**
 * Numbered pins over the room, 01–05, in tab order. Each opens its object's card. Over the
 * poster they sit where the render put each object; once the live room is up they follow
 * its camera (written straight to style, no re-render per frame).
 */
function RoomPins({ interactive }: { interactive: boolean }) {
  const hover = useStore(roomHover);
  const focus = useStore(roomFocus);
  const pins = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const place = () => {
      const at = roomPins.get() ?? POSTER_PINS;
      at.forEach(([x, y], i) => {
        const el = pins.current[i];
        if (!el) return;
        el.style.left = `${x * 100}%`;
        el.style.top = `${y * 100}%`;
      });
    };
    place();
    return roomPins.subscribe(place);
  }, []);

  // On phones the pins are too close together to be fair targets: they stay as markers
  // on the picture, and the index under it (PhoneIndex) is what you tap.
  if (!interactive)
    return (
      <div aria-hidden="true" className="room-pins absolute inset-0">
        {ROOM_OBJECTS.map((o, i) => (
          <span
            key={o.id}
            ref={(el) => {
              pins.current[i] = el;
            }}
            className="room-pin"
            style={{ left: `${POSTER_PINS[i][0] * 100}%`, top: `${POSTER_PINS[i][1] * 100}%`, animationDelay: `${500 + i * 90}ms` }}
          >
            <span className="room-pin-chip">
              <span className="room-pin-index">{o.index}</span>
            </span>
          </span>
        ))}
      </div>
    );

  return (
    <nav aria-label="Room" className="room-pins absolute inset-0" data-hidden={focus !== null || undefined}>
      <ol>
        {ROOM_OBJECTS.map((o, i) => (
          <li key={o.id}>
            <button
              ref={(el) => {
                pins.current[i] = el;
              }}
              id={`pin-${o.id}`}
              type="button"
              aria-haspopup="dialog"
              className="room-pin"
              data-on={hover === o.id || undefined}
              style={{ left: `${POSTER_PINS[i][0] * 100}%`, top: `${POSTER_PINS[i][1] * 100}%`, animationDelay: `${500 + i * 90}ms` }}
              onPointerEnter={() => roomHover.set(o.id)}
              onPointerLeave={() => roomHover.get() === o.id && roomHover.set(null)}
              onFocus={() => roomHover.set(o.id)}
              onBlur={() => roomHover.get() === o.id && roomHover.set(null)}
              onClick={() => openRoom(o.id)}
            >
              <span className="room-pin-chip">
                <span className="room-pin-index">{o.index}</span>
                <span className="room-pin-name">
                  {o.label}
                  <span className="sr-only">, {o.thing}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The room's index as full-size buttons, for phones. */
function PhoneIndex() {
  return (
    <nav aria-label="Room" className="mt-3 md:hidden">
      <ol className="grid grid-cols-2 gap-2">
        {ROOM_OBJECTS.map((o) => (
          <li key={o.id} className={o.id === "reel" ? "col-span-2" : undefined}>
            <button type="button" aria-haspopup="dialog" onClick={() => openRoom(o.id)} className="room-index flex min-h-[52px] w-full items-center gap-3 rounded-xl px-3.5 text-left">
              <span className="t-label text-ink/60">{o.index}</span>
              <span className="font-display text-xl font-light leading-none text-ink">{o.label}</span>
              <span aria-hidden="true" className="t-label ml-auto text-accent">
                →
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Vignette() {
  const focus = useStore(roomFocus);
  const live = useStore(roomLive);
  // only the live camera zooms in; over the poster the room stays as it is
  const side = live ? roomObject(focus)?.side : undefined;
  return <div aria-hidden="true" className="room-vignette pointer-events-none absolute -inset-px" data-side={side} />;
}

/**
 * The hero is Lanz's room at night. The headline is painted on its left wall (on phones,
 * where paint that small can't be read, it's set as type above the room). Five objects
 * are the index: pick one and the camera moves to it and its card opens.
 */
export function Hero({ facts, reel }: { facts: RoomFacts; reel: ReelItem[] }) {
  const section = useRef<HTMLElement>(null);
  const wide = useMedia("(min-width: 768px)");
  const fine = useFinePointer();
  const live = useStore(roomLive);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      heroPointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const h = section.current?.offsetHeight ?? window.innerHeight;
      heroPointer.scroll = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    syncRoomFromUrl();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", syncRoomFromUrl);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", syncRoomFromUrl);
      roomFocus.set(null);
      roomHover.set(null);
      roomTape.set(null);
    };
  }, []);

  const hint = !fine ? "Tap a number" : live ? "Drag to turn · pick a number" : "Pick a number";

  return (
    <section ref={section} aria-labelledby="hero-title" className="hero relative overflow-hidden">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex max-w-[1600px] flex-col px-5 md:min-h-[calc(100svh-56px)] md:px-8 lg:px-12">
        {/* On the wall from md up; set as type on phones. Always the page's one h1. */}
        <div className="pt-8 md:sr-only">
          <p className="t-label text-ink/70">Hi, I’m {siteConfig.alias} · Batangas, PH</p>
          <h1 id="hero-title" className="mt-3 font-display text-[clamp(2.6rem,11vw,4rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink">
            Software for curious people<span className="text-accent">.</span>
          </h1>
        </div>

        <div className="room-stage relative mt-2 md:mx-auto md:mt-0">
          <ModelStage
            model="room"
            poster={asset("/art/room.webp")}
            alt="Lanz’s room at night: a desk with a monitor showing PARADA’s parking count, an open notebook with “tala” written in it, a framed portrait, a door left ajar with warm light behind it, and a VHS deck on a cabinet under the words “Software for curious people.” painted on the wall."
            priority
            sizes="(min-width: 768px) 80vw, 100vw"
            live={wide}
            draggable={wide}
            className="absolute inset-0"
          />
          <Vignette />
          <RoomPins interactive={wide} />
        </div>
        <PhoneIndex />

        <div className="hero-fade relative z-[2] mt-6 grid gap-4 border-t border-ink/10 pb-8 pt-5 md:mt-auto md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8" style={{ animationDelay: "700ms" }}>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">A 3rd-year IT student building web, mobile and desktop apps.</p>
          <p className="t-label flex flex-wrap items-center gap-x-5 gap-y-2 text-ink/60 md:justify-center">
            <span>{hint}</span>
            <a href="#work" className="text-ink underline-offset-4 transition-colors hover:text-accent hover:underline">
              Skip the room ↓
            </a>
          </p>
          <p className="t-label inline-flex items-center gap-2 text-ink/70 md:justify-self-end">
            <span className="live-dot" aria-hidden="true" />
            {siteConfig.availability}
          </p>
        </div>
      </div>

      <RoomCard facts={facts} reel={reel} />
      <VhsOverlay reel={reel} />
    </section>
  );
}
