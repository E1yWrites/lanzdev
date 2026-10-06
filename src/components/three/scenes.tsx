"use client";

// The live WebGL scenes. Loaded on demand by ModelStage (this module pulls in three.js),
// so nothing here reaches the first paint. Models are pure functions of their props
// (src/three) — the rigs below turn pointer, hover and time into those props.

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { HouseModel } from "@/three/HouseModel";
import { HOUSE_VIEW, INDEX_ROOMS } from "@/three/housePlan";
import { ParadaLot } from "@/three/ParadaLot";
import { TalaDesk } from "@/three/TalaDesk";
import { StudioLights } from "@/three/Studio";
import { clamp01, easeInOut, range } from "@/three/lib";
import { VIEWS, type View } from "@/three/views";
import { houseHover, useStore } from "./store";
import { asset } from "@/lib/constants";
import { projects } from "@/data/projects";

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
  /** Display face, for painted text (the hero room's wall). */
  display?: string;
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

function Shell({
  view,
  active,
  onReady,
  lights = true,
  shadows,
  children,
}: {
  view: View;
  active: boolean;
  onReady?: () => void;
  /** false when the model lights itself (the house). */
  lights?: boolean;
  shadows?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Canvas
      shadows={shadows}
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: view.position, fov: view.fov, near: 0.1, far: 100 }}
      style={{ touchAction: "pan-y" }}
    >
      <Aim view={view} />
      {lights && <StudioLights />}
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

// ─── The house ────────────────────────────────────────────────────────────────

/**
 * PARADA's reel on the screening room's set, muted and looping: a frame of it until the
 * film is playing, and it plays only while the house is on screen.
 */
function useReel(active: boolean) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  useLayoutEffect(() => {
    const film = projects.find((p) => p.slug === "parada")?.film;
    if (!film) return;
    const frame = new THREE.TextureLoader().load(film.poster, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setTexture((now) => now ?? t);
    });
    const v = Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true, preload: "auto" });
    for (const [src, type] of [
      [film.mp4, "video/mp4"],
      [film.webm, "video/webm"],
    ])
      v.append(Object.assign(document.createElement("source"), { src, type }));
    const live = new THREE.VideoTexture(v);
    live.colorSpace = THREE.SRGBColorSpace;
    v.addEventListener("playing", () => setTexture(live), { once: true });
    video.current = v;
    return () => {
      v.pause();
      v.replaceChildren();
      v.load();
      frame.dispose();
      live.dispose();
    };
  }, []);
  useLayoutEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return texture;
}

/** The room you're at turns its lamp up; the others ease back down. */
function HouseRig({ font, fontReady, active }: { font: string; fontReady: boolean; active: boolean }) {
  const at = useStore(houseHover);
  const lit = useDamped(
    INDEX_ROOMS.map((r) => (r.room === at ? 1 : 0)),
    6
  );
  const time = useClock();
  const [portrait, setPortrait] = useState<THREE.Texture | null>(null);
  useLayoutEffect(() => {
    const t = new THREE.TextureLoader().load(asset("/images/portrait.webp"), (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setPortrait(tex);
    });
    return () => t.dispose();
  }, []);
  const film = useReel(active);
  return <HouseModel font={font} ready={fontReady} portrait={portrait} time={time} film={film} lit={Object.fromEntries(INDEX_ROOMS.map((r, i) => [r.room, lit[i]]))} />;
}

export function HouseScene({ active, font, fontReady, onReady }: SceneProps) {
  return (
    <Shell view={HOUSE_VIEW} active={active} onReady={onReady} lights={false} shadows>
      <HouseRig font={font} fontReady={fontReady} active={active} />
    </Shell>
  );
}
