import { AbsoluteFill, Audio, staticFile, Easing, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { TALA } from "../../../src/three/palette";
import { TalaDesk } from "../../../src/three/TalaDesk";
import { MONO, SERIF, Studio, useFontsReady } from "../shared/studio";
import { Label, Progress, RiseText, inOut, ramp, track, type Shot } from "./film";

// 15 s at 30 fps. A pencil writes "tala", the day turns to night, and the features
// arrive one by one. Light film on purpose: Tala is sun by day, moon by night.

const S = (s: number) => Math.round(s * 30);
const DAY = "#F3EEE2";
const NIGHT = TALA.night;

const SHOTS: Shot[] = [
  { f: 0, pos: [0.2, 7.4, 4.2], target: [0.0, 0.2, 0.1], fov: 30 },
  { f: S(1.8), pos: [0.9, 4.6, 4.9], target: [0.4, 0.3, 0.1], fov: 32 },
  { f: S(4.2), pos: [2.2, 2.3, 2.9], target: [0.95, 0.2, 0.2], fov: 30 },
  { f: S(6.8), pos: [1.3, 2.6, 3.4], target: [0.9, 0.3, 0.05], fov: 32 },
  { f: S(9.8), pos: [-0.8, 3.6, 5.6], target: [0.3, 0.8, -0.2], fov: 36 },
  { f: S(12.8), pos: [-2.4, 5.0, 4.8], target: [0.1, 0.5, 0], fov: 36 },
  { f: S(15), pos: [0.2, 6.6, 5.2], target: [0.1, 0.4, 0], fov: 34 },
];

const FEATURES = ["Apple Pencil", "PDF annotations", "Hold-to-shape", "Lasso + recolour", "Word & PowerPoint", ".zip packages", "Offline", "No account"];

export function TalaFilm() {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const ready = useFontsReady();

  const write = ramp(frame, S(2.0), S(6.6), Easing.bezier(0.35, 0.1, 0.4, 1));
  const night = ramp(frame, S(7.2), S(8.8));
  const bg = interpolateColors(night, [0, 1], [DAY, NIGHT]);
  const ink = interpolateColors(night, [0, 1], ["#171717", "#F4F1E8"]);
  const soft = interpolateColors(night, [0, 1], ["rgba(23,23,23,0.62)", "rgba(244,241,232,0.7)"]);
  const cam = track(frame, SHOTS);

  return (
    <AbsoluteFill style={{ background: bg }}>
      <Studio width={width} height={height} background={bg} camera={{ position: cam.pos, target: cam.target, fov: cam.fov ?? 34 }}>
        <TalaDesk font={MONO} ready={ready} write={write} night={night} time={frame / 30} />
      </Studio>

      {/* keeps overlay type legible: the page colour, faded out to the right */}
      <AbsoluteFill style={{ background: bg, WebkitMaskImage: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.78) 30%, transparent 56%)", maskImage: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.78) 30%, transparent 56%)" }} />

      {/* 0–2.4 s: title */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, 0, S(2.5), 1, 12) }}>
        <Label color="#B8821C">Project 02 — Notes + handwriting</Label>
        <RiseText text="Tala" frame={frame} start={4} size={160} color={ink} stagger={4} style={{ marginTop: 16 }} />
        <Label color={soft} style={{ marginTop: 4 }}>
          Pagtatala, made simple.
        </Label>
      </div>

      {/* 2.5–7 s: writing */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, S(2.6), S(7.0)) }}>
        <Label color={soft}>01 · Rich text and handwriting, side by side</Label>
        <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 56, lineHeight: 1.05, color: ink, marginTop: 14, maxWidth: 520, letterSpacing: "-0.02em" }}>
          Write the way you think.
        </div>
      </div>

      {/* 7–10 s: day to night */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, S(7.1), S(10.1)) }}>
        <Label color={soft}>02 · Themes applied before first paint</Label>
        <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 56, lineHeight: 1.05, color: ink, marginTop: 14, letterSpacing: "-0.02em" }}>
          Sun by day,
          <br />
          moon by night.
        </div>
      </div>

      {/* 10–13 s: features */}
      <div style={{ position: "absolute", left: 56, top: 48, width: 560, opacity: inOut(frame, S(10.1), S(13.1)) }}>
        <Label color={soft}>03 · New in v1.1.0</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
          {FEATURES.map((f, i) => {
            const t = ramp(frame, S(10.2) + i * 4, S(10.2) + i * 4 + 12, Easing.bezier(0.2, 0.8, 0.2, 1.2));
            return (
              <div
                key={f}
                style={{
                  fontFamily: MONO,
                  fontSize: 18,
                  fontWeight: 700,
                  padding: "10px 14px",
                  borderRadius: 999,
                  color: i === 0 ? "#2a220e" : ink,
                  background: i === 0 ? TALA.gold : "rgba(244,241,232,0.08)",
                  border: `1px solid ${i === 0 ? TALA.gold : "rgba(244,241,232,0.3)"}`,
                  transform: `scale(${0.6 + 0.4 * t}) translateY(${(1 - t) * 18}px)`,
                  opacity: t,
                }}
              >
                {f}
              </div>
            );
          })}
        </div>
      </div>

      {/* 13–15 s: end card */}
      <div style={{ position: "absolute", left: 56, bottom: 96, opacity: ramp(frame, S(13.1), S(13.6)) }}>
        <RiseText text="Tala" frame={frame} start={S(13.1)} size={130} color={ink} stagger={3} />
        <Label color={soft} style={{ marginTop: 6 }}>
          v1.1.0 · Windows · Web · MIT
        </Label>
        <Label color={TALA.gold} style={{ marginTop: 10 }}>
          github.com/E1yWrites/tala
        </Label>
      </div>

      {/* Soundtrack synthesised by audio/compose.py, cued to this timeline. */}
      <Audio src={staticFile("audio/tala.mp3")} />
      <Progress frame={frame} total={durationInFrames} color={ink} />
    </AbsoluteFill>
  );
}
