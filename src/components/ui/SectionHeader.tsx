import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  number?: string;
  label?: string;
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  className?: string;
}

/** Eyebrow + dotted rule, then a light serif title. */
export function SectionHeader({ number, label, title, subtitle, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="mb-6 flex items-center gap-4">
        <span className="section-number shrink-0">{[number, label].filter(Boolean).join(" / ") || title}</span>
        <span aria-hidden="true" className="h-px flex-1 border-t border-dotted border-ink/30" />
        {aside}
      </div>
      <h2 className="font-display text-4xl font-light tracking-tight text-ink md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">{subtitle}</p>}
    </div>
  );
}
