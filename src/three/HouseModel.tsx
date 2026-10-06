import { memo, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { HOUSE, type HouseRoom } from "../data/house";
import { Box, C, EnvLevel, Glow, Plant, Rod, floorTexture, spillTexture } from "./house";
import { FRONT_DOOR_X, HOUSE_SIZE, WALL, WALLS, floorOf, px, pz, type WallRun } from "./housePlan";
import { FurnitureContext, Piece, RUG, type Furniture } from "./furniture";
import { CAR_AT, CAR_SCALE, DESK_AT, FURNISHING, STUDY_DESK_AT, TV_AT } from "./houseLayout";
import { canvasFont, canvasTexture, useDisposable } from "./lib";
import { PARADA } from "./palette";
import { Car, useCarGeo } from "./ParadaLot";
import { StudioLights } from "./Studio";
import { TalaNotebook } from "./TalaDesk";

// The whole house from above with its roof off, one clay model in the hero room's angle,
// paint and night lighting. Each room on the index has its own lamp in its own light:
// PARADA's garage under a sodium lamp, Tala's study under a brass lamp, the screening
// room lit by its television, the about room, and the front entrance with its door open.
// `lit` brightens a room (hover, focus). The two back walls stand full height; every
// other wall is cut low so you can see in. Every room has its own deep paint, so from
// above the rooms read apart by colour before any lamp is turned up.

type Vec3 = [number, number, number];
const T = WALL.t;
const D = HOUSE_SIZE.d / 2;
/** The outside of the house, and the inside of each room. */
const PAINT_OUT = "#2a2f45";
const PAINT: Record<HouseRoom, string> = {
  garage: "#4a3826",
  study: "#4d4020",
  screening: "#18234f",
  about: "#566179",
  front: "#6b3324",
  room: "#29305a",
  hall: "#2f3550",
};

/** The room a plan point is in, or null outside the house. */
function roomAt(x: number, y: number) {
  return (Object.keys(HOUSE) as HouseRoom[]).find((id) => {
    const [rx, ry, w, d] = HOUSE[id].at;
    return x >= rx && x < rx + w && y >= ry && y < ry + d;
  }) ?? null;
}

/** A round, soft glow: a lamp's light on the floor around it. */
function roundTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.85)");
    g.addColorStop(0.4, "rgba(255,255,255,0.3)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Every solid surface casts and catches the moon's shadows; light (glows, screens) doesn't. */
function Shadowed({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    ref.current?.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const solid = o.material instanceof THREE.MeshStandardMaterial && !o.material.transparent;
      o.castShadow = solid;
      o.receiveShadow = solid;
    });
  });
  return <group ref={ref}>{children}</group>;
}

/** The moon, low from the front left: the walls throw their shadows across the floors. */
function Moon() {
  const ref = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const s = ref.current?.shadow;
    if (!s) return;
    s.mapSize.set(2048, 2048);
    s.bias = -0.0015;
    s.normalBias = 0.04;
    Object.assign(s.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
    s.camera.updateProjectionMatrix();
  }, []);
  return <directionalLight ref={ref} castShadow position={[-6, 11, 8]} color="#a9b8e6" intensity={0.9} />;
}

// ─── Walls and floors ─────────────────────────────────────────────────────────

/** Room boundaries along a wall run, where one room's paint stops and the next one's starts. */
function roomEdges(run: WallRun) {
  return Object.values(HOUSE).flatMap(({ at: [x, y, w, d] }) => (run.axis === "x" ? [x, x + w] : [y, y + d]));
}

