"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allDocSections, docsByProject } from "@/data/docs";
import { docMeta, formatDate, projectLabel, projectMeta, projectUpdated } from "@/data/docMeta";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { useReveal } from "@/hooks/useReveal";

const recentlyUpdated = Object.entries(docsByProject)
  .flatMap(([project, docs]) =>
    docs.navItems.flatMap((item) => {
      const updated = docMeta[item.slug]?.updated;
      return updated ? [{ project, slug: item.slug, title: item.title, updated }] : [];
    })
  )
  .sort((a, b) => b.updated.localeCompare(a.updated))
  .slice(0, 6);

const pad = (n: number) => String(n).padStart(2, "0");

export function DocsContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const projects = Object.entries(docsByProject);
  const latest = recentlyUpdated[0]?.updated;

  return (
    <div ref={sectionRef}>
      <section className="border-b border-dotted border-ink/30">
        <div className="px-5 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24 lg:px-14">
          <div className="max-w-2xl">
            <span className="reveal section-number block">Documentation</span>
            <h1 className="reveal mt-8 font-display text-display font-light text-ink">
              Documentation
            </h1>
            <p className="reveal mt-6 max-w-lg font-swiss text-base leading-relaxed text-swiss-fg/70 md:text-lg">
              Guides, references and setup notes for{" "}
              <span className="text-swiss-fg">PARADA</span>, the smart parking system, and{" "}
              <span className="text-swiss-fg">Tala</span>, the note-taking app.
            </p>
            <div className="reveal mt-8">
              <DocsSearch />
            </div>
            <dl className="t-label reveal mt-10 flex flex-wrap gap-x-10 gap-y-2 text-ink/60">
              <div className="flex gap-2">
                <dt>Documents</dt>
                <dd className="text-swiss-fg">{pad(allDocSections.length)}</dd>
              </div>
              <div className="flex gap-2">
                <dt>Projects</dt>
                <dd className="text-swiss-fg">{pad(projects.length)}</dd>
              </div>
              {latest && (
                <div className="flex gap-2">
                  <dt>Updated</dt>
                  <dd className="text-swiss-fg">{formatDate(latest)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* Project groups — everything visible, no accordion */}
      <div className="px-5 py-14 md:px-10 md:py-20 lg:px-14">
        {projects.map(([projectKey, projectDocs], i) => {
          const meta = projectMeta[projectKey];
          const updated = projectUpdated(projectKey);
          return (
            <section key={projectKey} className="reveal mb-16 last:mb-0 md:mb-20" aria-labelledby={`docs-${projectKey}`}>
              <div className="mb-8 flex flex-col gap-6 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="section-number">{pad(i + 1)}</span>
                    <span aria-hidden="true" className="h-px flex-1 border-t border-dotted border-ink/30" />
                  </div>
                  <h2 id={`docs-${projectKey}`} className="font-display font-light tracking-tight text-3xl text-swiss-fg md:text-4xl">
                    {projectLabel(projectKey)}
                  </h2>
                  {meta && <p className="mt-3 font-swiss text-sm leading-relaxed text-swiss-fg/70 md:text-base">{meta.tagline}</p>}
                </div>
                {meta && (
                  <dl className="flex shrink-0 flex-wrap gap-x-10 gap-y-3 lg:max-w-sm lg:justify-end">
                    {[
                      ["Version", meta.version],
                      ["Platform", meta.platform],
                      ["Stack", meta.stack],
                      ["Updated", updated && formatDate(updated)],
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt className="t-label text-swiss-fg/60">{k}</dt>
                          <dd className="mt-1 font-mono text-xs text-swiss-fg">{v}</dd>
                        </div>
                      ))}
                  </dl>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {projectDocs.navItems.map((item, idx) => (
                  <Link key={item.slug} href={`/docs/${item.slug}`} className="group block">
                    <Surface tier="solid" tactile className="flex h-full flex-col rounded-md p-5 transition-colors duration-fast group-hover:border-accent/50">
                      <div className="flex items-start justify-between gap-3">
                        <span className="t-label text-swiss-fg/60 transition-colors duration-fast group-hover:text-swiss-accent">
                          {pad(idx + 1)}
                        </span>
                        {item.slug === meta?.featured && <Badge variant="released">Start here</Badge>}
                      </div>
                      <h3 className="mt-5 font-swiss text-base font-bold uppercase tracking-tight text-swiss-fg transition-colors duration-fast group-hover:text-swiss-accent">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 font-swiss text-sm leading-relaxed text-swiss-fg/60">
                        {docMeta[item.slug]?.description}
                      </p>
                      <span className="t-label mt-auto inline-flex items-center gap-1.5 pt-5 text-swiss-fg/60 transition-colors duration-fast group-hover:text-swiss-accent">
                        Read
                        <ArrowRight size={12} className="transition-transform duration-fast group-hover:translate-x-1" />
                      </span>
                    </Surface>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Recently updated */}
      <section className="reveal border-t border-ink/10 px-5 py-14 md:px-10 md:py-20 lg:px-14" aria-labelledby="docs-recent">
        <div className="mb-4 flex items-center gap-4">
          <span className="section-number">{pad(projects.length + 1)}</span>
          <span aria-hidden="true" className="h-px flex-1 border-t border-dotted border-ink/30" />
        </div>
        <h2 id="docs-recent" className="font-display font-light tracking-tight mb-8 text-3xl text-swiss-fg md:text-4xl">
          Recently updated
        </h2>
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {recentlyUpdated.map((row) => (
            <li key={row.slug}>
              <Link href={`/docs/${row.slug}`} className="group flex h-14 items-center gap-4 transition-colors duration-fast hover:bg-ink/[0.03] sm:gap-6 sm:px-2">
                <span className="t-label w-20 shrink-0 text-swiss-accent">
                  {projectLabel(row.project)}
                </span>
                <span className="min-w-0 flex-1 truncate font-swiss text-sm text-swiss-fg/80 transition-colors duration-fast group-hover:text-swiss-fg">
                  {row.title}
                </span>
                <time dateTime={row.updated} className="shrink-0 font-mono text-xs text-swiss-fg/60">
                  {formatDate(row.updated)}
                </time>
                <ArrowRight size={14} className="hidden shrink-0 text-swiss-fg/60 transition-all duration-fast group-hover:translate-x-1 group-hover:text-swiss-accent sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
