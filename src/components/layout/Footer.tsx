import Link from "next/link";
import { footerNav } from "@/data/navigation";
import { siteConfig } from "@/data/config";
import type { NavItem } from "@/types/navigation";
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
              className="t-label text-ink transition-colors duration-fast hover:text-accent"
            >
              {item.label}
              {item.external && " ↗"}
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
        <Link href="/" className="t-label col-span-2 self-start text-ink lg:col-span-1">
          Lorenz<span className="text-accent">.</span>dev
        </Link>
        <FooterColumn title="Index" items={footerNav.index} />
        <FooterColumn title="Studio" items={footerNav.studio} />
        <FooterColumn title="Legal" items={footerNav.legal} />
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
