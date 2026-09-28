import { ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { FinishMaterial, useCapGeometry, type Finish } from "../shared/keycap";
import { Studio, useFontsReady } from "../shared/studio";

// ─── PARADA: a four-bay parking tile ─────────────────────────────────────────

const BAY_W = 0.8;
const BAYS: (Finish | null)[] = ["white", "accent", null, "white"];

/** Painted markings: dotted bay dividers, bay numbers, a "P" in the free bay. */
function useLotTexture(ready: boolean) {
  return useMemo(() => {
    if (!ready) return null;
    const scale = 400;
    const canvas = document.createElement("canvas");
    canvas.width = 3.4 * scale;
    canvas.height = 2.2 * scale;
    const ctx = canvas.getContext("2d")!;
    const cx = canvas.width / 2;
    ctx.strokeStyle = "rgba(240,240,236,0.85)";
    ctx.fillStyle = "rgba(240,240,236,0.85)";
    ctx.lineWidth = 7;
    ctx.setLineDash([22, 16]);
    for (let i = 0; i <= BAYS.length; i++) {
      const x = cx + (i - BAYS.length / 2) * BAY_W * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0.18 * scale);
      ctx.lineTo(x, 1.62 * scale);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.font = "500 44px KeyMono";
    ctx.textAlign = "center";
    BAYS.forEach((_, i) => {
      const x = cx + (i - BAYS.length / 2 + 0.5) * BAY_W * scale;
      ctx.fillText(String(i + 1).padStart(2, "0"), x, 1.86 * scale);
    });
    const free = BAYS.indexOf(null);
    ctx.font = "700 150px KeyMono";
    ctx.textBaseline = "middle";
    ctx.fillText("P", cx + (free - BAYS.length / 2 + 0.5) * BAY_W * scale, 0.92 * scale);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [ready]);
}

function Car({ x, finish }: { x: number; finish: Finish }) {
  const geometry = useCapGeometry(0.52, 0.9, 0.3, 0.22, 0.08);
  return (
    <mesh geometry={geometry} position={[x, 0.09 + 0.15, -0.28]}>
      <FinishMaterial finish={finish} />
    </mesh>
  );
}

export function ParadaObject() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  const tile = useMemo(() => new RoundedBoxGeometry(3.4, 0.18, 2.2, 8, 0.12), []);
  const markings = useLotTexture(ready);

  return (
    <Studio width={width} height={height} background={null} camera={{ position: [0, 7.2, 6.4], fov: 26 }}>
      <group rotation={[0.05, -0.42, 0.02]} position={[0, 0, 0.15]}>
        <mesh geometry={tile}>
          <meshPhysicalMaterial color="#29292c" roughness={0.82} />
        </mesh>
        {markings && (
          <mesh position={[0, 0.093, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 2.2]} />
            <meshStandardMaterial map={markings} transparent roughness={0.9} polygonOffset polygonOffsetFactor={-2} />
          </mesh>
        )}
        {BAYS.map((finish, i) =>
          finish ? <Car key={i} x={(i - BAYS.length / 2 + 0.5) * BAY_W} finish={finish} /> : null
        )}
      </group>
    </Studio>
  );
}

// ─── Modpack: a small voxel terrain ──────────────────────────────────────────

const HEIGHTS = [
  [1, 2, 1],
  [2, 3, 1],
  [1, 1, 2],
];
const CUBE = 0.62;
const GAP = 0.05;

export function ModpackObject() {
  const { width, height } = useVideoConfig();
  const cube = useMemo(() => new RoundedBoxGeometry(CUBE, CUBE, CUBE, 5, 0.06), []);
  const step = CUBE + GAP;

  const cubes: { p: [number, number, number]; finish: Finish }[] = [];
  HEIGHTS.forEach((row, z) =>
    row.forEach((h, x) => {
      for (let y = 0; y < h; y++) {
        const top = y === h - 1;
        const summit = h === 3 && top;
        cubes.push({
          p: [(x - 1) * step, y * step + CUBE / 2, (z - 1) * step],
          finish: summit ? "accent" : top ? "white" : "grey",
        });
      }
    })
  );

  return (
    <Studio width={width} height={height} background={null} camera={{ position: [0, 6.4, 6.6], fov: 26 }}>
      <group rotation={[0, -0.62, 0]} position={[0, -0.75, 0]}>
        {cubes.map((c, i) => (
          <mesh key={i} geometry={cube} position={c.p}>
            <FinishMaterial finish={c.finish} />
          </mesh>
        ))}
      </group>
      <ContactShadows position={[0, -0.76, 0]} opacity={0.35} scale={8} blur={2.6} far={2.5} frames={1} />
    </Studio>
  );
}
