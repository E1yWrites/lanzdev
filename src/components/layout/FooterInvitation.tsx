"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";

interface InvitationProps {
  email: string;
  github: string;
  availability: string;
}

/** The closing line on every page, except /contact, which says it already, and home, where the front door says it. */
export function FooterInvitation(props: InvitationProps) {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/") return null;
  return <Invitation {...props} />;
}

/**
 * "Have a project in mind?", with the email, a copy button and GitHub. Spread across the
 * footer, or `stacked` in one column (beside the front door on the home page), where
 * it's the section's heading.
 */
export function Invitation({ email, github, availability, stacked, headingId }: InvitationProps & { stacked?: boolean; headingId?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className={stacked ? "grid gap-8" : "mx-auto grid max-w-[1600px] gap-10 px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28 lg:grid-cols-12 lg:items-end lg:px-12"}>
      <KineticText
        as={stacked ? "h2" : "p"}
        id={headingId}
        lines={["Have a project", "in mind"]}
        accent="?"
        className={
          stacked
            ? "font-display text-[clamp(2.6rem,4.6vw,4.75rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink"
            : "font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink lg:col-span-7"
        }
      />
      <div className={stacked ? undefined : "lg:col-span-5 lg:pb-3"}>
        <p className="t-label inline-flex items-center gap-2 text-ink/70">
          <span className="live-dot" aria-hidden="true" />
          {availability}
        </p>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-ink/70">Email is the quickest way to reach me. Say what you’re building and I’ll write back.</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.35}>
            <a href={`mailto:${email}`} className="t-label inline-flex h-12 items-center gap-3 rounded-full bg-ink px-6 text-paper transition-colors duration-normal hover:bg-accent hover:text-on-sheet">
              {email} <span aria-hidden="true">→</span>
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={copy}
            className="t-label inline-flex h-12 items-center rounded-full px-5 text-ink ring-1 ring-ink/25 transition-colors duration-normal hover:ring-ink/60"
          >
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
          <a href={github} target="_blank" rel="noopener noreferrer" className="t-label link-underline ml-1 text-ink">
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}
