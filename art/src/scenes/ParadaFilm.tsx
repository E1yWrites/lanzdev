import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ParadaLot } from "../../../src/three/ParadaLot";
import { PARADA, SITE } from "../../../src/three/palette";
import { MONO, SERIF, Studio, useFontsReady } from "../shared/studio";
import { Decode, Label, Progress, RiseText, inOut, ramp, track, type Shot } from "./film";

// 15 s at 30 fps. A car arrives, the gate camera reads its plate, the barrier lifts,
// it parks, and Zone A's count drops by one — then how that number travels.

const S = (s: number) => Math.round(s * 30);
const INK = "#EDEDEA";

const SHOTS: Shot[] = [
  { f: 0, pos: [0.4, 9.5, 6.5], target: [0.4, 0, 0.2], fov: 30 },
  { f: S(1.6), pos: [1.2, 7.2, 7.4], target: [0.8, 0, 0.3], fov: 32 },
  { f: S(3.4), pos: [6.2, 1.9, 3.2], target: [3.4, 0.25, 0.6], fov: 34 },
  { f: S(5.4), pos: [4.9, 1.25, 2.1], target: [3.05, 0.25, 0.62], fov: 30 },
  { f: S(6.6), pos: [4.6, 2.8, 4.0], target: [2.2, 0.2, 0.3], fov: 36 },
  { f: S(9.4), pos: [-2.4, 4.6, 6.8], target: [-1.0, 0.1, -0.2], fov: 36 },
  { f: S(12.4), pos: [-3.4, 5.4, 5.2], target: [0.4, 0.1, 0], fov: 38 },
  { f: S(15), pos: [0.2, 9.8, 6.0], target: [0.4, 0, 0.2], fov: 32 },
];

const PIPELINE = ["Camera", "Vision / OCR", "API", "PostgreSQL", "SSE", "Mobile + Admin"];

