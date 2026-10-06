import type { ThreeEvent } from "@react-three/fiber";
import { memo, useMemo } from "react";
import * as THREE from "three";
import { canvasFont, canvasTexture, easeInOut, lerp, range, ribbonGeometry, useDisposable } from "./lib";
import { Box, C, EnvLevel, Glow, Plant, Rod, doorwayTexture, floorTexture, mulberry, poolTexture, spillTexture, useRounded, wallTexture } from "./house";
import { Macropad, type MacropadProps } from "./Macropad";
import { PARADA, SITE, TALA } from "./palette";
import { LAYOUT, ROOM_OBJECTS, type RoomId, type TapeId } from "./roomObjects";
import { SoftShadow, StudioLights } from "./Studio";
import { TalaNotebook } from "./TalaDesk";

// The hero: Lanz's room at night, floating on the page. The headline is painted on the
// left wall over the desk; the monitor (PARADA), the notebook (Tala), the portrait
// (About), the door (Say hi) and the VHS deck (the films) are the site's index. The
// macropad from the old hero sits on the desk and still works. Everything else is the
// room being lived in: shelves, plants, the window onto Taal, the server rack, the
// lanyards on the door, the barako mug. Like the other models, it's a pure function of
// its props: the live rig drives it from the pointer and the clock, art/ renders the
// poster from it.

type Vec3 = [number, number, number];

// ─── Layout (room units; floor top at y = 0, back corner at x = z = −S) ───────

const { S, H, headline: HEADLINE, monitor: MON, notebook: NOTEBOOK, portrait: PORTRAIT, door: DOOR, window: WIN } = LAYOUT;
const T = 0.14;
const F = 0.22;
const DESK = LAYOUT.desk;
const DESK_X = -S + DESK.depth / 2;
const MONITOR_X = -S + 0.2;
const CAB = { ...LAYOUT.cabinet, z: -S + LAYOUT.cabinet.depth / 2 };
const DECK = { ...LAYOUT.deck, z: -S + 0.23 };
const DECK_FRONT = DECK.z + DECK.d / 2;
const RACK = { ...LAYOUT.rack, z: -S + LAYOUT.rack.d / 2 + 0.02 };
const SHELF = LAYOUT.shelves;
const LAMP_HEAD: Vec3 = [-1.62, 1.3, 0.98];
const PAD = { x: -1.47, z: 0.32, scale: 0.075, yaw: Math.PI / 2 - 0.15 };
const MUG = { x: -1.5, z: 0.92 };

const TAPE = { w: 0.3, h: 0.17, d: 0.045 };
const TAPE_REST: Record<TapeId, Vec3> = {
  parada: [-1.0, CAB.top + TAPE.h / 2, -S + 0.12],
  tala: [-0.68, CAB.top + TAPE.h / 2, -S + 0.12],
};
const SLOT: Vec3 = [DECK.x - 0.12, CAB.top + DECK.h / 2, DECK_FRONT];


// ─── Shell: floor, walls, the painted headline ────────────────────────────────

/** "Software for curious people." in Newsreader Light, painted on the left wall. */
function headlineTexture(display: string, ready: boolean) {
  return canvasTexture(2048, Math.round((2048 * HEADLINE.h) / HEADLINE.w), (ctx, w, h) => {
    if (!ready) return;
    const pad = 36;
    const c = ctx as CanvasRenderingContext2D & { letterSpacing: string };

    const lines = ["Software for", "curious people"];
    ctx.font = canvasFont(300, 100, display);
    const widest = Math.max(ctx.measureText(lines[0]).width, ctx.measureText(lines[1] + ".").width);
    const size = Math.min(((w - pad * 2) * 100) / widest, (h - 150) / 2.12);
    ctx.font = canvasFont(300, size, display);
    c.letterSpacing = `${(-0.03 * size).toFixed(1)}px`;
    ctx.fillStyle = SITE.ink;
    const y1 = 120 + size * 0.86;
    const y2 = y1 + size * 0.98;
    ctx.fillText(lines[0], pad - size * 0.04, y1);
    ctx.fillText(lines[1], pad - size * 0.04, y2);
    const end = pad - size * 0.04 + ctx.measureText(lines[1]).width;
    ctx.fillStyle = SITE.accent;
    ctx.shadowColor = SITE.accent;
    ctx.shadowBlur = size * 0.18;
    ctx.fillText(".", end, y2);
    ctx.fillText(".", end, y2);
  });
}

const Shell = memo(function Shell({ display, ready, headline: painted, dim }: { display: string; ready: boolean; headline: boolean; dim: number }) {
  const slab = useRounded(2 * S + T, F, 2 * S + T, 0.05);
  const left = useRounded(T, H, 2 * S + T, 0.04);
  const right = useRounded(2 * S, H, T, 0.04);
  const floorMap = useDisposable(floorTexture, []);
  const leftMap = useDisposable(() => wallTexture(C.wallLeft, "right"), []);
  const rightMap = useDisposable(() => wallTexture(C.wallRight, "left"), []);
  const headline = useDisposable(() => headlineTexture(display, ready && painted), [display, ready, painted]);
  return (
    <group>
      <mesh geometry={slab} position={[-T / 2, -F / 2, -T / 2]}>
        <meshStandardMaterial color={C.cut} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2 * S, 2 * S]} />
        <meshStandardMaterial map={floorMap} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh geometry={left} position={[-S - T / 2, H / 2, -T / 2]}>
        <meshStandardMaterial color={C.cut} roughness={0.85} />
      </mesh>
      <mesh geometry={right} position={[0, H / 2, -S - T / 2]}>
        <meshStandardMaterial color={C.cut} roughness={0.85} />
      </mesh>
      <mesh position={[-S + 0.002, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2 * S, H]} />
        <meshStandardMaterial map={leftMap} roughness={0.95} />
      </mesh>
      <mesh position={[0, H / 2, -S + 0.002]}>
        <planeGeometry args={[2 * S, H]} />
        <meshStandardMaterial map={rightMap} roughness={0.95} />
      </mesh>
      {/* the headline: lit paint, plus a little emission so it reads in any light */}
      <mesh position={[-S + 0.005, HEADLINE.y, HEADLINE.z]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[HEADLINE.w, HEADLINE.h]} />
        <meshStandardMaterial map={headline} transparent emissive="#ffffff" emissiveMap={headline} emissiveIntensity={0.62 - dim * 0.2} roughness={0.9} depthWrite={false} />
      </mesh>
      <PictureLight />
    </group>
  );
});

