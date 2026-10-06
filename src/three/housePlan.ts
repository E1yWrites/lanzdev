// The house from above: its plan in model units, its walls and doorways, the rooms on the
// home page's index and the camera — plain data, no three.js, so the page can lay the
// plates and the rooms' hit areas over the poster before the 3D bundle loads.

import { FRONT_DOOR_SPAN, HOUSE, PLAN, type HouseRoom } from "../data/house";
import { orbit, type Pose } from "./roomObjects";

type Vec3 = [number, number, number];

/** Metres per plan unit; the plan is centred on the origin. */
const M = 0.15;
export const px = (x: number) => (x - PLAN.w / 2) * M;
export const pz = (y: number) => (y - PLAN.d / 2) * M;

export const HOUSE_SIZE = { w: PLAN.w * M, d: PLAN.d * M };
/** The two outside walls at the back stand full height; every other wall is cut low, like a model with its roof off. */
export const WALL = { full: 2.5, cut: 0.8, t: 0.14 };

/** A room's floor in model units. */
export function floorOf(room: HouseRoom) {
  const [x, y, w, d] = HOUSE[room].at;
  return { x0: px(x), x1: px(x + w), z0: pz(y), z1: pz(y + d), cx: px(x + w / 2), cz: pz(y + d / 2), w: w * M, d: d * M };
}

/** A wall: along x at plan depth `y` from `a` to `b` (or along z at plan `x`), with doorway gaps in plan units. */
export interface WallRun {
  axis: "x" | "z";
  at: number;
  from: number;
  to: number;
  h: number;
  gaps?: [number, number][];
}

export const WALLS: WallRun[] = [
  { axis: "x", at: 0, from: 0, to: PLAN.w, h: WALL.full },
  { axis: "z", at: 0, from: 0, to: PLAN.d, h: WALL.full },
  { axis: "x", at: PLAN.d, from: 0, to: PLAN.w, h: WALL.cut, gaps: [FRONT_DOOR_SPAN] },
  { axis: "z", at: PLAN.w, from: 0, to: PLAN.d, h: WALL.cut },
  // the hall's two sides: a doorway into every room
  { axis: "x", at: 24, from: 0, to: PLAN.w, h: WALL.cut, gaps: [[23, 31], [44, 50], [70, 76]] },
  { axis: "x", at: 36, from: 0, to: PLAN.w, h: WALL.cut, gaps: [[25, 31], [42, 56], [66, 72]] },
  { axis: "z", at: 34, from: 0, to: 24, h: WALL.cut },
  { axis: "z", at: 60, from: 0, to: 24, h: WALL.cut },
  { axis: "z", at: 36, from: 36, to: PLAN.d, h: WALL.cut },
  { axis: "z", at: 62, from: 36, to: PLAN.d, h: WALL.cut },
];

export const FRONT_DOOR_X: [number, number] = [px(FRONT_DOOR_SPAN[0]), px(FRONT_DOOR_SPAN[1])];

export interface IndexRoom {
  room: HouseRoom;
  index: string;
  label: string;
  /** A page, or "films" for the VHS player. */
  href: string;
  /** Where its enamel plate hangs: on the room's own wall, or over its door. */
  plate: Vec3;
}

/** The five rooms on the index, in tab order, numbered as the room's pins are. Lanz's room is the one you came from. */
export const INDEX_ROOMS: IndexRoom[] = [
  { room: "garage", index: "01", label: "PARADA", href: "/projects/parada", plate: [floorOf("garage").cx, WALL.full - 0.2, floorOf("garage").z0] },
  { room: "study", index: "02", label: "Tala", href: "/projects/tala", plate: [floorOf("study").cx, WALL.full - 0.2, floorOf("study").z0] },
  { room: "about", index: "03", label: "About", href: "/about", plate: [floorOf("about").x0, WALL.full - 0.15, floorOf("about").cz + 0.3] },
  { room: "front", index: "04", label: "Say hi", href: "/contact", plate: [(FRONT_DOOR_X[0] + FRONT_DOOR_X[1]) / 2, 2.45, pz(PLAN.d)] },
  { room: "screening", index: "05", label: "Showreel", href: "films", plate: [floorOf("screening").cx, WALL.full - 0.2, floorOf("screening").z0] },
];

/** Stage width : height. */
export const HOUSE_ASPECT = 16 / 9;

/** The room's own angle and long lens, raised so you look down into every room. */
export const HOUSE_VIEW: Pose = orbit([-0.9, 0.2, 0.9], 50, 40, 41, 22, -0.22);

/** The floor's four corners, for a room's hit area over the stage. */
export function floorCorners(room: HouseRoom): Vec3[] {
  const f = floorOf(room);
  return [
    [f.x0, 0, f.z0],
    [f.x1, 0, f.z0],
    [f.x1, 0, f.z1],
    [f.x0, 0, f.z1],
  ];
}
