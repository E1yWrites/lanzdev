import { useThree } from "@react-three/fiber";
import { memo, useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { canvasTexture, useDisposable } from "./lib";

// Parts shared by the rooms of the house (the hero room, the house from above): one palette, one
// set of rounded boxes, plank floors, plants, lit doorways and the soft light they throw.

type Vec3 = [number, number, number];

export const C = {
  floor: "#2b2522",
  plank: "#241f1c",
  wallLeft: "#232946",
  wallRight: "#20263c",
  cut: "#4b5470",
  deskTop: "#c3c8d1",
  dark: "#1d212b",
  fabric: "#394052",
  metal: "#1e222b",
  cabinet: "#20242f",
  cabinetDoor: "#272c38",
  door: "#3a4256",
  trim: "#c9ced6",
  wood: "#5a4636",
  leaf: "#4f7d3c",
  leafLight: "#6b9a4a",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function useRounded(w: number, h: number, d: number, r = 0.02, seg = 3) {
  return useDisposable(() => new RoundedBoxGeometry(w, h, d, seg, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)), [w, h, d, r, seg]);
}

export function Box({ size, position, rotation, color, roughness = 0.75, r = 0.02, metalness = 0 }: { size: Vec3; position: Vec3; rotation?: Vec3; color: string; roughness?: number; r?: number; metalness?: number }) {
  const geometry = useRounded(size[0], size[1], size[2], r);
  return (
    <mesh geometry={geometry} position={position} rotation={rotation}>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

/** A cylinder from `a` to `b`. */
export function Rod({ a, b, r, color, roughness = 0.5, metalness = 0 }: { a: Vec3; b: Vec3; r: number; color: string; roughness?: number; metalness?: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    return {
      position: va.clone().add(vb).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()),
      length: dir.length(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...a, ...b]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[r, r, length, 16]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

/** Soft light lying on a surface (door spill, LED strip): additive, so it only ever brightens. */
export function Glow({ map, size, position, rotation, color, opacity }: { map: THREE.Texture; size: [number, number]; position: Vec3; rotation: Vec3; color: string; opacity: number }) {
  return (
    <mesh position={position} rotation={rotation} renderOrder={1}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={map} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/** A soft pool: bright at the near edge, fading out. */
export function poolTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, h);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.5, "rgba(255,255,255,0.3)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

// ─── Walls and floors ─────────────────────────────────────────────────────────

/** Wall colour with contact shading baked in: darker toward the floor and (when it has one) the corner. */
export function wallTexture(color: string, cornerSide: "left" | "right" | null) {
  return canvasTexture(512, 400, (ctx, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    const floor = ctx.createLinearGradient(0, h, 0, h * 0.75);
    floor.addColorStop(0, "rgba(0,0,0,0.42)");
    floor.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = floor;
    ctx.fillRect(0, 0, w, h);
    if (!cornerSide) return;
    const cx = cornerSide === "left" ? 0 : w;
    const corner = ctx.createLinearGradient(cx, 0, cornerSide === "left" ? w * 0.16 : w * 0.84, 0);
    corner.addColorStop(0, "rgba(0,0,0,0.38)");
    corner.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = corner;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Dark wood planks, staggered, with contact shading where the floor meets a wall (`top`, `left`). */
export function floorTexture(edges: ("top" | "left")[] = ["top", "left"]) {
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = C.floor;
    ctx.fillRect(0, 0, w, h);
    const rand = mulberry(11);
    const rows = 22;
    const rh = h / rows;
    for (let r = 0; r < rows; r++) {
      let x = -rand() * 300;
      while (x < w) {
        const len = 260 + rand() * 260;
        const tone = 0.03 + rand() * 0.07;
        ctx.fillStyle = `rgba(${rand() < 0.5 ? "0,0,0" : "255,235,215"},${tone})`;
        ctx.fillRect(x, r * rh, len, rh);
        ctx.fillStyle = C.plank;
        ctx.fillRect(x, r * rh, 2, rh);
        x += len;
      }
      ctx.fillStyle = C.plank;
      ctx.fillRect(0, r * rh, w, 2);
    }
    for (const [x0, y0, x1, y1] of edges.map((e) => (e === "top" ? [0, 0, 0, h * 0.14] : [0, 0, w * 0.14, 0]))) {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, "rgba(0,0,0,0.5)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  });
}

// ─── Plants ───────────────────────────────────────────────────────────────────

/** A pointed leaf, cupped a little along its length. */
function leafGeometry(length: number, width: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(width, length * 0.38, 0, length);
  s.quadraticCurveTo(-width, length * 0.38, 0, 0);
  const g = new THREE.ShapeGeometry(s, 10);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getY(i) / length;
    pos.setZ(i, t * t * length * 0.35 + Math.abs(pos.getX(i)) * 0.4);
  }
  g.computeVertexNormals();
  return g;
}

function potGeometry(r: number, h: number) {
  const p = [
    [0, 0],
    [r * 0.78, 0],
    [r, h],
    [r * 0.92, h],
    [r * 0.74, h * 0.15],
    [0, h * 0.15],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(p, 32);
}

/**
 * A potted plant: leaves fanned out on a rosette (one instanced mesh), or for `trailing`,
 * vines that spill over the edge it stands on, with small leaves along them.
 */
export const Plant = memo(function Plant({ position, size = 1, pot = C.dark, trailing = false, seed = 1, yaw = 0, leaves = 11 }: { position: Vec3; size?: number; pot?: string; trailing?: boolean; seed?: number; yaw?: number; leaves?: number }) {
  const r = 0.09 * size;
  const ph = 0.16 * size;
  const potGeo = useDisposable(() => potGeometry(r, ph), [r, ph]);
  const leaf = useDisposable(() => (trailing ? leafGeometry(0.06, 0.035) : leafGeometry(0.2 * size, 0.07 * size)), [trailing, size]);
  const { matrices, vines } = useMemo(() => {
    const rand = mulberry(seed);
    const m: THREE.Matrix4[] = [];
    const curves: THREE.CatmullRomCurve3[] = [];
    const o = new THREE.Object3D();
    if (!trailing) {
      for (let i = 0; i < leaves; i++) {
        const a = i * 2.4 + rand() * 0.4;
        const tilt = 0.25 + (i / leaves) * 0.75 + rand() * 0.2;
        o.position.set(Math.cos(a) * 0.02, ph * 0.9, Math.sin(a) * 0.02);
        o.rotation.set(0, 0, 0);
        o.rotateY(-a + Math.PI / 2);
        o.rotateX(tilt);
        o.scale.setScalar(0.7 + rand() * 0.5);
        o.updateMatrix();
        m.push(o.matrix.clone());
      }
    } else {
      for (let v = 0; v < 4; v++) {
        const a = (v / 4) * Math.PI * 2 + rand();
        const out = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
        const drop = 0.3 + rand() * 0.45;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, ph * 0.95, 0),
          out.clone().multiplyScalar(r * 1.3).setY(ph * 1.05),
          out.clone().multiplyScalar(r * 1.8).setY(ph * 0.4),
          out.clone().multiplyScalar(r * 2.1).setY(ph - drop * 0.6),
          out.clone().multiplyScalar(r * 2.2 + rand() * 0.05).setY(ph - drop),
        ]);
        curves.push(curve);
        for (let i = 1; i <= 9; i++) {
          const t = i / 10;
          o.position.copy(curve.getPointAt(t));
          o.rotation.set(rand() * 2 - 1, a + rand() * 2, rand() * 2 - 1);
          o.scale.setScalar(0.8 + rand() * 0.5);
          o.updateMatrix();
          m.push(o.matrix.clone());
        }
      }
      // a few leaves on top too
      for (let i = 0; i < 7; i++) {
        o.position.set((rand() - 0.5) * r, ph, (rand() - 0.5) * r);
        o.rotation.set(-0.6 - rand(), rand() * 6, 0);
        o.scale.setScalar(1.2);
        o.updateMatrix();
        m.push(o.matrix.clone());
      }
    }
    return { matrices: m, vines: curves };
  }, [trailing, seed, r, ph, leaves]);
  const ref = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    matrices.forEach((mat, i) => {
      mesh.setMatrixAt(i, mat);
      mesh.setColorAt(i, new THREE.Color(i % 3 ? C.leaf : C.leafLight));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      <mesh geometry={potGeo}>
        <meshStandardMaterial color={pot} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, ph * 0.86, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r * 0.9, 24]} />
        <meshStandardMaterial color="#2a1d14" roughness={1} />
      </mesh>
      {vines.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 24, 0.004, 5, false]} />
          <meshStandardMaterial color="#3d5a2c" roughness={0.8} />
        </mesh>
      ))}
      <instancedMesh ref={ref} args={[leaf, undefined, matrices.length]}>
        <meshStandardMaterial roughness={0.55} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  );
});

// ─── Doorways ─────────────────────────────────────────────────────────────────

/** The lit room seen through an open doorway: a soft gradient between two of its light's tones. */
export function doorwayTexture(from = "#ffd2a1", to = "#ff9455") {
  return canvasTexture(128, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

/** The wedge of light the open door throws across the floor. */
export function spillTexture() {
  return canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.filter = "blur(10px)";
    ctx.beginPath();
    ctx.moveTo(w * 0.32, 0);
    ctx.lineTo(w * 0.5, 0);
    ctx.lineTo(w * 0.9, h);
    ctx.lineTo(w * 0.1, h);
    ctx.closePath();
    ctx.fill();
  });
}

// ─── Lighting ─────────────────────────────────────────────────────────────────

export function EnvLevel({ level }: { level: number }) {
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    scene.environmentIntensity = level;
  }, [scene, level]);
  return null;
}