/** A slim gallery light over the headline: the reason the paint is lit. */
const PictureLight = memo(function PictureLight() {
  const y = HEADLINE.y + HEADLINE.h / 2 + 0.1;
  const len = HEADLINE.w * 0.42;
  return (
    <group position={[-S, y, HEADLINE.z]}>
      <Rod a={[0.005, 0.04, 0]} b={[0.15, 0.02, 0]} r={0.012} color={C.metal} metalness={0.6} roughness={0.35} />
      <mesh position={[0.17, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, len, 20]} />
        <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.17, -0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.03, len - 0.04]} />
        <meshBasicMaterial color="#ffe6c8" toneMapped={false} />
      </mesh>
    </group>
  );
});

// ─── Window wall: portrait, window onto Taal, prints ──────────────────────────

function skyTexture() {
  const W = 612;
  const Hh = Math.round((W * (WIN.y1 - WIN.y0)) / (WIN.x1 - WIN.x0));
  return canvasTexture(W, Hh, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    sky.addColorStop(0, "#0a0f1f");
    sky.addColorStop(1, "#2a3758");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const rand = mulberry(7);
    for (let i = 0; i < 70; i++) {
      const x = rand() * w;
      const y = rand() * h * 0.55;
      ctx.fillStyle = `rgba(244,241,232,${0.25 + rand() * 0.6})`;
      ctx.fillRect(x, y, rand() < 0.15 ? 3 : 2, rand() < 0.15 ? 3 : 2);
    }
    // crescent moon with a halo
    const mx = w * 0.72;
    const my = h * 0.24;
    const r = h * 0.09;
    const halo = ctx.createRadialGradient(mx, my, r, mx, my, r * 4);
    halo.addColorStop(0, "rgba(244,241,232,0.22)");
    halo.addColorStop(1, "rgba(244,241,232,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
    const moon = document.createElement("canvas");
    moon.width = moon.height = Math.ceil(r * 2 + 4);
    const m = moon.getContext("2d")!;
    m.fillStyle = TALA.chalk;
    m.beginPath();
    m.arc(r + 2, r + 2, r, 0, Math.PI * 2);
    m.fill();
    m.globalCompositeOperation = "destination-out";
    m.beginPath();
    m.arc(r + 2 - r * 0.45, r + 2 - r * 0.3, r * 0.9, 0, Math.PI * 2);
    m.fill();
    ctx.drawImage(moon, mx - r - 2, my - r - 2);
    // the ridge across the lake, the lake, and Taal's low cone with its crater
    const ridgeY = h * 0.6;
    ctx.fillStyle = "#121a2e";
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, ridgeY + 8);
    for (let x = 0; x <= w; x += w / 12) ctx.lineTo(x, ridgeY + Math.sin(x * 0.02) * 6 - (x / w) * 10);
    ctx.lineTo(w, h);
    ctx.fill();
    const lakeY = h * 0.68;
    const lake = ctx.createLinearGradient(0, lakeY, 0, h);
    lake.addColorStop(0, "#1d2944");
    lake.addColorStop(1, "#141c31");
    ctx.fillStyle = lake;
    ctx.fillRect(0, lakeY, w, h - lakeY);
    ctx.fillStyle = "rgba(244,241,232,0.35)";
    for (let i = 0; i < 9; i++) ctx.fillRect(mx - 16 + rand() * 32, lakeY + 8 + i * 9, 10 + rand() * 22, 2);
    const cx = w * 0.4;
    const base = h * 0.82;
    ctx.fillStyle = "#0d1322";
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.24, base);
    ctx.quadraticCurveTo(cx - w * 0.12, base - h * 0.06, cx - w * 0.07, h * 0.66);
    ctx.lineTo(cx - w * 0.03, h * 0.675);
    ctx.lineTo(cx + w * 0.03, h * 0.675);
    ctx.lineTo(cx + w * 0.07, h * 0.66);
    ctx.quadraticCurveTo(cx + w * 0.12, base - h * 0.06, cx + w * 0.24, base);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(169,187,232,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.07, h * 0.66);
    ctx.lineTo(cx - w * 0.03, h * 0.675);
    ctx.lineTo(cx + w * 0.03, h * 0.675);
    ctx.lineTo(cx + w * 0.07, h * 0.66);
    ctx.stroke();
  });
}

const Window = memo(function Window() {
  const sky = useDisposable(skyTexture, []);
  const w = WIN.x1 - WIN.x0;
  const h = WIN.y1 - WIN.y0;
  const cx = (WIN.x0 + WIN.x1) / 2;
  const cy = (WIN.y0 + WIN.y1) / 2;
  const z = -S + 0.035;
  const bar = 0.045;
  return (
    <group>
      <mesh position={[cx, cy, -S + 0.004]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      <Box size={[w + bar * 2, bar, 0.07]} position={[cx, WIN.y1 + bar / 2, z]} color={C.trim} r={0.012} />
      <Box size={[w + bar * 2 + 0.1, bar * 1.3, 0.14]} position={[cx, WIN.y0 - bar / 2, z + 0.03]} color={C.trim} r={0.012} />
      <Box size={[bar, h, 0.07]} position={[WIN.x0 - bar / 2, cy, z]} color={C.trim} r={0.012} />
      <Box size={[bar, h, 0.07]} position={[WIN.x1 + bar / 2, cy, z]} color={C.trim} r={0.012} />
      <Box size={[0.025, h, 0.04]} position={[cx, cy, z]} color={C.trim} r={0.008} />
      <Box size={[w, 0.025, 0.04]} position={[cx, cy + h * 0.12, z]} color={C.trim} r={0.008} />
      {/* a rolled blind at the top */}
      <mesh position={[cx, WIN.y1 + 0.09, -S + 0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, w + 0.16, 20]} />
        <meshStandardMaterial color={C.dark} roughness={0.8} />
      </mesh>
    </group>
  );
});

const Portrait = memo(function Portrait({ portrait }: { portrait: THREE.Texture | null }) {
  return (
    <group position={[PORTRAIT.x, PORTRAIT.y, -S + 0.03]}>
      <Box size={[PORTRAIT.w, PORTRAIT.h, 0.04]} position={[0, 0, 0]} color="#14161b" r={0.012} roughness={0.5} />
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[PORTRAIT.w - 0.06, PORTRAIT.h - 0.06]} />
        <meshStandardMaterial color={SITE.sheet} roughness={0.9} />
      </mesh>
      {/* keyed: a material compiled without a map won't pick one up later */}
      <mesh key={portrait ? "photo" : "blank"} position={[0, 0.02, 0.022]}>
        <planeGeometry args={[PORTRAIT.w - 0.2, (PORTRAIT.w - 0.2) * (4 / 3)]} />
        <meshStandardMaterial map={portrait} color={portrait ? "#ffffff" : "#8b8f97"} roughness={0.6} />
      </mesh>
    </group>
  );
});

