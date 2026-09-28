"use client";

// The live WebGL scenes. Loaded on demand by ModelStage (this module pulls in three.js),
// so nothing here reaches the first paint. Models are pure functions of their props
// (src/three) — the rigs below turn pointer, hover and time into those props.

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { Macropad, PAD_KEYS } from "@/three/Macropad";
import { ParadaLot } from "@/three/ParadaLot";
import { TalaDesk } from "@/three/TalaDesk";
import { StudioLights } from "@/three/Studio";
import { clamp01, easeInOut, range } from "@/three/lib";
import { MACROPAD_YAW, VIEWS, type View } from "@/three/views";
import { cursorLabel, heroKey, heroPointer, useStore } from "./store";

/** Drag state written by the DOM wrapper, read every frame by the rig (no re-renders). */
export interface DragState {
  yaw: number;
  velocity: number;
  dragging: boolean;
}

export interface SceneProps {
  /** Render frames only while on screen. */
  active: boolean;
  font: string;
  fontReady: boolean;
  onReady?: () => void;
  /** Touch devices: play the story when on screen instead of on hover. */
  autoplay?: boolean;
  hovered?: boolean;
  drag?: MutableRefObject<DragState>;
  /** Tala: day/night toggle. */
  night?: boolean;
  onNavigate?: (href: string) => void;
}

// ─── Shared bits ──────────────────────────────────────────────────────────────

/** Posters are 4:3. On a narrower stage, widen the vertical fov so the width still fits —
 *  the same framing object-contain gives the poster, so the swap doesn't jump. */
const POSTER_ASPECT = 4 / 3;

function Aim({ view }: { view: View }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const fov =
      aspect >= POSTER_ASPECT
        ? view.fov
        : THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(THREE.MathUtils.degToRad(view.fov) / 2) * POSTER_ASPECT) / aspect));
    camera.position.set(...view.position);
    camera.fov = fov;
    camera.lookAt(...view.target);
    camera.updateProjectionMatrix();
  }, [camera, view, size.width, size.height]);
  return null;
}

function FirstFrame({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    // One more frame so the swap from poster to canvas never shows an empty canvas.
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}

function Shell({ view, active, onReady, children }: { view: View; active: boolean; onReady?: () => void; children: React.ReactNode }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: view.position, fov: view.fov, near: 0.1, far: 100 }}
      style={{ touchAction: "pan-y" }}
    >
      <Aim view={view} />
      <StudioLights />
      {children}
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}

/** Values that ease toward their targets; re-renders only while something is still moving. */
function useDamped(targets: number[], lambda = 10) {
  const current = useRef(targets.slice());
  const target = useRef(targets);
  target.current = targets;
  const [, setTick] = useState(0);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    let changed = false;
    const c = current.current;
    for (let i = 0; i < c.length; i++) {
      const t = target.current[i] ?? 0;
      if (c[i] === t) continue;
      const next = THREE.MathUtils.damp(c[i], t, lambda, dt);
      c[i] = Math.abs(next - t) < 1e-3 ? t : next;
      changed = true;
    }
    if (changed) setTick((n) => (n + 1) % 1e6);
  });
  return current.current;
}

/** Re-render every frame and hand back elapsed seconds — for models with idle motion. */
function useClock(enabled = true) {
  const [time, setTime] = useState(0);
  useFrame((state) => {
    if (enabled) setTime(state.clock.elapsedTime);
  });
  return time;
}

/** Applies the drag yaw (with inertia) and a gentle idle sway to a group. */
function useTurntable(group: MutableRefObject<THREE.Group | null>, drag: MutableRefObject<DragState> | undefined, baseYaw = 0) {
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const d = drag?.current;
    if (d && !d.dragging) {
      d.yaw += d.velocity;
      d.velocity *= Math.pow(0.9, delta * 60);
      // drift back toward the resting angle
      d.yaw = THREE.MathUtils.damp(d.yaw, 0, 0.6, delta);
    }
    const sway = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    g.rotation.y = baseYaw + (d?.yaw ?? 0) + sway;
  });
}

