"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes, type PointerEvent } from "react";

type SurfaceTier = "solid" | "subtle" | "glass" | "elevated";

interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tier?: SurfaceTier;
  interactive?: boolean;
  tactile?: boolean;
}

const tierClass: Record<SurfaceTier, string> = {
  solid: "surface-solid",
  subtle: "surface-subtle",
  glass: "surface-glass",
  elevated: "surface-elevated",
};

/**
 * Material-tier surface primitive. `interactive` adds a pointer-following glass
 * highlight (glass/elevated tiers only); `tactile` adds hover-lift + press-compress.
 */
const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ tier = "solid", interactive = false, tactile = false, className, onPointerMove, children, ...props }, ref) => {
    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--pointer-x", `${e.clientX - rect.left}px`);
      e.currentTarget.style.setProperty("--pointer-y", `${e.clientY - rect.top}px`);
      onPointerMove?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          tierClass[tier],
          interactive && "glass-interactive",
          tactile && "tactile",
          className
        )}
        onPointerMove={interactive ? handlePointerMove : onPointerMove}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = "Surface";

export { Surface, type SurfaceProps, type SurfaceTier };
