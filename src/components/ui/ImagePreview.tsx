"use client";

import { useState } from "react";
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
      <figure
        className={cn("group cursor-pointer relative", className)}
        onClick={() => setLightboxOpen(true)}
      >
        <div className="relative overflow-hidden border-2 border-swiss-border bg-swiss-muted transition-all duration-150 group-hover:bg-swiss-fg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-auto transition-all duration-150 group-hover:opacity-80"
          />
        </div>
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
