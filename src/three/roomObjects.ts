// The hero room's five objects — plain data and a little camera math, no three.js, so the
// page can place the pins over the poster before the 3D bundle has loaded.

type Vec3 = [number, number, number];

export interface Pose {
  position: Vec3;
  target: Vec3;
  fov: number;
}

export type RoomId = "parada" | "tala" | "about" | "contact" | "reel";
export type TapeId = "parada" | "tala";

/** How long a tape takes to slide into the deck; the film opens after it. */
export const TAPE_INSERT_MS = 550;

export interface RoomObject {
  id: RoomId;
  index: string;
  /** Pin label and accessible name. */
  label: string;
  /** What the pin's object is, for its accessible name ("01 PARADA, the monitor"). */
  thing: string;
  /** Where the pin floats, in room coordinates. */
  anchor: Vec3;
  /** Where the camera goes when the object is picked. */
  pose: Pose;
  /** Which side of the screen the card takes; the pose leaves the other side to the object. */
  side: "left" | "right";
  card: { kicker: string; title: string; body: string; cta?: { label: string; href: string } };
}

const ASPECT = 4 / 3;
const rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * A camera `dist` away from `center`, `yaw` degrees round from the front (+z toward +x) and
 * `pitch` degrees up. `shift` slides the view sideways (in screen halves) so the object sits
 * off-centre: positive puts it left of centre, leaving the right side to the card.
 */
export function orbit(center: Vec3, yaw: number, pitch: number, dist: number, fov: number, shift = 0): Pose {
  const y = rad(yaw);
  const p = rad(pitch);
  const half = dist * Math.tan(rad(fov) / 2) * ASPECT;
  const right: Vec3 = [Math.cos(y), 0, -Math.sin(y)];
  const target: Vec3 = [center[0] + right[0] * half * shift, center[1], center[2] + right[2] * half * shift];
  return {
    target,
    position: [target[0] + dist * Math.sin(y) * Math.cos(p), target[1] + dist * Math.sin(p), target[2] + dist * Math.cos(y) * Math.cos(p)],
    fov,
  };
}

/**
 * Where everything stands (room units; floor top at y = 0, back corner at x = z = −S).
 * The headline wall is x = −S (the desk stands against it); the window wall is z = −S
 * (cabinet under the window, then the server rack, then the door). The model is built
 * from these, and the pins and camera poses below aim at them, so moving an object
 * moves its pin and its close-up too.
 */
export const LAYOUT = {
  S: 2.0,
  H: 3.1,
  // headline wall, from the front (+z) toward the corner
  headline: { z: 0.5, y: 2.3, w: 2.7, h: 1.1 },
  shelves: { z: -1.38, w: 0.78 },
  desk: { z0: 1.35, z1: -0.88, depth: 0.72, top: 0.78 },
  monitor: { z: 0.3, y: 1.17, w: 0.86, h: 0.52 },
  notebook: { x: -1.6, z: -0.42, scale: 0.14, yaw: Math.PI / 2 + 0.1 },
  // window wall, from the corner (−x) toward the front
  portrait: { x: -1.52, y: 1.88, w: 0.56, h: 0.74 },
  window: { x0: -1.06, x1: -0.06, y0: 1.42, y1: 2.5 },
  cabinet: { x: -0.56, l: 2.0, depth: 0.5, top: 0.6 },
  deck: { x: -0.12, w: 0.74, d: 0.4, h: 0.13 },
  rack: { x: 0.83, w: 0.46, d: 0.48, h: 1.95 },
  door: { x0: 1.2, x1: 1.9, h: 2.05, open: 0.55 },
};

const { S, desk, monitor, notebook, portrait, cabinet, deck, door } = LAYOUT;
const MONITOR_X = -S + 0.2;
const DOOR_MID = (door.x0 + door.x1) / 2;

/** The resting camera: the room from the front right, long lens, so it reads as isometric. */
export const ROOM_VIEW: Pose = orbit([0.06, 1.26, 0.1], 50, 21, 15.4, 22);

