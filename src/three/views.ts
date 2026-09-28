// Camera framing for each model — shared by the live scenes (src/components/three)
// and the renders in art/, so the poster and the live model line up when they swap.

type Vec3 = [number, number, number];

export interface View {
  position: Vec3;
  target: Vec3;
  fov: number;
}

export const VIEWS: Record<"macropad" | "parada" | "tala", View> = {
  macropad: { position: [0.4, 7.4, 7.6], target: [0.1, -0.15, 0], fov: 30 },
  parada: { position: [3.6, 5.6, 7.4], target: [0.55, 0.1, 0], fov: 34 },
  tala: { position: [0.6, 5.4, 5.8], target: [0.1, 0.35, 0], fov: 34 },
};

/** Resting yaw of the macropad in the hero (radians). */
export const MACROPAD_YAW = -0.32;
