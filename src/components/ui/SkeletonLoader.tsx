import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  variant?: "page" | "inline" | "card";
  className?: string;
  lines?: number;
}

const CARD_WIDTHS = [85, 72, 93, 68, 79];
const INLINE_WIDTHS = [78, 91, 64, 87, 73];

export function SkeletonLoader({
  variant = "page",
  className,
  lines = 4,
}: SkeletonLoaderProps) {
  if (variant === "card") {
    return (
      <div className={cn("border-2 border-swiss-border bg-swiss-bg p-6", className)}>
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-line mb-4" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${CARD_WIDTHS[i % CARD_WIDTHS.length]}%` }} />
        ))}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-line" />
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton skeleton-text" style={{ width: `${INLINE_WIDTHS[i % INLINE_WIDTHS.length]}%` }} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("max-w-6xl mx-auto px-6 py-16 md:py-24", className)}>
      <div className="mb-16">
        <div className="skeleton skeleton-heading" style={{ width: "200px", height: "48px" }} />
        <div className="skeleton skeleton-text" style={{ width: "300px", height: "12px", marginTop: "12px" }} />
      </div>
      <div className="skeleton skeleton-line mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="skeleton" style={{ width: "28px", height: "10px" }} />
            <div className="flex-1 space-y-2">
              <div className="skeleton skeleton-text" style={{ width: "40%" }} />
              <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
