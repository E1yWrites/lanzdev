"use client";

import { usePathname } from "next/navigation";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";

/** The closing line on every page — except /contact, which says it already. */
export function FooterInvitation({ email, github }: { email: string; github: string }) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
      <span className="section-number">Contact</span>
      <KineticText as="p" lines={["Have a project", "in mind"]} accent="?" className="mt-8 max-w-4xl font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink" />
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Magnetic strength={0.35}>
          <a href={`mailto:${email}`} data-cursor="Email" className="t-label inline-flex h-12 items-center gap-3 rounded-full bg-ink px-6 text-paper transition-colors duration-normal hover:bg-accent hover:text-on-sheet">
            {email} <span aria-hidden="true">→</span>
          </a>
        </Magnetic>
        <Magnetic>
          <a href={github} target="_blank" rel="noopener noreferrer" className="t-label inline-flex h-12 items-center gap-2 rounded-full border border-ink/30 px-6 text-ink transition-colors duration-normal hover:border-ink">
            GitHub ↗
          </a>
        </Magnetic>
      </div>
    </div>
  );
}
