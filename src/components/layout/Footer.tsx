import Link from "next/link";
import { footerNav } from "@/data/navigation";
import type { NavItem } from "@/types/navigation";
import { Hairline } from "@/components/ui/Hairline";

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h3 className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40 mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="font-swiss text-sm font-medium text-swiss-fg/70 hover:text-swiss-accent transition-colors duration-150"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink/[0.02] swiss-dots">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <FooterColumn title="Projects" items={footerNav.projects} />
          <FooterColumn title="Resources" items={footerNav.resources} />
          <FooterColumn title="About" items={footerNav.about} />
          <FooterColumn title="Legal" items={footerNav.legal} />
        </div>

        <Hairline className="mt-10 mb-6" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="font-swiss font-black text-xl tracking-tighter uppercase text-swiss-fg">
            Lorenz<span className="text-swiss-accent">.</span>dev
          </div>
          <div className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
            &copy; 2026 Lorenz.dev — Built with precision
          </div>
          <div className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
            Software / Design / Development
          </div>
        </div>
      </div>
    </footer>
  );
}
