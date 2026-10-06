import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import * as THREE from "three";
import { ParadaLot } from "../../../src/three/ParadaLot";
import { loadFurniture, type Furniture } from "../../../src/three/furniture";
import { HouseModel } from "../../../src/three/HouseModel";
import { HOUSE_VIEW } from "../../../src/three/housePlan";
import { Room } from "../../../src/three/Room";
import { ROOM_VIEW } from "../../../src/three/roomObjects";
import { TalaDesk } from "../../../src/three/TalaDesk";
import { VIEWS } from "../../../src/three/views";
import { MONO, SERIF, Studio, useFontsReady } from "../shared/studio";

// Transparent renders of each model. The site shows these first (and keeps them
// under reduced motion or without WebGL); the live model takes over once loaded.
// Camera framing comes from src/three/views.ts, shared with the live scenes.

/** A picture from art/public as a texture, held until it has loaded. Call outside <ThreeCanvas>. */
function usePicture(file: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const handle = delayRender(file);
    new THREE.TextureLoader().load(staticFile(file), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setTexture(t);
      continueRender(handle);
    });
  }, [file]);
  return texture;
}

/** The furniture kit from art/public/furniture, held until every piece has loaded. */
function useFurnitureSet() {
  const [set, setSet] = useState<Furniture | null>(null);
  useEffect(() => {
    const handle = delayRender("furniture");
    loadFurniture((n) => staticFile(`furniture/${n}.glb`)).then((s) => {
      setSet(s);
      continueRender(handle);
    });
  }, []);
  return set;
}

/** The portrait in the room's frame. */
const usePortrait = () => usePicture("portrait.webp");

/** The hero room as the site first paints it: the live room's opening frame. On phones the headline is set as type above the room, so its wall is left blank. */
export function RoomStill({ headline = true }: { headline?: boolean }) {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  const portrait = usePortrait();
  return (
    <Studio width={width} height={height} background={null} camera={ROOM_VIEW} lights={false}>
      <Room font={MONO} display={SERIF} ready={ready} portrait={portrait} headline={headline} />
    </Studio>
  );
}

/** The house from above, roof off, every lamp at rest: the home page under the room. */
export function HouseStill() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  const portrait = usePortrait();
  const film = usePicture("parada-film.jpg");
  const furniture = useFurnitureSet();
  return (
    <Studio width={width} height={height} background={null} camera={HOUSE_VIEW} lights={false} shadows>
      <HouseModel font={MONO} ready={ready} portrait={portrait} film={film} furniture={furniture} />
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
