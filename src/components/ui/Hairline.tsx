import { cn } from "@/lib/utils";

interface HairlineProps {
  className?: string;
}

export function Hairline({ className }: HairlineProps) {
  return (
    <hr
      className={cn("border-0 border-t border-ink/10", className)}
    />
  );
}
