import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteConfig } from "@/data/config";
import { cn } from "@/lib/utils";

export interface LegalSection {
  title: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  href: "/terms" | "/privacy" | "/license";
  lede: string;
  updated?: string;
  sections: LegalSection[];
  /** "For questions about …" line in the closing contact block. */
  contactTopic: string;
}

const LEGAL_PAGES = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/license", label: "License" },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const pad = (n: number) => String(n).padStart(2, "0");

/** Shared layout for the legal pages — numbered sections with a sticky rail. */
export function LegalPage({ title, href, lede, updated, sections, contactTopic }: LegalPageProps) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} lede={lede} stats={[["Last updated", updated]]} />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav aria-label="Legal pages" className="lg:sticky lg:top-24">
            <span className="font-swiss text-[10px] font-bold uppercase tracking-widest text-swiss-fg/40">Documents</span>
            <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-0">
              {LEGAL_PAGES.map((page) => {
                const active = page.href === href;
                return (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-md border px-3 py-2 font-swiss text-sm transition-colors duration-fast lg:rounded-none lg:border-0 lg:border-l-2 lg:py-1.5 lg:pl-4",
                        active
                          ? "border-accent/40 text-swiss-fg lg:border-accent"
                          : "border-ink/10 text-swiss-fg/50 hover:text-swiss-fg lg:border-ink/10"
                      )}
                    >
                      {page.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
          {sections.map((section, i) => (
            <section
              key={section.title}
              id={slug(section.title)}
              className="grid scroll-mt-20 gap-3 border-t border-ink/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr] md:gap-6"
            >
              <span className="font-mono text-xs text-swiss-accent md:pt-1">{pad(i + 1)}</span>
              <div>
                <h2 className="font-swiss text-xl font-black uppercase tracking-tighter text-swiss-fg md:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-3 font-swiss text-[15px] leading-relaxed text-swiss-fg/70">{section.body}</div>
              </div>
            </section>
          ))}

          <div className="mt-8 rounded-lg border border-accent/25 bg-accent/[0.06] p-6 md:ml-[5.5rem]">
            <h2 className="font-swiss text-[11px] font-bold uppercase leading-normal tracking-widest text-swiss-accent">Contact</h2>
            <p className="mt-2 font-swiss text-sm leading-relaxed text-swiss-fg/80">
              For questions about {contactTopic}, email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="break-all font-medium text-swiss-fg underline decoration-accent/50 underline-offset-4 transition-colors duration-fast hover:text-swiss-accent"
              >
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
