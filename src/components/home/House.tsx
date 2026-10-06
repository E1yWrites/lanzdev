"use client";

import Link from "next/link";
import { useRef } from "react";
import { Invitation } from "@/components/layout/FooterInvitation";
import { enterDoor } from "@/components/motion/DoorTransition";
import { ModelStage } from "@/components/three/ModelStage";
import { houseHover, roomTape, useStore } from "@/components/three/store";
import { siteConfig } from "@/data/config";
import { HOUSE, type HouseRoom } from "@/data/house";
import { useMedia } from "@/hooks/useMedia";
import { asset } from "@/lib/constants";
import { HOUSE_ASPECT, HOUSE_VIEW, INDEX_ROOMS, floorCorners } from "@/three/housePlan";
import { projectToStage, type TapeId } from "@/three/roomObjects";

// Under the room, the whole house from above with its roof off: five lit rooms off a short
// hall, a plate over each (number · name · status). Be at a room (hover, focus) and
// its lamp turns up and a paper note says what's in it; go in and you walk through to its
// page in its light. The screening room plays the films. Beside the open front door, the
// invitation. Plates and hit areas are placed with the render's own camera, so they land
// on the poster before WebGL and on the live model after. On phones the house is a
// picture: the room's own index above already lists the same five rooms.

/** A room's status on its plate, then the lines on its note. */
export type HouseNotes = Partial<Record<HouseRoom, string[]>>;

const CTA: Record<string, string> = {
  garage: "Open PARADA",
  study: "Open Tala",
  screening: "Play the films",
  about: "About me",
  front: "Say hi",
};

const at = (p: [number, number, number]) => projectToStage(HOUSE_VIEW, p, HOUSE_ASPECT);

const ROOMS = INDEX_ROOMS.map((r) => {
  const floor = floorCorners(r.room).map(at);
  const xs = floor.map(([x]) => x);
  const ys = floor.map(([, y]) => y);
  return {
    ...r,
    light: HOUSE[r.room].light,
    plate: at(r.plate),
    clip: `polygon(${floor.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(", ")})`,
    box: { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) },
  };
});

function RoomLink({ room, notes, stage, tape }: { room: (typeof ROOMS)[number]; notes?: string[]; stage: React.RefObject<HTMLDivElement>; tape?: TapeId }) {
  const on = useStore(houseHover) === room.room;
  const [status, ...lines] = notes ?? [];
  const hover = {
    onPointerEnter: () => houseHover.set(room.room),
    onPointerLeave: () => houseHover.get() === room.room && houseHover.set(null),
    onFocus: () => houseHover.set(room.room),
    onBlur: () => houseHover.get() === room.room && houseHover.set(null),
  };
  const inner = (
    <>
      <span aria-hidden="true" className="house-hit" style={{ clipPath: room.clip }} />
      <span className="house-plate" style={{ left: `${room.plate[0] * 100}%`, top: `${room.plate[1] * 100}%` }}>
        <span className="house-plate-index">{room.index}</span>
        {room.label}
        {status && <span className="house-plate-status">{status}</span>}
      </span>
      <span className="house-note" style={{ left: `${room.plate[0] * 100}%`, top: `${room.plate[1] * 100}%` }}>
        {lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
        <span className="house-note-cta">{CTA[room.room]} →</span>
      </span>
    </>
  );
  const name = `${room.index} ${room.label}${notes?.length ? `: ${notes.join(", ")}` : ""}. ${CTA[room.room]}`;
  const common = { "aria-label": name, className: "house-room", "data-on": on || undefined, style: { "--light": room.light } as React.CSSProperties, ...hover };

  if (room.href === "films")
    return (
      <button type="button" aria-haspopup="dialog" disabled={!tape} onClick={() => tape && roomTape.set(tape)} {...common}>
        {inner}
      </button>
    );

  const go = (e: React.MouseEvent) => {
    const box = stage.current?.getBoundingClientRect();
    if (!box || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const { x0, y0, x1, y1 } = room.box;
    const rect = { x: box.left + x0 * box.width, y: box.top + y0 * box.height, w: (x1 - x0) * box.width, h: (y1 - y0) * box.height };
    if (enterDoor({ href: room.href, rect, light: room.light })) e.preventDefault();
  };
  return (
    <Link href={room.href} onClick={go} data-door {...common}>
      {inner}
    </Link>
  );
}

export function House({ notes, tape }: { notes: HouseNotes; tape?: TapeId }) {
  const stage = useRef<HTMLDivElement>(null);
  const wide = useMedia("(min-width: 768px)");

  return (
    <section id="house" data-scene aria-labelledby="house-title" className="scene house-scene relative overflow-hidden">
      <h2 id="house-title" className="sr-only">
        The rooms
      </h2>
      <div ref={stage} className="house-stage" style={{ aspectRatio: HOUSE_ASPECT }}>
        <ModelStage
          model="house"
          poster={asset("/art/house.webp")}
          alt="The house from above with its roof off, at night: PARADA’s garage with two cars under a sodium lamp, Tala’s study with the notebook and a brass lamp, a screening room lit by its television, the about room with the portrait, and the front entrance with its door open."
          sizes="(min-width: 768px) 100vw, 160vw"
          live={wide}
          feather={false}
          className="absolute inset-0"
        />
        <nav aria-label="Rooms" className="absolute inset-0 hidden md:block">
          <ul>
            {ROOMS.map((r) => (
              <li key={r.room}>
                <RoomLink room={r} notes={notes[r.room]} stage={stage} tape={tape} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="house-invite px-5 pb-16 pt-12 md:p-0">
        <Invitation email={siteConfig.email} github={siteConfig.github.url} availability={siteConfig.availability} stacked headingId="say-hi-title" />
      </div>
    </section>
  );
}
