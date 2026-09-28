import { Environment, Lightformer } from "@react-three/drei";
import { ThreeCanvas } from "@remotion/three";
import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

export const ACCENT = "#FF4C29";
/** Surfaces on the site the transparent stills sit on — keep in sync with src/app/globals.css. */
export const PAPER = "#EFEEE9";
export const GREY = "#D3D2CC";

const fontsReady =
  typeof document === "undefined"
    ? Promise.resolve()
    : Promise.all([
        new FontFace("KeyMono", `url(${staticFile("fonts/jetbrains-mono-500.woff")})`, { weight: "500" }).load(),
        new FontFace("KeyMono", `url(${staticFile("fonts/jetbrains-mono-700.woff")})`, { weight: "700" }).load(),
      ]).then((faces) => faces.forEach((f) => document.fonts.add(f)));

/** Canvas-texture legends need the font loaded first — hold the frame until it is. */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const handle = delayRender("legend fonts");
    fontsReady.then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, []);
  return ready;
}

interface StudioProps {
  width: number;
  height: number;
  /** null renders with a transparent background (PNG stills). */
  background: string | null;
  camera: { position: [number, number, number]; fov: number };
  children: React.ReactNode;
}

/**
 * Soft product-shot lighting built from local Lightformers — no HDR download,
 * so renders are reproducible offline.
 */
export function Studio({ width, height, background, camera, children }: StudioProps) {
  return (
    <ThreeCanvas width={width} height={height} gl={{ alpha: background === null, antialias: true }} camera={camera}>
      {background && <color attach="background" args={[background]} />}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[6, 1.5, -2]} rotation-y={-Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#ffd9cc" position={[0, 2, -6]} scale={3} />
        <Lightformer form="rect" intensity={0.7} position={[0, -4, 3]} rotation-x={-Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[0, 3, 7]} scale={[10, 3, 1]} />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 8, 4]} intensity={0.9} />
      {children}
    </ThreeCanvas>
  );
}
