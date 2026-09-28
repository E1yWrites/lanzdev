"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";
import { allDocSections } from "@/data/docs";
import { docMeta, projectLabel, projectMeta } from "@/data/docMeta";
import { cn } from "@/lib/utils";

const PROJECTS = [{ key: "all", label: "All" }, ...Object.keys(projectMeta).map((key) => ({ key, label: projectLabel(key) }))];

const RECENT_KEY = "lanzdev-doc-search-recent";

interface Entry {
  slug: string;
  title: string;
  project: string;
  label: string;
  description: string;
}

// Ordered token substring match — good enough for 16 documents.
function score(text: string, query: string): number {
  const t = text.toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);
  if (!tokens.length) return -1;
  let total = 0;
  let last = -1;
  for (const tok of tokens) {
    let i = t.indexOf(tok, last + 1);
    if (i === -1) i = t.indexOf(tok);
    if (i === -1) return -1;
    total += tok.length + (1 - i / Math.max(1, t.length));
    last = i;
  }
  return total;
}

function loadRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

/**
 * Docs search. Shortcut is `/` (GitHub/MDN convention) — ⌘K already belongs to the
 * site-wide CommandPalette. Mount at most one instance per page.
 */
export function DocsSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("all");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo<Entry[]>(
    () =>
      allDocSections.map((s) => ({
        slug: s.slug,
        title: s.title,
        project: s.project,
        label: projectLabel(s.project),
        description: docMeta[s.slug]?.description ?? "",
      })),
    []
  );

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const hits: Array<{ s: number; e: Entry }> = [];
    for (const e of entries) {
      if (project !== "all" && e.project !== project) continue;
      const s = score(`${e.title} ${e.description} ${e.label} ${e.slug}`, q);
      if (s >= 0) hits.push({ s, e });
    }
    hits.sort((a, b) => b.s - a.s);
    return hits.slice(0, 12).map((h) => h.e);
  }, [query, project, entries]);

  const list = query.trim()
    ? results
    : recent.map((slug) => entries.find((e) => e.slug === slug)).filter((e): e is Entry => Boolean(e));

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setProject("all");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, list]);

  const openDoc = (slug: string) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 5);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    setOpen(false);
    router.push(`/docs/${slug}`);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => {
        const n = list.length;
        if (!n) return a;
        return e.key === "ArrowDown" ? (a + 1) % n : (a - 1 + n) % n;
      });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = list[Math.min(active, list.length - 1)];
      if (target) openDoc(target.slug);
    }
  };

  const kbd = "shrink-0 rounded-[4px] border border-ink/15 bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] text-ink/70";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        className={cn(
          "tactile flex w-full items-center justify-between gap-3 rounded-md border border-ink/15 bg-ink/5 text-left transition-colors duration-fast hover:border-ink/30 hover:bg-ink/10",
          compact ? "h-9 px-3" : "h-12 max-w-[560px] px-4"
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2.5 text-swiss-fg/60", compact ? "text-xs" : "text-sm")}>
          <Search size={compact ? 13 : 15} className="shrink-0" />
          <span className="truncate">Search docs…</span>
        </span>
        <kbd className={kbd}>/</kbd>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Search documentation" className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="surface-elevated relative mx-auto mt-[10vh] w-[min(600px,calc(100vw-32px))] overflow-hidden rounded-lg">
            <div className="flex items-center gap-3 border-b border-ink/10 px-4">
              <Search size={16} className="shrink-0 text-swiss-fg/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search documentation…"
                className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-swiss-fg placeholder:text-swiss-fg/60 focus:outline-none"
              />
              <kbd className={kbd}>esc</kbd>
            </div>

            <div className="flex items-center gap-1 border-b border-ink/10 px-3 py-2" role="group" aria-label="Filter by project">
              {PROJECTS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={project === p.key}
                  onClick={() => {
                    setProject(p.key);
                    setActive(0);
                  }}
                  className={cn(
                    "t-label rounded-[4px] px-2.5 py-1 transition-colors duration-fast",
                    project === p.key ? "bg-swiss-fg text-swiss-bg" : "text-swiss-fg/60 hover:bg-ink/10 hover:text-swiss-fg"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div ref={listRef} className="scrollbar-hide max-h-[340px] overflow-y-auto p-2" role="listbox">
              {list.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-swiss-fg/60">
                  {query.trim() ? "No documents match your search." : "Type to search all documentation. Recent docs appear here."}
                </p>
              )}
              {list.map((e, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={e.slug}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-idx={i}
                    onClick={() => openDoc(e.slug)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left transition-colors duration-instant",
                      isActive ? "border-swiss-accent bg-ink/10" : "border-transparent hover:bg-ink/5"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="t-label text-swiss-accent">{e.label}</span>
                        <span className={cn("truncate text-sm", isActive ? "text-swiss-fg" : "text-swiss-fg/80")}>{e.title}</span>
                      </span>
                      {e.description && <span className="mt-0.5 block truncate text-xs text-swiss-fg/60">{e.description}</span>}
                    </span>
                    <CornerDownLeft size={13} className={cn("shrink-0 text-swiss-accent transition-opacity duration-instant", !isActive && "opacity-0")} />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-ink/10 px-4 py-2.5 t-label text-ink/60">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span className="ml-auto">/ search · ⌘K commands</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