/** A small print by the window: the four-point star from the mark — "tala" is Filipino for star. */
function printTexture() {
  return canvasTexture(240, 320, (ctx, w, h) => {
    ctx.fillStyle = "#11141c";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h * 0.44);
    ctx.fillStyle = SITE.solar;
    ctx.scale(64, 64);
    ctx.fill(new Path2D("M0-1C.1-.2.2-.1 1 0 .2.1.1.2 0 1-.1.2-.2.1-1 0-.2-.1-.1-.2 0-1Z"));
    ctx.restore();
    ctx.fillStyle = "rgba(232,233,236,0.35)";
    ctx.fillRect(w * 0.3, h * 0.8, w * 0.4, 3);
  });
}

function Print({ position }: { position: Vec3 }) {
  const map = useDisposable(printTexture, []);
  return (
    <group position={position}>
      <Box size={[0.3, 0.4, 0.03]} position={[0, 0, 0]} color="#0c0e13" r={0.008} roughness={0.5} />
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial map={map} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ─── Desk wall: shelves ───────────────────────────────────────────────────────

const BOOK_COLORS = ["#c9ced6", "#3d4a6b", "#e9673f", "#6b5a4a", "#e6b450", "#2c3346", "#8a93a6", "#4a3f5c"];

/** Floating shelves near the corner: books, a salt lamp, a camera, and a pothos spilling down. */
const SHELF_LEVELS = [1.6, 2.0, 2.42];

const Shelves = memo(function Shelves() {
  const x = -S + 0.12;
  const books = useMemo(() => {
    const rand = mulberry(5);
    const out: { z: number; y: number; w: number; h: number; d: number; c: string; lean: number }[] = [];
    // bottom shelf: a row of books; middle: a short leaning stack
    let z = SHELF.z + SHELF.w / 2 - 0.05;
    for (let i = 0; i < 7; i++) {
      const w = 0.035 + rand() * 0.025;
      const h = 0.18 + rand() * 0.08;
      out.push({ z: z - w / 2, y: SHELF_LEVELS[0] + 0.012 + h / 2, w, h, d: 0.15 + rand() * 0.04, c: BOOK_COLORS[(i * 3) % BOOK_COLORS.length], lean: 0 });
      z -= w + 0.004;
    }
    z = SHELF.z - SHELF.w / 2 + 0.06;
    for (let i = 0; i < 3; i++) {
      const w = 0.04;
      const h = 0.2 - i * 0.015;
      out.push({ z: z + i * 0.045, y: SHELF_LEVELS[1] + 0.012 + h / 2, w, h, d: 0.16, c: BOOK_COLORS[(i * 5 + 1) % BOOK_COLORS.length], lean: i === 2 ? -0.25 : 0 });
    }
    return out;
  }, []);
  return (
    <group>
      {SHELF_LEVELS.map((y) => (
        <group key={y}>
          <Box size={[0.24, 0.025, SHELF.w]} position={[x, y, SHELF.z]} color={C.wood} r={0.008} roughness={0.7} />
          <Box size={[0.1, 0.02, 0.02]} position={[-S + 0.05, y - 0.03, SHELF.z + SHELF.w / 2 - 0.08]} color={C.metal} r={0.005} />
          <Box size={[0.1, 0.02, 0.02]} position={[-S + 0.05, y - 0.03, SHELF.z - SHELF.w / 2 + 0.08]} color={C.metal} r={0.005} />
        </group>
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={[x, b.y, b.z]} rotation={[b.lean, 0, 0]}>
          <boxGeometry args={[b.d, b.h, b.w]} />
          <meshStandardMaterial color={b.c} roughness={0.8} />
        </mesh>
      ))}
      {/* a camera on the bottom shelf, past the books */}
      <group position={[x + 0.02, SHELF_LEVELS[0] + 0.065, SHELF.z - SHELF.w / 2 + 0.12]}>
        <mesh>
          <boxGeometry args={[0.08, 0.08, 0.14]} />
          <meshStandardMaterial color="#15171c" roughness={0.5} />
        </mesh>
        <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.033, 0.06, 20]} />
          <meshStandardMaterial color="#0b0c0f" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
      {/* salt lamp: a warm rock that glows */}
      <group position={[x + 0.02, SHELF_LEVELS[1] + 0.012, SHELF.z + 0.18]}>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.05, 0.055, 0.03, 16]} />
          <meshStandardMaterial color={C.wood} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.09, 0]} scale={[1, 1.3, 1]}>
          <dodecahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial color="#ff9a5c" emissive="#ff7a3c" emissiveIntensity={1.4} roughness={0.6} flatShading />
        </mesh>
      </group>
      <Plant position={[x, SHELF_LEVELS[2] + 0.012, SHELF.z]} size={0.8} trailing seed={4} pot={SITE.sheet} />
    </group>
  );
});

// ─── Door: ajar, warm light behind it, lanyards on its hook ───────────────────

function badgeTexture(font: string, ready: boolean, kind: number) {
  return canvasTexture(200, 280, (ctx, w) => {
    const band = [SITE.accent, SITE.grey, SITE.solar][kind];
    ctx.fillStyle = kind === 1 ? "#232836" : SITE.sheet;
    ctx.fillRect(0, 0, w, 280);
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, w, 64);
    if (!ready) return;
    ctx.fillStyle = kind === 1 ? SITE.sheet : SITE.onSheet;
    ctx.font = canvasFont(700, 30, font);
    const lines = [
      ["INSECOM", "2025", "FINALIST"],
      ["LPU-B", "COMPUTER", "SOCIETY"],
      ["ALCA", "CAREER", "AMBASSADOR"],
    ][kind];
    lines.forEach((t, i) => ctx.fillText(t, 18, 120 + i * 50));
  });
}

