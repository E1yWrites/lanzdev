import { cn } from "@/lib/utils";

// [simple-icons slug, background hex, logo hex]. A name without an entry still gets a plain badge.
const BRAND: Record<string, [string, string, string]> = {
  "React Native": ["react", "20232A", "61DAFB"],
  React: ["react", "20232A", "61DAFB"],
  Expo: ["expo", "000020", "FFFFFF"],
  "Next.js": ["nextdotjs", "000000", "FFFFFF"],
  "Node.js": ["nodedotjs", "339933", "FFFFFF"],
  Express: ["express", "000000", "FFFFFF"],
  Python: ["python", "3776AB", "FFFFFF"],
  FastAPI: ["fastapi", "009688", "FFFFFF"],
  OpenCV: ["opencv", "5C3EE8", "FFFFFF"],
  PostgreSQL: ["postgresql", "4169E1", "FFFFFF"],
  Prisma: ["prisma", "2D3748", "FFFFFF"],
  Turborepo: ["turborepo", "EF4444", "FFFFFF"],
  Tauri: ["tauri", "24C8D8", "FFFFFF"],
  TypeScript: ["typescript", "3178C6", "FFFFFF"],
  JavaScript: ["javascript", "F7DF1E", "000000"],
  Vite: ["vite", "646CFF", "FFFFFF"],
  "Svelte 5": ["svelte", "FF3E00", "FFFFFF"],
  Vitest: ["vitest", "6E9F18", "FFFFFF"],
  "Tailwind CSS": ["tailwindcss", "06B6D4", "FFFFFF"],
  MongoDB: ["mongodb", "47A248", "FFFFFF"],
  GSAP: ["greensock", "88CE02", "000000"],
  "three.js": ["threedotjs", "000000", "FFFFFF"],
  Remotion: ["", "0B84F3", "FFFFFF"],
  Git: ["git", "F05032", "FFFFFF"],
  GitHub: ["github", "181717", "FFFFFF"],
  Cisco: ["cisco", "1BA0D7", "FFFFFF"],
};

/** shields.io's path syntax: "-" is "--", "_" is "__", a space is "_". */
function badgeUrl(name: string) {
  const [logo, bg = "1C2230", fg = "FFFFFF"] = BRAND[name] ?? [];
  const text = encodeURIComponent(name.replace(/-/g, "--").replace(/_/g, "__").replace(/ /g, "_"));
  const params = new URLSearchParams({ style: "flat-square" });
  if (logo) {
    params.set("logo", logo);
    params.set("logoColor", fg);
  }
  return `https://img.shields.io/badge/${text}-${bg}?${params}`;
}

/** A project's stack as shields.io badges: the first `max`, then a "+N" for the rest. */
export function TechBadges({ names, max = 5, className }: { names: string[]; max?: number; className?: string }) {
  if (!names.length) return null;
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <ul className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {shown.map((n) => (
        <li key={n} className="flex">
          {/* eslint-disable-next-line @next/next/no-img-element -- an SVG from shields.io, nothing to optimise */}
          <img src={badgeUrl(n)} alt={n} height={20} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-5 w-auto" />
        </li>
      ))}
      {rest > 0 && (
        <li className="t-label flex h-5 items-center text-ink/60">
          <span aria-hidden="true">+{rest}</span>
          <span className="sr-only">and {rest} more: {names.slice(max).join(", ")}</span>
        </li>
      )}
    </ul>
  );
}
