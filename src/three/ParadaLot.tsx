import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { canvasFont, canvasTexture, clamp01, easeInOut, easeOutBack, ribbonGeometry, useDisposable } from "./lib";
import { PARADA, SITE } from "./palette";
import { SoftShadow } from "./Studio";

// PARADA as a diorama: one zone, four bays, a gate with a plate-reading camera,
// and the zone sign that shows the only number PARADA trusts — spaces free.
// Every moving part is a prop, so the site animates it on hover and the films
// drive it from the frame number.

const LOT = { w: 5.4, d: 3.8 };
const LANE_Z = 0.62;
const GATE_X = 2.45;
const BAY_Z = -0.95;
const BAYS = [-1.75, -0.85, 0.05, 0.95];
const TARGET_BAY = 2;
/** Where the arriving car waits at the gate (its centre); the road runs out to ROAD_END. */
const STOP_X = 3.5;
const ROAD_END = 5.9;

// ─── Car ──────────────────────────────────────────────────────────────────────

const CAR = { len: 0.92, width: 0.46, wheel: 0.078 };

/** Lower body in side profile (x = length, y = height), extruded across the width. Nose at +x. */
function carBodyGeometry() {
  const s = new THREE.Shape();
  s.moveTo(-0.46, 0.07);
  s.lineTo(0.44, 0.07);
  s.quadraticCurveTo(0.475, 0.075, 0.475, 0.13);
  s.quadraticCurveTo(0.47, 0.2, 0.36, 0.215);
  s.lineTo(0.16, 0.235);
  s.lineTo(-0.36, 0.24);
  s.lineTo(-0.44, 0.235);
  s.quadraticCurveTo(-0.48, 0.2, -0.475, 0.12);
  s.quadraticCurveTo(-0.47, 0.075, -0.46, 0.07);
  const g = new THREE.ExtrudeGeometry(s, { depth: CAR.width - 0.06, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4, curveSegments: 16 });
  g.translate(0, 0, -(CAR.width - 0.06) / 2);
  return g;
}

/** Glass cabin: windscreen, side windows and rear window in one piece. */
function carCabinGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0.17, 0.24);
  s.quadraticCurveTo(0.1, 0.33, 0.02, 0.345);
  s.lineTo(-0.2, 0.347);
  s.quadraticCurveTo(-0.29, 0.335, -0.35, 0.245);
  s.lineTo(0.17, 0.24);
  const depth = CAR.width - 0.12;
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 12 });
  g.translate(0, 0, -depth / 2);
  return g;
}

interface CarGeo {
  body: THREE.BufferGeometry;
  glass: THREE.BufferGeometry;
  roof: THREE.BufferGeometry;
  tyre: THREE.BufferGeometry;
  hub: THREE.BufferGeometry;
}

/** One set of car geometry, shared by every car in a scene (the lot, the garage at home). */
export function useCarGeo() {
  return useDisposable(() => {
    const geo: CarGeo = {
      body: carBodyGeometry(),
      glass: carCabinGeometry(),
      roof: new RoundedBoxGeometry(0.27, 0.03, 0.4, 2, 0.012),
      tyre: new THREE.CylinderGeometry(CAR.wheel, CAR.wheel, 0.06, 24),
      hub: new THREE.CylinderGeometry(CAR.wheel * 0.55, CAR.wheel * 0.55, 0.012, 24),
    };
    return { geo, dispose: () => Object.values(geo).forEach((g) => g.dispose()) };
  }, []);
}

function plateTexture(text: string, font: string, ready: boolean) {
  return canvasTexture(360, 100, (ctx, w, h) => {
    ctx.fillStyle = "#f4f3ee";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, w - 8, h - 8);
    if (!ready) return;
    ctx.fillStyle = "#15151a";
    ctx.font = canvasFont(700, 62, font);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, h / 2 + 3);
  });
}

