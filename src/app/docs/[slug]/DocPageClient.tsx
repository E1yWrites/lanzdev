"use client";

import type { DocSection } from "@/types/doc";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { docsByProject } from "@/data/docs";
import { docMeta, formatDate, projectLabel } from "@/data/docMeta";
import { useReveal } from "@/hooks/useReveal";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pad = (n: number) => String(n).padStart(2, "0");

export function DocPageClient({ doc }: { doc: DocSection }) {
  const sectionRef = useReveal({ threshold: 0.08, stagger: true, staggerDelay: 60 });
  const bodyRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  const headings = useMemo(() => Array.from(doc.content.matchAll(/^## (.+)$/gm), (m) => m[1]), [doc.content]);
  const html = useMemo(() => renderMarkdown(doc.content), [doc.content]);

  const siblings = docsByProject[doc.project]?.navItems ?? [];
  const at = siblings.findIndex((s) => s.slug === doc.slug);
  const prev = at > 0 ? siblings[at - 1] : undefined;
  const next = at >= 0 && at < siblings.length - 1 ? siblings[at + 1] : undefined;
  const updated = docMeta[doc.slug]?.updated;

  // Scroll-spy for the right-hand TOC.
  useEffect(() => {
    const onScroll = () => {
      const cutoff = window.scrollY + 140;
      let cur = 0;
      headings.forEach((_, i) => {
        const el = document.getElementById(`doc-${i}`);
        if (el && el.getBoundingClientRect().top + window.scrollY <= cutoff) cur = i;
      });
      tocRef.current?.querySelectorAll<HTMLElement>("[data-toc]").forEach((a) => {
        a.dataset.active = String(Number(a.dataset.toc) === cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  // Delegate copy-button clicks inside the rendered markdown.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-copy-target]");
      if (!btn) return;
      const code = btn.dataset.copyTarget ? document.getElementById(btn.dataset.copyTarget) : null;
      if (code) navigator.clipboard?.writeText(code.textContent ?? "").catch(() => {});
      btn.classList.remove("doc-copy-pop");
      void btn.offsetWidth;
      btn.classList.add("doc-copy-pop");
      const orig = btn.textContent;
      btn.textContent = "Copied";
      window.setTimeout(() => {
        btn.textContent = orig;
      }, 1400);
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, []);

  return (
    <article ref={sectionRef} className="flex gap-12 px-5 py-10 md:px-10 md:py-14 lg:px-14">
      <div className="min-w-0 max-w-[720px] flex-1">
        <nav aria-label="Breadcrumb" className="t-label reveal flex items-center gap-2">
          <Link href="/docs" className="inline-flex min-h-7 items-center text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent">
            Docs
          </Link>
          <span className="text-swiss-fg/60">/</span>
          <span className="text-swiss-accent">{projectLabel(doc.project)}</span>
        </nav>
        <h1 className="font-display font-light tracking-tight reveal mt-5 text-4xl text-swiss-fg md:text-5xl">{doc.title}</h1>
        {(docMeta[doc.slug]?.description || updated) && (
          <div className="reveal mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {docMeta[doc.slug]?.description && (
              <p className="font-swiss text-base leading-relaxed text-swiss-fg/70">{docMeta[doc.slug].description}</p>
            )}
            {updated && (
              <time dateTime={updated} className="font-mono text-xs text-swiss-fg/60">
                Updated {formatDate(updated)}
              </time>
            )}
          </div>
        )}

        <div ref={bodyRef} className="doc-content mt-10 border-t border-ink/10 pt-8" dangerouslySetInnerHTML={{ __html: html }} />

        {(prev || next) && (
          <nav aria-label="Adjacent documents" className="reveal mt-16 grid gap-3 border-t border-ink/10 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/docs/${prev.slug}`} className="group surface-solid tactile flex flex-col gap-2 rounded-md p-5 transition-colors duration-fast hover:border-accent/50">
                <span className="t-label inline-flex items-center gap-1.5 text-swiss-fg/60">
                  <ArrowLeft size={11} className="transition-transform duration-fast group-hover:-translate-x-1" />
                  Previous
                </span>
                <span className="font-display text-xl font-light text-ink transition-colors duration-fast group-hover:text-accent">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/docs/${next.slug}`} className="group surface-solid tactile flex flex-col gap-2 rounded-md p-5 text-right transition-colors duration-fast hover:border-accent/50">
                <span className="t-label inline-flex items-center justify-end gap-1.5 text-swiss-fg/60">
                  Next
                  <ArrowRight size={11} className="transition-transform duration-fast group-hover:translate-x-1" />
                </span>
                <span className="font-display text-xl font-light text-ink transition-colors duration-fast group-hover:text-accent">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Right sticky mini-TOC */}
      {headings.length > 1 && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div ref={tocRef} className="sticky top-24">
            <span className="editorial-label block text-swiss-fg/60">On this page</span>
            <ul className="mt-4 border-l border-ink/10">
              {headings.map((h, i) => (
                <li key={h}>
                  <a
                    href={`#doc-${i}`}
                    data-toc={i}
                    className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-[13px] text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-fg data-[active=true]:border-swiss-accent data-[active=true]:text-swiss-fg"
                  >
                    {h}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </article>
  );
}

/* ---------------------------------------------------------------------------
 * Markdown → HTML. Deliberately tiny: the corpus is 16 hand-written docs using
 * `##`, paragraphs, `-`/`1.` lists, fenced code, pipe tables, **bold**, `code`
 * and [links](). Every tag emitted here is explicitly closed — HTML has no
 * self-closing <span/>, and innerHTML will happily nest everything after one.
 * ------------------------------------------------------------------------- */

const P = "mb-5 font-swiss text-[15px] leading-7 text-swiss-fg/70";

function renderMarkdown(content: string): string {
  const parts = content.split(/^## (.+)$/m);
  let codeCounter = 0;
  let html = "";

  const intro = parts[0].trim();
  if (intro) html += `<div class="doc-intro">${renderBody(intro, () => ++codeCounter)}</div>`;

  for (let i = 0; 1 + i * 2 < parts.length; i++) {
    const title = parts[1 + i * 2];
    const body = parts[2 + i * 2] ?? "";
    html +=
      `<section class="mt-12 border-t border-dotted border-ink/30 pt-10 first:mt-0 first:border-t-0 first:pt-0">` +
      `<h2 id="doc-${i}" class="mb-5 scroll-mt-24 font-display text-3xl font-light tracking-tight text-ink">${title}</h2>` +
      renderBody(body, () => ++codeCounter) +
      `</section>`;
  }
  return html;
}

function renderBody(raw: string, nextCode: () => number): string {
  let html = raw.trim();

  // Fenced code — must run before inline code so backticks inside blocks survive.
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang: string | undefined, code: string) => {
    const id = `doc-code-${nextCode()}`;
    const isShell = /^(bash|sh|shell|zsh)$/.test(lang ?? "");
    const body = esc(code.trim())
      .split("\n")
      .map((l) => (isShell ? l.replace(/(^|\s)(#.*)$/, '$1<span class="text-ink/60">$2</span>') : l))
      .join("\n");
    return (
      `<figure class="my-6 overflow-hidden rounded-md border border-ink/10 bg-swiss-muted">` +
      `<figcaption class="flex h-10 items-center gap-2 border-b border-ink/10 px-4">` +
      `<span class="h-2.5 w-2.5 rounded-full bg-ink/20"></span><span class="h-2.5 w-2.5 rounded-full bg-ink/20"></span><span class="h-2.5 w-2.5 rounded-full bg-ink/10"></span>` +
      `<span class="t-label ml-2 text-ink/60">${lang || "text"}</span>` +
      `<button type="button" data-copy-target="${id}" class="t-label ml-auto rounded-[4px] border border-ink/15 px-2.5 py-1 text-swiss-fg/60 transition-colors duration-fast hover:border-accent/60 hover:text-swiss-fg">Copy</button>` +
      `</figcaption>` +
      `<pre tabindex="0" class="overflow-x-auto p-4 font-mono text-[13px] leading-6 text-swiss-fg/90"><code id="${id}">${body}</code></pre>` +
      `</figure>`
    );
  });

  // Pipe tables — a run of `| … |` lines; second line of dashes marks the header.
  html = html.replace(/^(?:\|.*\|\s*\n?)+/gm, (block) => {
    const rows = block
      .trim()
      .split("\n")
      .map((line) => line.split("|").slice(1, -1).map((c) => c.trim()));
    const hasHeader = rows.length > 1 && rows[1].every((c) => /^:?-+:?$/.test(c));
    const head = hasHeader ? rows[0] : null;
    const body = hasHeader ? rows.slice(2) : rows;
    const th = (c: string) => `<th class="t-label px-4 py-2.5 text-left text-swiss-fg/60">${c}</th>`;
    const td = (c: string) => `<td class="px-4 py-2.5 align-top font-swiss text-sm leading-6 text-swiss-fg/70">${c}</td>`;
    return (
      `<div class="my-6 overflow-x-auto rounded-md border border-ink/10"><table class="w-full">` +
      (head ? `<thead class="border-b border-ink/10 bg-ink/[0.03]"><tr>${head.map(th).join("")}</tr></thead>` : "") +
      `<tbody class="divide-y divide-ink/10">${body.map((r) => `<tr>${r.map(td).join("")}</tr>`).join("")}</tbody>` +
      `</table></div>\n`
    );
  });

  // List items — tagged so runs can be wrapped in the right list element below.
  html = html.replace(
    /^- (.+)$/gm,
    `<li data-li="ul" class="flex gap-3 font-swiss text-[15px] leading-7 text-swiss-fg/70"><span class="mt-[14px] h-px w-3 shrink-0 bg-accent"></span><span class="min-w-0">$1</span></li>`
  );
  html = html.replace(
    /^(\d+)\. (.+)$/gm,
    (_m, n: string, item: string) =>
      `<li data-li="ol" class="flex gap-3 font-swiss text-[15px] leading-7 text-swiss-fg/70"><span class="w-6 shrink-0 pt-px font-mono text-xs font-bold leading-7 text-swiss-accent">${pad(Number(n))}</span><span class="min-w-0">${item}</span></li>`
  );

  // Inline
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-swiss-fg">$1</strong>');
  html = html.replace(/`([^`]+)`/g, (_m, code: string) => `<code class="rounded-[4px] border border-ink/10 bg-ink/5 px-1.5 py-0.5 font-mono text-[13px] text-swiss-fg">${esc(code)}</code>`);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text: string, href: string) => {
    const ext = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${ext} class="font-medium text-swiss-accent underline decoration-swiss-accent/40 underline-offset-4 transition-colors duration-fast hover:decoration-swiss-accent">${text}</a>`;
  });

  // Paragraphs — anything that isn't already a block element.
  html = html
    .split("\n\n")
    .map((block) => {
      const t = block.trim();
      if (!t || /^<(figure|div|li|table|h\d)/.test(t)) return t;
      return `<p class="${P}">${t}</p>`;
    })
    .join("\n");

  // Wrap runs of tagged <li> in <ul>/<ol>.
  html = html.replace(/((?:<li data-li="ul"[^>]*>[\s\S]*?<\/li>\n?)+)/g, '<ul class="my-5 space-y-2">$1</ul>');
  html = html.replace(/((?:<li data-li="ol"[^>]*>[\s\S]*?<\/li>\n?)+)/g, '<ol class="my-5 space-y-2">$1</ol>');

  return html;
}
