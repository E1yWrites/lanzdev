"use client";

import type { DocSection } from "@/types/doc";
import Link from "next/link";

interface DocPageClientProps {
  doc: DocSection;
}

export function DocPageClient({ doc }: DocPageClientProps) {
  const content = renderMarkdown(doc.content);

  return (
    <article className="py-10 px-6 md:px-10 max-w-3xl">
      <div className="mb-2 flex items-center gap-2">
        <Link
          href="/docs"
          className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150"
        >
          Docs
        </Link>
        <span className="font-swiss text-[11px] text-swiss-fg/30">/</span>
        <span className="section-number">{doc.project}</span>
      </div>

      <h1 className="font-swiss font-black text-3xl md:text-4xl tracking-tighter uppercase text-swiss-fg mt-6 mb-8">
        {doc.title}
      </h1>

      <div
        className="doc-content font-swiss text-base text-swiss-fg/70 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}

function renderMarkdown(content: string): string {
  let html = content;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-swiss font-bold text-lg uppercase tracking-tight text-swiss-fg mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-swiss font-black text-2xl tracking-tighter uppercase text-swiss-fg mt-10 mb-4">$1</h2>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-swiss-fg font-bold">$1</strong>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-swiss-muted border-2 border-swiss-border px-2 py-0.5 font-swiss text-xs font-bold tracking-widest uppercase text-swiss-fg/70">$1</code>');

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const escapedCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre class="bg-swiss-fg text-swiss-bg border-2 border-swiss-border p-4 my-5 overflow-x-auto text-sm leading-relaxed font-swiss"><code>${escapedCode.trim()}</code></pre>`;
    }
  );

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="flex gap-2 mb-1"><span class="text-swiss-accent font-bold shrink-0">—</span>$1</li>');
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="flex gap-2 mb-1"><span class="text-swiss-fg/40 font-swiss text-xs font-bold tracking-widest shrink-0">$1.</span>$2</li>');

  // Tables (basic)
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match
      .split("|")
      .filter((c) => c.trim())
      .map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    return `<div class="flex gap-4 py-2 border-b-2 border-swiss-border">${cells.map((c) => `<span class="flex-1 font-swiss text-sm text-swiss-fg/70">${c}</span>`).join("")}</div>`;
  });

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-swiss-accent font-bold underline underline-offset-4 decoration-swiss-accent hover:text-swiss-fg transition-colors duration-150">$1</a>'
  );

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<div") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      if (trimmed.startsWith("<li")) {
        return `<ul class="my-3">${trimmed}</ul>`;
      }
      return `<p class="mb-4">${trimmed}</p>`;
    })
    .join("\n");

  // Wrap consecutive li elements in ul
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul class="my-3 space-y-1.5">$1</ul>');

  return html;
}
