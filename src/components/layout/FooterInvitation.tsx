"use client";

import { usePathname } from "next/navigation";

/** The closing line on every page — except /contact, which says it already. */
export function FooterInvitation({ email, github }: { email: string; github: string }) {
  const pathname = usePathname();
  if (pathname === "/contact") return null;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
      <span className="section-number">Contact</span>
      <p className="mt-8 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-tight text-ink md:text-7xl">
        Have a project in mind<span className="text-accent">?</span>
      </p>
      <div className="t-label mt-10 flex flex-wrap gap-x-10 gap-y-3">
        <a href={`mailto:${email}`} className="text-ink underline decoration-ink/30 underline-offset-[6px] transition-colors duration-fast hover:text-accent hover:decoration-accent">
          {email} →
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-ink/70 transition-colors duration-fast hover:text-ink">
          GitHub ↗
        </a>
      </div>
    </div>
  );
}
