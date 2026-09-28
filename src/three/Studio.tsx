import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { shadowTexture, useDisposable } from "./lib";

type Former = { w: number; h: number; p: [number, number, number]; i: number; c?: string };

// Soft product-shot lighting: emissive panels ("lightformers") baked into a PMREM environment once.
// Local and deterministic — no HDR download, so the site and the renders match.
const FORMERS: Former[] = [
  { w: 8, h: 4, p: [0, 6, 1], i: 2.4 },
  { w: 5, h: 2, p: [-6, 2, 2], i: 1.4 },
  { w: 5, h: 2, p: [6, 1.5, -2], i: 1.1 },
  { w: 3, h: 3, p: [0, 2, -6], i: 0.8, c: "#ffd9cc" },
  { w: 8, h: 3, p: [0, -4, 3], i: 0.7 },
  { w: 10, h: 3, p: [0, 3, 7], i: 1.2 },
];

/** Environment + key light. `warmth` tints the rim panel (0 neutral, 1 sunset). */
export function StudioLights({ intensity = 1, warmth = 0 }: { intensity?: number; warmth?: number }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = new THREE.Scene();
    env.background = new THREE.Color("#060606");
    const disposables: { dispose: () => void }[] = [];
    for (const f of FORMERS) {
      const color = new THREE.Color(f.c ?? "#ffffff");
      if (f.c && warmth) color.lerp(new THREE.Color("#ff9a6a"), warmth);
      const geo = new THREE.PlaneGeometry(f.w, f.h);
      const mat = new THREE.MeshBasicMaterial({ color: color.multiplyScalar(f.i), side: THREE.DoubleSide, toneMapped: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...f.p);
      mesh.lookAt(0, 0, 0); // every panel faces the object
      env.add(mesh);
      disposables.push(geo, mat);
    }
    const target = pmrem.fromScene(env, 0.035);
    const previous = scene.environment;
    scene.environment = target.texture;
    return () => {
      scene.environment = previous;
      target.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [gl, scene, warmth]);

  return (
    <>
      <ambientLight intensity={0.3 * intensity} />
      <directionalLight position={[3, 8, 4]} intensity={0.9 * intensity} />
    </>
  );
}

/** A blurred blob under an object, instead of real-time shadow maps. */
export function SoftShadow({ width, depth, y = 0, opacity = 1 }: { width: number; depth: number; y?: number; opacity?: number }) {
  const map = useDisposable(() => shadowTexture(), []);
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
