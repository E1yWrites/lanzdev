import Link from "next/link";
import { Invitation } from "@/components/layout/FooterInvitation";
import { siteConfig } from "@/data/config";
import { projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";
import { Title } from "./Facts";
import { ReelPlayer } from "./ReelPlayer";
import type { ReelItem } from "./VhsOverlay";

// Phones, under the room they've looked around (RoomPan): any project without an object
// in the room, the films, and the way to write. Desktop gets the house instead.

export function UnderRoom({ projects, reel }: { projects: Project[]; reel: ReelItem[] }) {
  const shelf = projects.filter((p) => !p.model);

  return (
    <div className="md:hidden">
      {shelf.length > 0 && (
        <section id="shelf" aria-labelledby="shelf-title" className="scroll-mt-14 px-5 pt-16">
          <div className="flex items-baseline justify-between gap-4">
            <Title id="shelf-title" text="On the shelf" />
            <p className="t-label shrink-0 text-ink/60">{shelf.length} more</p>
          </div>
          <ul className="mt-6 border-t border-dotted border-ink/25">
            {shelf.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="flex min-h-[4.5rem] items-center gap-4 border-b border-dotted border-ink/25 py-3.5">
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-light leading-tight text-ink">{p.name}</span>
                    <span className="mt-1 line-clamp-2 text-sm leading-snug text-ink/60">{p.tagline}</span>
                  </span>
                  <span className="t-label shrink-0 text-ink/60">{projectStatus(p.status).label}</span>
                  <span aria-hidden="true" className="t-label text-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reel.length > 0 && (
        <section id="reel" aria-labelledby="reel-title" className="scroll-mt-14 pt-16">
          <ReelPlayer reel={reel}>
            <Title id="reel-title" text={reel.length > 1 ? "Watch them run" : "Watch it run"} />
          </ReelPlayer>
        </section>
      )}

      <section id="contact" aria-labelledby="contact-title" className="px-5 pb-20 pt-20">
        <Invitation email={siteConfig.email} github={siteConfig.github.url} availability={siteConfig.availability} stacked headingId="contact-title" />
      </section>
    </div>
  );
}
