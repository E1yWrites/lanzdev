import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ number, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <div className="flex items-center gap-4 mb-6">
        {number && (
          <span className="section-number">{number}.</span>
        )}
        <span className="flex-1 h-[2px] bg-swiss-border" />
      </div>
      <h2 className="font-swiss font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter uppercase text-swiss-fg">
        {title}
      </h2>
      {subtitle && (
        <p className="font-swiss text-base md:text-lg text-swiss-fg/70 mt-4 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