/** A wall run cut into pieces round its doorways, the cut showing on top; each face painted in the room it faces. */
function Wall({ run }: { run: WallRun }) {
  const edges = [run.from, ...(run.gaps ?? []).flat(), run.to];
  const bounds = roomEdges(run);
  const pieces: { a: number; b: number }[] = [];
  for (let i = 0; i < edges.length; i += 2) pieces.push({ a: edges[i], b: edges[i + 1] });
  const h = run.h - 0.03;
  const pos = (along: number, y: number, off = 0): Vec3 => (run.axis === "x" ? [px(along), y, pz(run.at) + off] : [px(run.at) + off, y, pz(along)]);
  return (
    <>
      {pieces.map(({ a, b }) => {
        const mid = (a + b) / 2;
        const l = (b - a) * 0.15 + T;
        const size = (y: number): Vec3 => (run.axis === "x" ? [l, y, T] : [T, y, l]);
        const cuts = [a, ...bounds.filter((v) => v > a && v < b).sort((m, n) => m - n), b].filter((v, i, all) => v !== all[i - 1]);
        return (
          <group key={mid}>
            <Box size={size(h)} position={pos(mid, h / 2)} color={PAINT_OUT} r={0.01} roughness={0.92} />
            <Box size={size(0.04)} position={pos(mid, run.h - 0.02)} color={C.cut} r={0.01} roughness={0.85} />
            {cuts.slice(1).flatMap((e, i) => {
              const s = cuts[i];
              return [-1, 1].map((side) => {
                const room = run.axis === "x" ? roomAt((s + e) / 2, run.at + side * 0.5) : roomAt(run.at + side * 0.5, (s + e) / 2);
                if (!room) return null;
                const turn = run.axis === "x" ? (side > 0 ? 0 : Math.PI) : (side * Math.PI) / 2;
                return (
                  <mesh key={`${s}${side}`} position={pos((s + e) / 2, h / 2, side * (T / 2 + 0.003))} rotation={[0, turn, 0]}>
                    <planeGeometry args={[(e - s) * 0.15, h]} />
                    <meshStandardMaterial color={PAINT[room]} roughness={0.92} />
                  </mesh>
                );
              });
            })}
          </group>
        );
      })}
    </>
  );
}

function tileTexture() {
  return canvasTexture(512, 512, (ctx, w, h) => {
    const n = 8;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = (i + j) % 2 ? "#3a302c" : "#4a3f39";
        ctx.fillRect((i * w) / n, (j * h) / n, w / n, h / n);
      }
  });
}

function concreteTexture() {
  return canvasTexture(512, 360, (ctx, w, h) => {
    ctx.fillStyle = "#34363c";
    ctx.fillRect(0, 0, w, h);
    // the bays: two lines and a stop line at the back
    ctx.fillStyle = "rgba(241,239,233,0.55)";
    for (const x of [0.04, 0.5, 0.96]) ctx.fillRect(x * w - 3, h * 0.06, 6, h * 0.82);
    ctx.fillRect(w * 0.04, h * 0.06, w * 0.92, 5);
  });
}

const Floors = memo(function Floors() {
  const planks = useDisposable(() => {
    const t = floorTexture([]);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(HOUSE_SIZE.w / 4, HOUSE_SIZE.d / 4);
    return t;
  }, []);
  const tiles = useDisposable(tileTexture, []);
  const concrete = useDisposable(concreteTexture, []);
  const slab = (room: HouseRoom, y: number, mat: React.ReactNode) => {
    const f = floorOf(room);
    return (
      <mesh position={[f.cx, y, f.cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[f.w, f.d]} />
        {mat}
      </mesh>
    );
  };
  return (
    <group>
      <Box size={[HOUSE_SIZE.w + T, 0.22, HOUSE_SIZE.d + T]} position={[0, -0.11, 0]} color={C.cut} r={0.05} roughness={0.85} />
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HOUSE_SIZE.w, HOUSE_SIZE.d]} />
        <meshStandardMaterial map={planks} roughness={0.55} metalness={0.05} />
      </mesh>
      {slab("garage", 0.004, <meshStandardMaterial map={concrete} roughness={0.9} />)}
      {slab("screening", 0.004, <meshStandardMaterial color="#1d2233" roughness={1} />)}
      {slab("front", 0.004, <meshStandardMaterial map={tiles} roughness={0.6} />)}
      {/* the hall's runner */}
      <mesh position={[0, 0.006, floorOf("hall").cz]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[HOUSE_SIZE.w - 1.6, 0.8]} />
        <meshStandardMaterial color="#3b2c2a" roughness={1} />
      </mesh>
    </group>
  );
});

/** Everything in houseLayout.ts for a room: the kit's pieces and the hand-built plants. */
function Furnish({ room }: { room: HouseRoom }) {
  const { items, plants } = FURNISHING[room];
  return (
    <>
      {items.map((it, i) => (
        <Piece key={i} name={it.name} at={it.at} y={it.y} ry={it.ry} h={it.h} w={it.w} paint={it.rug && RUG[it.rug]} />
      ))}
      {plants.map((p, i) => (
        <Plant key={i} position={[p.at[0], p.y ?? 0, p.at[1]]} size={p.size} seed={p.seed} leaves={p.leaves} trailing={p.trailing} />
      ))}
    </>
  );
}

// ─── 01 The garage ────────────────────────────────────────────────────────────

