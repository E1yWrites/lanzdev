// The rooms of the house: which room each page is, the light it gives off, and where it
// sits in the plan. The light colours the door you walk through (DoorTransition), the
// floor plan in the nav and the room's lamp in the house on the home page. The plan is
// the one drawing both the floor plan and the 3D house are built from.

export type HouseRoom = "room" | "hall" | "garage" | "study" | "screening" | "about" | "front";

/** x, y, width, depth in plan units: the back wall is y = 0, the front door's wall y = PLAN.d. */
export type PlanRect = [x: number, y: number, w: number, d: number];

export const PLAN = { w: 92, d: 64 };

export const HOUSE: Record<HouseRoom, { name: string; light: string; at: PlanRect }> = {
  garage: { name: "Garage", light: "#F2A54A", at: [0, 0, 34, 24] },
  study: { name: "Study", light: "#E6B450", at: [34, 0, 26, 24] },
  screening: { name: "Screening room", light: "#7FB0FF", at: [60, 0, 32, 24] },
  hall: { name: "Hallway", light: "#C9CED6", at: [0, 24, 92, 12] },
  about: { name: "About", light: "#DCE3F0", at: [0, 36, 36, 28] },
  front: { name: "Front door", light: "#FF9455", at: [36, 36, 26, 28] },
  room: { name: "Lanz’s room", light: "#E9673F", at: [62, 36, 30, 28] },
};

/** The front door, in the front wall (plan x from–to). */
export const FRONT_DOOR_SPAN: [number, number] = [45, 52];

export function roomForPath(path: string): HouseRoom {
  const p = path.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (p === "/") return "room";
  if (p === "/projects/parada") return "garage";
  if (p === "/projects/tala") return "study";
  if (p === "/about") return "about";
  if (p === "/contact") return "front";
  return "hall";
}
