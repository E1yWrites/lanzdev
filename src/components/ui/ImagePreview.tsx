"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

interface ImagePreviewProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function ImagePreview({
  src,
  alt,
  caption,
  className,
}: ImagePreviewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <figure className={cn("group relative", className)}>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Enlarge image: ${alt}`}
          className="relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-ink/10 bg-ink/[0.02] transition-colors duration-normal hover:border-ink/25"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-auto w-full transition-transform duration-slow ease-standard group-hover:scale-[1.01]"
          />
          <span
            aria-hidden="true"
            className="surface-glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-swiss-fg opacity-0 transition-opacity duration-fast group-hover:opacity-100"
          >
            <Maximize2 size={14} strokeWidth={2} />
          </span>
        </button>
        {caption && (
          <figcaption className="mt-3 font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightboxOpen && (
        <Lightbox
          src={src}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
