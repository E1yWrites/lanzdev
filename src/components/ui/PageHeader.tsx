import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Mono key/value strip, e.g. [["Projects", "03"]]. Falsy values are dropped. */
  stats?: [string, React.ReactNode][];
  /** Extra content (actions, search) under the lede. */
  children?: React.ReactNode;
  /** Adds `.reveal` to each row — only when a parent owns a useReveal ref. */
  reveal?: boolean;
  className?: string;
}

/** Interior page header — eyebrow, light serif title, lede, and a mono stats strip on a dotted rule. */
export function PageHeader({ eyebrow, title, lede, stats, children, reveal = false, className }: PageHeaderProps) {
  const r = reveal ? "reveal" : undefined;
  const shownStats = stats?.filter(([, value]) => value);

  return (
    <header className={cn("border-b border-dotted border-ink/30", className)}>
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-20 md:px-8 md:pb-16 md:pt-28">
        <span className={cn("section-number block", r)}>{eyebrow}</span>
        <h1 className={cn("mt-8 max-w-5xl font-display text-display font-light text-ink", r)}>{title}</h1>
        {lede && <p className={cn("mt-8 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg", r)}>{lede}</p>}
        {children && <div className={cn("mt-10", r)}>{children}</div>}
        {shownStats && shownStats.length > 0 && (
          <dl className={cn("t-label mt-12 flex flex-wrap gap-x-10 gap-y-2 text-ink/60", r)}>
            {shownStats.map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt>{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
