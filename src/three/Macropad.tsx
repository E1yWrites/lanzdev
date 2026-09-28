import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { canvasFont, canvasTexture, taperedCap, useDisposable } from "./lib";
import { SITE, TALA } from "./palette";
import { PAD_KEYS, type Finish, type PadKey } from "./padKeys";
import { SoftShadow } from "./Studio";

// The hero object: a four-key macropad that is also the site's index. Each key is a
// destination; the OLED shows what's under your finger; the knob follows the scroll.

export { PAD_KEYS, type Finish, type PadKey } from "./padKeys";

const PITCH = 1.1;
const KEY_H = 0.5;
const CASE = { w: 4.7, h: 0.5, d: 2.9 };
const TOP = CASE.h / 2;
const KEY_POS: [number, number][] = [
  [-1.62, -0.56],
  [-1.62 + PITCH, -0.56],
  [-1.62, 0.56],
  [-1.62 + PITCH, 0.56],
];
const SCREEN = { x: 1.2, z: -0.56, w: 1.72, d: 0.84 };
const KNOB = { x: 1.2, z: 0.6, r: 0.36, h: 0.4 };

const FINISH: Record<Finish, { color: string; roughness: number; clearcoat: number; ink: string }> = {
  accent: { color: SITE.accent, roughness: 0.38, clearcoat: 0.5, ink: "#1a0d08" },
  solar: { color: TALA.gold, roughness: 0.42, clearcoat: 0.4, ink: "#2a220e" },
  white: { color: "#ecebe6", roughness: 0.6, clearcoat: 0.1, ink: "#2a2a2c" },
  grey: { color: "#9f9e99", roughness: 0.55, clearcoat: 0.1, ink: "#161616" },
};

export interface MacropadProps {
  /** CSS font-family list (site) or a FontFace name (art) for legends and the screen. */
  font: string;
  /** Legends are drawn once the font has loaded. */
  ready: boolean;
  /** 0–1 per key: how far it's pressed. */
  press?: number[];
  /** 0–1 per key: underglow. */
  glow?: number[];
  /** Knob angle, radians. */
  knob?: number;
  screen?: { title: string; sub: string; meter?: number };
  onKey?: (index: number, type: "over" | "out" | "click", event: ThreeEvent<PointerEvent | MouseEvent>) => void;
}

function Legend({ w, d, index, label, ink, font, ready }: { w: number; d: number; index: string; label: string; ink: string; font: string; ready: boolean }) {
  const map = useDisposable(
    () =>
      canvasTexture(512 * w, 512 * d, (ctx, cw, ch) => {
        if (!ready) return;
        ctx.fillStyle = ink;
        ctx.font = canvasFont(500, 50, font);
        ctx.fillText(index, 44, 92);
        ctx.font = canvasFont(700, label.length > 5 ? 60 : 68, font);
        ctx.fillText(label, 44, ch - 48);
      }),
    [w, d, index, label, ink, font, ready]
  );
  return (
    <mesh position={[0, KEY_H / 2 + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w * 0.82, d * 0.82]} />
      <meshStandardMaterial map={map} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

function Key({
  k,
  i,
  press,
  glow,
  font,
  ready,
  cap,
  glowMap,
  onKey,
}: {
  k: PadKey;
  i: number;
  press: number;
  glow: number;
  font: string;
  ready: boolean;
  cap: THREE.BufferGeometry;
  glowMap: THREE.Texture;
  onKey?: MacropadProps["onKey"];
}) {
  const f = FINISH[k.finish];
  const [x, z] = KEY_POS[i];
  const handlers = onKey
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onKey(i, "over", e)),
        onPointerOut: (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), onKey(i, "out", e)),
        onClick: (e: ThreeEvent<MouseEvent>) => (e.stopPropagation(), onKey(i, "click", e)),
      }
    : {};
  return (
    <group position={[x, TOP + 0.02, z]}>
      {/* switch housing, visible in the gap as the cap goes down */}
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.62, 0.14, 0.62]} />
        <meshStandardMaterial color="#1c1c1f" roughness={0.5} />
      </mesh>
      {/* underglow: a soft additive halo, lifted clear of the plate (sharing its plane made it flicker) */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={glow > 0.01} renderOrder={1}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial
          map={glowMap}
          color={f.color}
          transparent
          opacity={glow * 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-4}
        />
      </mesh>
      {/* Pointer target: fixed at the key's resting size, so the cap dipping under the
          pointer can't flip hover off and on (that was the flicker). Never drawn. */}
      <mesh position={[0, KEY_H / 2 + 0.12, 0]} {...handlers}>
        <boxGeometry args={[1.02, KEY_H + 0.04, 1.02]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      <group position={[0, KEY_H / 2 + 0.12 - press * 0.13, 0]}>
        <mesh geometry={cap}>
          <meshPhysicalMaterial
            color={f.color}
            roughness={f.roughness}
            clearcoat={f.clearcoat}
            clearcoatRoughness={0.3}
            emissive={f.color}
            emissiveIntensity={glow * 0.18}
          />
        </mesh>
        <Legend w={1} d={1} index={k.index} label={k.label} ink={f.ink} font={font} ready={ready} />
      </group>
    </group>
  );
}

