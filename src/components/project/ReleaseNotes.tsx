import { cn } from "@/lib/utils";

interface TimelineEntryProps {
  version: string;
  date: string;
  latest?: boolean;
  tags?: string[];
  children: React.ReactNode;
}

/** One release in a version timeline — sticky version rail on the left, notes on the right. */
export function TimelineEntry({ version, date, latest = false, tags = [], children }: TimelineEntryProps) {
  return (
    <article className="grid gap-6 border-t border-ink/10 py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10 md:py-12">
      <header className="self-start md:sticky md:top-24 md:col-span-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              latest ? "bg-swiss-accent shadow-[0_0_0_4px_rgb(var(--accent)/0.15)]" : "bg-ink/25"
            )}
          />
          <h3 className="font-mono text-base font-bold normal-case tracking-normal text-swiss-fg">{version}</h3>
        </div>
        <p className="t-label mt-2 pl-5 text-swiss-fg/60">{date}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 pl-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "t-label rounded-sm border px-1.5 py-0.5",
                  latest ? "border-accent/30 bg-accent/10 text-swiss-accent" : "border-ink/15 text-swiss-fg/60"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </article>
  );
}

/** A labelled bullet group — "Added", "Fixed", or a release-note heading. */
export function NoteGroup({ label, items }: { label?: React.ReactNode; items: React.ReactNode[] }) {
  return (
    <div className="mb-6 last:mb-0">
      {label && (
        <h4 className="t-label mb-3 leading-normal text-swiss-fg/60">
          {label}
        </h4>
      )}
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 font-swiss text-sm leading-relaxed text-swiss-fg/75">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-swiss-accent" />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Markdown subset for GitHub release bodies ────────────────────────────────
// Headings, "Label:" lines, bullet/numbered lists and paragraphs, with inline
// `code`, **bold**, [links](https://…) and bare URLs. Output is React nodes only.

type Block =
  | { type: "label"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    if (list) blocks.push({ type: "list", items: list });
    paragraph = [];
    list = null;
  };

  const lines = body.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(/^#{1,6}\s+(.+?)\s*#*$/) ?? line.match(/^([A-Z][\w '’&/-]{0,40}):$/);
    const item = line.match(/^(?:[-*+]|\d+[.)])\s+(.+)$/);

    if (!line || /^(-{3,}|\*{3,})$/.test(line)) {
      flush();
    } else if (heading) {
      flush();
      blocks.push({ type: "label", text: heading[1].replace(/\*\*/g, "") });
    } else if (item) {
      if (paragraph.length) flush();
      (list ??= []).push(item[1]);
    } else if (list && raw.startsWith("  ")) {
      list[list.length - 1] += ` ${line}`;
    } else {
      if (list) flush();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)<]+)/g;

function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of Array.from(text.matchAll(INLINE))) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const [whole, code, bold, linkText, linkHref, bare] = m;
    if (code) {
      out.push(
        <code key={i} className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-swiss-fg">
          {code.slice(1, -1)}
        </code>
      );
    } else if (bold) {
      out.push(<strong key={i} className="font-semibold text-swiss-fg">{bold.slice(2, -2)}</strong>);
    } else {
      const href = linkHref ?? bare ?? whole;
      out.push(
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words text-swiss-fg underline decoration-ink/30 underline-offset-4 transition-colors duration-fast hover:text-swiss-accent hover:decoration-accent"
        >
          {linkText ?? href.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
        </a>
      );
    }
    last = i + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Renders a GitHub release body. Consecutive label + list pairs become NoteGroups. */
export function ReleaseNotes({ body }: { body: string }) {
  const blocks = parseBlocks(body);
  if (blocks.length === 0) return null;

  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (block.type === "label" && next?.type === "list") {
      nodes.push(<NoteGroup key={i} label={block.text} items={next.items.map(renderInline)} />);
      i++;
    } else if (block.type === "label") {
      nodes.push(
        <h4 key={i} className="t-label mb-3 mt-6 leading-normal text-swiss-fg/60 first:mt-0">
          {block.text}
        </h4>
      );
    } else if (block.type === "list") {
      nodes.push(<NoteGroup key={i} items={block.items.map(renderInline)} />);
    } else {
      nodes.push(
        <p key={i} className="mb-4 max-w-2xl font-swiss text-sm leading-relaxed text-swiss-fg/70 last:mb-0">
          {renderInline(block.text)}
        </p>
      );
    }
  }
  return <div className="max-w-2xl">{nodes}</div>;
}