function zoneTexture(font: string, ready: boolean, free: number) {
  return canvasTexture(440, 280, (ctx, w, h) => {
    ctx.fillStyle = "#0e1118";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = PARADA.brand;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    if (!ready) return;
    ctx.fillStyle = "#e8e9ec";
    ctx.font = canvasFont(700, 40, font);
    ctx.fillText("ZONE A", 30, 62);
    ctx.fillStyle = PARADA.mint;
    ctx.font = canvasFont(700, 150, font);
    ctx.fillText(String(free), 26, 220);
    ctx.font = canvasFont(500, 34, font);
    ctx.fillText("FREE", 250, 220);
  });
}

const Garage = memo(function Garage({ font, ready, free }: { font: string; ready: boolean; free: number }) {
  const f = floorOf("garage");
  const car = useCarGeo();
  const zone = useDisposable(() => zoneTexture(font, ready, free), [font, ready, free]);
  const back = f.z0 + T / 2;
  return (
    <group>
      {/* the roller door in the back wall, the sodium lamp over it */}
      <Box size={[4.2, 1.95, 0.04]} position={[f.cx, 0.975, back + 0.02]} color="#3a3f52" r={0.01} />
      {Array.from({ length: 11 }, (_, i) => (
        <Box key={i} size={[4.2, 0.025, 0.06]} position={[f.cx, 0.12 + i * 0.17, back + 0.04]} color="#2c3142" r={0.008} />
      ))}
      <Box size={[0.6, 0.1, 0.2]} position={[f.cx, 2.15, back + 0.1]} color={C.metal} r={0.03} />
      <mesh position={[f.cx, 2.095, back + 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshBasicMaterial color="#ffc27a" toneMapped={false} />
      </mesh>
      {/* Zone A's count on the side wall */}
      <mesh position={[f.x0 + T / 2 + 0.01, 1.45, f.cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshBasicMaterial map={zone} toneMapped={false} />
      </mesh>
      <group position={[CAR_AT[0], 0.004, CAR_AT[1]]} rotation={[0, Math.PI / 2, 0]} scale={CAR_SCALE}>
        <Car geo={car.geo} color="#c9ced6" plate="PRD 0014" font={font} ready={ready} />
      </group>
      <Furnish room="garage" />
    </group>
  );
});

// ─── 02 The study ─────────────────────────────────────────────────────────────

const Study = memo(function Study({ font, ready }: { font: string; ready: boolean }) {
  const [dx, z] = STUDY_DESK_AT;
  const top = 0.76;
  return (
    <group>
      {/* the desk, the notebook with "tala" in it, the brass lamp */}
      <Box size={[1.8, 0.05, 0.72]} position={[dx, top, z]} color={C.deskTop} r={0.015} roughness={0.5} />
      {[-0.85, 0.85].map((o) => (
        <Box key={o} size={[0.05, top - 0.03, 0.66]} position={[dx + o, (top - 0.03) / 2, z]} color={C.dark} r={0.01} />
      ))}
      <group position={[dx - 0.15, top + 0.026, z + 0.02]} rotation={[0, 0.08, 0]} scale={0.15}>
        <TalaNotebook font={font} ready={ready} write={0.995} />
      </group>
      <mesh position={[dx + 0.62, top + 0.035, z - 0.12]}>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 24]} />
        <meshStandardMaterial color="#c99a45" metalness={0.8} roughness={0.35} />
      </mesh>
      <Rod a={[dx + 0.62, top + 0.05, z - 0.12]} b={[dx + 0.5, top + 0.5, z - 0.02]} r={0.012} color="#c99a45" metalness={0.8} roughness={0.35} />
      <mesh position={[dx + 0.44, top + 0.46, z + 0.04]} rotation={[0.5, 0, 0.3]}>
        <coneGeometry args={[0.1, 0.14, 24, 1, true]} />
        <meshStandardMaterial color="#c99a45" metalness={0.8} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <Furnish room="study" />
    </group>
  );
});

// ─── 03 The screening room ────────────────────────────────────────────────────

/** The set's glow before a film has loaded. */
function blankScreen() {
  return canvasTexture(320, 240, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
    g.addColorStop(0, "#dbe8ff");
    g.addColorStop(0.5, "#7fb0ff");
    g.addColorStop(1, "#1a2c55");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

const Screening = memo(function Screening({ film }: { film: THREE.Texture | null }) {
  const blank = useDisposable(blankScreen, []);
  const screen = film ?? blank;
  const [x, z] = TV_AT;
  return (
    <group>
      {/* the television on its cabinet */}
      <Box size={[0.9, 0.7, 0.62]} position={[x, 0.94, z]} color="#16171c" r={0.06} roughness={0.5} />
      <mesh position={[x, 0.96, z + 0.315]}>
        <planeGeometry args={[0.7, 0.52]} />
        <meshBasicMaterial key={screen.uuid} map={screen} toneMapped={false} />
      </mesh>
      <Furnish room="screening" />
    </group>
  );
});

// ─── 04 About ─────────────────────────────────────────────────────────────────

const About = memo(function About({ portrait }: { portrait: THREE.Texture | null }) {
  const f = floorOf("about");
  const wall = f.x0 + T / 2;
  return (
    <group>
      {/* the portrait on the side wall, the lanyards beside it, two certificates */}
      <Box size={[0.05, 0.92, 0.74]} position={[wall + 0.03, 1.55, f.cz - 0.3]} color={C.trim} r={0.01} />
      <mesh position={[wall + 0.06, 1.55, f.cz - 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.56, 0.74]} />
        <meshStandardMaterial map={portrait} color={portrait ? "#ffffff" : "#8a93a6"} roughness={0.8} />
      </mesh>
      {[
        { dz: 0.62, color: "#e9673f" },
        { dz: 0.74, color: "#e6b450" },
        { dz: 0.86, color: "#7fb0ff" },
      ].map((l) => (
        <group key={l.dz}>
          <Box size={[0.015, 0.7, 0.03]} position={[wall + 0.03, 1.55, f.cz + l.dz]} color={l.color} r={0.005} />
          <Box size={[0.02, 0.14, 0.1]} position={[wall + 0.04, 1.15, f.cz + l.dz]} color="#e8eaee" r={0.008} />
        </group>
      ))}
      {[0.5, 0.95].map((dz) => (
        <Box key={dz} size={[0.03, 0.3, 0.38]} position={[wall + 0.02, 2.05, f.cz + dz + 0.2]} color="#e8eaee" r={0.006} />
      ))}
      <Furnish room="about" />
    </group>
  );
});

// ─── 05 The front door ────────────────────────────────────────────────────────

/** A two-panel door leaf, hinged at the origin, running toward -x. */
function Leaf({ w, h }: { w: number; h: number }) {
  return (
    <group>
      <Box size={[w, h, 0.045]} position={[-w / 2, h / 2, 0]} color={C.door} r={0.008} roughness={0.55} />
      {[h * 0.72, h * 0.28].map((y) => (
        <Box key={y} size={[w - 0.2, h * 0.36, 0.06]} position={[-w / 2, y, 0]} color="#434c63" r={0.012} roughness={0.55} />
      ))}
      <mesh position={[-w + 0.08, h * 0.48, 0.05]}>
        <sphereGeometry args={[0.03, 16, 12]} />
        <meshStandardMaterial color="#e6b450" metalness={0.8} roughness={0.28} />
      </mesh>
    </group>
  );
}

const Front = memo(function Front() {
  const [x0, x1] = FRONT_DOOR_X;
  const dw = x1 - x0;
  const DH = 2.1;
  const spill = useDisposable(spillTexture, []);
  return (
    <group>
      {/* the doorframe stands up out of the cut wall, the door swung wide into the hall */}
      {[x0 - 0.04, x1 + 0.04].map((x) => (
        <Box key={x} size={[0.08, DH + 0.08, T + 0.04]} position={[x, (DH + 0.08) / 2, D]} color={C.trim} r={0.012} />
      ))}
      <Box size={[dw + 0.16, 0.08, T + 0.04]} position={[(x0 + x1) / 2, DH + 0.04, D]} color={C.trim} r={0.012} />
      <group position={[x1 - 0.02, 0.01, D - T / 2 - 0.03]} rotation={[0, -1.8, 0]}>
        <Leaf w={dw - 0.04} h={DH - 0.02} />
      </group>
      {/* the step outside, warm light pouring out over it: the warmest light in the house */}
      <Box size={[dw + 0.6, 0.16, 0.62]} position={[(x0 + x1) / 2, -0.14, D + 0.38]} color="#5a3a2c" r={0.02} />
      <Glow map={spill} size={[dw + 0.5, 0.6]} position={[(x0 + x1) / 2, -0.055, D + 0.38]} rotation={[-Math.PI / 2, 0, 0]} color={HOUSE.front.light} opacity={1} />
      <Glow map={spill} size={[dw + 0.9, 1.4]} position={[(x0 + x1) / 2, 0.011, D - 0.7]} rotation={[-Math.PI / 2, 0, Math.PI]} color={HOUSE.front.light} opacity={0.85} />
      <pointLight position={[(x0 + x1) / 2, 1.2, D - 0.2]} color={HOUSE.front.light} intensity={5} distance={3} decay={1.4} />
      <Furnish room="front" />
    </group>
  );
});

// ─── Lanz's room (where you came from) and the hall ───────────────────────────

const LanzRoom = memo(function LanzRoom() {
  const [dx, dz] = DESK_AT;
  return (
    <group>
      {/* the monitor on the desk, left on */}
      <Box size={[0.04, 0.32, 0.56]} position={[dx - 0.15, 1.0, dz + 0.1]} color={C.metal} r={0.01} />
      <mesh position={[dx - 0.175, 1.0, dz + 0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.52, 0.28]} />
        <meshBasicMaterial color="#5f7fd8" toneMapped={false} />
      </mesh>
      <Furnish room="room" />
    </group>
  );
});

const Hall = memo(function Hall() {
  return (
    <group>
      <Furnish room="hall" />
    </group>
  );
});

// ─── Lights ───────────────────────────────────────────────────────────────────

/** Each room's lamp: where it hangs and how bright it burns at rest. */
const LAMPS: { room: HouseRoom; at: (f: ReturnType<typeof floorOf>) => Vec3; base: number; pool: number }[] = [
  { room: "garage", at: (f) => [f.cx, 1.9, f.z0 + 0.6], base: 3.2, pool: 3.4 },
  { room: "study", at: (f) => [f.cx + 0.42, 1.15, f.z0 + 0.7], base: 1.8, pool: 2.4 },
  { room: "screening", at: (f) => [f.cx + 0.2, 0.95, f.z0 + 1.1], base: 2.0, pool: 2.6 },
  { room: "about", at: (f) => [f.cx, 1.9, f.cz], base: 1.8, pool: 3.0 },
  { room: "front", at: (f) => [f.cx - 0.1, 1.8, f.z1 - 0.9], base: 3.6, pool: 3.0 },
];

function Lights({ lit, flicker }: { lit: Partial<Record<HouseRoom, number>>; flicker: number }) {
  const round = useDisposable(roundTexture, []);
  return (
    <>
      <StudioLights intensity={0} />
      <EnvLevel level={0.2} />
      <hemisphereLight args={["#8a9bd0", "#2a2f40", 2.3]} />
      <Moon />
      {LAMPS.map(({ room: id, at, base, pool }) => {
        const f = floorOf(id);
        const p = at(f);
        const k = lit[id] ?? 0;
        const light = HOUSE[id].light;
        const flick = id === "screening" ? flicker : 1;
        return (
          <group key={id}>
            <pointLight position={p} color={light} intensity={base * 2.6 * (1 + 1.6 * k) * flick} distance={5.5 + k} decay={1.4} />
            <Glow map={round} size={[pool, pool]} position={[p[0], 0.012, p[2] + 0.3]} rotation={[-Math.PI / 2, 0, 0]} color={light} opacity={(0.36 + 0.34 * k) * flick} />
          </group>
        );
      })}
      {/* Lanz's room: the desk lamp and the monitor, left on */}
      <pointLight position={[DESK_AT[0] - 0.2, 1.2, DESK_AT[1] + 0.1]} color="#ffbe86" intensity={1.4} distance={3.2} decay={1.6} />
      <pointLight position={[0, 1.4, floorOf("hall").cz]} color="#c9ced6" intensity={0.7} distance={5} decay={1.6} />
    </>
  );
}

// ─── The house ────────────────────────────────────────────────────────────────

export interface HouseModelProps {
  /** Mono face for the zone sign and the number plates. */
  font: string;
  ready: boolean;
  portrait?: THREE.Texture | null;
  /** 0–1 per room: how far its lamp is turned up (hover, focus). */
  lit?: Partial<Record<HouseRoom, number>>;
  /** Seconds, for the television's flicker. */
  time?: number;
  /** Zone A's free count. */
  free?: number;
  /** What the screening room's set is showing: a film playing, or a frame of one. */
  film?: THREE.Texture | null;
  /** The loaded furniture kit; the rooms are bare until it arrives. */
  furniture?: Furniture | null;
}

export function HouseModel({ font, ready, portrait = null, lit = {}, time = 0, free = 12, film = null, furniture = null }: HouseModelProps) {
  const flicker = 0.9 + 0.1 * Math.sin(time * 11) * Math.sin(time * 3.7);
  return (
    <FurnitureContext.Provider value={furniture}>
      <Lights lit={lit} flicker={flicker} />
      <Shadowed>
        <Floors />
        {WALLS.map((run) => (
          <Wall key={`${run.axis}${run.at}${run.from}`} run={run} />
        ))}
        <Garage font={font} ready={ready} free={free} />
        <Study font={font} ready={ready} />
        <Screening film={film} />
        <About portrait={portrait} />
        <Front />
        <LanzRoom />
        <Hall />
      </Shadowed>
    </FurnitureContext.Provider>
  );
}