/** One lanyard hanging from a hook at the origin, flat against the surface behind it (+z faces out). */
function Lanyard({ font, ready, kind, dx, drop, tilt }: { font: string; ready: boolean; kind: number; dx: number; drop: number; tilt: number }) {
  const z = 0.01 + kind * 0.008;
  const card: Vec3 = [dx, -drop, z];
  const strap = useDisposable(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, z),
      new THREE.Vector3(dx * 0.5 - 0.035, -drop * 0.55, z),
      new THREE.Vector3(card[0] - 0.012, card[1] + 0.09, z),
      new THREE.Vector3(card[0] + 0.012, card[1] + 0.09, z),
      new THREE.Vector3(dx * 0.5 + 0.035, -drop * 0.55, z),
      new THREE.Vector3(0.004, 0, z),
    ]);
    return ribbonGeometry(curve, 0.02, 120, (_, tangent) => tangent.clone().cross(new THREE.Vector3(0, 0, 1)));
  }, [kind, dx, drop, z]);
  const face = useDisposable(() => badgeTexture(font, ready, kind), [font, ready, kind]);
  const color = [SITE.accent, SITE.grey, SITE.solar][kind];
  return (
    <group>
      <mesh geometry={strap}>
        <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <group position={card} rotation={[0, 0, tilt]}>
        <Box size={[0.1, 0.14, 0.006]} position={[0, 0, 0]} color="#ffffff" r={0.003} />
        <mesh position={[0, 0, 0.0035]}>
          <planeGeometry args={[0.096, 0.136]} />
          <meshStandardMaterial map={face} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

const Door = memo(function Door({ font, ready, dim }: { font: string; ready: boolean; dim: number }) {
  const doorway = useDisposable(doorwayTexture, []);
  const spill = useDisposable(spillTexture, []);
  const w = DOOR.x1 - DOOR.x0;
  const leaf = useRounded(w, DOOR.h - 0.02, 0.05, 0.015);
  const panel = useRounded(w - 0.22, 0.72, 0.012, 0.01);
  const z = -S + 0.04;
  return (
    <group>
      <mesh position={[(DOOR.x0 + DOOR.x1) / 2, DOOR.h / 2, -S + 0.004]}>
        <planeGeometry args={[w, DOOR.h]} />
        <meshBasicMaterial map={doorway} toneMapped={false} />
      </mesh>
      {/* frame */}
      <Box size={[0.07, DOOR.h + 0.06, 0.09]} position={[DOOR.x0 - 0.035, (DOOR.h + 0.06) / 2, z]} color={C.trim} r={0.012} />
      <Box size={[0.07, DOOR.h + 0.06, 0.09]} position={[DOOR.x1 + 0.035, (DOOR.h + 0.06) / 2, z]} color={C.trim} r={0.012} />
      <Box size={[w + 0.14, 0.07, 0.09]} position={[(DOOR.x0 + DOOR.x1) / 2, DOOR.h + 0.035, z]} color={C.trim} r={0.012} />
      {/* the leaf, hinged on the far jamb and swung into the room */}
      <group position={[DOOR.x1, 0, -S + 0.03]} rotation={[0, DOOR.open, 0]}>
        <mesh geometry={leaf} position={[-w / 2, DOOR.h / 2, 0.025]}>
          <meshStandardMaterial color={C.door} roughness={0.7} />
        </mesh>
        {[0.52, 1.42].map((y) => (
          <mesh key={y} geometry={panel} position={[-w / 2, y, 0.053]}>
            <meshStandardMaterial color="#434c62" roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[-w + 0.09, 1.0, 0.075]}>
          <sphereGeometry args={[0.03, 20, 14]} />
          <meshStandardMaterial color={TALA.gold} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* the hook, and the lanyards from INSECOM and the orgs */}
        <group position={[-w / 2 + 0.05, 1.86, 0.06]}>
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 12]} />
            <meshStandardMaterial color={C.metal} metalness={0.7} roughness={0.3} />
          </mesh>
          <Lanyard font={font} ready={ready} kind={1} dx={-0.05} drop={0.48} tilt={0.06} />
          <Lanyard font={font} ready={ready} kind={2} dx={0.06} drop={0.44} tilt={-0.08} />
          <Lanyard font={font} ready={ready} kind={0} dx={0.0} drop={0.54} tilt={0.02} />
        </group>
      </group>
      <Glow map={spill} size={[1.4, 1.8]} position={[DOOR.x0 + 0.02, 0.006, -S + 0.92]} rotation={[-Math.PI / 2, 0, 0]} color="#ff9a5c" opacity={0.5 * (1 - dim * 0.6)} />
    </group>
  );
});

// ─── Desk, chair and what's on the desk ───────────────────────────────────────

const Desk = memo(function Desk() {
  const len = DESK.z0 - DESK.z1;
  const z = (DESK.z0 + DESK.z1) / 2;
  const ped = { z0: DESK.z0 - 0.04, z1: DESK.z0 - 0.48 };
  const pedZ = (ped.z0 + ped.z1) / 2;
  const pedW = ped.z0 - ped.z1;
  return (
    <group>
      <group position={[DESK_X, 0, z]}>
        <SoftShadow width={DESK.depth + 0.5} depth={len + 0.5} y={0.004} opacity={0.7} />
      </group>
      <Box size={[DESK.depth, 0.05, len]} position={[DESK_X, DESK.top - 0.025, z]} color={C.deskTop} roughness={0.6} r={0.02} />
      {/* drawer pedestal at the front end, legs at the back */}
      <Box size={[DESK.depth - 0.06, DESK.top - 0.05, pedW]} position={[DESK_X, (DESK.top - 0.05) / 2, pedZ]} color={C.dark} r={0.015} />
      {[0.14, 0.36, 0.58].map((y) => (
        <group key={y}>
          <Box size={[0.012, 0.18, pedW - 0.05]} position={[DESK_X + DESK.depth / 2 - 0.025, y, pedZ]} color="#262b37" r={0.005} />
          <Box size={[0.015, 0.014, 0.12]} position={[DESK_X + DESK.depth / 2 - 0.012, y + 0.05, pedZ]} color={C.trim} r={0.005} metalness={0.5} />
        </group>
      ))}
      {[DESK.z1 + 0.06].map((lz) =>
        [-S + 0.08, -S + DESK.depth - 0.08].map((lx) => <Box key={`${lx}${lz}`} size={[0.05, DESK.top - 0.05, 0.05]} position={[lx, (DESK.top - 0.05) / 2, lz]} color={C.dark} r={0.012} />)
      )}
    </group>
  );
});

const Chair = memo(function Chair() {
  return (
    <group position={[-0.86, 0, 0.28]} rotation={[0, Math.PI / 2 + 0.32, 0]}>
      <SoftShadow width={0.9} depth={0.9} y={0.004} opacity={0.6} />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <Box size={[0.04, 0.03, 0.27]} position={[0, 0.06, 0.135]} color={C.metal} r={0.01} />
            <mesh position={[0, 0.025, 0.26]}>
              <sphereGeometry args={[0.025, 12, 8]} />
              <meshStandardMaterial color="#111318" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
      <Rod a={[0, 0.06, 0]} b={[0, 0.42, 0]} r={0.022} color={C.metal} metalness={0.6} roughness={0.35} />
      <Box size={[0.5, 0.08, 0.48]} position={[0, 0.46, 0]} color={C.fabric} r={0.035} roughness={0.9} />
      <Box size={[0.05, 0.32, 0.03]} position={[0, 0.6, 0.25]} color={C.metal} r={0.01} />
      <Box size={[0.48, 0.5, 0.07]} position={[0, 0.86, 0.27]} rotation={[-0.1, 0, 0]} color={C.fabric} r={0.035} roughness={0.9} />
      {[-1, 1].map((s) => (
        <Box key={s} size={[0.04, 0.03, 0.3]} position={[s * 0.27, 0.66, 0.02]} color={C.metal} r={0.01} />
      ))}
    </group>
  );
});

