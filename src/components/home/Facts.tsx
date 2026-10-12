import { cn } from "@/lib/utils";

/** Label/value rows on dotted rules: a room card's facts. */
export function Facts({ rows, className }: { rows: [string, string][]; className?: string }) {
  return (
    <dl className={cn("border-t border-dotted border-ink/25", className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-4 border-b border-dotted border-ink/25 py-2.5">
          <dt className="t-label w-24 shrink-0 pt-px text-ink/60">{k}</dt>
          <dd className="text-[15px] leading-snug text-ink md:text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A phone title: it ends on its own punctuation, in ember. */
export function Title({ id, text, className }: { id?: string; text: string; className?: string }) {
  const [words, end] = /[.?!]$/.test(text) ? [text.slice(0, -1), text.slice(-1)] : [text, "."];
  return (
    <h2 id={id} className={cn("font-display text-[2.6rem] font-light leading-[0.98] tracking-[-0.03em] text-ink", className)}>
      {words}
      <span className="text-accent">{end}</span>
    </h2>
  );
}
