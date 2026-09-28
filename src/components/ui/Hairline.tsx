import { cn } from "@/lib/utils";

interface HairlineProps {
  className?: string;
  /** Dotted, like a spec-sheet rule. */
  dotted?: boolean;
}

export function Hairline({ className, dotted = false }: HairlineProps) {
  return <hr className={cn("border-0 border-t border-ink/15", dotted && "border-dotted border-ink/30", className)} />;
}