function screenTexture(font: string, ready: boolean, free: number) {
  return canvasTexture(1024, Math.round((1024 * (MON.h - 0.06)) / (MON.w - 0.06)), (ctx, w, h) => {
    ctx.fillStyle = "#151b29";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = PARADA.navy;
    ctx.fillRect(0, 0, w, 92);
    if (!ready) return;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = PARADA.sunset;
    ctx.font = canvasFont(700, 46, font);
    ctx.fillText("PARADA", 40, 62);
    ctx.fillStyle = PARADA.mint;
    ctx.beginPath();
    ctx.arc(w - 150, 46, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = canvasFont(500, 30, font);
    ctx.fillText("LIVE", w - 128, 57);
    ctx.fillStyle = "rgba(241,239,233,0.7)";
    ctx.font = canvasFont(500, 34, font);
    ctx.fillText("ZONE A", 40, 168);
    ctx.fillStyle = PARADA.mint;
    ctx.shadowColor = PARADA.mint;
    ctx.shadowBlur = 20;
    ctx.font = canvasFont(700, 190, font);
    ctx.fillText(String(free), 32, 350);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(241,239,233,0.75)";
    ctx.font = canvasFont(500, 40, font);
    ctx.fillText("/ 40 FREE", 290, 350);
    ctx.fillStyle = "rgba(241,239,233,0.14)";
    ctx.fillRect(40, 392, w - 80, 22);
    ctx.fillStyle = PARADA.mint;
    ctx.fillRect(40, 392, (w - 80) * (1 - free / 40), 22);
    ctx.fillStyle = "rgba(241,239,233,0.55)";
    ctx.font = canvasFont(500, 28, font);
    ctx.fillText(free < 12 ? "GATE A · ENTRY · PARKED" : "GATE A · WAITING", 40, h - 34);
  });
}

/** Facing out from the headline wall (+x), so it's built facing +z and turned. */
const Monitor = memo(function Monitor({ font, ready, free }: { font: string; ready: boolean; free: number }) {
  const screen = useDisposable(() => screenTexture(font, ready, free), [font, ready, free]);
  return (
    <group position={[MONITOR_X, 0, MON.z]} rotation={[0, Math.PI / 2, 0]}>
      <Box size={[0.34, 0.025, 0.22]} position={[0, DESK.top + 0.0125, 0.02]} color={C.metal} r={0.01} />
      <Box size={[0.06, 0.36, 0.04]} position={[0, DESK.top + 0.18, -0.04]} color={C.metal} r={0.01} />
      <Box size={[MON.w, MON.h, 0.05]} position={[0, MON.y, 0]} color="#0f1116" r={0.02} roughness={0.4} />
      <mesh position={[0, MON.y + 0.008, 0.026]}>
        <planeGeometry args={[MON.w - 0.06, MON.h - 0.06]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
    </group>
  );
});

const Lamp = memo(function Lamp() {
  const base: Vec3 = [-S + 0.16, DESK.top, 1.18];
  const elbow: Vec3 = [-S + 0.1, 1.36, 1.12];
  return (
    <group>
      <mesh position={[base[0], base[1] + 0.012, base[2]]}>
        <cylinderGeometry args={[0.09, 0.1, 0.024, 32]} />
        <meshStandardMaterial color={SITE.accent} roughness={0.45} />
      </mesh>
      <Rod a={[base[0], base[1] + 0.02, base[2]]} b={elbow} r={0.014} color={SITE.accent} roughness={0.45} />
      <Rod a={elbow} b={[LAMP_HEAD[0] - 0.03, LAMP_HEAD[1] + 0.05, LAMP_HEAD[2] + 0.03]} r={0.014} color={SITE.accent} roughness={0.45} />
      <group position={LAMP_HEAD} rotation={[-0.4, 0, -0.45]}>
        <mesh>
          <coneGeometry args={[0.09, 0.14, 32, 1, true]} />
          <meshStandardMaterial color={SITE.accent} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <sphereGeometry args={[0.035, 16, 12]} />
          <meshBasicMaterial color="#fff1dc" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
});

function mugLabel(font: string, ready: boolean) {
  return canvasTexture(512, 64, (ctx, w, h) => {
    ctx.fillStyle = "#2b1a12";
    ctx.fillRect(0, 0, w, h);
    if (!ready) return;
    ctx.fillStyle = TALA.chalk;
    ctx.font = canvasFont(700, 30, font);
    ctx.textBaseline = "middle";
    ctx.fillText("KAPENG BARAKO · BATANGAS", 20, h / 2 + 2);
  });
}

function steamTexture() {
  return canvasTexture(64, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.save();
    ctx.scale(1, h / w);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, w);
    ctx.restore();
  });
}

function Mug({ font, ready, time }: { font: string; ready: boolean; time: number }) {
  const body = useDisposable(() => {
    const p = [
      [0, 0],
      [0.052, 0],
      [0.056, 0.006],
      [0.056, 0.11],
      [0.049, 0.11],
      [0.049, 0.012],
      [0, 0.012],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(p, 40);
  }, []);
  const label = useDisposable(() => mugLabel(font, ready), [font, ready]);
  const steam = useDisposable(steamTexture, []);
  return (
    <group position={[MUG.x, DESK.top, MUG.z]} rotation={[0, 0.9, 0]}>
      <mesh geometry={body}>
        <meshStandardMaterial color={SITE.sheet} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.0565, 0.0565, 0.034, 40, 1, true]} />
        <meshStandardMaterial map={label} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.049, 32]} />
        <meshStandardMaterial color="#2a1810" roughness={0.25} />
      </mesh>
      <mesh position={[0.062, 0.058, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.026, 0.008, 10, 24, Math.PI]} />
        <meshStandardMaterial color={SITE.sheet} roughness={0.45} />
      </mesh>
      {[0, 0.33, 0.66].map((phase, i) => {
        const f = (time * 0.32 + phase) % 1;
        return (
          <mesh key={i} position={[Math.sin(time * 1.3 + i * 2) * 0.012 + (i - 1) * 0.014, 0.14 + f * 0.2, 0]} rotation={[0, 0, 0]} renderOrder={2}>
            <planeGeometry args={[0.05, 0.16]} />
            <meshBasicMaterial map={steam} transparent opacity={Math.sin(Math.PI * f) * 0.22} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Server rack ──────────────────────────────────────────────────────────────

/** Rack units behind smoked glass: blanking plates, patch panels, switches, a server. */
function rackTexture() {
  return canvasTexture(256, 1024, (ctx, w, h) => {
    ctx.fillStyle = "#07080b";
    ctx.fillRect(0, 0, w, h);
    const units = [
      { h: 44, kind: "patch" },
      { h: 44, kind: "switch" },
      { h: 44, kind: "switch" },
      { h: 22, kind: "blank" },
      { h: 88, kind: "server" },
      { h: 44, kind: "patch" },
      { h: 88, kind: "server" },
      { h: 22, kind: "blank" },
      { h: 132, kind: "server" },
      { h: 44, kind: "switch" },
      { h: 88, kind: "blank" },
    ];
    let y = 40;
    for (const u of units) {
      ctx.fillStyle = u.kind === "blank" ? "#1c2029" : "#2a2f3b";
      ctx.fillRect(18, y + 2, w - 36, u.h - 4);
      if (u.kind === "patch" || u.kind === "switch") {
        ctx.fillStyle = "#06070a";
        for (let i = 0; i < 12; i++) ctx.fillRect(40 + i * 15, y + 14, 11, u.kind === "switch" ? 9 : 14);
      } else if (u.kind === "server") {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        for (let i = 0; i < u.h - 16; i += 6) ctx.fillRect(40, y + 8 + i, w - 80, 2);
      }
      y += u.h;
    }
  });
}

/** Where the link lights sit on the rack face (fractions of its width and height). */
const RACK_LEDS = (() => {
  const rand = mulberry(9);
  const rows = [0.075, 0.118, 0.161, 0.247, 0.39, 0.475, 0.62, 0.74, 0.86];
  return rows.flatMap((y, r) =>
    Array.from({ length: r % 3 === 1 ? 8 : 4 }, (_, i) => ({
      x: 0.18 + i * (r % 3 === 1 ? 0.085 : 0.08),
      y,
      rate: 0.8 + rand() * 3,
      phase: rand() * 6,
      tone: rand() < 0.7 ? "#4aa3ff" : rand() < 0.5 ? PARADA.mint : PARADA.amber,
    }))
  );
})();

function Rack({ time, wake }: { time: number; wake: number }) {
  const face = useDisposable(rackTexture, []);
  const glow = useDisposable(poolTexture, []);
  const bodyH = RACK.h - 0.05;
  const front = RACK.z + RACK.d / 2;
  const fw = RACK.w - 0.08;
  const fh = bodyH - 0.12;
  const cable = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(RACK.x - 0.1, 1.62, front + 0.005),
        new THREE.Vector3(RACK.x - 0.16, 1.4, front + 0.05),
        new THREE.Vector3(RACK.x - 0.12, 1.18, front + 0.03),
        new THREE.Vector3(RACK.x + 0.06, 1.12, front + 0.005),
      ]),
    [front]
  );
  return (
    <group>
      <group position={[RACK.x, 0, RACK.z]}>
        <SoftShadow width={RACK.w + 0.5} depth={RACK.d + 0.5} y={0.004} opacity={0.75} />
      </group>
      <Box size={[RACK.w, bodyH, RACK.d]} position={[RACK.x, 0.05 + bodyH / 2, RACK.z]} color="#232733" r={0.02} roughness={0.45} metalness={0.3} />
      <mesh position={[RACK.x, 0.05 + bodyH / 2, front + 0.002]}>
        <planeGeometry args={[fw, fh]} />
        <meshStandardMaterial map={face} roughness={0.25} metalness={0.2} />
      </mesh>
      {RACK_LEDS.map((l, i) => {
        const on = wake < 0.5 ? i % 4 !== 0 : Math.sin(time * l.rate + l.phase) > -0.35;
        return (
          <mesh key={i} position={[RACK.x - fw / 2 + l.x * fw, 0.05 + bodyH / 2 + fh / 2 - l.y * fh, front + 0.004]}>
            <planeGeometry args={[0.02, 0.011]} />
            <meshBasicMaterial color={on ? l.tone : "#1a1d24"} toneMapped={false} />
          </mesh>
        );
      })}
      {/* the light-blue console cable, Cisco's own colour */}
      <mesh>
        <tubeGeometry args={[cable, 30, 0.006, 6, false]} />
        <meshStandardMaterial color="#7fb6e0" roughness={0.6} />
      </mesh>
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[RACK.x + sx * (RACK.w / 2 - 0.05), 0.025, RACK.z + sz * (RACK.d / 2 - 0.05)]}>
            <sphereGeometry args={[0.025, 10, 8]} />
            <meshStandardMaterial color="#0d0e12" />
          </mesh>
        ))
      )}
      <Glow map={glow} size={[RACK.w + 0.4, 0.7]} position={[RACK.x, 0.006, front + 0.35]} rotation={[-Math.PI / 2, 0, 0]} color="#4a8cff" opacity={0.35} />
      <Plant position={[RACK.x + 0.05, 0.05 + bodyH, RACK.z + 0.05]} size={0.9} trailing seed={8} pot={C.dark} />
    </group>
  );
}

