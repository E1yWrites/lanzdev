import Link from "next/link";
import { TechBadges } from "@/components/ui/TechBadges";
import { siteConfig } from "@/data/config";
import { projectFacts, projectStatus, type Fact } from "@/lib/projectDisplay";
import { ROOM_OBJECTS } from "@/three/roomObjects";
import type { Project } from "@/types/project";
import { Facts } from "./Facts";
import type { RoomFacts } from "./RoomCard";

// Phones don't get the room: its objects as a numbered list, each row opening to what its room
// card says (line, facts, stack, one way in). The films and the way to write follow (UnderRoom).
// Projects with no object in the room (UDB) join the list; the room's own film and contact
// objects don't, since those sections sit right below.

interface Row {
  key: string;
  title: string;
  kicker: string;
  body: string;
  facts?: Fact[];
  stack?: string[];
  cta: { label: string; href: string };
}

function rowsFor(facts: RoomFacts, projects: Project[]): Row[] {
  const fromRoom = (id: string): Row[] => {
    const o = ROOM_OBJECTS.find((r) => r.id === id);
    if (!o?.card.cta) return [];
    const stack = projects.find((p) => p.slug === id)?.technologies;
    return [{ key: o.id, title: o.card.title, kicker: o.card.kicker.replace(/^\d+ · /, ""), body: o.card.body, facts: facts[o.id as keyof RoomFacts], stack, cta: o.card.cta }];
  };
  const shelf: Row[] = projects
    .filter((p) => !p.model)
    .map((p) => ({ key: p.slug, title: p.name, kicker: projectStatus(p.status).label, body: p.tagline, facts: projectFacts(p), stack: p.technologies, cta: { label: "Take a look", href: `/projects/${p.slug}` } }));
  return [...fromRoom("parada"), ...fromRoom("tala"), ...shelf, ...fromRoom("about")];
}

export function MobileIndex({ facts, projects }: { facts: RoomFacts; projects: Project[] }) {
  return (
    <section aria-labelledby="index-title" className="px-5 pt-10 md:hidden">
      <h1 id="index-title" className="font-display text-[2.9rem] font-light leading-[0.98] tracking-[-0.03em] text-ink">
        Software for curious people<span className="text-accent">.</span>
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-ink/70">Hi, I’m {siteConfig.alias}, a 3rd-year IT student in Batangas building web, mobile and desktop apps.</p>
      <p className="t-label mt-4 inline-flex items-center gap-2 text-ink/70">
        <span className="live-dot" aria-hidden="true" />
        {siteConfig.availability}
      </p>

      <ol className="mt-10 border-t border-dotted border-ink/25">
        {rowsFor(facts, projects).map((r, i) => {
          // the stack is badges below, so its dotted text row goes
          const rows = r.facts?.filter(([k]) => k !== "Built with");
          return (
            <li key={r.key} className="mi-row border-b border-dotted border-ink/25" style={{ "--i": i } as React.CSSProperties}>
              <details className="group relative">
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center gap-4 py-3.5 transition-colors active:bg-ink/5 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="absolute inset-y-3 -left-3 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 group-open:scale-y-100" />
                  <span className="t-label w-6 shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl font-light leading-tight text-ink">{r.title}</span>
                    <span className="t-label mt-1 block text-ink/60">{r.kicker}</span>
                  </span>
                  <span aria-hidden="true" className="t-label text-lg text-ink/60 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-6 pl-10">
                  <p className="text-[15px] leading-relaxed text-ink/75">{r.body}</p>
                  {rows && rows.length > 0 && <Facts rows={rows} className="mt-5" />}
                  {r.stack && r.stack.length > 0 && (
                    <div className="mt-4">
                      <p className="t-label text-ink/60">Built with</p>
                      <TechBadges names={r.stack} max={5} className="mt-2.5" />
                    </div>
                  )}
                  <Link href={r.cta.href} className="room-cta t-label mt-6">
                    {r.cta.label} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
