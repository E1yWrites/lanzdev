import { FRONT_DOOR_SPAN, HOUSE, PLAN, type HouseRoom } from "@/data/house";

// The house from above, drawn small like a blueprint: the rooms around the hall, a piece
// of furniture in each, and the one you're in glowing in its own light. Every room page
// sets it under the logo.

type Rect = [x: number, y: number, w: number, h: number];

/** A piece of furniture in each room, so the rooms read at this size. */
const THINGS: Partial<Record<HouseRoom, Rect[]>> = {
  garage: [[8, 6, 9, 14]], // a car
  study: [[39, 4, 16, 6]], // a desk
  screening: [[66, 4, 20, 3], [68, 15, 16, 5]], // a cabinet, a sofa
  about: [[6, 42, 12, 8]], // a table
  front: [[40, 40, 5, 5]], // the coat stand
  room: [[84, 40, 6, 14], [66, 55, 8, 6]], // the desk, the bed's end
};

export function FloorPlan({ current, className }: { current: HouseRoom; className?: string }) {
  return (
    <figure className={className} style={{ "--here": HOUSE[current].light } as React.CSSProperties}>
      <svg aria-hidden="true" viewBox="-1 -1 94 66" className="floor-plan block w-full">
        <defs>
          <radialGradient id="floor-plan-glow">
            <stop offset="0" stopColor={HOUSE[current].light} stopOpacity="0.85" />
            <stop offset="1" stopColor={HOUSE[current].light} stopOpacity="0.25" />
          </radialGradient>
        </defs>
        {(Object.keys(HOUSE) as HouseRoom[]).map((id) => {
          const [x, y, w, h] = HOUSE[id].at;
          return (
          <g key={id}>
            <rect x={x} y={y} width={w} height={h} className={id === current ? "floor-plan-here" : undefined} />
            {(THINGS[id] ?? []).map(([tx, ty, tw, th]) => (
              <rect key={`${tx},${ty}`} x={tx} y={ty} width={tw} height={th} className="floor-plan-thing" />
            ))}
          </g>
          );
        })}
        <rect x={0} y={0} width={PLAN.w} height={PLAN.d} className="floor-plan-outline" />
        {/* the front door, in the outside wall */}
        <path d={`M${FRONT_DOOR_SPAN[0]} ${PLAN.d}H${FRONT_DOOR_SPAN[1]}`} className="floor-plan-door" />
      </svg>
      <figcaption className="t-label mt-1.5 whitespace-nowrap text-[10px] text-ink/60">You are here · {HOUSE[current].name}</figcaption>
    </figure>
  );
}