export function Car({
  geo,
  color,
  plate,
  font,
  ready,
  roll = 0,
  braking = 0,
  plateAt = "rear",
}: {
  geo: CarGeo;
  color: string;
  plate: string;
  font: string;
  ready: boolean;
  /** Wheel rotation, radians. */
  roll?: number;
  braking?: number;
  plateAt?: "front" | "rear";
}) {
  const plateMap = useDisposable(() => plateTexture(plate, font, ready), [plate, font, ready]);
  const wheels: [number, number][] = [
    [0.29, 1],
    [0.29, -1],
    [-0.29, 1],
    [-0.29, -1],
  ];
  return (
    <group>
      <mesh geometry={geo.body}>
        <meshPhysicalMaterial color={color} roughness={0.32} metalness={0.25} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh geometry={geo.glass}>
        <meshPhysicalMaterial color="#121419" roughness={0.08} metalness={0.4} clearcoat={1} />
      </mesh>
      <mesh geometry={geo.roof} position={[-0.09, 0.37, 0]}>
        <meshPhysicalMaterial color={color} roughness={0.32} metalness={0.25} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      {wheels.map(([x, side]) => (
        <group key={`${x}${side}`} position={[x, CAR.wheel, side * (CAR.width / 2 - 0.005)]} rotation={[0, 0, -roll]}>
          <mesh geometry={geo.tyre} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#141416" roughness={0.85} />
          </mesh>
          <mesh geometry={geo.hub} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.024]}>
            <meshPhysicalMaterial color="#c8c7c2" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* head and tail lights */}
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh position={[0.472, 0.165, side * 0.15]}>
            <boxGeometry args={[0.02, 0.035, 0.09]} />
            <meshBasicMaterial color="#fff4d6" toneMapped={false} />
          </mesh>
          <mesh position={[-0.472, 0.19, side * 0.15]}>
            <boxGeometry args={[0.02, 0.032, 0.1]} />
            <meshBasicMaterial color={new THREE.Color("#ff2a1a").multiplyScalar(0.6 + braking * 2.4)} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh position={plateAt === "front" ? [0.508, 0.12, 0] : [-0.508, 0.13, 0]} rotation={[0, plateAt === "front" ? Math.PI / 2 : -Math.PI / 2, 0]}>
        <planeGeometry args={[0.2, 0.056]} />
        <meshBasicMaterial map={plateMap} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const approachPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(ROAD_END - 0.5, 0, LANE_Z),
  new THREE.Vector3((ROAD_END + STOP_X) / 2, 0, LANE_Z),
  new THREE.Vector3(STOP_X, 0, LANE_Z),
]);
const parkPath = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(STOP_X, 0, LANE_Z),
    new THREE.Vector3(2.2, 0, LANE_Z),
    new THREE.Vector3(1.15, 0, LANE_Z - 0.02),
    new THREE.Vector3(0.48, 0, LANE_Z - 0.2),
    new THREE.Vector3(0.12, 0, 0.0),
    new THREE.Vector3(BAYS[TARGET_BAY], 0, -0.55),
    new THREE.Vector3(BAYS[TARGET_BAY], 0, BAY_Z),
  ],
  false,
  "catmullrom",
  0.5
);
const APPROACH_LEN = approachPath.getLength();
const PARK_LEN = parkPath.getLength();

function poseOn(curve: THREE.CatmullRomCurve3, t: number) {
  const u = clamp01(t);
  const p = curve.getPointAt(u);
  const tan = curve.getTangentAt(u);
  return { p, yaw: Math.atan2(-tan.z, tan.x) };
}

// ─── Lot pieces ───────────────────────────────────────────────────────────────

