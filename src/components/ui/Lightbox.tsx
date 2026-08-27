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
      className="fixed inset-0 z-[55] flex items-center justify-center bg-swiss-fg/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-swiss-bg text-swiss-fg border-2 border-swiss-border hover:bg-swiss-accent hover:text-swiss-bg hover:border-swiss-accent transition-all duration-150"
        aria-label="Close lightbox"
      >
        <X size={20} strokeWidth={2.5} />
      </button>
      <div
        className="relative max-w-[90vw] max-h-[85vh] border-2 border-swiss-border overflow-hidden"
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
