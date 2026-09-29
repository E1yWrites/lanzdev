"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";

/** The closing line on every page, except /contact, which says it already. */
export function FooterInvitation({ email, github, availability }: { email: string; github: string; availability: string }) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  if (pathname === "/contact") return null;

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
    <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28 lg:grid-cols-12 lg:items-end lg:px-12">
      <KineticText
        as="p"
        lines={["Have a project", "in mind"]}
        accent="?"
        className="font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink lg:col-span-7"
      />
      <div className="lg:col-span-5 lg:pb-3">
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
