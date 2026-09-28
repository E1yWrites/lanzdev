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
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="t-label group inline-flex min-h-7 items-center text-ink"
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
    <footer className="relative z-[1] border-t border-dotted border-ink/30">
      <FooterInvitation email={siteConfig.email} github={siteConfig.github.url} />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-12 md:px-8 lg:grid-cols-6">
        <Link href="/" className="t-label group col-span-2 inline-flex min-h-7 items-center gap-2.5 self-start text-ink lg:col-span-1">
          <LogoMark size={20} />
          <span>
            Lorenz<span className="text-accent">.</span>dev
          </span>
        </Link>
        <FooterColumn title="Index" items={footerNav.index} />
        <FooterColumn title="Studio" items={footerNav.studio} />
        <FooterColumn title="Legal" items={footerNav.legal} />
      </div>

      {/* The sign-off: the mark, big. Hover it. */}
      <div aria-hidden="true" className="group mx-auto flex max-w-7xl items-end gap-[2vw] overflow-hidden px-5 md:px-8">
        <LogoMark size="css" className="h-[15vw] max-h-48 w-auto shrink-0 translate-y-[6%] text-ink" />
        {/* Drawn as a graphic, not text: it's a watermark, and it would fail contrast as text. */}
        <svg viewBox="0 0 1000 200" className="h-auto w-[70vw] max-w-[62rem] translate-y-[14%] select-none text-ink/[0.07] transition-colors duration-slow group-hover:text-ink/[0.14]">
          <text x="0" y="170" fill="currentColor" style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 300, fontSize: 212, letterSpacing: "-0.05em" }}>
            lorenz.dev
          </text>
        </svg>
      </div>

      <div className="border-t border-dotted border-ink/30">
        <div className="t-label mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-ink/60 md:flex-row md:justify-between md:px-8">
          <span>© 2026 {siteConfig.personalName}</span>
          <span>
            {siteConfig.education.location} — <span className="tabular whitespace-nowrap">13.7565° N, 121.0583° E</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