function lotMarkings(font: string, ready: boolean) {
  const S = 300;
  return canvasTexture(LOT.w * S, LOT.d * S, (ctx, w, h) => {
    const X = (x: number) => (x + LOT.w / 2) * S;
    const Z = (z: number) => (z + LOT.d / 2) * S;
    // sidewalk strip along the front
    ctx.fillStyle = "rgba(207,204,196,0.9)";
    ctx.fillRect(0, Z(1.12), w, h - Z(1.12));
    ctx.strokeStyle = "rgba(241,239,233,0.92)";
    ctx.fillStyle = "rgba(241,239,233,0.92)";
    // bay dividers
    ctx.lineWidth = 9;
    const half = 0.45;
    [...BAYS.map((b) => b - half), BAYS[BAYS.length - 1] + half].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(X(x), Z(BAY_Z - 0.62));
      ctx.lineTo(X(x), Z(BAY_Z + 0.62));
      ctx.stroke();
    });
    // bay mouth ticks + numbers
    if (ready) {
      ctx.font = canvasFont(700, 40, font);
      ctx.textAlign = "center";
      BAYS.forEach((x, i) => ctx.fillText(`A-0${i + 1}`, X(x), Z(BAY_Z + 0.52)));
    }
    // lane centre dashes
    ctx.setLineDash([46, 34]);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(X(-2.5), Z(LANE_Z));
    ctx.lineTo(X(1.9), Z(LANE_Z));
    ctx.stroke();
    ctx.setLineDash([]);
    // direction arrows, pointing into the lot
    const arrow = (x: number) => {
      ctx.save();
      ctx.translate(X(x), Z(LANE_Z + 0.26));
      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.lineTo(10, -30);
      ctx.lineTo(10, -12);
      ctx.lineTo(60, -12);
      ctx.lineTo(60, 12);
      ctx.lineTo(10, 12);
      ctx.lineTo(10, 30);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    arrow(1.35);
    // zebra at the gate
    for (let i = 0; i < 6; i++) ctx.fillRect(X(1.95) + i * 26, Z(0.22), 14, Z(1.02) - Z(0.22));
    // zone name
    if (ready) {
      ctx.font = canvasFont(700, 110, font);
      ctx.textAlign = "left";
      ctx.globalAlpha = 0.9;
      ctx.fillText("ZONE A", X(-0.95), Z(LANE_Z + 0.36));
      ctx.globalAlpha = 1;
    }
    // hatched keep-clear box by the sign
    ctx.save();
    ctx.beginPath();
    ctx.rect(X(-2.55), Z(1.14), X(-1.0) - X(-2.55), Z(1.75) - Z(1.14));
    ctx.clip();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(252,118,67,0.8)";
    for (let i = -20; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(X(-2.55) + i * 30, Z(1.14));
      ctx.lineTo(X(-2.55) + i * 30 + 190, Z(1.75));
      ctx.stroke();
    }
    ctx.restore();
  });
}