const METER_SEGMENTS = 16;

function Screen({ title, sub, meter, font, ready }: { title: string; sub: string; meter?: number; font: string; ready: boolean }) {
  // Quantised so a moving meter only redraws when a segment changes.
  const lit = Math.round(Math.min(1, Math.max(0, meter ?? 0)) * METER_SEGMENTS);
  const map = useDisposable(
    () =>
      canvasTexture(640, 312, (ctx, w, h) => {
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);
        if (!ready) return;
        const glowColor = "#FF7A45";
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 14;
        ctx.font = canvasFont(700, 58, font);
        ctx.fillText(title, 34, 112);
        ctx.shadowBlur = 6;
        ctx.font = canvasFont(500, 27, font);
        ctx.fillText(sub, 36, 170);
        // Segmented meter
        for (let s = 0; s < METER_SEGMENTS; s++) {
          ctx.globalAlpha = s < lit ? 1 : 0.18;
          ctx.fillRect(36 + s * 35, 214, 26, 34);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        // Scanlines
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1.5);
      }),
    [title, sub, lit, font, ready]
  );
  return (
    <group position={[SCREEN.x, TOP, SCREEN.z]}>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[SCREEN.w + 0.12, 0.05, SCREEN.d + 0.12]} />
        <meshPhysicalMaterial color="#0d0d0f" roughness={0.3} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[SCREEN.w, SCREEN.d]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Knurled knob: one open cylinder whose side is pushed out in 44 ridges. */
function knurledGeometry() {
  const g = new THREE.CylinderGeometry(KNOB.r, KNOB.r * 1.02, KNOB.h, 176, 1, true);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const a = Math.atan2(z, x);
    const k = 1 + 0.045 * Math.pow(Math.abs(Math.sin(a * 22)), 0.6);
    pos.setX(i, x * k);
    pos.setZ(i, z * k);
  }
  g.computeVertexNormals();
  return g;
}

function Knob({ angle }: { angle: number }) {
  const knurl = useDisposable(knurledGeometry, []);
  return (
    <group position={[KNOB.x, TOP, KNOB.z]}>
      {/* collar */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[KNOB.r + 0.08, 0.03, 12, 64]} />
        <meshPhysicalMaterial color="#1a1a1c" roughness={0.35} metalness={0.4} />
      </mesh>
      <group rotation={[0, angle, 0]} position={[0, KNOB.h / 2 + 0.04, 0]}>
        <mesh geometry={knurl}>
          <meshPhysicalMaterial color="#2c2c30" roughness={0.3} metalness={0.85} clearcoat={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* rim, dished top, indicator */}
        <mesh position={[0, KNOB.h / 2, 0]}>
          <cylinderGeometry args={[KNOB.r * 1.01, KNOB.r * 1.01, 0.03, 64]} />
          <meshPhysicalMaterial color="#3a3a3f" roughness={0.25} metalness={0.9} />
        </mesh>
        <mesh position={[0, KNOB.h / 2 + 0.018, 0]}>
          <cylinderGeometry args={[KNOB.r * 0.86, KNOB.r * 0.9, 0.012, 64]} />
          <meshPhysicalMaterial color="#d8d7d3" roughness={0.22} metalness={0.9} />
        </mesh>
        <mesh position={[0, KNOB.h / 2 + 0.03, -KNOB.r * 0.55]}>
          <boxGeometry args={[0.05, 0.016, KNOB.r * 0.5]} />
          <meshBasicMaterial color={SITE.accent} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Coiled cable from the back — a helix between two sweeps, as one tube. */
function Cable() {
  const geometry = useDisposable(() => {
    const pts: THREE.Vector3[] = [];
    const start = new THREE.Vector3(SCREEN.x, 0, -CASE.d / 2 - 0.35);
    pts.push(start.clone().add(new THREE.Vector3(0, 0, 0.1)), start.clone());
    const turns = 7;
    const coilLen = 1.5;
    for (let i = 0; i <= turns * 16; i++) {
      const t = i / (turns * 16);
      const a = t * turns * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          SCREEN.x + Math.sin(a) * 0.13 - t * 0.2,
          Math.cos(a) * 0.13 - 0.13 - t * 0.25,
          start.z - 0.12 - t * coilLen
        )
      );
    }
    const end = pts[pts.length - 1];
    // then a lazy S-curve away behind the pad
    pts.push(
      end.clone().add(new THREE.Vector3(-0.25, -0.1, -0.45)),
      end.clone().add(new THREE.Vector3(-0.9, -0.22, -0.8)),
      end.clone().add(new THREE.Vector3(-1.9, -0.3, -0.75)),
      end.clone().add(new THREE.Vector3(-3.1, -0.36, -1.2)),
      end.clone().add(new THREE.Vector3(-4.2, -0.4, -2.2))
    );
    const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
    return new THREE.TubeGeometry(curve, 900, 0.034, 10, false);
  }, []);
  return (
    <group>
      {/* aviator plug */}
      <mesh position={[SCREEN.x, 0, -CASE.d / 2 - 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.24, 32]} />
        <meshPhysicalMaterial color="#c9c8c4" roughness={0.22} metalness={0.95} />
      </mesh>
      <mesh position={[SCREEN.x, 0, -CASE.d / 2 - 0.29]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.085, 0.12, 32]} />
        <meshPhysicalMaterial color="#1c1c1e" roughness={0.5} />
      </mesh>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color={SITE.accent} roughness={0.45} clearcoat={0.3} />
      </mesh>
    </group>
  );
}

