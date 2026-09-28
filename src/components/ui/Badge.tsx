import { cn } from "@/lib/utils";

type BadgeVariant = "released" | "in-progress" | "prototype" | "archived" | "planned";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const dotStyles: Record<BadgeVariant, string> = {
  released: "bg-accent",
  "in-progress": "bg-current",
  prototype: "bg-current opacity-60",
  archived: "border border-current bg-transparent",
  planned: "border border-current bg-transparent",
};

/** Status marker: a small square and a mono label, like a spec-sheet field. */
export function Badge({ variant = "released", children, className }: BadgeProps) {
  return (
    <span className={cn("t-label inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0", dotStyles[variant])} />
      {children}
    </span>
  );
}