// ─── Cabinet, VHS deck and the two tapes ──────────────────────────────────────

function deckFace(font: string, ready: boolean, playing: TapeId | null) {
  return canvasTexture(740, 130, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#3a3f4a");
    g.addColorStop(1, "#22262e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // the tape slot (on the left, as seen from the room)
    ctx.fillStyle = "#07080a";
    ctx.beginPath();
    ctx.roundRect(70, 38, 350, 46, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(74, 40, 342, 3);
    // display
    ctx.fillStyle = "#06120f";
    ctx.beginPath();
    ctx.roundRect(470, 34, 210, 54, 6);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "#15171c";
      ctx.beginPath();
      ctx.roundRect(470 + i * 54, 98, 42, 16, 4);
      ctx.fill();
    }
    if (!ready) return;
    ctx.fillStyle = "#7fe9d8";
    ctx.shadowColor = "#7fe9d8";
    ctx.shadowBlur = 10;
    ctx.font = canvasFont(700, 30, font);
    ctx.fillText(playing ? "▶ PLAY" : "STOP", 486, 72);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(232,233,236,0.45)";
    ctx.font = canvasFont(500, 18, font);
    ctx.fillText("VHS · HQ", 76, 112);
  });
}

function tapeLabel(font: string, ready: boolean, id: TapeId) {
  return canvasTexture(320, 180, (ctx, w) => {
    ctx.fillStyle = id === "parada" ? SITE.accent : SITE.solar;
    ctx.fillRect(0, 0, w, 180);
    // the label and the two reel windows
    ctx.fillStyle = TALA.ivory;
    ctx.fillRect(22, 18, w - 44, 74);
    ctx.fillStyle = "rgba(13,16,22,0.85)";
    ctx.beginPath();
    ctx.roundRect(80, 108, w - 160, 48, 10);
    ctx.fill();
    if (!ready) return;
    ctx.fillStyle = SITE.onSheet;
    ctx.font = canvasFont(700, 40, font);
    ctx.fillText(id === "parada" ? "PARADA" : "TALA", 36, 66);
    ctx.font = canvasFont(500, 22, font);
    ctx.fillText("15 s", w - 86, 66);
  });
}

