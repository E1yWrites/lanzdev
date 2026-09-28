"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-[55] flex animate-fade-in items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="surface-glass absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full text-swiss-fg transition-colors duration-fast hover:bg-accent hover:text-swiss-bg"
        autoFocus
        aria-label="Close lightbox"
      >
        <X size={20} strokeWidth={2.5} />
      </button>
      <div
        className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-lg border border-ink/10 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          className="max-w-full max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
}
