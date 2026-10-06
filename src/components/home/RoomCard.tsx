"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { closeRoom, roomEnter, roomFocus, roomLive, roomTape, useStore } from "@/components/three/store";
import { roomObject, type RoomId, type TapeId } from "@/three/roomObjects";
import type { ReelItem } from "./VhsOverlay";

/** Label/value rows under each card's line, from the projects' data and the résumé. */
export type RoomFacts = Partial<Record<RoomId, [string, string][]>>;

/**
 * The card for the picked object: a line, a few facts and one way in. A native modal
 * dialog, so focus stays inside it and Esc closes it; clicking outside, Back, or
 * scrolling on also close it. Beside the object on wide screens, a bottom sheet on phones.
 */
export function RoomCard({ facts, reel }: { facts: RoomFacts; reel: ReelItem[] }) {
  const focus = useStore(roomFocus);
  const live = useStore(roomLive);
  const tape = useStore(roomTape);
  const obj = roomObject(focus);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d || !obj) return;
    if (!d.open) d.showModal();
    const id = obj.id;
    const from = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - from) > 48 && closeRoom();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (d.open) d.close();
      // back to the pin it came from, so a keyboard user carries on where they were
      if (document.activeElement === document.body || d.contains(document.activeElement)) document.getElementById(`pin-${id}`)?.focus({ preventScroll: true });
    };
  }, [obj]);

  const rows = obj ? facts[obj.id] : undefined;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="room-card-title"
      data-side={obj?.side}
      className="room-card"
      onCancel={(e) => {
        e.preventDefault();
        closeRoom();
      }}
      onClick={(e) => e.target === e.currentTarget && closeRoom()}
    >
      {obj && (
        <div className="room-card-body">
          <div className="flex items-start justify-between gap-4">
            <p className="t-label text-accent">{obj.card.kicker}</p>
            <button type="button" onClick={closeRoom} className="t-label -mr-2 -mt-2 rounded-md px-2 py-2 text-ink/70 transition-colors hover:text-accent">
              Close
            </button>
          </div>
          <h2 id="room-card-title" className="mt-3 font-display text-[2.4rem] font-light leading-none tracking-[-0.02em] text-ink">
            {obj.card.title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{obj.card.body}</p>

          {rows && rows.length > 0 && (
            <dl className="mt-5 border-t border-dotted border-ink/25">
              {rows.map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-dotted border-ink/25 py-2.5">
                  <dt className="t-label w-24 shrink-0 pt-px text-ink/60">{k}</dt>
                  <dd className="text-sm leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {obj.id === "reel" ? (
            <ul className="mt-5 grid gap-2">
              {reel.map((r) => (
                <li key={r.slug}>
                  <button type="button" aria-pressed={tape === r.slug} onClick={() => roomTape.set(r.slug as TapeId)} className="room-tape" data-tape={r.slug}>
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-xl font-light text-ink">{r.name}</span>
                      <span className="t-label text-ink/60">{r.film.duration} s</span>
                    </span>
                    <span className="mt-1 block text-left text-sm leading-snug text-ink/70">{r.caption}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            obj.card.cta && (
              <Link
                href={obj.card.cta.href}
                className="room-cta t-label mt-6"
                onClick={(e) => {
                  // the live room pushes in first, then navigates; new-tab clicks go straight through
                  if (!live || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  roomEnter.set(obj.card.cta!.href);
                }}
              >
                {obj.card.cta.label} <span aria-hidden="true">→</span>
              </Link>
            )
          )}
        </div>
      )}
    </dialog>
  );
}
