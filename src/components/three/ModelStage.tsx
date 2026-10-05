"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { DragState, SceneProps } from "./scenes";
import { Loader } from "@/components/motion/Loader";
import { useCanvasFont } from "./useCanvasFont";

// Every model starts as its rendered poster (art/, same camera), so first paint is an
// image. The live scene loads when the stage nears the viewport, renders only while
// visible, and fades in over the poster once it has drawn a frame. Reduced motion or
// no WebGL: the poster stays.

const scenes = {
  room: dynamic(() => import("./RoomScene").then((m) => m.RoomScene), { ssr: false }),
  parada: dynamic(() => import("./scenes").then((m) => m.ParadaScene), { ssr: false }),
  tala: dynamic(() => import("./scenes").then((m) => m.TalaScene), { ssr: false }),
} satisfies Record<string, React.ComponentType<SceneProps>>;

export type ModelName = keyof typeof scenes;

// Scenes compile shaders on mount, which can hold the main thread for a moment. Mount them
// one at a time, when the browser is idle, so scroll-in reveals and text never wait on WebGL.
const queue: (() => void)[] = [];
let draining = false;
function whenIdle(cb: () => void) {
  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(cb, { timeout: 900 });
  else window.setTimeout(cb, 250);
}
function drain() {
  const next = queue.shift();
  if (!next) {
    draining = false;
    return;
  }
  next();
  whenIdle(drain);
}
function scheduleMount(cb: () => void) {
  let cancelled = false;
  queue.push(() => !cancelled && cb());
  if (!draining) {
    draining = true;
    whenIdle(drain);
  }
  return () => {
    cancelled = true;
  };
}

let prefetched = false;
function prefetchScenes() {
  if (prefetched) return;
  prefetched = true;
  whenIdle(() => void import("./scenes"));
}

let webgl: boolean | null = null;
function supportsWebGL() {
  if (webgl !== null) return webgl;
  try {
    const c = document.createElement("canvas");
    webgl = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}

interface ModelStageProps {
  model: ModelName;
  poster: string;
  /** Poster alt text; the live canvas is decorative and hidden from assistive tech. */
  alt?: string;
  className?: string;
  /** Poster <Image> sizes. */
  sizes?: string;
  priority?: boolean;
  /** Drag to turn (project models). */
  draggable?: boolean;
  /** Tala: day/night, controlled by the page. */
  night?: boolean;
  /** Label for the cursor ring while over the stage. */
  cursor?: string;
  /** false keeps the poster and never loads WebGL (the hero room on phones). */
  live?: boolean;
  onClick?: () => void;
}

export function ModelStage({ model, poster, alt = "", className, sizes = "100vw", priority, draggable, night, cursor, live: allowLive = true, onClick }: ModelStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const near = useInView(ref, "700px 0px");
  const visible = useInView(ref, "0px", 0.05);
  const { font, display, ready: fontReady } = useCanvasFont();
  const [canRender, setCanRender] = useState(false);
  const [live, setLive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const drag = useRef<DragState>({ yaw: 0, velocity: 0, dragging: false });
  const last = useRef<{ x: number } | null>(null);
  /** Distance of the current/last drag, so the click that ends a drag can be ignored. */
  const moved = useRef(0);

  useEffect(() => setCanRender(supportsWebGL()), []);
  // Fetch the 3D code in the background right after load, so it's usually ready
  // before any stage scrolls near.
  useEffect(() => {
    if (canRender && !reduced) prefetchScenes();
  }, [canRender, reduced]);

  const wanted = allowLive && canRender && !reduced && near;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!wanted) {
      setMounted(false);
      setLive(false);
      return;
    }
    return scheduleMount(() => setMounted(true));
  }, [wanted]);

  // If a scene never draws (lost context, very slow device), stop showing the loader —
  // the poster is already a complete picture.
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    if (!wanted || live) return;
    setGaveUp(false);
    const t = window.setTimeout(() => setGaveUp(true), 20000);
    return () => window.clearTimeout(t);
  }, [wanted, live]);
  const loading = wanted && !live && !gaveUp;

  const Scene = scenes[model];

  const dragHandlers = draggable
    ? {
        onPointerDown: (e: React.PointerEvent) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          last.current = { x: e.clientX };
          moved.current = 0;
          drag.current.dragging = true;
          drag.current.velocity = 0;
        },
        onPointerMove: (e: React.PointerEvent) => {
          if (!last.current) return;
          const dx = e.clientX - last.current.x;
          last.current.x = e.clientX;
          moved.current += Math.abs(dx);
          // Only capture once it's clearly a horizontal drag, so touch scrolling still works.
          const el = e.currentTarget as Element;
          if (moved.current > 6 && !el.hasPointerCapture(e.pointerId)) el.setPointerCapture(e.pointerId);
          const step = dx * 0.008;
          drag.current.yaw += step;
          drag.current.velocity = step;
        },
        onPointerUp: () => {
          drag.current.dragging = false;
          last.current = null;
        },
        onPointerCancel: () => {
          drag.current.dragging = false;
          last.current = null;
        },
      }
    : {};

  return (
    <div
      ref={ref}
      className={cn("relative isolate select-none", draggable && "cursor-grab active:cursor-grabbing", className)}
      data-cursor={cursor}
      onPointerEnter={() => fine && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => {
        // A drag isn't a click.
        if (onClick && moved.current < 6) onClick();
      }}
      {...dragHandlers}
    >
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // the hero's poster is the page's largest paint: decode it into the first frame
        decoding={priority ? "sync" : "async"}
        className={cn("stage-feather pointer-events-none object-contain transition-opacity duration-700", live && "opacity-0")}
        draggable={false}
      />
      {mounted && (
        <div aria-hidden="true" className={cn("stage-feather absolute inset-0 transition-opacity duration-700", live ? "opacity-100" : "opacity-0")}>
          <Scene
            active={visible}
            font={font}
            display={display}
            fontReady={fontReady}
            onReady={() => setLive(true)}
            hovered={hovered}
            autoplay={!fine}
            drag={drag}
            night={night}
            onNavigate={(href) => router.push(href)}
          />
        </div>
      )}
      {/* The poster stays until the live model has drawn; this says it's on its way. */}
      {loading && <Loader label="Loading 3D" className="pointer-events-none absolute bottom-3 left-3" />}
    </div>
  );
}
