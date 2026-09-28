import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { ACCENT } from "./studio";

export type Finish = "accent" | "white" | "grey" | "frost";

/** Rounded box whose top face tapers in, like an OEM-profile keycap. */
export function useCapGeometry(w: number, d: number, h: number, taper = 0.13, radius = 0.09) {
  return useMemo(() => {
    const g = new RoundedBoxGeometry(w, h, d, 6, radius);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getY(i) + h / 2) / h; // 0 at the base, 1 at the top
      const s = 1 - taper * t * t;
      // Wide caps taper less along their length so the top stays usable.
      pos.setX(i, pos.getX(i) * (1 - (1 - s) * (w > 1.5 ? 0.35 : 1)));
      pos.setZ(i, pos.getZ(i) * s);
    }
    g.computeVertexNormals();
    return g;
  }, [w, d, h, taper, radius]);
}

export function FinishMaterial({ finish }: { finish: Finish }) {
  switch (finish) {
    case "accent":
      return <meshPhysicalMaterial color={ACCENT} roughness={0.38} clearcoat={0.5} clearcoatRoughness={0.3} />;
    case "white":
      return <meshPhysicalMaterial color="#ecebe6" roughness={0.62} sheen={0.2} />;
    case "grey":
      return <meshPhysicalMaterial color="#b9b8b3" roughness={0.55} />;
    case "frost":
      // Reads as frosted acrylic without real transmission, which renders black against the void.
      return <meshPhysicalMaterial color="#d6dde0" roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} sheen={0.4} sheenColor="#ffffff" />;
  }
}

export const inkFor = (finish: Finish) => (finish === "accent" ? "#1a0d08" : "#2a2a2c");

/**
 * Text printed on a flat top face, drawn to a canvas texture (deterministic, no async font worker).
 * `lines` are placed top-left and bottom-left like a keycap legend.
 */
export function Print({
  w,
  d,
  y,
  topLeft,
  bottomLeft,
  center,
  ink,
}: {
  w: number;
  d: number;
  y: number;
  topLeft?: string;
  bottomLeft?: string;
  center?: string;
  ink: string;
}) {
  const texture = useMemo(() => {
    const px = 512;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(px * w);
    canvas.height = Math.round(px * d);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = ink;
    if (topLeft) {
      ctx.font = "500 50px KeyMono";
      ctx.fillText(topLeft, 40, 88);
    }
    if (bottomLeft) {
      ctx.font = `700 ${bottomLeft.length > 7 ? 60 : 66}px KeyMono`;
      ctx.fillText(bottomLeft, 40, canvas.height - 44);
    }
    if (center) {
      ctx.font = `700 ${Math.round(canvas.height * 0.62)}px KeyMono`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(center, canvas.width / 2, canvas.height / 2 + canvas.height * 0.03);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [w, d, topLeft, bottomLeft, center, ink]);

  return (
    <mesh position={[0, y + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w * 0.82, d * 0.82]} />
      <meshStandardMaterial map={texture} transparent roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}
