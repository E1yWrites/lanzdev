"use client";

// The hero room, live. Loaded on demand by ModelStage; the room itself is a pure model
// (src/three/Room.tsx) and this rig turns the pointer, the stores and the clock into its
// props and the camera. It talks to the page only through the stores in ./store.

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { asset } from "@/lib/constants";
import { PAD_KEYS } from "@/three/padKeys";
import { Room } from "@/three/Room";
import { ROOM_OBJECTS, ROOM_VIEW, TAPE_INSERT_MS, roomObject, type Pose, type RoomId, type TapeId } from "@/three/roomObjects";
import type { SceneProps } from "./scenes";
import { cursorLabel, heroPointer, openRoom, roomEnter, roomFocus, roomHover, roomLive, roomPins, roomTape, useStore } from "./store";

/** Drag turns the room at most this far either way, then it springs back to the front. */
const MAX_YAW = THREE.MathUtils.degToRad(15);
const DRAG_GAIN = 0.45;

const IDLE_SCREENS: [string, string][] = [
  ["LORENZ.DEV", "PICK A NUMBER"],
  ["PARADA · TALA", "TWO PROJECTS · FIVE PINS"],
  ["BATANGAS, PH", "13.7565° N · 121.0583° E"],
  ["STATUS", "OPEN TO AN INTERNSHIP"],
];

const TAPE_NAME: Record<TapeId, string> = { parada: "PARADA", tala: "Tala" };

type CamState = { px: number; py: number; pz: number; tx: number; ty: number; tz: number; fov: number };
const camOf = (p: Pose): CamState => ({ px: p.position[0], py: p.position[1], pz: p.position[2], tx: p.target[0], ty: p.target[1], tz: p.target[2], fov: p.fov });

const damp = THREE.MathUtils.damp;