function Curb() {
  const t = 0.12;
  const hgt = 0.1;
  // The right side is open at the lane — that's the gate.
  const pieces: [number, number, number, number][] = [
    [0, -LOT.d / 2 + t / 2, LOT.w, t], // back
    [0, LOT.d / 2 - t / 2, LOT.w, t], // front
    [-LOT.w / 2 + t / 2, 0, t, LOT.d], // left
    [LOT.w / 2 - t / 2, (-LOT.d / 2 + (LANE_Z - 0.42)) / 2, t, LANE_Z - 0.42 + LOT.d / 2], // right, behind the lane
    [LOT.w / 2 - t / 2, (LOT.d / 2 + (LANE_Z + 0.46)) / 2, t, LOT.d / 2 - (LANE_Z + 0.46)], // right, in front of the lane
  ];
  const geos = useDisposable(() => {
    const list = pieces.map(([, , w, d]) => new RoundedBoxGeometry(w, hgt, d, 2, 0.03));
    return { list, dispose: () => list.forEach((g) => g.dispose()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <group>
      {pieces.map(([x, z], i) => (
        <mesh key={i} geometry={geos.list[i]} position={[x, hgt / 2, z]}>
          <meshStandardMaterial color={PARADA.concrete} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Gate({ barrier, time }: { barrier: number; time: number }) {
  const stripes = useDisposable(
    () =>
      canvasTexture(512, 32, (ctx, w, h) => {
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = i % 2 ? "#f3f1ec" : SITE.accent;
          ctx.fillRect((i * w) / 8, 0, w / 8, h);
        }
      }),
    []
  );
  const lift = easeInOut(clamp01(barrier)) * 1.38;
  const beacon = barrier > 0.02 && barrier < 0.98 ? (Math.sin(time * 18) > 0 ? 1 : 0.15) : 0.15;
  return (
    <group position={[GATE_X, 0, LANE_Z + 0.58]}>
      {/* housing */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.2, 0.52, 0.2]} />
        <meshPhysicalMaterial color="#e9e7e1" roughness={0.4} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 0.05, 16]} />
        <meshBasicMaterial color={new THREE.Color(PARADA.amber).multiplyScalar(0.4 + beacon * 1.8)} toneMapped={false} />
      </mesh>
      {/* arm, pivoting at the housing */}
      <group position={[0, 0.42, -0.05]} rotation={[lift, 0, 0]}>
        <mesh position={[0, 0, -0.62]}>
          <boxGeometry args={[0.05, 0.05, 1.18]} />
          <meshStandardMaterial map={stripes} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// The car arrives nose-first (heading -x), so its front plate faces the gate.
const PLATE_AT = new THREE.Vector3(STOP_X - 0.512, 0.12, LANE_Z);
// On the sidewalk just inside the gate, looking back out at the arriving plate.
const CAMERA_AT = new THREE.Vector3(GATE_X - 0.3, 1.18, LANE_Z + 0.66);

function GateCamera({ scan }: { scan: number }) {
  const { quat, dist } = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(CAMERA_AT, PLATE_AT, new THREE.Vector3(0, 1, 0));
    return { quat: new THREE.Quaternion().setFromRotationMatrix(m), dist: CAMERA_AT.distanceTo(PLATE_AT) };
  }, []);
  const beam = useDisposable(() => {
    const g = new THREE.CylinderGeometry(0.03, 0.2, dist, 32, 1, true);
    g.translate(0, -dist / 2, 0);
    g.rotateX(Math.PI / 2); // point along -Z: Matrix4.lookAt aims -Z at the target, like a camera
    return g;
  }, [dist]);
  const s = clamp01(scan);
  return (
    <group>
      {/* pole */}
      <mesh position={[CAMERA_AT.x, 0.62, CAMERA_AT.z]}>
        <cylinderGeometry args={[0.028, 0.034, 1.24, 16]} />
        <meshPhysicalMaterial color="#3a3b40" roughness={0.4} metalness={0.7} />
      </mesh>
      <group position={CAMERA_AT} quaternion={quat}>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.13, 0.12, 0.34]} />
          <meshPhysicalMaterial color="#f2f1ec" roughness={0.35} clearcoat={0.6} />
        </mesh>
        {/* sun hood */}
        <mesh position={[0, 0.075, -0.02]}>
          <boxGeometry args={[0.16, 0.012, 0.42]} />
          <meshPhysicalMaterial color="#e6e5df" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.115]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 24]} />
          <meshPhysicalMaterial color="#0a0a0c" roughness={0.05} metalness={0.5} clearcoat={1} />
        </mesh>
        <mesh position={[0.045, -0.035, -0.11]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color={s > 0.05 ? "#ff3b2f" : "#551311"} toneMapped={false} />
        </mesh>
        {/* scan beam */}
        <mesh geometry={beam} position={[0, 0, -0.12]} visible={s > 0.01}>
          <meshBasicMaterial
            color={PARADA.mint}
            transparent
            opacity={0.16 * s}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>
      {/* reticle brackets around the plate */}
      <group position={[PLATE_AT.x - 0.03, PLATE_AT.y, PLATE_AT.z]} rotation={[0, Math.PI / 2, 0]} scale={0.9 + 0.3 * (1 - s)} visible={s > 0.01}>
        {[
          [-1, 1],
          [1, 1],
          [-1, -1],
          [1, -1],
        ].map(([sx, sy]) => (
          <group key={`${sx}${sy}`} position={[sx * 0.14, sy * 0.055, 0]}>
            <mesh position={[-sx * 0.02, 0, 0]}>
              <boxGeometry args={[0.05, 0.008, 0.004]} />
              <meshBasicMaterial color={PARADA.mint} transparent opacity={s} toneMapped={false} />
            </mesh>
            <mesh position={[0, -sy * 0.016, 0]}>
              <boxGeometry args={[0.008, 0.04, 0.004]} />
              <meshBasicMaterial color={PARADA.mint} transparent opacity={s} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function ZoneSign({ free, capacity, font, ready }: { free: number; capacity: number; font: string; ready: boolean }) {
  const n = Math.round(free);
  const map = useDisposable(
    () =>
      canvasTexture(600, 420, (ctx, w, h) => {
        ctx.fillStyle = "#0b0c10";
        ctx.fillRect(0, 0, w, h);
        if (!ready) return;
        const status = n === 0 ? PARADA.coral : n / capacity < 0.2 ? PARADA.amber : PARADA.mint;
        ctx.fillStyle = "#f1efe9";
        ctx.font = canvasFont(700, 44, font);
        ctx.fillText("ZONE A", 40, 78);
        ctx.fillStyle = status;
        ctx.beginPath();
        ctx.arc(w - 64, 62, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = status;
        ctx.shadowBlur = 24;
        ctx.font = canvasFont(700, 210, font);
        ctx.fillText(String(n).padStart(2, "0"), 32, 290);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(241,239,233,0.7)";
        ctx.font = canvasFont(500, 38, font);
        ctx.fillText(`/ ${capacity} FREE`, 330, 290);
        // occupancy bar
        ctx.fillStyle = "rgba(241,239,233,0.15)";
        ctx.fillRect(40, 340, w - 80, 22);
        ctx.fillStyle = status;
        ctx.fillRect(40, 340, (w - 80) * (1 - n / capacity), 22);
      }),
    [n, capacity, font, ready]
  );
  return (
    <group position={[-1.78, 0, 1.44]} rotation={[0, 0.18, 0]}>
      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.3, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.6, 12]} />
          <meshPhysicalMaterial color="#3a3b40" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.94, 0.68, 0.07]} />
        <meshPhysicalMaterial color="#17181d" roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.78, 0.037]}>
        <planeGeometry args={[0.84, 0.588]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** PARADA's ribbon "P" as a sculpture: one folded band, orange on the front, ink on the back. */
function RibbonP() {
  const geometry = useDisposable(() => {
    // Stem up, over the bowl, back across the stem and out as a leg — like the logo.
    // z lifts the returning band over the stem where they cross.
    const pts: [number, number, number][] = [
      [0.0, -0.02, 0],
      [0.0, 0.7, 0],
      [0.03, 1.5, 0],
      [0.2, 1.95, 0.02],
      [0.62, 2.1, 0.06],
      [1.05, 1.95, 0.1],
      [1.25, 1.55, 0.12],
      [1.1, 1.15, 0.14],
      [0.7, 0.98, 0.16],
      [0.3, 1.05, 0.2],
      [0.12, 1.2, 0.22],
      [0.18, 0.8, 0.24],
      [0.4, 0.35, 0.22],
      [0.62, -0.02, 0.2],
    ];
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, "centripetal");
    const z = new THREE.Vector3(0, 0, 1);
    // The band's width lies in the letter's plane and twists a little, so both faces show.
    return ribbonGeometry(curve, 0.34, 360, (t, tan) => {
      const inPlane = new THREE.Vector3(-tan.y, tan.x, 0).normalize();
      const twist = Math.sin(t * Math.PI * 2.2) * 0.55;
      return inPlane.multiplyScalar(Math.cos(twist)).add(z.clone().multiplyScalar(Math.sin(twist)));
    });
  }, []);
  const plinth = useDisposable(() => new RoundedBoxGeometry(0.9, 0.12, 0.62, 3, 0.04), []);
  return (
    <group position={[2.05, 0, -1.3]} rotation={[0, 0.42, 0]}>
      <mesh geometry={plinth} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#1b1c20" roughness={0.6} />
      </mesh>
      <group position={[-0.28, 0.12, 0]} scale={0.5}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial color={PARADA.sunset} roughness={0.4} clearcoat={0.6} side={THREE.FrontSide} />
        </mesh>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial color="#111114" roughness={0.45} clearcoat={0.4} side={THREE.BackSide} />
        </mesh>
      </group>
    </group>
  );
}

/** The entry road running out of the gate, so the car arrives on tarmac. */
function Road() {
  const len = ROAD_END - LOT.w / 2;
  const road = useDisposable(() => new RoundedBoxGeometry(len + 0.1, 0.2, 1.0, 3, 0.06), [len]);
  const marks = useDisposable(
    () =>
      canvasTexture(len * 200, 200, (ctx, w, h) => {
        ctx.strokeStyle = "rgba(241,239,233,0.9)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, 14);
        ctx.lineTo(w, 14);
        ctx.moveTo(0, h - 14);
        ctx.lineTo(w, h - 14);
        ctx.stroke();
        // stop line at the gate
        ctx.fillStyle = "rgba(241,239,233,0.92)";
        ctx.fillRect(18, 20, 16, h - 40);
      }),
    [len]
  );
  const x = LOT.w / 2 + len / 2 - 0.05;
  return (
    <group position={[x, 0, LANE_Z]}>
      <mesh geometry={road} position={[0, -0.1, 0]}>
        <meshStandardMaterial color={PARADA.asphalt} roughness={0.92} />
      </mesh>
      <mesh position={[0.05, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[len, 1.0]} />
        <meshStandardMaterial map={marks} transparent roughness={0.9} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
    </group>
  );
}

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  const canopy = useDisposable(() => new THREE.IcosahedronGeometry(0.34, 1), []);
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.12, 20]} />
        <meshStandardMaterial color="#8d8a82" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.4, 8]} />
        <meshStandardMaterial color="#5c4634" roughness={0.9} />
      </mesh>
      <mesh geometry={canopy} position={[0, 0.66, 0]} scale={[1, 1.15, 1]}>
        <meshStandardMaterial color="#6f8f66" roughness={0.8} flatShading />
      </mesh>
      <mesh geometry={canopy} position={[0.14, 0.5, 0.1]} scale={0.62}>
        <meshStandardMaterial color="#7fa074" roughness={0.8} flatShading />
      </mesh>
    </group>
  );
}