export const ROOM_OBJECTS: RoomObject[] = [
  {
    id: "parada",
    index: "01",
    label: "PARADA",
    thing: "the monitor",
    anchor: [MONITOR_X + 0.02, monitor.y + monitor.h / 2 + 0.2, monitor.z],
    pose: orbit([MONITOR_X, monitor.y - 0.04, monitor.z], 78, 8, 3.2, 26, 0.36),
    side: "right",
    card: {
      kicker: "01 · Smart parking",
      title: "PARADA",
      body: "Know which zone has space before you drive in. Cameras at the gate, one number everyone trusts.",
      cta: { label: "Open PARADA", href: "/projects/parada" },
    },
  },
  {
    id: "tala",
    index: "02",
    label: "Tala",
    thing: "the notebook",
    anchor: [notebook.x + 0.05, desk.top + 0.2, notebook.z],
    pose: orbit([notebook.x, desk.top + 0.02, notebook.z], 70, 48, 2.4, 26, 0.36),
    side: "right",
    card: {
      kicker: "02 · Notes + handwriting",
      title: "Tala",
      body: "A local-first notebook for Windows and the web. Type, write by hand, import PDFs. No account.",
      cta: { label: "Open Tala", href: "/projects/tala" },
    },
  },
  {
    id: "about",
    index: "03",
    label: "About",
    thing: "the portrait",
    anchor: [portrait.x, portrait.y + portrait.h / 2 + 0.13, -S + 0.08],
    pose: orbit([portrait.x, portrait.y, -S + 0.04], 12, 4, 2.8, 26, 0.36),
    side: "right",
    card: {
      kicker: "03 · BSIT, LPU-Batangas",
      title: "About",
      body: "Who I am, what I study, the student orgs I help run and what I’m learning next.",
      cta: { label: "About me", href: "/about" },
    },
  },
  {
    id: "contact",
    index: "04",
    label: "Say hi",
    thing: "the door",
    anchor: [DOOR_MID - 0.05, door.h + 0.22, -S + 0.25],
    pose: orbit([DOOR_MID, door.h / 2 + 0.05, -S + 0.2], 22, 10, 4.0, 26, -0.36),
    side: "left",
    card: {
      kicker: "04 · Open to an internship",
      title: "Say hi",
      body: "Write to me about an internship, a project or anything you’re building.",
      cta: { label: "Say hi", href: "/contact" },
    },
  },
  {
    id: "reel",
    index: "05",
    label: "Showreel",
    thing: "the VHS deck",
    anchor: [deck.x, cabinet.top + deck.h + 0.24, -S + 0.25],
    pose: orbit([deck.x - 0.4, cabinet.top + 0.1, -S + 0.3], 16, 20, 3.0, 26, 0.36),
    side: "right",
    card: {
      kicker: "05 · Showreel",
      title: "Fifteen seconds each.",
      body: "Pick a tape: PARADA’s motion reel, or Tala writing its own name.",
    },
  },
];

export const roomObject = (id: string | null) => ROOM_OBJECTS.find((o) => o.id === id) ?? null;

/** Where a point lands on a stage of `aspect` (width / height) seen from `view`, as fractions (0–1) of its width and height. */
export function projectToStage(view: Pose, point: Vec3, aspect = ASPECT): [number, number] {
  const [px, py, pz] = view.position;
  let fx = view.target[0] - px;
  let fy = view.target[1] - py;
  let fz = view.target[2] - pz;
  const fl = Math.hypot(fx, fy, fz);
  fx /= fl;
  fy /= fl;
  fz /= fl;
  // right = forward × up, up' = right × forward
  let rx = -fz;
  let rz = fx;
  const rl = Math.hypot(rx, rz);
  rx /= rl;
  rz /= rl;
  const ux = -rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy;
  const dx = point[0] - px;
  const dy = point[1] - py;
  const dz = point[2] - pz;
  const depth = dx * fx + dy * fy + dz * fz;
  const t = Math.tan(rad(view.fov) / 2);
  const ndcX = (dx * rx + dz * rz) / (depth * t * aspect);
  const ndcY = (dx * ux + dy * uy + dz * uz) / (depth * t);
  return [(ndcX + 1) / 2, (1 - ndcY) / 2];
}
