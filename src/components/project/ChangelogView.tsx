import { NoteGroup, TimelineEntry } from "@/components/project/ReleaseNotes";
import { formatDate } from "@/lib/utils";
import type { ProjectChangelogEntry } from "@/types/project";

interface ChangelogViewProps {
  entries: ProjectChangelogEntry[];
}

const GROUPS = [
  { key: "breaking" as const, label: "Breaking" },
  { key: "added" as const, label: "Added" },
  { key: "changed" as const, label: "Changed" },
  { key: "fixed" as const, label: "Fixed" },
  { key: "security" as const, label: "Security" },
];

export function ChangelogView({ entries }: ChangelogViewProps) {
  return (
    <div>
      {entries.map((entry) => (
        <TimelineEntry
          key={entry.version}
          version={`v${entry.version}`}
          date={formatDate(entry.date)}
          latest={entry.current}
          tags={entry.current ? ["Current"] : []}
        >
          <div className="grid gap-x-10 lg:grid-cols-2">
            {GROUPS.map(({ key, label }) => {
              const items = entry[key];
              return items?.length ? <NoteGroup key={key} label={label} items={items} /> : null;
            })}
          </div>
        </TimelineEntry>
      ))}
    </div>
  );
}