function RoomRig({ font, display, fontReady, onReady, drag, onNavigate }: Pick<SceneProps, "font" | "display" | "fontReady" | "onReady" | "drag" | "onNavigate">) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const hover = useStore(roomHover);
  const focus = useStore(roomFocus);
  const tape = useStore(roomTape);
  const [tapeHover, setTapeHover] = useState<TapeId | null>(null);
  const [pressed, setPressed] = useState(-1);
  const [idle, setIdle] = useState(0);
  const [portrait, setPortrait] = useState<THREE.Texture | null>(null);
  const [, setTick] = useState(0);

  // Everything that eases lives in refs; one re-render per frame hands it to the model.
  const cam = useRef<CamState>(camOf(focus ? roomObject(focus)!.pose : ROOM_VIEW));
  const v = useRef({ time: 0, wake: 0, dim: focus ? 1 : 0, look: [0, 0] as [number, number], knob: 0.6, lit: {} as Partial<Record<RoomId, number>>, tapes: {} as Partial<Record<TapeId, number>>, press: [0, 0, 0, 0], glow: [0, 0, 0, 0], meter: 0.25 });
  const ready = useRef({ frames: 0, done: false });
  const offset = useRef(new THREE.Vector3());
  const lastPins = useRef<[number, number][] | null>(null);

  useEffect(() => {
    let tex: THREE.Texture | null = null;
    let alive = true;
    new THREE.TextureLoader().load(asset("/images/portrait.webp"), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      tex = t;
      if (alive) setPortrait(t);
      else t.dispose();
    });
    return () => {
      alive = false;
      tex?.dispose();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIdle((i) => (i + 1) % IDLE_SCREENS.length), 2600);
    return () => clearInterval(id);
  }, []);

  // A pick moves the camera to the object's pose; closing brings it back.
  useEffect(() => {
    const pose = focus ? roomObject(focus)!.pose : ROOM_VIEW;
    const to = camOf(pose);
    const tween = gsap.to(cam.current, { ...to, duration: 0.6, ease: "power2.inOut", overwrite: true });
    return () => {
      tween.kill();
    };
  }, [focus]);

  // A card's call to action: push in toward the object, then go.
  useEffect(
    () =>
      roomEnter.subscribe(() => {
        const href = roomEnter.get();
        if (!href) return;
        const c = cam.current;
        gsap.to(c, {
          px: c.px + (c.tx - c.px) * 0.45,
          py: c.py + (c.ty - c.py) * 0.45,
          pz: c.pz + (c.tz - c.pz) * 0.45,
          duration: 0.32,
          ease: "power2.in",
          overwrite: true,
          onComplete: () => {
            roomEnter.set(null);
            onNavigate?.(href);
          },
        });
      }),
    [onNavigate]
  );

  useEffect(
    () => () => {
      roomLive.set(false);
      roomPins.set(null);
      roomHover.set(null);
      cursorLabel.set(null);
      document.body.style.cursor = "";
    },
    []
  );

  const padIndex = PAD_KEYS.findIndex((k) => k.id === (hover ?? focus));

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const s = v.current;
    s.time = state.clock.elapsedTime;
    if (ready.current.done) s.wake = Math.min(1, s.wake + dt / 2.2);

    // Orbit: the drag turns the room a little and springs back; the pointer adds a lean.
    const d = drag?.current;
    if (d) {
      if (!d.dragging) d.yaw = damp(d.yaw, 0, 4, dt);
      d.yaw = THREE.MathUtils.clamp(d.yaw, -MAX_YAW / DRAG_GAIN, MAX_YAW / DRAG_GAIN);
    }
    const free = focus ? 0 : 1;
    s.look[0] = damp(s.look[0], free * (heroPointer.x * THREE.MathUtils.degToRad(2.5) + (d?.yaw ?? 0) * DRAG_GAIN), 5, dt);
    s.look[1] = damp(s.look[1], free * heroPointer.y * THREE.MathUtils.degToRad(1.5), 5, dt);

    const c = cam.current;
    const o = offset.current.set(c.px - c.tx, c.py - c.ty, c.pz - c.tz);
    o.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -s.look[0]);
    const right = new THREE.Vector3(o.z, 0, -o.x).normalize();
    o.applyAxisAngle(right, s.look[1]);
    camera.position.set(c.tx + o.x, c.ty + o.y, c.tz + o.z);
    camera.lookAt(c.tx, c.ty, c.tz);
    if (Math.abs(camera.fov - c.fov) > 1e-4) {
      camera.fov = c.fov;
      camera.updateProjectionMatrix();
    }

    // Pins follow the live camera.
    if (ready.current.done) {
      const v3 = new THREE.Vector3();
      const pins = ROOM_OBJECTS.map((obj) => {
        v3.set(...obj.anchor).project(camera);
        return [(v3.x + 1) / 2, (1 - v3.y) / 2] as [number, number];
      });
      const prev = lastPins.current;
      if (!prev || pins.some((p, i) => Math.abs(p[0] - prev[i][0]) + Math.abs(p[1] - prev[i][1]) > 2e-4)) {
        lastPins.current = pins;
        roomPins.set(pins);
      }
    }

    s.dim = damp(s.dim, focus ? 1 : 0, 6, dt);
    for (const obj of ROOM_OBJECTS) s.lit[obj.id] = damp(s.lit[obj.id] ?? 0, !focus && hover === obj.id ? 1 : 0, 12, dt);
    const step = dt / (TAPE_INSERT_MS / 1000);
    for (const id of ["parada", "tala"] as TapeId[]) {
      const cur = s.tapes[id] ?? 0;
      s.tapes[id] = tape === id ? Math.min(1, cur + step) : Math.max(0, cur - step);
    }
    PAD_KEYS.forEach((_, i) => {
      s.press[i] = damp(s.press[i], pressed === i ? 1 : padIndex === i ? 0.32 : 0, 14, dt);
      s.glow[i] = damp(s.glow[i], padIndex === i || pressed === i ? 1 : 0, 14, dt);
    });
    s.meter = damp(s.meter, padIndex >= 0 ? (padIndex + 1) / PAD_KEYS.length : 0.25, 14, dt);
    s.knob = damp(s.knob, (window.scrollY / window.innerHeight) * (Math.PI / 2) + 0.6, 8, dt);

    // First paint: once the fonts and the portrait are in and a frame has drawn, the poster can go.
    const r = ready.current;
    if (!r.done && fontReady && portrait && ++r.frames > 1) {
      r.done = true;
      roomLive.set(true);
      requestAnimationFrame(() => onReady?.());
    }
    setTick((n) => (n + 1) % 1e6);
  });

  const pointer = (on: boolean) => {
    document.body.style.cursor = on ? "pointer" : "";
  };

  const onObject = (id: RoomId, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (type === "over") {
      roomHover.set(id);
      pointer(true);
    } else if (type === "out") {
      if (roomHover.get() === id) roomHover.set(null);
      pointer(false);
    } else if (e.delta < 6) {
      pointer(false);
      openRoom(id);
    }
  };

  const onKey = (i: number, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const id = PAD_KEYS[i].id as RoomId;
    if (type !== "click") return onObject(id, type, e);
    if (e.delta >= 6) return;
    setPressed(i);
    pointer(false);
    window.setTimeout(() => {
      setPressed(-1);
      openRoom(id);
    }, 170);
  };

  const onTape = (id: TapeId, type: "over" | "out" | "click", e: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (type === "over") {
      setTapeHover(id);
      cursorLabel.set(`${TAPE_NAME[id]} · 15 s`);
      pointer(true);
    } else if (type === "out") {
      setTapeHover((h) => (h === id ? null : h));
      cursorLabel.set(null);
      pointer(false);
    } else if (e.delta < 6) {
      cursorLabel.set(null);
      pointer(false);
      roomTape.set(id);
    }
  };

  const s = v.current;
  const screen = padIndex >= 0 ? PAD_KEYS[padIndex].screen : IDLE_SCREENS[idle];
  return (
    <Room
      font={font}
      display={display ?? "Georgia, serif"}
      ready={fontReady}
      portrait={portrait}
      time={s.time}
      wake={s.wake}
      lit={s.lit}
      focus={focus}
      dim={s.dim}
      tapes={s.tapes}
      tapeHover={tapeHover}
      pad={{ press: s.press, glow: s.glow, knob: s.knob, screen: { title: screen[0], sub: screen[1], meter: s.meter } }}
      onObject={onObject}
      onTape={onTape}
      onKey={onKey}
    />
  );
}

export function RoomScene({ active, font, display, fontReady, onReady, drag, onNavigate }: SceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: ROOM_VIEW.position, fov: ROOM_VIEW.fov, near: 0.1, far: 100 }}
      style={{ touchAction: "pan-y" }}
    >
      <RoomRig font={font} display={display} fontReady={fontReady} onReady={onReady} drag={drag} onNavigate={onNavigate} />
    </Canvas>
  );
}