// ─── The lot ──────────────────────────────────────────────────────────────────

export interface ParadaLotProps {
  font: string;
  ready: boolean;
  /** 0–1: the orange car drives up to the gate. */
  approach?: number;
  /** 0–1: the gate camera reads the plate. */
  scan?: number;
  /** 0–1: the barrier lifts. */
  barrier?: number;
  /** 0–1: the car drives from the gate into bay A-03. */
  park?: number;
  /** 0–1: the arriving car pops in (and out, between loops). */
  spawn?: number;
  /** Spaces free in the zone, shown on the sign. */
  free?: number;
  capacity?: number;
  /** Seconds, for blinking lights. */
  time?: number;
  plate?: string;
}

export function ParadaLot({
  font,
  ready,
  approach = 0,
  scan = 0,
  barrier = 0,
  park = 0,
  spawn = 1,
  free = 12,
  capacity = 40,
  time = 0,
  plate = "LNZ 2026",
}: ParadaLotProps) {
  const slab = useDisposable(() => new RoundedBoxGeometry(LOT.w, 0.2, LOT.d, 4, 0.08), []);
  const marks = useDisposable(() => lotMarkings(font, ready), [font, ready]);
  const car = useCarGeo();

  const parking = park > 0;
  const { p, yaw } = parking ? poseOn(parkPath, easeInOut(park)) : poseOn(approachPath, 1 - Math.pow(1 - clamp01(approach), 2.2));
  const travelled = parking ? APPROACH_LEN + easeInOut(park) * PARK_LEN : (1 - Math.pow(1 - clamp01(approach), 2.2)) * APPROACH_LEN;
  const waiting = approach >= 0.999 && park < 0.02;

  return (
    <group>
      <SoftShadow width={LOT.w * 1.5} depth={LOT.d * 1.6} y={-0.21} opacity={0.85} />
      <mesh geometry={slab} position={[0, -0.1, 0]}>
        <meshStandardMaterial color={PARADA.asphalt} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LOT.w, LOT.d]} />
        <meshStandardMaterial map={marks} transparent roughness={0.9} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      <Curb />
      <Road />

      {/* parked cars, nose in */}
      {[
        { i: 0, color: "#ecebe6", plate: "ABA 4411" },
        { i: 1, color: PARADA.navy, plate: "NXT 7590" },
        { i: 3, color: "#a9a8a3", plate: "DAQ 1082" },
      ].map((c) => (
        <group key={c.i} position={[BAYS[c.i], 0, BAY_Z]} rotation={[0, Math.PI / 2, 0]}>
          <Car geo={car.geo} color={c.color} plate={c.plate} font={font} ready={ready} />
        </group>
      ))}

      {/* the arriving car */}
      <group position={[p.x, 0, p.z]} rotation={[0, yaw, 0]} scale={Math.max(0.0001, easeOutBack(clamp01(spawn), 2.2))} visible={spawn > 0.001}>
        <Car
          geo={car.geo}
          color={SITE.accent}
          plate={plate}
          plateAt="front"
          font={font}
          ready={ready}
          roll={travelled / CAR.wheel}
          braking={waiting ? 1 : 0}
        />
      </group>

      <Gate barrier={barrier} time={time} />
      <GateCamera scan={scan} />
      <ZoneSign free={free} capacity={capacity} font={font} ready={ready} />
      <RibbonP />
      <Tree x={-2.36} z={-1.45} />
      <Tree x={-2.4} z={-0.42} s={0.72} />
    </group>
  );
}

export const PARADA_TARGET_BAY = TARGET_BAY;
