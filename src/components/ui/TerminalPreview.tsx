"use client";

import { cn } from "@/lib/utils";
import { Surface } from "@/components/ui/Surface";

interface TerminalPreviewProps {
  className?: string;
}

export function TerminalPreview({ className }: TerminalPreviewProps) {
  return (
    <Surface
      tier="glass"
      interactive
      className={cn("rounded-lg overflow-hidden text-ink", className)}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <div className="w-2.5 h-2.5 rounded-full bg-ink/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-ink/10" />
        </div>
        <span className="font-mono text-[11px] text-ink/40 tracking-wide">
          lorenz.dev / status
        </span>
      </div>

      {/* Terminal body */}
      <div className="relative p-4 md:p-6 font-mono text-[12px] md:text-[13px] leading-relaxed min-h-[260px] md:min-h-[320px]">
        <div className="text-ink/45">$ cat stack.json</div>
        <div className="text-ink/85 mt-1">{"{"}</div>
        <div className="text-ink/85 ml-4">&quot;name&quot;: &quot;lorenz.dev&quot;,</div>
        <div className="text-ink/85 ml-4">&quot;status&quot;: &quot;active&quot;,</div>
        <div className="text-ink/85 ml-4">&quot;focus&quot;: [&quot;software&quot;, &quot;design&quot;],</div>
        <div className="text-ink/85 ml-4">&quot;stack&quot;: [&quot;react&quot;, &quot;typescript&quot;, &quot;rust&quot;]</div>
        <div className="text-ink/85">{"}"}</div>

        <div className="text-ink/45 mt-4">$ cursor</div>

        <div className="mt-4 flex items-center">
          <span className="text-ink/45">$ </span>
          <span
            className="inline-block w-[7px] h-[14px] bg-accent ml-0.5 cursor-blink"
            style={{ animation: "cursorBlink 1s step-end infinite" }}
          />
        </div>
      </div>
    </Surface>
  );
}
