import { useVideoConfig } from "remotion";
import { Macropad } from "../../../src/three/Macropad";
import { ParadaLot } from "../../../src/three/ParadaLot";
import { TalaDesk } from "../../../src/three/TalaDesk";
import { MACROPAD_YAW, VIEWS } from "../../../src/three/views";
import { MONO, Studio, useFontsReady } from "../shared/studio";

// Transparent renders of each model. The site shows these first (and keeps them
// under reduced motion or without WebGL); the live model takes over once loaded.
// Camera framing comes from src/three/views.ts, shared with the live scenes.

export function MacropadStill() {
  const { width, height } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <Studio width={width} height={height} background={null} camera={VIEWS.macropad}>
      <group rotation={[0, MACROPAD_YAW, 0]}>
        <Macropad font={MONO} ready={ready} press={[0, 0, 0, 0]} knob={0.6} screen={{ title: "LORENZ.DEV", sub: "HOVER A KEY · CLICK TO OPEN", meter: 0.25 }} />
      </group>
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
