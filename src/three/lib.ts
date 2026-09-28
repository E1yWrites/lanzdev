import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// ─── Easing ───────────────────────────────────────────────────────────────────

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Maps v from [a, b] to [0, 1], clamped. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutBack = (t: number, s = 1.7) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Resource lifetime ────────────────────────────────────────────────────────

/** useMemo for GPU resources: disposes the previous value when deps change and on unmount. */
export function useDisposable<T extends { dispose: () => void }>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(factory, deps);
  useEffect(() => () => value.dispose(), [value]);
  return value;
}

// ─── Geometry ─────────────────────────────────────────────────────────────────

/** Rounded box whose top face tapers in, like an OEM-profile keycap. */
export function taperedCap(w: number, d: number, h: number, taper = 0.13, radius = 0.09) {
  const g = new RoundedBoxGeometry(w, h, d, 6, radius);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + h / 2) / h; // 0 at the base, 1 at the top
    const s = 1 - taper * t * t;
    pos.setX(i, pos.getX(i) * (1 - (1 - s) * (w > 1.5 ? 0.35 : 1)));
    pos.setZ(i, pos.getZ(i) * s);
  }
  g.computeVertexNormals();
  return g;
}

/** Four-point sparkle with concave sides — the star in the logo, and "tala" itself. */
export function sparkleShape(r = 1, pinch = 0.12) {
  const s = new THREE.Shape();
  const c = r * pinch;
  s.moveTo(0, r);
  s.bezierCurveTo(c * 0.6, c * 2.4, c * 2.4, c * 0.6, r, 0);
  s.bezierCurveTo(c * 2.4, -c * 0.6, c * 0.6, -c * 2.4, 0, -r);
  s.bezierCurveTo(-c * 0.6, -c * 2.4, -c * 2.4, -c * 0.6, -r, 0);
  s.bezierCurveTo(-c * 2.4, c * 0.6, -c * 0.6, c * 2.4, 0, r);
  return s;
}

/** Extruded sparkle, centred, with a soft bevel. */
export function sparkleGeometry(r = 1, depth = 0.12) {
  const g = new THREE.ExtrudeGeometry(sparkleShape(r), {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.4,
    bevelSize: r * 0.05,
    bevelSegments: 4,
    curveSegments: 24,
  });
  g.center();
  return g;
}

/**
 * A flat band that follows `curve`, `width` wide — a paper ribbon. `across` is either a fixed
 * direction or a function of (t, tangent) for bands that twist as they go.
 * Both faces share the vertices; render it twice (FrontSide / BackSide) for two colours.
 */
export function ribbonGeometry(
  curve: THREE.Curve<THREE.Vector3>,
  width: number,
  segments = 240,
  across: THREE.Vector3 | ((t: number, tangent: THREE.Vector3) => THREE.Vector3) = new THREE.Vector3(0, 0, 1)
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const p = curve.getPointAt(i / segments);
    const dir = typeof across === "function" ? across(i / segments, curve.getTangentAt(i / segments)) : across;
    const half = dir.clone().normalize().multiplyScalar(width / 2);
    positions.push(p.x - half.x, p.y - half.y, p.z - half.z, p.x + half.x, p.y + half.y, p.z + half.z);
    uvs.push(i / segments, 0, i / segments, 1);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** Catmull-Rom through 2D points (x right, y up), laid on the XZ plane at height y. */
export function curveOnPlane(points: [number, number][], opts: { scale: number; x: number; z: number; y: number }) {
  return new THREE.CatmullRomCurve3(
    points.map(([px, py]) => new THREE.Vector3(opts.x + px * opts.scale, opts.y, opts.z - py * opts.scale)),
    false,
    "catmullrom",
    0.5
  );
}

// ─── Textures ─────────────────────────────────────────────────────────────────

/** A canvas texture drawn once. `draw` receives the 2D context and pixel size. */
export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  const ctx = canvas.getContext("2d")!;
  draw(ctx, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Radial falloff used for soft contact shadows (no shadow maps needed). */
export function shadowTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(0,0,0,0.55)");
    g.addColorStop(0.45, "rgba(0,0,0,0.28)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Font string for canvas text: `family` is a CSS font-family list (site) or a FontFace name (art). */
export const canvasFont = (weight: number, px: number, family: string) => `${weight} ${Math.round(px)}px ${family}`;
