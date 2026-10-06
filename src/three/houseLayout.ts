// What stands where in the house, as plain data (no three.js): HouseModel renders it and
// scripts/check-house.mts checks it, so a room can't ship with furniture through a wall,
// through other furniture or across a doorway. Pieces are placed by their footprint's centre,
// in metres; `ry` turns a piece about the vertical axis (pieces face +z; π/2 faces +x,
// -π/2 faces -x, π faces -z). Size a piece by `h` (height) or `w` (width): the kit's own
// scales differ per piece. Run `npx tsx scripts/check-house.mts` after moving anything.

import type { HouseRoom } from "../data/house";
import type { FurnitureName } from "./furniture";
import { floorOf } from "./housePlan";

type Vec2 = [x: number, z: number];

export type RugName = "plum" | "navy" | "warm" | "slate";

/** A piece of the Kenney kit. Rugs (names starting "rug") lie flat and may sit under others. */
export interface Item {
  name: FurnitureName;
  at: Vec2;
  /** Off the floor: a lamp on a table. */
  y?: number;
  ry?: number;
  h?: number;
  w?: number;
  rug?: RugName;
}

/** One of the hand-built plants (house.tsx `Plant`). */
export interface PlantItem {
  at: Vec2;
  y?: number;
  size: number;
  seed: number;
  leaves?: number;
  trailing?: boolean;
}

/** Something hand-built in HouseModel that the check still has to know about. */
export interface Fixed {
  id: string;
  at: Vec2;
  /** Footprint before `ry`: across x, across z. */
  size: Vec2;
  /** Off the floor, and how tall it stands from there. */
  y?: number;
  h: number;
  ry?: number;
}

export interface Furnishing {
  items: Item[];
  plants: PlantItem[];
  fixed: Fixed[];
}

/** A plant's leaves reach about this far, per unit of `size`. */
export const PLANT_REACH = 0.18;
/** The cars are drawn at this scale (ParadaLot's `Car` is 0.92 × 0.46 m at 1). */
export const CAR_SCALE = 3;

const P = Math.PI;
const g = floorOf("garage");
const s = floorOf("study");
const sc = floorOf("screening");
const a = floorOf("about");
const f = floorOf("front");
const r = floorOf("room");
const h = floorOf("hall");

/** The garage's one car, nose to the roller door. */
export const CAR_AT: Vec2 = [g.x0 + 1.5, g.cz - 0.1];
/** Study desk: the notebook and the brass lamp are built on it, so it stays put. */
export const STUDY_DESK_AT: Vec2 = [s.cx, s.z0 + 0.5];
/** Screening room: the cabinet and the television set on it share this x. */
export const TV_AT: Vec2 = [sc.x1 - 1.2, sc.z0 + 0.4];
/** Lanz's room: the desk's centre, with the monitor built on it. */
export const DESK_AT: Vec2 = [r.x1 - 0.5, r.cz - 0.6];

