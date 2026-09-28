import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import type * as THREE from "three";
import { useEffect, useLayoutEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { StudioLights } from "../../../src/three/Studio";

/** FontFace names used by canvas legends (mono) and overlay type (serif, sans). */
export const MONO = "KeyMono";
export const SERIF = "Display";

const fontsReady =
  typeof document === "undefined"
    ? Promise.resolve()
    : Promise.all([
        new FontFace(MONO, `url(${staticFile("fonts/jetbrains-mono-500.woff")})`, { weight: "500" }).load(),
        new FontFace(MONO, `url(${staticFile("fonts/jetbrains-mono-700.woff")})`, { weight: "700" }).load(),
        new FontFace(SERIF, `url(${staticFile("fonts/newsreader-300.woff")})`, { weight: "300" }).load(),
      ]).then((faces) => faces.forEach((f) => document.fonts.add(f)));

/**
 * Canvas-texture text needs the fonts loaded first — hold the frame until they are.
 * Call it in the composition, *outside* <ThreeCanvas>: state changes inside the canvas
 * don't trigger a redraw in Remotion's frame loop.
 */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const handle = delayRender("fonts");
    fontsReady.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, []);
  return ready;
}

type Vec3 = [number, number, number];

/** Points the camera every frame — Remotion re-renders the tree per frame, so this follows animated props. */
function Aim({ position, target, fov }: { position: Vec3; target: Vec3; fov: number }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.fov = fov;
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  });
  return null;
}

interface StudioProps {
  width: number;
  height: number;
  /** null renders with a transparent background (stills with alpha). */
  background: string | null;
  camera: { position: Vec3; target?: Vec3; fov: number };
  children: React.ReactNode;
}

/** The same lighting the site uses (src/three/Studio.tsx), inside a Remotion canvas. */
export function Studio({ width, height, background, camera, children }: StudioProps) {
  return (
    <ThreeCanvas width={width} height={height} gl={{ alpha: background === null, antialias: true }} camera={{ position: camera.position, fov: camera.fov }}>
      {background && <color attach="background" args={[background]} />}
      <Aim position={camera.position} target={camera.target ?? [0, 0, 0]} fov={camera.fov} />
      <StudioLights />
      {children}
    </ThreeCanvas>
  );
}
