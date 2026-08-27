import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "border-2 border-swiss-border bg-swiss-bg",
        "transition-all duration-150",
        hover && "hover:bg-swiss-fg hover:text-swiss-bg",
        className
      )}
    >
      {children}
    </div>
  );
}