export const FURNISHING: Record<HouseRoom, Furnishing> = {
  garage: {
    fixed: [{ id: "garage.car", at: CAR_AT, size: [0.92 * CAR_SCALE, 0.46 * CAR_SCALE], h: 0.95, ry: P / 2 }],
    items: [
      // a workbench along the back wall, a radio on it
      { name: "sideTableDrawers", at: [g.x1 - 0.7, g.z0 + 0.35], h: 0.85 },
      { name: "sideTableDrawers", at: [g.x1 - 1.9, g.z0 + 0.35], h: 0.85 },
      { name: "radio", at: [g.x1 - 0.7, g.z0 + 0.35], y: 0.85, h: 0.25 },
      // shelving down the left wall
      { name: "bookcaseOpen", at: [g.x0 + 0.35, g.z0 + 0.55], ry: P / 2, h: 1.7 },
      { name: "bookcaseOpen", at: [g.x0 + 0.35, g.z0 + 1.4], ry: P / 2, h: 1.7 },
      // boxes in the front corner, a bin at the right
      { name: "cardboardBoxClosed", at: [g.x0 + 0.35, g.z1 - 0.45], ry: 0.3, h: 0.45 },
      { name: "cardboardBoxClosed", at: [g.x0 + 0.35, g.z1 - 0.45], y: 0.45, ry: -0.4, h: 0.35 },
      { name: "cardboardBoxOpen", at: [g.x0 + 0.5, g.z1 - 0.95], ry: -0.2, h: 0.4 },
      { name: "trashcan", at: [g.x1 - 0.25, g.cz + 0.1], h: 0.6 },
    ],
    plants: [],
  },
  study: {
    fixed: [{ id: "study.desk", at: STUDY_DESK_AT, size: [1.8, 0.72], h: 0.8 }],
    items: [
      { name: "rugRectangle", at: [s.cx, s.cz + 0.2], y: 0.02, w: 2.4, rug: "plum" },
      { name: "chairDesk", at: [s.cx - 0.1, s.z0 + 1.35], ry: P + 0.25, h: 0.95 },
      { name: "bookcaseOpen", at: [s.x0 + 0.5, s.z0 + 0.36], h: 1.9 },
      { name: "bookcaseOpen", at: [s.x0 + 0.36, s.z0 + 1.45], ry: P / 2, h: 1.9 },
      { name: "sideTable", at: [s.x1 - 0.25, s.cz + 0.6], ry: -P / 2, h: 0.55 },
      { name: "lampRoundTable", at: [s.x1 - 0.25, s.cz + 0.6], y: 0.55, h: 0.4 },
    ],
    plants: [{ at: [s.x1 - 0.4, s.z0 + 0.45], size: 1.3, seed: 4, leaves: 16 }],
  },
  screening: {
    fixed: [{ id: "screening.tv", at: TV_AT, size: [0.9, 0.62], y: 0.59, h: 0.7 }],
    items: [
      { name: "rugRectangle", at: [sc.x1 - 1.5, sc.cz - 0.1], y: 0.02, w: 2.8, rug: "navy" },
      { name: "cabinetTelevision", at: TV_AT, h: 0.57 },
      { name: "speaker", at: [TV_AT[0] - 0.95, TV_AT[1]], h: 0.95 },
      { name: "speaker", at: [TV_AT[0] + 0.95, TV_AT[1]], h: 0.95 },
      { name: "loungeSofa", at: [TV_AT[0], sc.z1 - 1.3], ry: P, w: 1.8 },
      { name: "tableCoffee", at: [TV_AT[0], sc.z0 + 1.25], w: 1.0, h: 0.35 },
      { name: "loungeChair", at: [sc.x0 + 0.9, sc.cz + 0.1], ry: P / 2 + 0.3, h: 0.8 },
      { name: "lampRoundFloor", at: [sc.x0 + 0.5, sc.z1 - 0.5], h: 1.5 },
      { name: "bookcaseOpen", at: [sc.x0 + 1.4, sc.z0 + 0.3], h: 1.5 },
    ],
    plants: [{ at: [sc.x0 + 0.4, sc.z0 + 0.4], size: 1.4, seed: 9, leaves: 18 }],
  },
  about: {
    fixed: [],
    items: [
      { name: "rugRound", at: [a.cx + 0.5, a.cz], y: 0.02, w: 2.6, rug: "slate" },
      { name: "table", at: [a.cx + 0.5, a.cz], h: 0.66 },
      { name: "chair", at: [a.cx + 0.05, a.cz - 0.7], h: 0.85 },
      { name: "chair", at: [a.cx + 0.95, a.cz - 0.7], h: 0.85 },
      { name: "chair", at: [a.cx + 0.05, a.cz + 0.7], ry: P, h: 0.85 },
      { name: "chair", at: [a.cx + 0.95, a.cz + 0.7], ry: P, h: 0.85 },
      { name: "sideTableDrawers", at: [a.cx - 0.6, a.z1 - 0.33], ry: P, h: 0.8 },
      { name: "sideTableDrawers", at: [a.cx + 0.6, a.z1 - 0.33], ry: P, h: 0.8 },
      { name: "lampRoundFloor", at: [a.x0 + 0.5, a.z1 - 0.45], h: 1.5 },
      { name: "bookcaseOpen", at: [a.x1 - 0.35, a.cz + 0.6], ry: -P / 2, h: 1.6 },
    ],
    plants: [
      { at: [a.x1 - 0.4, a.z1 - 0.45], size: 1.5, seed: 3, leaves: 20 },
      { at: [a.cx - 0.6, a.z1 - 0.33], y: 0.8, size: 0.6, seed: 5, trailing: true },
    ],
  },
  front: {
    fixed: [],
    items: [
      { name: "rugDoormat", at: [(f.x0 + f.x1) / 2 - 0.1, f.z1 - 0.4], y: 0.02, w: 0.9, rug: "warm" },
      { name: "coatRackStanding", at: [f.x0 + 0.45, f.z1 - 0.5], h: 1.75 },
      { name: "sideTableDrawers", at: [f.x0 + 0.3, f.cz - 0.5], ry: P / 2, h: 0.6 },
      { name: "lampRoundTable", at: [f.x0 + 0.3, f.cz - 0.5], y: 0.6, h: 0.4 },
      { name: "lampRoundFloor", at: [f.x1 - 0.35, f.cz - 0.4], h: 1.5 },
    ],
    plants: [{ at: [f.x1 - 0.4, f.z1 - 0.45], size: 1.3, seed: 8, leaves: 14 }],
  },
  room: {
    fixed: [],
    items: [
      { name: "rugRectangle", at: [r.x0 + 2.2, r.cz + 0.4], y: 0.02, w: 2.4, rug: "warm" },
      // the bed's head against the left wall, a night table and lamp at each side
      { name: "bedDouble", at: [r.x0 + 1.1, r.cz + 0.4], ry: P / 2, w: 1.6 },
      { name: "sideTableDrawers", at: [r.x0 + 0.3, r.cz - 0.75], ry: P / 2, h: 0.5 },
      { name: "lampRoundTable", at: [r.x0 + 0.3, r.cz - 0.75], y: 0.5, h: 0.4 },
      { name: "sideTableDrawers", at: [r.x0 + 0.3, r.cz + 1.55], ry: P / 2, h: 0.5 },
      { name: "lampRoundTable", at: [r.x0 + 0.3, r.cz + 1.55], y: 0.5, h: 0.4 },
      // the desk against the right wall
      { name: "desk", at: DESK_AT, ry: -P / 2, h: 0.76 },
      { name: "computerKeyboard", at: [DESK_AT[0] + 0.1, DESK_AT[1] + 0.1], y: 0.76, ry: -P / 2, w: 0.4 },
      { name: "chairDesk", at: [r.x1 - 1.4, DESK_AT[1] + 0.1], ry: P / 2 - 0.3, h: 0.95 },
    ],
    plants: [{ at: [r.x1 - 0.4, r.z1 - 0.4], size: 1.5, seed: 6, leaves: 18 }],
  },
  hall: {
    fixed: [],
    items: [
      { name: "rugRectangle", at: [h.cx, h.cz], y: 0.02, w: 2.6, rug: "plum" },
      { name: "sideTableDrawers", at: [h.x0 + 0.35, h.cz], ry: P / 2, h: 0.8 },
    ],
    plants: [{ at: [h.x0 + 0.35, h.cz], y: 0.8, size: 0.7, seed: 12 }],
  },
};

export const fixed = (id: string) => Object.values(FURNISHING).flatMap((r) => r.fixed).find((x) => x.id === id)!;
