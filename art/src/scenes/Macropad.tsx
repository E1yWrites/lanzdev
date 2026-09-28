import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { FinishMaterial, Print, inkFor, useCapGeometry, type Finish } from "../shared/keycap";
import { Studio, useFontsReady } from "../shared/studio";

type Cap = {
  x: number;
  z: number;
  w: number;
  index?: string;
  label: string;
  finish: Finish;
  /** Seconds into the loop at which this key is pressed. */
  pressAt?: number;
};

// Each project is a key. Pressed in order, once per loop.
const CAPS: Cap[] = [
  { x: -1.1, z: -0.55, w: 1, index: "01", label: "tala", finish: "accent", pressAt: 0.9 },
  { x: 0, z: -0.55, w: 1, index: "02", label: "parada", finish: "white", pressAt: 2.4 },
  { x: 1.1, z: -0.55, w: 1, index: "03", label: "modpack", finish: "white", pressAt: 3.9 },
  { x: -0.55, z: 0.55, w: 2.1, label: "lorenz.dev", finish: "frost" },
  { x: 1.1, z: 0.55, w: 1, label: "⌘K", finish: "grey" },
];

const H = 0.5;

function Key({ cap, press, ready }: { cap: Cap; press: number; ready: boolean }) {
  const geometry = useCapGeometry(cap.w, 1, H);
  return (
    <group position={[cap.x, H / 2 + 0.11 - press * 0.14, cap.z]}>
      <mesh geometry={geometry}>
        <FinishMaterial finish={cap.finish} />
      </mesh>
      {ready && <Print w={cap.w} d={1} y={H / 2} topLeft={cap.index} bottomLeft={cap.label} ink={inkFor(cap.finish)} />}
    </group>
  );
}

/**
 * The macropad object on its own, driven by the current frame. `ready` must come from
 * useFontsReady() *outside* the canvas: state changes inside it don't trigger a redraw.
 */
export function MacropadObject({ ready, sway = true }: { ready: boolean; sway?: boolean }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const plate = useMemo(() => new RoundedBoxGeometry(3.66, 0.22, 2.56, 8, 0.1), []);

  const t = frame / fps;
  const phase = (frame / durationInFrames) * Math.PI * 2; // exactly one cycle per loop

  const press = (at?: number) => {
    if (at === undefined) return 0;
    const d = t - at;
    if (d < 0 || d > 0.55) return 0;
    return d < 0.14
      ? interpolate(d, [0, 0.14], [0, 1], { easing: Easing.out(Easing.quad) })
      : interpolate(d, [0.14, 0.55], [1, 0], { easing: Easing.out(Easing.back(2)) });
  };

  return (
    <group
      rotation={[0.08, -0.5 + (sway ? Math.sin(phase) * 0.12 : 0), 0.04]}
      position={[0, sway ? Math.sin(phase * 2) * 0.04 : 0, 0.1]}
    >
      <mesh geometry={plate}>
        <meshPhysicalMaterial color="#d9d9dc" metalness={0.55} roughness={0.34} clearcoat={0.4} />
      </mesh>
      {CAPS.map((cap) => (
        <Key key={cap.label} cap={cap} press={sway ? press(cap.pressAt) : 0} ready={ready} />
      ))}
    </group>
  );
}

/** Home hero: a seamless loop on pure black (the site composites it with mix-blend-mode: screen). */
export function Hero() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <Studio width={width} height={height} background="#000000" camera={{ position: [0, 9, 8.2], fov: 26 }}>
      <MacropadObject ready={ready} />
    </Studio>
  );
}