function Screw({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, TOP, z]}>
      <mesh>
        <cylinderGeometry args={[0.065, 0.065, 0.03, 24]} />
        <meshPhysicalMaterial color="#e3e2de" roughness={0.25} metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.016, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.09, 0.01, 0.018]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.016, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[0.09, 0.01, 0.018]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </group>
  );
}

function Engraving({ font, ready }: { font: string; ready: boolean }) {
  const map = useDisposable(
    () =>
      canvasTexture(2048, 110, (ctx, w, h) => {
        if (!ready) return;
        ctx.fillStyle = "rgba(40,40,44,0.9)";
        ctx.font = canvasFont(500, 44, font);
        ctx.textBaseline = "middle";
        ctx.fillText("LORENZ.DEV", 40, h / 2);
        ctx.textAlign = "right";
        ctx.fillText("MK.II — BATANGAS, PH — 13.7565° N", w - 40, h / 2);
      }),
    [font, ready]
  );
  return (
    <mesh position={[0, 0, CASE.d / 2 + 0.002]}>
      <planeGeometry args={[CASE.w - 0.5, (CASE.w - 0.5) * (110 / 2048)]} />
      <meshBasicMaterial map={map} transparent toneMapped={false} />
    </mesh>
  );
}

export function Macropad({ font, ready, press = [], glow = [], knob = 0, screen, onKey }: MacropadProps) {
  const body = useDisposable(() => new RoundedBoxGeometry(CASE.w, CASE.h, CASE.d, 8, 0.16), []);
  const plate = useDisposable(() => new RoundedBoxGeometry(2.3, 0.05, 2.3, 4, 0.06), []);
  const cap = useDisposable(() => taperedCap(1, 1, KEY_H), []);
  const glowMap = useDisposable(
    () =>
      canvasTexture(128, 128, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w / 2, h / 2, w * 0.18, w / 2, h / 2, w / 2);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(0.55, "rgba(255,255,255,0.35)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }),
    []
  );
  const s = screen ?? { title: "LORENZ.DEV", sub: "HOVER A KEY ·  CLICK TO OPEN", meter: 0.25 };

  return (
    <group>
      <SoftShadow width={CASE.w * 1.9} depth={CASE.d * 2.1} y={-CASE.h / 2 - 0.02} opacity={0.9} />
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#d3d2cf" metalness={0.6} roughness={0.3} clearcoat={0.35} clearcoatRoughness={0.25} />
      </mesh>
      <mesh geometry={plate} position={[-1.07, TOP, 0]}>
        <meshStandardMaterial color="#141416" roughness={0.6} />
      </mesh>
      {PAD_KEYS.map((k, i) => (
        <Key key={k.id} k={k} i={i} press={press[i] ?? 0} glow={glow[i] ?? 0} font={font} ready={ready} cap={cap} glowMap={glowMap} onKey={onKey} />
      ))}
      <Screen title={s.title} sub={s.sub} meter={s.meter} font={font} ready={ready} />
      <Knob angle={knob} />
      {[-1, 1].map((sx) => [-1, 1].map((sz) => <Screw key={`${sx}${sz}`} x={sx * (CASE.w / 2 - 0.2)} z={sz * (CASE.d / 2 - 0.2)} />))}
      <Engraving font={font} ready={ready} />
      <Cable />
    </group>
  );
}
