// Is anything in the house clipping? Reads src/three/houseLayout.ts, measures every piece
// from its .glb, and fails on furniture through a wall, through other furniture, or across
// a doorway. `npx tsx scripts/check-house.mts` (exit 1 on any finding).

import { readFileSync } from "node:fs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HOUSE, type HouseRoom } from "../src/data/house";
import { FRONT_DOOR_X, WALL, WALLS, floorOf, px, pz } from "../src/three/housePlan";
import { FURNISHING, PLANT_REACH } from "../src/three/houseLayout";

const TOL = 0.01; // metres of overlap that still counts as touching
const DOOR_MARGIN = 0.1; // clear space beside a doorway's frame
const DOOR_DEPTH = 0.6; // clear space each side of a doorway

type Pt = [number, number];
interface Body {
  id: string;
  room: HouseRoom;
  corners: Pt[];
  y0: number;
  y1: number;
  rug: boolean;
}

// raw size of each piece, with the kit's node transforms applied (what Piece measures at runtime)
const raw = new Map<string, THREE.Vector3>();
async function measure(name: string) {
  if (raw.has(name)) return raw.get(name)!;
  const b = readFileSync(new URL(`../public/models/furniture/${name}.glb`, import.meta.url));
  const gltf: { scene: THREE.Object3D } = await new Promise((ok, no) => new GLTFLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), "", ok, no));
  const size = new THREE.Box3().setFromObject(gltf.scene).getSize(new THREE.Vector3());
  raw.set(name, size);
  return size;
}

/** A w × d rectangle centred on `at`, turned by `ry` as three.js turns about y. */
function rect(at: Pt, w: number, d: number, ry = 0): Pt[] {
  const c = Math.cos(ry);
  const s = Math.sin(ry);
  return ([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]] as Pt[]).map(([x, z]) => [at[0] + x * c + z * s, at[1] - x * s + z * c]);
}

const bodies: Body[] = [];
for (const [room, fur] of Object.entries(FURNISHING) as [HouseRoom, (typeof FURNISHING)[HouseRoom]][]) {
  for (const [i, it] of fur.items.entries()) {
    const size = await measure(it.name);
    const k = it.h ? it.h / size.y : it.w ? it.w / size.x : 1;
    bodies.push({ id: `${room}.${it.name}#${i}`, room, corners: rect(it.at, size.x * k, size.z * k, it.ry), y0: it.y ?? 0, y1: (it.y ?? 0) + size.y * k, rug: it.name.startsWith("rug") });
  }
  for (const [i, p] of fur.plants.entries()) {
    const r = PLANT_REACH * p.size;
    bodies.push({ id: `${room}.plant#${i}`, room, corners: rect(p.at, 2 * r, 2 * r), y0: p.y ?? 0, y1: (p.y ?? 0) + 0.4 * p.size, rug: false });
  }
  for (const f of fur.fixed) bodies.push({ id: f.id, room, corners: rect(f.at, f.size[0], f.size[1], f.ry), y0: f.y ?? 0, y1: (f.y ?? 0) + f.h, rug: false });
}

// the front door's leaf, hinged at the frame and swung 103° into the entrance (HouseModel `Front`)
const L = FRONT_DOOR_X[1] - FRONT_DOOR_X[0] - 0.04;
const hinge: Pt = [FRONT_DOOR_X[1] - 0.02, pz(64) - WALL.t / 2 - 0.03];
const leaf: Pt = [hinge[0] + 0.5 * L * 0.227, hinge[1] - 0.5 * L * 0.974];
bodies.push({ id: "front.door-leaf", room: "front", corners: rect(leaf, L, 0.05, -1.8), y0: 0, y1: 2.1, rug: false });

/** Smallest overlap along any separating axis of two rectangles: > 0 means they intersect by that much. */
function penetration(A: Pt[], B: Pt[]) {
  let least = Infinity;
  for (const poly of [A, B]) {
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = poly[i];
      const [x2, z2] = poly[(i + 1) % 4];
      const n: Pt = [z1 - z2, x2 - x1];
      const len = Math.hypot(...n);
      const proj = (P: Pt[]) => P.map(([x, z]) => (x * n[0] + z * n[1]) / len);
      const [a, b] = [proj(A), proj(B)];
      least = Math.min(least, Math.min(Math.max(...a), Math.max(...b)) - Math.max(Math.min(...a), Math.min(...b)));
    }
  }
  return least;
}

const problems: string[] = [];
const at = (p: Pt) => `(${p[0].toFixed(2)}, ${p[1].toFixed(2)})`;

// 1. everything stays inside its room, short of the walls' thickness
for (const b of bodies) {
  const f = floorOf(b.room);
  const inset = WALL.t / 2 - 0.005;
  for (const c of b.corners) {
    const out = Math.max(f.x0 + inset - c[0], c[0] - (f.x1 - inset), f.z0 + inset - c[1], c[1] - (f.z1 - inset));
    if (out > 0.005) {
      problems.push(`WALL   ${b.id} pokes ${(out * 100).toFixed(0)} cm through the ${HOUSE[b.room].name}'s wall at ${at(c)}`);
      break;
    }
  }
}

// 2. nothing stands inside anything else (rugs lie under things; a piece resting on another differs in height)
for (let i = 0; i < bodies.length; i++) {
  for (let j = i + 1; j < bodies.length; j++) {
    const [A, B] = [bodies[i], bodies[j]];
    if (A.rug || B.rug || A.room !== B.room) continue;
    if (A.y0 >= B.y1 - 0.005 || B.y0 >= A.y1 - 0.005) continue;
    const depth = penetration(A.corners, B.corners);
    if (depth > TOL) problems.push(`CLIP   ${A.id} and ${B.id} overlap by ${(depth * 100).toFixed(0)} cm`);
  }
}

// 3. every doorway stays walkable
const doors: { name: string; box: Pt[] }[] = [];
for (const w of WALLS) {
  if (w.axis !== "x") continue;
  for (const [a, b] of w.gaps ?? []) {
    const z = pz(w.at);
    const lo = px(a) - DOOR_MARGIN;
    const hi = px(b) + DOOR_MARGIN;
    const inside = w.at === 64 ? [z - DOOR_DEPTH, z] : [z - DOOR_DEPTH, z + DOOR_DEPTH];
    doors.push({ name: `doorway x ${px(a).toFixed(2)}…${px(b).toFixed(2)} at z ${z.toFixed(2)}`, box: rect([(lo + hi) / 2, (inside[0] + inside[1]) / 2], hi - lo, inside[1] - inside[0]) });
  }
}
for (const d of doors) {
  for (const b of bodies) {
    if (b.rug || b.y0 > 2.1) continue;
    const depth = penetration(d.box, b.corners);
    if (depth > TOL && b.id !== "front.door-leaf") problems.push(`DOOR   ${b.id} blocks the ${d.name} by ${(depth * 100).toFixed(0)} cm`);
  }
}

console.log(`${bodies.length} bodies, ${doors.length} doorways checked`);
if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log("clean: nothing clips, nothing blocks a door");
