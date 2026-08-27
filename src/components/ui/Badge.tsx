import { cn } from "@/lib/utils";

type BadgeVariant = "released" | "in-progress" | "prototype" | "archived" | "planned";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const dotStyles: Record<BadgeVariant, string> = {
  released: "bg-swiss-accent",
  "in-progress": "bg-swiss-fg",
  prototype: "bg-swiss-fg/50",
  archived: "bg-swiss-fg/30",
  planned: "bg-swiss-fg/50",
};

export function Badge({ variant = "released", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "font-swiss text-[10px] font-bold tracking-widest uppercase",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5",
          dotStyles[variant]
        )}
      />
      {children}
    </span>
  );
}
