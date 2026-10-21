import { Invitation } from "@/components/layout/FooterInvitation";
import { siteConfig } from "@/data/config";
import { Title } from "./Facts";
import { ReelPlayer } from "./ReelPlayer";
import type { ReelItem } from "./VhsOverlay";

// Phones, under the index: the films and the way to write. Desktop gets the house instead.

export function UnderRoom({ reel }: { reel: ReelItem[] }) {
  return (
    <div className="md:hidden">
      {reel.length > 0 && (
        <section id="reel" aria-labelledby="reel-title" className="scroll-mt-14 pt-16">
          <ReelPlayer reel={reel}>
            <Title id="reel-title" text={reel.length > 1 ? "Watch them run" : "Watch it run"} />
          </ReelPlayer>
        </section>
      )}

      <section id="contact" aria-labelledby="contact-title" className="px-5 pb-20 pt-16">
        <Invitation email={siteConfig.email} github={siteConfig.github.url} availability={siteConfig.availability} stacked headingId="contact-title" />
      </section>
    </div>
  );
}
