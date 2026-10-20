import Link from "next/link";
import { siteConfig } from "@/data/config";
import { ROOM_OBJECTS } from "@/three/roomObjects";
import { Facts } from "./Facts";
import type { RoomFacts } from "./RoomCard";

// Phones don't get the room: the same five objects as a numbered list. Each row opens to
// what its room card says (line, facts, one way in). The films play further down (UnderRoom).

/** The deck has no page; on phones the films play under the list. */
const REEL_CTA = { label: "Play the films", href: "#reel" };

export function MobileIndex({ facts }: { facts: RoomFacts }) {
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
        {ROOM_OBJECTS.map((o, i) => {
          const rows = facts[o.id];
          const cta = o.card.cta ?? REEL_CTA;
          return (
            <li key={o.id} className="mi-row border-b border-dotted border-ink/25" style={{ "--i": i } as React.CSSProperties}>
              <details className="group relative">
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center gap-4 py-3.5 transition-colors active:bg-ink/5 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 group-open:scale-y-100" />
                  <span className="t-label w-6 shrink-0 text-accent">{o.index}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-2xl font-light leading-tight text-ink">{o.card.title}</span>
                    <span className="t-label mt-1 block text-ink/60">{o.card.kicker.replace(/^\d+ · /, "")}</span>
                  </span>
                  <span aria-hidden="true" className="t-label text-lg text-ink/60 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-6 pl-10">
                  <p className="text-[15px] leading-relaxed text-ink/75">{o.card.body}</p>
                  {rows && rows.length > 0 && <Facts rows={rows} className="mt-5" />}
                  <Link href={cta.href} className="room-cta t-label mt-6">
                    {cta.label} <span aria-hidden="true">→</span>
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
