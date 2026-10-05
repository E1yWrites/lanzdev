import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";
import { ParadaLot } from "../../../src/three/ParadaLot";
import { Room } from "../../../src/three/Room";
import { ROOM_VIEW } from "../../../src/three/roomObjects";
import { TalaDesk } from "../../../src/three/TalaDesk";
import { VIEWS } from "../../../src/three/views";
import { MONO, SERIF, Studio, useFontsReady } from "../shared/studio";

// Transparent renders of each model. The site shows these first (and keeps them
// under reduced motion or without WebGL); the live model takes over once loaded.
// Camera framing comes from src/three/views.ts, shared with the live scenes.

/** The portrait in the room's frame, held until it has loaded. Call outside <ThreeCanvas>. */
function usePortrait() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const handle = delayRender("portrait");
    new THREE.TextureLoader().load(staticFile("portrait.webp"), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setTexture(t);
      continueRender(handle);
    });
  }, []);
  return texture;
}

/** The hero room as the site first paints it: the live room's opening frame. */
export function RoomStill() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  const portrait = usePortrait();
  return (
    <Studio width={width} height={height} background={null} camera={ROOM_VIEW} lights={false}>
      <Room font={MONO} display={SERIF} ready={ready} portrait={portrait} />
    </Studio>
  );
}

export function ParadaStill() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <Studio width={width} height={height} background={null} camera={VIEWS.parada}>
      <ParadaLot font={MONO} ready={ready} approach={1} scan={1} barrier={0.35} free={12} time={0.2} />
    </Studio>
  );
}

export function TalaStill() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <Studio width={width} height={height} background={null} camera={VIEWS.tala}>
      <TalaDesk font={MONO} ready={ready} write={0.93} night={0} time={0.6} />
    </Studio>
  );
}
