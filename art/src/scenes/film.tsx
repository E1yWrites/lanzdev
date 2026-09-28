import { Easing, interpolate } from "remotion";
import { MONO, SERIF } from "../shared/studio";

// Building blocks shared by the two 15-second films.

export type Vec3 = [number, number, number];
export interface Shot {
  /** Frame this key is reached. */
  f: number;
  pos: Vec3;
  target: Vec3;
  fov?: number;
}

const ease = Easing.bezier(0.65, 0, 0.35, 1);

/** Camera position/target/fov at `frame`, eased between keyframes. */
export function track(frame: number, shots: Shot[]) {
  if (frame <= shots[0].f) return shots[0];
  for (let i = 0; i < shots.length - 1; i++) {
    const a = shots[i];
    const b = shots[i + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / (b.f - a.f));
      const mix = (x: Vec3, y: Vec3) => x.map((v, k) => v + (y[k] - v) * t) as Vec3;
      return { f: frame, pos: mix(a.pos, b.pos), target: mix(a.target, b.target), fov: (a.fov ?? 34) + ((b.fov ?? 34) - (a.fov ?? 34)) * t };
    }
  }
  return shots[shots.length - 1];
}

/** 0→1 over [start, end] frames with an ease; clamped. */
export const ramp = (frame: number, start: number, end: number, easing = ease) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Fades in over `inF` frames at `start`, out over `outF` frames before `end`. */
export const inOut = (frame: number, start: number, end: number, inF = 10, outF = 10) =>
  Math.min(ramp(frame, start, start + inF), 1 - ramp(frame, end - outF, end));

export function Label({ children, color, style }: { children: React.ReactNode; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 17, letterSpacing: "0.08em", textTransform: "uppercase", color, ...style }}>
      {children}
    </div>
  );
}

/** A headline whose letters rise in, staggered. */
export function RiseText({
  text,
  frame,
  start,
  size,
  color,
  font = SERIF,
  weight = 300,
  stagger = 2,
  style,
}: {
  text: string;
  frame: number;
  start: number;
  size: number;
  color: string;
  font?: string;
  weight?: number;
  stagger?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em", color, whiteSpace: "pre", overflow: "hidden", paddingBottom: size * 0.12, ...style }}>
      {Array.from(text).map((ch, i) => {
        const t = ramp(frame, start + i * stagger, start + i * stagger + 18, Easing.bezier(0.2, 0.8, 0.2, 1));
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - t) * 105}%)`, opacity: t }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/** Text that decodes from noise, like an OCR read settling. Deterministic per frame. */
export function Decode({ text, frame, start, duration, style }: { text: string; frame: number; start: number; duration: number; style?: React.CSSProperties }) {
  const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  const t = ramp(frame, start, start + duration, Easing.linear);
  const out = Array.from(text)
    .map((ch, i) => {
      if (ch === " ") return " ";
      const settle = (i + 1) / text.length;
      if (t >= settle) return ch;
      if (frame < start) return "·";
      return glyphs[(frame * 7 + i * 13) % glyphs.length];
    })
    .join("");
  return <span style={{ whiteSpace: "pre", ...style }}>{out}</span>;
}

/** Thin progress bar along the bottom — a film-strip cue that this is a 15-second piece. */
export function Progress({ frame, total, color }: { frame: number; total: number; color: string }) {
  return (
    <div style={{ position: "absolute", left: 56, right: 56, bottom: 34, height: 2, background: `${color}33` }}>
      <div style={{ width: `${(frame / total) * 100}%`, height: "100%", background: color }} />
    </div>
  );
}
