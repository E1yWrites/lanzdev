import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { canvasFont, canvasTexture, clamp01, easeInOut, easeOutBack, lerp, ribbonGeometry, sparkleGeometry, useDisposable } from "./lib";
import { SITE, TALA } from "./palette";
import { SoftShadow } from "./Studio";

// Tala as a desk: an open notebook where a pencil writes "tala" in cursive, a doodled
// sun on the facing page, a sticky note, and — above it all — the sun that turns into
// the moon, because Tala is "sun by day, moon by night". "Tala" also means star.

const PAGE = { w: 1.62, d: 2.14, h: 0.12 };
const SPINE_GAP = 0.08;
const PAGE_TOP = 0.05 + PAGE.h;

// ─── Handwriting ──────────────────────────────────────────────────────────────

// "tala" in cursive, x right / y up, baseline at 0 — authored by hand, smoothed by Catmull-Rom.
const WORD: [number, number][] = [
  [-0.1, 0.0], [0.02, 0.2], [0.1, 0.52], [0.14, 0.8], [0.12, 0.52], [0.1, 0.2], [0.14, 0.04], [0.22, 0.02],
  [0.3, 0.22], [0.39, 0.43], [0.5, 0.47], [0.5, 0.47], [0.4, 0.49], [0.3, 0.4], [0.26, 0.2], [0.32, 0.04], [0.43, 0.06], [0.5, 0.24], [0.53, 0.46], [0.53, 0.2], [0.56, 0.04], [0.66, 0.04],
  [0.78, 0.34], [0.9, 0.78], [0.91, 1.08], [0.83, 1.1], [0.78, 0.86], [0.79, 0.4], [0.83, 0.1], [0.9, 0.02], [0.97, 0.06],
  [1.04, 0.26], [1.12, 0.43], [1.22, 0.47], [1.22, 0.47], [1.12, 0.49], [1.02, 0.4], [0.98, 0.2], [1.04, 0.04], [1.15, 0.06], [1.22, 0.24], [1.25, 0.46], [1.25, 0.2], [1.28, 0.04], [1.38, 0.05], [1.5, 0.16],
];
const CROSS: [number, number][] = [[0.0, 0.56], [0.14, 0.585], [0.3, 0.575]];
const SWASH: [number, number][] = [[-0.12, -0.2], [0.3, -0.25], [0.8, -0.21], [1.2, -0.26], [1.52, -0.19]];

const WRITE = { x: 0.44, z: 0.34, scale: 0.72 };

/** Height of the (curved) page surface at world x, for either page. */
function pageSurfaceY(x: number) {
  const side = x >= 0 ? 1 : -1;
  const local = x - side * (PAGE.w / 2 + SPINE_GAP / 2);
  const u = clamp01((side === 1 ? local + PAGE.w / 2 : PAGE.w / 2 - local) / PAGE.w);
  return PAGE_TOP - Math.pow(1 - u, 3) * 0.1 + Math.sin(u * Math.PI) * 0.02 - Math.pow(u, 6) * 0.03;
}

/** 2D points (x right, y up) laid onto the page surface. */
function onPage(points: [number, number][], at: { x: number; z: number; scale: number }, lift = 0.005) {
  return new THREE.CatmullRomCurve3(
    points.map(([px, py]) => {
      const x = at.x + px * at.scale;
      return new THREE.Vector3(x, pageSurfaceY(x) + lift, at.z - py * at.scale);
    }),
    false,
    "catmullrom",
    0.5
  );
}

/** Where the pencil tip is when `write` of the word is done (0–1). */
function writingPoint(curves: THREE.CatmullRomCurve3[], lengths: number[], write: number) {
  const total = lengths.reduce((a, b) => a + b, 0);
  let d = clamp01(write) * total;
  for (let i = 0; i < curves.length; i++) {
    if (d <= lengths[i] || i === curves.length - 1) return curves[i].getPointAt(clamp01(d / lengths[i]));
    d -= lengths[i];
  }
  return curves[0].getPointAt(0);
}

