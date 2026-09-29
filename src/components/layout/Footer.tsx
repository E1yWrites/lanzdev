import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { siteConfig } from "@/data/config";
import type { NavItem } from "@/types/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { FooterInvitation } from "./FooterInvitation";

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="t-label text-ink/60">{title}</h2>
      <ul className="mt-4 space-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group inline-flex min-h-7 items-center text-[15px] text-ink/85 transition-colors duration-fast hover:text-ink"
            >
              <span className="roll">
                <span>
                  {item.label}
                  {item.external && " ↗"}
                </span>
                <span aria-hidden="true">
                  {item.label}
                  {item.external && " ↗"}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative z-[1] overflow-hidden border-t border-ink/10">
      <FooterInvitation email={siteConfig.email} github={siteConfig.github.url} availability={siteConfig.availability} />

      <div className="mx-auto max-w-[1600px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 border-t border-ink/10 py-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="t-label group inline-flex min-h-7 items-center gap-2.5 text-ink">
              <LogoMark size={20} />
              <span>
                Lorenz<span className="text-accent">.</span>dev
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink/60">
              Web, mobile and desktop apps by {siteConfig.personalName}, a BSIT student at LPU-Batangas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Work" items={footerNav.index} />
            <FooterColumn title={siteConfig.alias} items={footerNav.studio} />
            <FooterColumn title="Legal" items={footerNav.legal} />
          </div>
        </div>

        {/* The sign-off: the mark and the name, as wide as the page. Hover it. */}
        <div aria-hidden="true" className="group flex items-end gap-[2.5%]">
          <LogoMark size="css" className="h-auto w-[13%] shrink-0 translate-y-[4%] text-ink" />
          {/* Drawn as a graphic, not text: it's a watermark, and it would fail contrast as text. */}
          <svg viewBox="0 0 1000 200" className="h-auto w-[84.5%] translate-y-[14%] select-none text-ink/[0.07] transition-colors duration-slow group-hover:text-ink/[0.14]">
            <text x="0" y="170" fill="currentColor" style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 300, fontSize: 212, letterSpacing: "-0.05em" }}>
              lorenz.dev
            </text>
          </svg>
        </div>
      </div>

      <div className="relative border-t border-ink/10 bg-paper">
        <div className="t-label mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-6 text-ink/60 md:flex-row md:items-center md:justify-between md:px-8 lg:px-12">
          <span>© 2026 {siteConfig.personalName}</span>
          <span>{siteConfig.education.location}</span>
          <a href="#main" className="inline-flex min-h-7 items-center gap-2 text-ink/70 transition-colors duration-fast hover:text-accent">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
