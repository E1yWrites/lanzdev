"use client";

import { cn } from "@/lib/utils";

interface TerminalPreviewProps {
  className?: string;
}

export function TerminalPreview({ className }: TerminalPreviewProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-[#0a0a0a] text-white overflow-hidden",
        "shadow-[0_20px_80px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset]",
        className
      )}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF3B0F]" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[11px] text-white/40 tracking-wide">
          lorenz.dev / status
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 md:p-6 font-mono text-[12px] md:text-[13px] leading-relaxed min-h-[260px] md:min-h-[320px]">
        {/* Command: cat stack.json */}
        <div className="text-white/50">$ cat stack.json</div>
        <div className="text-white/90 mt-1">{"{"}</div>
        <div className="text-white/90 ml-4">&quot;name&quot;: &quot;lorenz.dev&quot;,</div>
        <div className="text-white/90 ml-4">&quot;status&quot;: &quot;active&quot;,</div>
        <div className="text-white/90 ml-4">&quot;focus&quot;: [&quot;software&quot;, &quot;design&quot;],</div>
        <div className="text-white/90 ml-4">&quot;stack&quot;: [&quot;react&quot;, &quot;typescript&quot;, &quot;rust&quot;]</div>
        <div className="text-white/90">{"}"}</div>

        {/* Command: cursor */}
        <div className="text-white/50 mt-4">$ cursor</div>

        {/* Prompt with cursor */}
        <div className="mt-4 flex items-center">
          <span className="text-white/50">$ </span>
          <span
            className="inline-block w-[7px] h-[14px] bg-[#FF3B0F] ml-0.5 cursor-blink"
            style={{ animation: "cursorBlink 1s step-end infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