function Pipeline({ frame, start }: { frame: number; start: number }) {
  const show = inOut(frame, start, S(12.6), 12, 12);
  return (
    <div style={{ position: "absolute", left: 56, right: 56, bottom: 110, opacity: show }}>
      <Label color={`${INK}99`}>How the number travels</Label>
      <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
        {PIPELINE.map((node, i) => {
          const t = ramp(frame, start + i * 6, start + i * 6 + 14);
          const packet = ((frame - start) / 26) % 1;
          return (
            <div key={node} style={{ display: "flex", alignItems: "center", flex: i < PIPELINE.length - 1 ? 1 : "none" }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 17,
                  fontWeight: 700,
                  color: i === 2 ? "#111" : INK,
                  background: i === 2 ? SITE.accent : "rgba(255,255,255,0.06)",
                  border: `1px solid ${i === 2 ? SITE.accent : "rgba(237,237,234,0.35)"}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  whiteSpace: "nowrap",
                  transform: `translateY(${(1 - t) * 16}px)`,
                  opacity: t,
                }}
              >
                {node}
              </div>
              {i < PIPELINE.length - 1 && (
                <div style={{ position: "relative", flex: 1, height: 2, margin: "0 10px", background: `rgba(237,237,234,${0.25 * t})` }}>
                  <div
                    style={{
                      position: "absolute",
                      top: -3,
                      left: `${packet * 100}%`,
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      background: PARADA.mint,
                      boxShadow: `0 0 12px ${PARADA.mint}`,
                      opacity: t,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ParadaFilm() {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const ready = useFontsReady();

  const approach = ramp(frame, S(1.6), S(4.1), Easing.bezier(0.3, 0, 0.2, 1));
  const scan = inOut(frame, S(4.2), S(6.9), 8, 12);
  const barrier = ramp(frame, S(5.9), S(6.7)) - ramp(frame, S(9.6), S(10.4));
  const park = ramp(frame, S(6.6), S(9.2), Easing.bezier(0.45, 0, 0.3, 1));
  const free = frame >= S(9.0) ? 11 : 12;
  const cam = track(frame, SHOTS);
  const dim = interpolate(frame, [S(9.3), S(9.9), S(12.4), S(13)], [0, 0.55, 0.55, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: SITE.paper }}>
      <Studio width={width} height={height} background={SITE.paper} camera={{ position: cam.pos, target: cam.target, fov: cam.fov ?? 34 }}>
        <ParadaLot font={MONO} ready={ready} approach={approach} scan={scan} barrier={barrier} park={park} free={free} time={frame / 30} />
      </Studio>
      <AbsoluteFill style={{ background: `rgba(12,12,12,${dim})` }} />
      {/* keeps overlay type legible over the scene */}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(12,12,12,0.82) 0%, rgba(12,12,12,0.45) 32%, rgba(12,12,12,0) 56%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(12,12,12,0.7) 0%, rgba(12,12,12,0) 34%)" }} />

      {/* 0–2.4 s: title */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, 0, S(2.6), 1, 12) }}>
        <Label color={SITE.accent}>Project 01 — Smart parking</Label>
        <RiseText text="PARADA" frame={frame} start={4} size={150} color={INK} stagger={3} style={{ marginTop: 18 }} />
        <Label color={`${INK}B3`} style={{ marginTop: 6 }}>
          Zone-level availability from OCR-assisted gate cameras
        </Label>
      </div>

      {/* 2.4–4.2 s: the car arrives */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, S(2.6), S(4.2)) }}>
        <Label color={`${INK}B3`}>01 · A car arrives at Zone A</Label>
      </div>

      {/* 4.2–6.9 s: plate read */}
      <div style={{ position: "absolute", right: 56, top: 48, width: 430, opacity: inOut(frame, S(4.3), S(6.9)) }}>
        <Label color={`${INK}B3`}>02 · The gate camera reads the plate</Label>
        <div style={{ marginTop: 16, background: "rgba(10,10,12,0.82)", border: `1px solid ${PARADA.mint}66`, borderRadius: 10, padding: "18px 20px" }}>
          <Label color={PARADA.mint}>OpenCV → EasyOCR</Label>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 48, color: INK, marginTop: 10, letterSpacing: "0.04em" }}>
            <Decode text="LNZ 2026" frame={frame} start={S(4.4)} duration={S(1.1)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <Label color={`${INK}99`}>trusted at ≥ 0.50</Label>
            <Label color={frame > S(5.6) ? PARADA.mint : `${INK}55`}>{frame > S(5.6) ? "registered ✓" : "resolving…"}</Label>
          </div>
        </div>
      </div>

      {/* 6.9–9.4 s: parking, the number changes */}
      <div style={{ position: "absolute", left: 56, top: 48, opacity: inOut(frame, S(6.9), S(9.6)) }}>
        <Label color={`${INK}B3`}>03 · One transaction, one number</Label>
        <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 64, lineHeight: 1.05, color: INK, marginTop: 16, letterSpacing: "-0.02em" }}>
          available =<br />
          capacity − occupied
        </div>
        <Label color={PARADA.mint} style={{ marginTop: 18 }}>
          Zone A · {free} free
        </Label>
      </div>

      <Pipeline frame={frame} start={S(9.6)} />

      {/* 12.6–15 s: end card */}
      <div style={{ position: "absolute", left: 56, bottom: 96, opacity: ramp(frame, S(12.8), S(13.3)) }}>
        <RiseText text="PARADA" frame={frame} start={S(12.8)} size={120} color={INK} stagger={2} />
        <Label color={`${INK}CC`} style={{ marginTop: 8 }}>
          Phases 0–14 done · 801 tests passing · deployment under way
        </Label>
        <Label color={SITE.accent} style={{ marginTop: 10 }}>
          parada-landing.vercel.app
        </Label>
      </div>

      <Progress frame={frame} total={durationInFrames} color={INK} />
    </AbsoluteFill>
  );
}
