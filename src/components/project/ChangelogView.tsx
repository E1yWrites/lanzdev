import type { ProjectChangelogEntry } from "@/types/project";

interface ChangelogViewProps {
  entries: ProjectChangelogEntry[];
}

const GROUPS = [
  { key: "added" as const, label: "Added", marker: "+" },
  { key: "changed" as const, label: "Changed", marker: "~" },
  { key: "fixed" as const, label: "Fixed", marker: "—" },
];

export function ChangelogView({ entries }: ChangelogViewProps) {
  return (
    <div>
      <span className="section-number inline-block mb-8">
        Changelog
      </span>

      <div className="space-y-0 border-2 border-swiss-border">
        {entries.map((entry, i) => (
          <div
            key={entry.version}
            className={`border-b-2 border-swiss-border py-10 last:border-0 px-6 ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-swiss font-black text-lg tracking-tighter uppercase text-swiss-fg px-3 py-1 border-2 border-swiss-border">
                v{entry.version}
              </span>
              <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
                {new Date(entry.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {entry.current && (
                <span className="section-number">Current</span>
              )}
            </div>

            {GROUPS.map(({ key, label, marker }) => {
              const items = entry[key];
              if (!items || items.length === 0) return null;
              return (
                <div key={key} className="mb-4">
                  <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block mb-2">
                    {label}
                  </span>
                  <ul className="space-y-1.5 ml-1">
                    {items.map((item) => (
                      <li key={item} className="font-swiss text-sm text-swiss-fg/70 flex gap-2">
                        <span className="text-swiss-accent font-swiss text-xs font-bold shrink-0">{marker}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
