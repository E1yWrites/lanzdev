import { AbsoluteFill, useVideoConfig } from "remotion";
import { MARK_L, MARK_STAR } from "../../../src/components/brand/mark";
import { Macropad } from "../../../src/three/Macropad";
import { SITE } from "../../../src/three/palette";
import { MONO, SERIF, Studio, useFontsReady } from "../shared/studio";
import { MACROPAD_YAW, VIEWS } from "../../../src/three/views";

const INK = SITE.ink;

const label: React.CSSProperties = {
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: 19,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: INK,
};

/** 1200×630 Open Graph image: the mark and statement on the left, the macropad on the right. */
export function ShareImage() {
  const { height } = useVideoConfig();
  const ready = useFontsReady();
  return (
    <AbsoluteFill style={{ background: SITE.paper }}>
      <AbsoluteFill style={{ left: 440 }}>
        <Studio width={760} height={height} background={null} camera={{ ...VIEWS.macropad, fov: 33 }}>
          <group rotation={[0, MACROPAD_YAW, 0]}>
            <Macropad font={MONO} ready={ready} knob={0.6} screen={{ title: "LORENZ.DEV", sub: "PARADA · TALA · ABOUT", meter: 0.5 }} />
          </group>
        </Studio>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 52, display: "flex", alignItems: "center", gap: 14 }}>
        <svg width={34} height={34} viewBox="6 5 52 53">
          <path d={MARK_L} fill={INK} />
          <path d={MARK_STAR} fill={SITE.accent} />
        </svg>
        <span style={label}>
          lorenz<span style={{ color: SITE.accent }}>.</span>dev
        </span>
      </div>
      <div style={{ position: "absolute", left: 56, top: 196, fontFamily: SERIF, fontWeight: 300, fontSize: 82, lineHeight: 1, letterSpacing: "-0.03em", color: INK }}>
        Software for
        <br />
        curious people<span style={{ color: SITE.accent }}>.</span>
      </div>
      <div style={{ ...label, position: "absolute", left: 60, bottom: 54, opacity: 0.65 }}>Lorenz Malabanan · PARADA · Tala — Batangas, PH</div>
    </AbsoluteFill>
  );
}