// ─── Hero: the macropad ───────────────────────────────────────────────────────

const IDLE_SCREENS: [string, string][] = [
  ["LORENZ.DEV", "HOVER A KEY · CLICK TO OPEN"],
  ["PARADA · TALA", "TWO PROJECTS · FOUR KEYS"],
  ["BATANGAS, PH", "13.7565° N · 121.0583° E"],
  ["STATUS", "OPEN TO AN INTERNSHIP"],
];

function MacropadRig({ font, fontReady, onNavigate }: Pick<SceneProps, "font" | "fontReady" | "onNavigate">) {
  const group = useRef<THREE.Group>(null);
  const hovered = useStore(heroKey);
  const [pressed, setPressed] = useState(-1);
  const [idle, setIdle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdle((i) => (i + 1) % IDLE_SCREENS.length), 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => cursorLabel.set(null), []);

  const press = PAD_KEYS.map((_, i) => (pressed === i ? 1 : hovered === i ? 0.32 : 0));
  const glow = PAD_KEYS.map((_, i) => (hovered === i || pressed === i ? 1 : 0));
  const meter = hovered >= 0 ? (hovered + 1) / PAD_KEYS.length : 0.25;
  const damped = useDamped([...press, ...glow, meter], 14);

  // Pointer tilt, float and scroll — straight onto the group, no React work.
  const knob = useRef(0);
  const [knobAngle, setKnobAngle] = useState(0);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = heroPointer.scroll;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, MACROPAD_YAW + heroPointer.x * 0.32 + Math.sin(t * 0.4) * 0.04, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, heroPointer.y * 0.14 + s * 0.55, 4, delta);
    g.position.y = Math.sin(t * 0.9) * 0.06 - s * 1.4;
    // The knob follows the page: a quarter turn per screen of scrolling.
    const want = (window.scrollY / window.innerHeight) * (Math.PI / 2) + 0.6;
    knob.current = THREE.MathUtils.damp(knob.current, want, 8, delta);
    if (Math.abs(knob.current - knobAngle) > 0.004) setKnobAngle(knob.current);
  });

  const onKey = (i: number, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const key = PAD_KEYS[i];
    if (type === "over") {
      heroKey.set(i);
      cursorLabel.set(`Open ${key.label}`);
      document.body.style.cursor = "pointer";
    } else if (type === "out") {
      if (heroKey.get() === i) heroKey.set(-1);
      cursorLabel.set(null);
      document.body.style.cursor = "";
    } else {
      e.stopPropagation();
      setPressed(i);
      document.body.style.cursor = "";
      cursorLabel.set(null);
      window.setTimeout(() => {
        setPressed(-1);
        onNavigate?.(key.href);
      }, 170);
    }
  };

  // Initial pose only — after that the frame loop owns the transform (a rotation prop
  // would be re-applied on every re-render and fight the damping).
  useLayoutEffect(() => {
    group.current?.rotation.set(0, MACROPAD_YAW, 0);
  }, []);

  const screen = hovered >= 0 ? PAD_KEYS[hovered].screen : IDLE_SCREENS[idle];
  const n = PAD_KEYS.length;
  return (
    <group ref={group}>
      <Macropad
        font={font}
        ready={fontReady}
        press={damped.slice(0, n)}
        glow={damped.slice(n, n * 2)}
        knob={knobAngle}
        screen={{ title: screen[0], sub: screen[1], meter: damped[n * 2] }}
        onKey={onKey}
      />
    </group>
  );
}

export function MacropadScene({ active, font, fontReady, onReady, onNavigate }: SceneProps) {
  return (
    <Shell view={VIEWS.macropad} active={active} onReady={onReady}>
      <MacropadRig font={font} fontReady={fontReady} onNavigate={onNavigate} />
    </Shell>
  );
}