function Tape({ id, font, ready, insert, lift, onTape }: { id: TapeId; font: string; ready: boolean; insert: number; lift: number; onTape?: RoomProps["onTape"] }) {
  const shell = useRounded(TAPE.w, TAPE.h, TAPE.d, 0.008);
  const label = useDisposable(() => tapeLabel(font, ready, id), [font, ready, id]);
  // rest (standing on the cabinet, leaning on the wall) → lying flat at the slot → inside the deck
  const rest = TAPE_REST[id];
  const a = easeInOut(range(insert, 0, 0.6));
  const b = easeInOut(range(insert, 0.6, 1));
  const frontZ = SLOT[2] + TAPE.h / 2 + 0.06;
  const x = lerp(rest[0], SLOT[0], a);
  const y = lerp(rest[1] + lift, SLOT[1], a) + Math.sin(a * Math.PI) * 0.22;
  const z = lerp(lerp(rest[2], frontZ, a), SLOT[2] - TAPE.h / 2 - 0.02, b);
  const handlers = onTape && {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onTape(id, "over", e)),
    onPointerOut: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onTape(id, "out", e)),
    onClick: (e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), onTape(id, "click", e)),
  };
  return (
    <group position={[x, y, z]} rotation={[lerp(-0.09, -Math.PI / 2, a), 0, 0]} visible={insert < 0.999}>
      <mesh geometry={shell} {...handlers}>
        <meshStandardMaterial color="#15171c" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, TAPE.d / 2 + 0.001]}>
        <planeGeometry args={[TAPE.w - 0.012, TAPE.h - 0.012]} />
        <meshStandardMaterial map={label} roughness={0.55} />
      </mesh>
    </group>
  );
}