/** An ink stroke that draws itself on: `progress` 0–1 of the tube is visible. */
function Stroke({ curve, radius, color, progress }: { curve: THREE.Curve<THREE.Vector3>; radius: number; color: string; progress: number }) {
  const geometry = useDisposable(() => new THREE.TubeGeometry(curve, 520, radius, 6, false), [curve, radius]);
  useLayoutEffect(() => {
    const count = geometry.index!.count;
    // TubeGeometry indexes segment by segment, so a prefix of the index buffer is a prefix of the path.
    geometry.setDrawRange(0, Math.floor((clamp01(progress) * count) / 6) * 6);
  }, [geometry, progress]);
  return (
    <mesh geometry={geometry} visible={progress > 0.001}>
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

// ─── Notebook ─────────────────────────────────────────────────────────────────

/** A page block whose top surface curves down into the gutter, like a real open book. */
function pageBlockGeometry(side: 1 | -1) {
  const g = new THREE.BoxGeometry(PAGE.w, PAGE.h, PAGE.d, 48, 1, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // u: 0 at the spine, 1 at the outer edge
    const u = (side === 1 ? x + PAGE.w / 2 : PAGE.w / 2 - x) / PAGE.w;
    if (y > 0) {
      // dips into the spine, rises, then rolls off the edge — same curve as pageSurfaceY
      const gutter = Math.pow(1 - u, 3) * 0.1;
      const bulge = Math.sin(u * Math.PI) * 0.02 - Math.pow(u, 6) * 0.03;
      pos.setY(i, y - gutter + bulge);
    }
  }
  g.computeVertexNormals();
  return g;
}

function ruledPage(side: 1 | -1, font: string, ready: boolean) {
  return canvasTexture(810, 1070, (ctx, w, h) => {
    ctx.fillStyle = TALA.page;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(95,125,170,0.28)";
    ctx.lineWidth = 2;
    for (let y = 150; y < h - 40; y += 46) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // margin line on the outer side
    ctx.strokeStyle = "rgba(232,120,110,0.5)";
    const mx = side === 1 ? 110 : w - 110;
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, h);
    ctx.stroke();
    if (ready) {
      ctx.fillStyle = "rgba(23,23,23,0.45)";
      ctx.font = canvasFont(500, 26, font);
      ctx.textAlign = side === 1 ? "right" : "left";
      ctx.fillText(side === 1 ? "pagtatala — 28.09" : "sun by day", side === 1 ? w - 40 : 40, 80);
    }
  });
}

function edgeTexture() {
  return canvasTexture(64, 256, (ctx, w, h) => {
    ctx.fillStyle = "#efe9da";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(160,150,125,0.5)";
    for (let y = 2; y < h; y += 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
}

function PageBlock({ side, font, ready, edge }: { side: 1 | -1; font: string; ready: boolean; edge: THREE.Texture }) {
  const geometry = useDisposable(() => pageBlockGeometry(side), [side]);
  const top = useDisposable(() => ruledPage(side, font, ready), [side, font, ready]);
  const x = side * (PAGE.w / 2 + SPINE_GAP / 2);
  // BoxGeometry material order: +x, -x, +y, -y, +z, -z
  return (
    <mesh geometry={geometry} position={[x, 0.05 + PAGE.h / 2, 0]}>
      <meshStandardMaterial attach="material-0" map={edge} roughness={0.9} />
      <meshStandardMaterial attach="material-1" map={edge} roughness={0.9} />
      <meshStandardMaterial attach="material-2" map={top} roughness={0.85} />
      <meshStandardMaterial attach="material-3" color={TALA.page} roughness={0.9} />
      <meshStandardMaterial attach="material-4" map={edge} roughness={0.9} />
      <meshStandardMaterial attach="material-5" map={edge} roughness={0.9} />
    </mesh>
  );
}

function Binding() {
  const ring = useDisposable(() => new THREE.TorusGeometry(0.1, 0.014, 10, 40, Math.PI * 1.55), []);
  const zs = useMemo(() => Array.from({ length: 11 }, (_, i) => -PAGE.d / 2 + 0.16 + i * ((PAGE.d - 0.32) / 10)), []);
  return (
    <group position={[0, PAGE_TOP - 0.05, 0]}>
      {zs.map((z) => (
        <mesh key={z} geometry={ring} position={[0, 0, z]} rotation={[0, 0, -Math.PI * 0.275]}>
          <meshPhysicalMaterial color="#cfccc4" roughness={0.25} metalness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Bookmark() {
  const geometry = useDisposable(() => {
    const on = (x: number, z: number, dy = 0.006) => new THREE.Vector3(x, pageSurfaceY(x) + dy, z);
    const curve = new THREE.CatmullRomCurve3([
      on(0.07, -PAGE.d / 2 + 0.02, -0.02),
      on(0.11, -PAGE.d / 2 + 0.5),
      on(0.13, 0.2),
      on(0.15, PAGE.d / 2 - 0.05),
      new THREE.Vector3(0.16, PAGE_TOP - 0.1, PAGE.d / 2 + 0.06),
      new THREE.Vector3(0.17, -0.02, PAGE.d / 2 + 0.2),
    ]);
    return ribbonGeometry(curve, 0.07, 160, new THREE.Vector3(1, 0, 0.12));
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#d9573b" roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Pencil ───────────────────────────────────────────────────────────────────

function Pencil({ tip, lift, roll }: { tip: THREE.Vector3; lift: number; roll: number }) {
  // Built along +Y with the graphite point at the origin, then leaned toward the writer.
  const L = 1.35;
  return (
    <group position={[tip.x, tip.y + lift, tip.z]} rotation={[0.62, 0.35 + roll * 0.02, -0.42]}>
      <mesh position={[0, 0.015, 0]}>
        <coneGeometry args={[0.016, 0.03, 6]} />
        <meshStandardMaterial color="#2b2b2e" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.052, 0.13, 6, 1, true]} />
        <meshStandardMaterial color={TALA.wood} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.155 + L / 2, 0]} rotation={[0, roll, 0]}>
        <cylinderGeometry args={[0.052, 0.052, L, 6]} />
        <meshPhysicalMaterial color={TALA.gold} roughness={0.35} clearcoat={0.8} clearcoatRoughness={0.2} flatShading />
      </mesh>
      {/* ferrule with crimped rings */}
      <group position={[0, 0.155 + L + 0.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.1, 24]} />
          <meshPhysicalMaterial color="#d8d6cf" roughness={0.22} metalness={0.95} />
        </mesh>
        {[-0.03, 0, 0.03].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.056, 0.005, 6, 24]} />
            <meshPhysicalMaterial color="#b9b7b0" roughness={0.25} metalness={0.95} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.155 + L + 0.14, 0]}>
        <cylinderGeometry args={[0.05, 0.052, 0.09, 24]} />
        <meshStandardMaterial color={TALA.eraser} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Sun, moon and stars ──────────────────────────────────────────────────────

/** Crescent = a disc minus an offset disc, traced as one outline (outer arc, then inner arc back). */
export function crescentGeometry() {
  const R = 0.34;
  const c = new THREE.Vector2(0.15, 0.1);
  const r = 0.29;
  const d = c.length();
  const a = (R * R - r * r + d * d) / (2 * d);
  const h = Math.sqrt(R * R - a * a);
  const dir = c.clone().divideScalar(d);
  const base = dir.clone().multiplyScalar(a);
  const perp = new THREE.Vector2(-dir.y, dir.x).multiplyScalar(h);
  const p1 = base.clone().add(perp);
  const p2 = base.clone().sub(perp);
  const t1 = Math.atan2(p1.y, p1.x);
  let t2 = Math.atan2(p2.y, p2.x);
  if (t2 < t1) t2 += Math.PI * 2;
  const b1 = Math.atan2(p1.y - c.y, p1.x - c.x);
  let b2 = Math.atan2(p2.y - c.y, p2.x - c.x);
  if (b2 < b1) b2 += Math.PI * 2;
  const s = new THREE.Shape();
  s.moveTo(p1.x, p1.y);
  s.absarc(0, 0, R, t1, t2, false); // the lit rim, away from the bite
  s.absarc(c.x, c.y, r, b2, b1, true); // the bite's edge (the side facing the centre), back to p1
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.04, bevelSegments: 5, curveSegments: 64 });
  g.center();
  return g;
}

function StickyNote({ font, ready }: { font: string; ready: boolean }) {
  const map = useDisposable(
    () =>
      canvasTexture(300, 300, (ctx, w, h) => {
        ctx.fillStyle = "#F6E3A1";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, w, 34);
        ctx.strokeStyle = "#3a3222";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        [96, 162, 228].forEach((y, i) => {
          ctx.strokeRect(34, y - 26, 30, 30);
          if (i < 2) {
            ctx.beginPath();
            ctx.moveTo(39, y - 12);
            ctx.lineTo(48, y - 2);
            ctx.lineTo(62, y - 30);
            ctx.stroke();
          }
        });
        if (!ready) return;
        ctx.fillStyle = "#3a3222";
        ctx.font = canvasFont(700, 30, font);
        ["zone A", "v1.1.0", "sleep"].forEach((t, i) => ctx.fillText(t, 86, 92 + i * 66));
      }),
    [font, ready]
  );
  const x = -1.25;
  return (
    <group position={[x, pageSurfaceY(x) + 0.012, -0.55]} rotation={[0, 0.2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={map} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** A sun whose rays are uneven on purpose, like Tala's hand-drawn mark. */
function Sun({ scale, spin }: { scale: number; spin: number }) {
  const rays = useMemo(() => [0.2, 0.26, 0.19, 0.24, 0.21, 0.27, 0.18, 0.25], []);
  return (
    <group scale={scale} rotation={[0, 0, spin]}>
      <mesh>
        <sphereGeometry args={[0.3, 48, 32]} />
        <meshPhysicalMaterial color={TALA.gold} emissive={TALA.gold} emissiveIntensity={0.35} roughness={0.35} clearcoat={0.6} />
      </mesh>
      {rays.map((len, i) => {
        const a = (i / rays.length) * Math.PI * 2 + (i % 2 ? 0.06 : -0.04);
        const r = 0.42 + len / 2;
        return (
          <mesh key={i} position={[Math.cos(a) * r, Math.sin(a) * r, 0]} rotation={[0, 0, a - Math.PI / 2]}>
            <capsuleGeometry args={[0.035, len, 6, 12]} />
            <meshPhysicalMaterial color={TALA.gold} emissive={TALA.gold} emissiveIntensity={0.3} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

const STARS: { p: [number, number, number]; r: number; color: string; phase: number }[] = [
  { p: [-1.75, 1.35, -0.5], r: 0.2, color: SITE.accent, phase: 0 },
  { p: [0.55, 1.75, -0.95], r: 0.13, color: TALA.gold, phase: 1.7 },
  { p: [2.05, 0.95, 0.65], r: 0.11, color: TALA.chalk, phase: 3.1 },
  { p: [-0.6, 1.95, 0.35], r: 0.08, color: TALA.gold, phase: 4.4 },
];

export interface TalaNotebookProps {
  font: string;
  ready: boolean;
  /** 0–1: how much of "tala" the pencil has written. */
  write?: number;
}

/** The open notebook, the pencil and the word it writes — the desk below, and 02 in the hero room. */
export function TalaNotebook({ font, ready, write = 1 }: TalaNotebookProps) {
  const edge = useDisposable(edgeTexture, []);
  const cover = useDisposable(() => new RoundedBoxGeometry(PAGE.w + 0.1, 0.05, PAGE.d + 0.1, 3, 0.02), []);

  const curves = useMemo(() => {
    const doodle = { x: -PAGE.w / 2 - SPINE_GAP / 2 + 0.05, z: 0.3, scale: 1 };
    const ring = Array.from({ length: 26 }, (_, i) => {
      // overshoots its start, like a pen that didn't lift in time
      const a = (i / 24) * Math.PI * 2 + 0.3;
      const r = 0.24 + Math.sin(i * 1.7) * 0.01;
      return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
    });
    const rays = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 + (i % 2 ? 0.08 : -0.05);
      const r0 = 0.32;
      const r1 = 0.43 + (i % 3) * 0.035;
      return onPage(
        [
          [Math.cos(a) * r0, Math.sin(a) * r0],
          [Math.cos(a) * (r0 + r1) * 0.5, Math.sin(a) * (r0 + r1) * 0.5],
          [Math.cos(a) * r1, Math.sin(a) * r1],
        ],
        doodle
      );
    });
    return {
      word: onPage(WORD, WRITE),
      cross: onPage(CROSS, WRITE),
      swash: onPage(SWASH, WRITE),
      sunRing: onPage(ring, doodle),
      rays,
    };
  }, []);
  const lengths = useMemo(() => [curves.word.getLength(), curves.cross.getLength()], [curves]);

  // Write the word, then cross the t, then the swash underline.
  const w = clamp01(write);
  const wordP = clamp01(w / 0.78);
  const crossP = clamp01((w - 0.78) / 0.08);
  const swashP = clamp01((w - 0.86) / 0.14);
  const tip =
    w < 0.78
      ? writingPoint([curves.word], [lengths[0]], wordP)
      : w < 0.86
        ? writingPoint([curves.cross], [lengths[1]], crossP)
        : curves.swash.getPointAt(swashP);
  const lift = w <= 0.001 || w >= 0.999 ? 0.28 : 0.02 + Math.abs(Math.sin(w * 60)) * 0.006;
  const inkColor = TALA.ink;

  return (
    <group>
      {/* covers */}
      {[1, -1].map((side) => (
        <mesh key={side} geometry={cover} position={[side * (PAGE.w / 2 + SPINE_GAP / 2), 0.025, 0]}>
          <meshPhysicalMaterial color={TALA.gold} roughness={0.55} clearcoat={0.3} sheen={0.4} />
        </mesh>
      ))}
      <PageBlock side={-1} font={font} ready={ready} edge={edge} />
      <PageBlock side={1} font={font} ready={ready} edge={edge} />
      <Binding />
      <Bookmark />

      {/* ink */}
      <Stroke curve={curves.word} radius={0.014} color={inkColor} progress={wordP} />
      <Stroke curve={curves.cross} radius={0.014} color={inkColor} progress={crossP} />
      <Stroke curve={curves.swash} radius={0.011} color={TALA.goldDeep} progress={swashP} />
      <Stroke curve={curves.sunRing} radius={0.012} color={TALA.goldDeep} progress={1} />
      {curves.rays.map((ray, i) => (
        <Stroke key={i} curve={ray} radius={0.012} color={TALA.goldDeep} progress={1} />
      ))}
      <Pencil tip={tip} lift={lift} roll={w * 4} />

      <StickyNote font={font} ready={ready} />
    </group>
  );
}

// ─── The desk ─────────────────────────────────────────────────────────────────

export interface TalaDeskProps extends TalaNotebookProps {
  /** 0–1: sun (day) to moon (night). */
  night?: number;
  /** Seconds, for the floating stars. */
  time?: number;
}

export function TalaDesk({ font, ready, write = 1, night = 0, time = 0 }: TalaDeskProps) {
  const star = useDisposable(() => sparkleGeometry(1, 0.2), []);
  const moon = useDisposable(crescentGeometry, []);
  const n = easeInOut(clamp01(night));

  return (
    <group>
      <SoftShadow width={5.2} depth={3.6} y={-0.001} opacity={0.8} />
      <TalaNotebook font={font} ready={ready} write={write} />

      {/* sun ↔ moon, turning over like a coin */}
      <group position={[0.95, 1.35, -0.7]} rotation={[0, n * Math.PI, 0]} scale={0.78}>
        <group visible={n < 0.5}>
          <Sun scale={lerp(1, 0.6, n * 2)} spin={time * 0.25} />
        </group>
        <group visible={n >= 0.5} rotation={[0, Math.PI, 0]}>
          <mesh geometry={moon} scale={lerp(0.6, 1.25, (n - 0.5) * 2)} rotation={[0, 0, 0.5]}>
            <meshPhysicalMaterial color={TALA.chalk} emissive="#fff6de" emissiveIntensity={0.25} roughness={0.45} clearcoat={0.5} />
          </mesh>
        </group>
      </group>

      {STARS.map((s, i) => {
        const bob = Math.sin(time * 1.1 + s.phase) * 0.06;
        const twinkle = 1 + (night > 0.5 ? Math.sin(time * 3 + s.phase) * 0.12 : 0);
        return (
          <mesh
            key={i}
            geometry={star}
            position={[s.p[0], s.p[1] + bob, s.p[2]]}
            rotation={[0.25, Math.sin(time * 0.6 + s.phase) * 0.45, Math.sin(time * 0.4 + s.phase) * 0.2]}
            scale={s.r * twinkle * easeOutBack(clamp01(0.4 + n * 0.6 + (i === 0 ? 0.6 : 0)))}
          >
            <meshPhysicalMaterial color={s.color} emissive={s.color} emissiveIntensity={0.2 + n * 0.5} roughness={0.35} clearcoat={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}