// ─── PARADA: the lot ──────────────────────────────────────────────────────────

// One loop, starting and ending at the poster's pose: a car waiting at the gate,
// its plate being read. Seconds.
const CYCLE = 7.2;

function paradaPose(t: number) {
  // t ∈ [0, CYCLE); 0 = the resting pose.
  const barrierUp = range(t, 0, 0.6);
  const barrierDown = range(t, 2.9, 3.5);
  const park = t < 3.7 ? easeInOut(range(t, 0.45, 2.7)) : 0;
  const despawn = range(t, 3.3, 3.7);
  const spawn = t < 3.7 ? 1 - despawn : range(t, 3.75, 4.15);
  const approach = t < 3.7 ? 1 : range(t, 3.75, 5.7);
  const scan = t < 0.5 ? 1 - range(t, 0.2, 0.5) : range(t, 5.8, 6.3);
  const reopen = range(t, 6.5, 7.0) * 0.35;
  const barrier = 0.35 + (1 - 0.35) * barrierUp - barrierDown + reopen;
  const free = t >= 2.4 && t < 4.0 ? 11 : 12;
  return { approach, scan, barrier: clamp01(barrier), park, spawn, free };
}

function ParadaRig({ font, fontReady, playing, drag }: { font: string; fontReady: boolean; playing: boolean; drag?: MutableRefObject<DragState> }) {
  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  const running = useRef(false);
  const [, setTick] = useState(0);
  useTurntable(group, drag);

  useFrame((state, delta) => {
    if (playing && !running.current) running.current = true;
    if (!running.current) return;
    t.current += Math.min(delta, 1 / 20);
    if (t.current >= CYCLE) {
      t.current = 0;
      running.current = playing; // keep looping while hovered, else rest
    }
    setTick((n) => (n + 1) % 1e6);
  });

  const pose = paradaPose(t.current);
  return (
    <group ref={group}>
      <ParadaLot font={font} ready={fontReady} {...pose} time={t.current} />
    </group>
  );
}

export function ParadaScene({ active, font, fontReady, onReady, hovered, autoplay, drag }: SceneProps) {
  return (
    <Shell view={VIEWS.parada} active={active} onReady={onReady}>
      <ParadaRig font={font} fontReady={fontReady} playing={Boolean(hovered || (autoplay && active))} drag={drag} />
    </Shell>
  );
}

// ─── Tala: the desk ───────────────────────────────────────────────────────────

function TalaRig({ font, fontReady, playing, night, drag }: { font: string; fontReady: boolean; playing: boolean; night: boolean; drag?: MutableRefObject<DragState> }) {
  const group = useRef<THREE.Group>(null);
  const write = useRef(0.93);
  const writing = useRef(false);
  const wasPlaying = useRef(false);
  useTurntable(group, drag);
  const time = useClock();
  const [n] = useDamped([night ? 1 : 0], 3.2);

  useFrame((_, delta) => {
    // Each time play starts, the pencil writes the word again from the top.
    if (playing && !wasPlaying.current) {
      write.current = 0;
      writing.current = true;
    }
    wasPlaying.current = playing;
    if (writing.current) {
      write.current = Math.min(1, write.current + Math.min(delta, 1 / 20) / 3.6);
      if (write.current >= 1) writing.current = false;
    }
  });

  return (
    <group ref={group}>
      <TalaDesk font={font} ready={fontReady} write={write.current} night={n} time={time} />
    </group>
  );
}

export function TalaScene({ active, font, fontReady, onReady, hovered, autoplay, drag, night = false }: SceneProps) {
  return (
    <Shell view={VIEWS.tala} active={active} onReady={onReady}>
      <TalaRig font={font} fontReady={fontReady} playing={Boolean(hovered || (autoplay && active))} night={night} drag={drag} />
    </Shell>
  );
}