function Cabinet({ font, ready, tapes, onTape, tapeHover }: { font: string; ready: boolean; tapes: Partial<Record<TapeId, number>>; onTape?: RoomProps["onTape"]; tapeHover?: TapeId | null }) {
  const playing = (["parada", "tala"] as TapeId[]).find((id) => (tapes[id] ?? 0) > 0.98) ?? null;
  const face = useDisposable(() => deckFace(font, ready, playing), [font, ready, playing]);
  const strip = useDisposable(poolTexture, []);
  const bodyH = CAB.top - 0.095;
  const front = CAB.z + CAB.depth / 2;
  return (
    <group>
      <group position={[CAB.x, 0, CAB.z]}>
        <SoftShadow width={CAB.l + 0.5} depth={CAB.depth + 0.5} y={0.004} opacity={0.7} />
      </group>
      <Box size={[CAB.l, bodyH, CAB.depth]} position={[CAB.x, 0.06 + bodyH / 2, CAB.z]} color={C.cabinet} r={0.025} />
      <Box size={[CAB.l + 0.04, 0.035, CAB.depth + 0.04]} position={[CAB.x, CAB.top - 0.0175, CAB.z]} color={C.deskTop} r={0.012} roughness={0.55} />
      {[-1.5, -0.5, 0.5, 1.5].map((s) => (
        <group key={s}>
          <Box size={[CAB.l / 4 - 0.04, bodyH - 0.07, 0.014]} position={[CAB.x + s * (CAB.l / 4), 0.06 + bodyH / 2, front + 0.006]} color={C.cabinetDoor} r={0.006} />
          <mesh position={[CAB.x + s * (CAB.l / 4) + (s < 0 ? 0.17 : -0.17), 0.06 + bodyH / 2 + 0.1, front + 0.02]}>
            <sphereGeometry args={[0.014, 12, 8]} />
            <meshStandardMaterial color={TALA.gold} metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* the warm LED strip under it, and its pool on the floor */}
      <mesh position={[CAB.x, 0.058, front - 0.03]}>
        <boxGeometry args={[CAB.l - 0.08, 0.01, 0.01]} />
        <meshBasicMaterial color="#ffc890" toneMapped={false} />
      </mesh>
      <Glow map={strip} size={[CAB.l + 0.3, 0.8]} position={[CAB.x, 0.006, front + 0.38]} rotation={[-Math.PI / 2, 0, 0]} color="#ff9a52" opacity={0.55} />
      {/* the deck */}
      <Box size={[DECK.w, DECK.h, DECK.d]} position={[DECK.x, CAB.top + DECK.h / 2, DECK.z]} color="#1b1e25" r={0.014} roughness={0.5} />
      <mesh position={[DECK.x, CAB.top + DECK.h / 2, DECK_FRONT + 0.001]}>
        <planeGeometry args={[DECK.w - 0.02, DECK.h - 0.02]} />
        <meshStandardMaterial map={face} roughness={0.5} emissive="#ffffff" emissiveMap={face} emissiveIntensity={0.15} />
      </mesh>
      {(["parada", "tala"] as TapeId[]).map((id) => (
        <Tape key={id} id={id} font={font} ready={ready} insert={tapes[id] ?? 0} lift={tapeHover === id ? 0.03 : 0} onTape={onTape} />
      ))}
      <Plant position={[CAB.x - CAB.l / 2 + 0.16, CAB.top, CAB.z]} size={0.85} seed={3} pot={SITE.sheet} />
    </group>
  );
}

// ─── Picking: an outline that hugs each object ────────────────────────────────

/** The object's box: invisible for picking, and drawn as an inverted hull (an outline) while lit. */
function Pickable({ id, size, position, rotation, lit, onObject }: { id: RoomId; size: Vec3; position: Vec3; rotation?: Vec3; lit: number; onObject?: RoomProps["onObject"] }) {
  const t = 0.022;
  const hull = useRounded(size[0] + t * 2, size[1] + t * 2, size[2] + t * 2, 0.02);
  const handlers = onObject && {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onObject(id, "over", e)),
    onPointerOut: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onObject(id, "out", e)),
    onClick: (e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), onObject(id, "click", e)),
  };
  return (
    <group position={position} rotation={rotation}>
      <mesh {...handlers}>
        <boxGeometry args={size} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
      <mesh geometry={hull} visible={lit > 0.01} renderOrder={3}>
        <meshBasicMaterial color={SITE.accent} side={THREE.BackSide} transparent opacity={lit} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────────

/** Night: a dim cool fill, then everything warm comes from things in the room. `dim` lowers the room around a picked object. */
function Lights({ dim, focus }: { dim: number; focus: RoomId | null }) {
  const k = 1 - dim * 0.55;
  // Always mounted (a change in the number of lights recompiles every material): it just sits at 0 until something's picked.
  const at = (ROOM_OBJECTS.find((o) => o.id === focus) ?? ROOM_OBJECTS[0]).anchor;
  return (
    <>
      <StudioLights intensity={0} />
      <EnvLevel level={0.22 * k} />
      <hemisphereLight args={["#8a9bd0", "#2a2f40", 1.8 * k]} />
      <directionalLight position={[3, 7, 5]} color="#b8c4e8" intensity={0.85 * k} />
      <pointLight position={[LAMP_HEAD[0] + 0.05, LAMP_HEAD[1] - 0.1, LAMP_HEAD[2] - 0.05]} color="#ffbe86" intensity={2.6 * k} distance={3.2} decay={1.6} />
      <pointLight position={[DOOR.x0 + 0.25, 1.1, -S + 0.45]} color="#ff9a55" intensity={2.4 * k} distance={3.2} decay={1.6} />
      <pointLight position={[MONITOR_X + 0.45, MON.y, MON.z]} color="#9fb2ff" intensity={0.7 * k} distance={1.8} decay={1.8} />
      <pointLight position={[-S + 0.45, HEADLINE.y + HEADLINE.h / 2 - 0.05, HEADLINE.z]} color="#ffe2c4" intensity={1.8 * k} distance={2.6} decay={1.6} />
      <pointLight position={[CAB.x, 0.35, CAB.z + 0.6]} color="#ffb070" intensity={1.2 * k} distance={2.2} decay={1.8} />
      <pointLight position={[at[0] + 0.5, at[1] - 0.2, at[2] + 0.9]} color="#ffffff" intensity={dim * 1.6} distance={2.6} decay={1.6} />
    </>
  );
}

// ─── The room ─────────────────────────────────────────────────────────────────

export interface RoomProps {
  /** Mono face for legends and screens; display face for the painted headline. */
  font: string;
  display: string;
  ready: boolean;
  portrait: THREE.Texture | null;
  /** Seconds, for the idle motion (steam, link lights). */
  time?: number;
  /** 0 at the poster; 1 once the room has woken (a car parks, the rack starts blinking). */
  wake?: number;
  /** The object under the pointer or focus (outlined). */
  lit?: Partial<Record<RoomId, number>>;
  /** The picked object, and how far the rest of the room has dimmed around it. */
  focus?: RoomId | null;
  dim?: number;
  /** How far each tape is into the deck (0 on the cabinet, 1 inside). */
  tapes?: Partial<Record<TapeId, number>>;
  tapeHover?: TapeId | null;
  pad?: Pick<MacropadProps, "press" | "glow" | "knob" | "screen">;
  onObject?: (id: RoomId, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => void;
  onTape?: (id: TapeId, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => void;
  onKey?: MacropadProps["onKey"];
  /** false leaves the wall blank (the phone poster, where the headline is set as type). */
  headline?: boolean;
}

export function Room({ font, display, ready, portrait, headline = true, time = 0, wake = 0, lit = {}, focus = null, dim = 0, tapes = {}, tapeHover = null, pad, onObject, onTape, onKey }: RoomProps) {
  const free = wake > 0.6 ? 11 : 12;
  const doorLeaf: Vec3 = [DOOR.x1, 0, -S + 0.03];
  return (
    <group>
      <Lights dim={dim} focus={focus} />
      <Shell display={display} ready={ready} headline={headline} dim={dim} />
      <Shelves />
      <Desk />
      <Chair />
      <Monitor font={font} ready={ready} free={free} />
      <Lamp />
      <Mug font={font} ready={ready} time={time} />
      <group position={[NOTEBOOK.x, DESK.top, NOTEBOOK.z]} rotation={[0, NOTEBOOK.yaw, 0]} scale={NOTEBOOK.scale}>
        <SoftShadow width={4.2} depth={3} y={0.004} opacity={0.5} />
        <TalaNotebook font={font} ready={ready} write={0.995} />
      </group>
      <group position={[PAD.x, DESK.top + 0.25 * PAD.scale, PAD.z]} rotation={[0, PAD.yaw, 0]} scale={PAD.scale}>
        <Macropad font={font} ready={ready} cable={false} {...pad} onKey={onKey} />
      </group>
      <Plant position={[-S + 0.15, DESK.top, DESK.z1 + 0.14]} size={0.6} seed={2} pot={C.dark} />
      <Plant position={[-S + 0.32, 0, DESK.z0 + 0.32]} size={1.6} seed={6} pot={C.dark} yaw={0.6} leaves={22} />

      <Portrait portrait={portrait} />
      <Window />
      <Print position={[0.24, 2.2, -S + 0.025]} />
      <Cabinet font={font} ready={ready} tapes={tapes} onTape={onTape} tapeHover={tapeHover} />
      <Rack time={time} wake={wake} />
      <Door font={font} ready={ready} dim={dim} />

      <group position={[MONITOR_X, 0, MON.z]} rotation={[0, Math.PI / 2, 0]}>
        <Pickable id="parada" size={[MON.w, MON.h, 0.05]} position={[0, MON.y, 0]} lit={lit.parada ?? 0} onObject={onObject} />
      </group>
      <Pickable
        id="tala"
        size={[3.44 * NOTEBOOK.scale, 0.04, 2.26 * NOTEBOOK.scale]}
        position={[NOTEBOOK.x, DESK.top + 0.02, NOTEBOOK.z]}
        rotation={[0, NOTEBOOK.yaw, 0]}
        lit={lit.tala ?? 0}
        onObject={onObject}
      />
      <Pickable id="about" size={[PORTRAIT.w, PORTRAIT.h, 0.04]} position={[PORTRAIT.x, PORTRAIT.y, -S + 0.03]} lit={lit.about ?? 0} onObject={onObject} />
      <group position={doorLeaf} rotation={[0, DOOR.open, 0]}>
        <Pickable id="contact" size={[DOOR.x1 - DOOR.x0, DOOR.h - 0.02, 0.05]} position={[-(DOOR.x1 - DOOR.x0) / 2, DOOR.h / 2, 0.025]} lit={lit.contact ?? 0} onObject={onObject} />
      </group>
      <Pickable id="reel" size={[DECK.w, DECK.h, DECK.d]} position={[DECK.x, CAB.top + DECK.h / 2, DECK.z]} lit={lit.reel ?? 0} onObject={onObject} />
    </group>
  );
}
