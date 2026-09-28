"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/constants";

/**
 * One object, four labels. The macropad loop is rendered by art/ (Remotion) on pure black;
 * `mix-blend-mode: screen` drops that black into the page. Reduced motion holds the poster frame.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const video = videoRef.current;
      if (!video) return;
      if (mql.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        video.play().catch(() => {});
      }
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return (
    // bg-paper matters: <main> is a stacking context, so the video can only screen-blend with
    // a backdrop painted inside it.
    <section aria-labelledby="hero-title" className="relative bg-paper">
      <div className="mx-auto grid min-h-[calc(100svh-56px)] max-w-7xl grid-rows-[1fr_auto] px-5 md:px-8">
        <div className="grid content-center items-center gap-6 py-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <h1 id="hero-title" className="t-label text-ink">
            Software for curious people
          </h1>

          <div className="mx-auto aspect-square w-[min(92vw,62svh,720px)]">
            <video
              ref={videoRef}
              className="h-full w-full mix-blend-screen"
              poster={asset("/art/hero-poster.jpg")}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              aria-hidden="true"
            >
              <source src={asset("/art/hero.webm")} type="video/webm" />
              <source src={asset("/art/hero.mp4")} type="video/mp4" />
            </video>
          </div>

          <p className="t-label text-ink lg:text-right">Lorenz Malabanan — 2026</p>
        </div>

        <a href="#work" className="t-label mx-auto mb-8 flex flex-col items-center gap-1 text-ink transition-colors duration-fast hover:text-accent">
          Scroll down
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
