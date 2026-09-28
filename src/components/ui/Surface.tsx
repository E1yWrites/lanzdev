import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

type SurfaceTier = "solid" | "subtle" | "glass" | "elevated";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tier?: SurfaceTier;
  /** Press feedback (scale 0.98) — for surfaces that act as buttons. */
  tactile?: boolean;
}

const tierClass: Record<SurfaceTier, string> = {
  solid: "surface-solid",
  subtle: "surface-subtle",
  glass: "surface-glass",
  elevated: "surface-elevated",
};

/** Flat, hairline-bordered surface. Tone carries depth; no blur, glow or lift. */
const Surface = forwardRef<HTMLDivElement, SurfaceProps>(({ tier = "solid", tactile = false, className, children, ...props }, ref) => (
  <div ref={ref} className={cn(tierClass[tier], tactile && "tactile", className)} {...props}>
    {children}
  </div>
));

Surface.displayName = "Surface";

export { Surface, type SurfaceProps, type SurfaceTier };
