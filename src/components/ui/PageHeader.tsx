import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  /** Mono key/value strip under the lede, e.g. [["Projects", "03"]]. Falsy values are dropped. */
  stats?: [string, React.ReactNode][];
  /** Extra content (actions, search) under the lede. */
  children?: React.ReactNode;
  /** Adds `.reveal` to each row — only when a parent owns a useReveal ref. */
  reveal?: boolean;
  className?: string;
}

/** Interior page header — eyebrow, display title, lede and stats, over the corner key light. */
export function PageHeader({ eyebrow, title, lede, stats, children, reveal = false, className }: PageHeaderProps) {
  const r = reveal ? "reveal" : undefined;
  const shownStats = stats?.filter(([, value]) => value);

  return (
    <header className={cn("relative overflow-hidden border-b border-ink/10", className)}>
      <div aria-hidden="true" className="page-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
        <span className={cn("section-number block", r)}>{eyebrow}</span>
        <h1
          className={cn(
            "mt-6 max-w-5xl font-swiss text-5xl font-black uppercase tracking-tighter text-swiss-fg sm:text-6xl md:text-7xl lg:text-8xl",
            r
          )}
        >
          {title}
        </h1>
        {lede && (
          <p className={cn("mt-6 max-w-xl font-swiss text-base leading-relaxed text-swiss-fg/70 md:text-lg", r)}>
            {lede}
          </p>
        )}
        {children && <div className={cn("mt-8", r)}>{children}</div>}
        {shownStats && shownStats.length > 0 && (
          <dl className={cn("mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-swiss-fg/50", r)}>
            {shownStats.map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <dt>{label}</dt>
                <dd className="text-swiss-fg">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  );
}
