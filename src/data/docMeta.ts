import { docsByProject } from "@/data/docs";

export interface ProjectMeta {
  label: string;
  tagline: string;
  /** Optional — only shown when a release actually exists. */
  version?: string;
  platform: string;
  stack: string;
  featured: string;
}

export const projectMeta: Record<string, ProjectMeta> = {
  tala: {
    label: "TALA",
    tagline: "A local-first note-taking workspace for writing, drawing and thinking.",
    version: "v1.0.1",
    platform: "Windows · macOS · Web",
    stack: "React · Tauri · TypeScript",
    featured: "getting-started",
  },
  "parada-landing": {
    label: "PARADA",
    tagline: "Smart parking infrastructure for automated vehicle recognition and occupancy.",
    platform: "Web · Mobile · API",
    stack: "React · GSAP · Vite",
    featured: "parada-overview",
  },
  "modpack-development": {
    label: "MODPACK",
    tagline: "A modern Minecraft Fabric modpack development environment.",
    platform: "Windows · macOS · Linux",
    stack: "Java · Gradle · Fabric",
    featured: "modpack-setup",
  },
};

export const projectLabel = (project: string) => projectMeta[project]?.label ?? project;

export interface DocMeta {
  description: string;
  /** ISO date (YYYY-MM-DD) */
  updated: string;
}

export const docMeta: Record<string, DocMeta> = {
  "getting-started": { description: "Your first 5 minutes with Tala — download, install and create your first note.", updated: "2026-09-11" },
  installation: { description: "Windows, macOS and verified SHA-256 downloads.", updated: "2026-09-05" },
  features: { description: "Rich text, handwriting, organization, templates and search.", updated: "2026-09-11" },
  "keyboard-shortcuts": { description: "Every global and editor shortcut in one place.", updated: "2026-09-08" },
  "pen-tools": { description: "Six presets, ten ink colors and six stroke widths.", updated: "2026-09-11" },
  exporting: { description: "JSON backup, merge import and integrity checks.", updated: "2026-09-04" },
  troubleshooting: { description: "Common issues and the fastest fixes.", updated: "2026-09-07" },
  faq: { description: "Licensing, accounts, storage and multi-device answers.", updated: "2026-09-06" },
  "developer-setup": { description: "Clone, build and run Tala from source.", updated: "2026-09-07" },
  "parada-overview": { description: "Smart parking with OCR-assisted zone detection.", updated: "2026-09-09" },
  "parada-runtime": { description: "Component runtime, local server and file layout.", updated: "2026-09-03" },
  "parada-animations": { description: "GSAP pipeline, scan canvas and micro-reveals.", updated: "2026-09-09" },
  "parada-related": { description: "Repositories and companion architecture.", updated: "2026-09-02" },
  "modpack-overview": { description: "A Fabric modpack development environment.", updated: "2026-09-10" },
  "modpack-setup": { description: "Prerequisites and your first build.", updated: "2026-09-10" },
  "modpack-structure": { description: "Gradle wrapper, sources and mixins layout.", updated: "2026-09-08" },
};

/** Latest `updated` across a project's docs (ISO), so it can't drift from the per-doc dates. */
export function projectUpdated(project: string): string | undefined {
  return docsByProject[project]?.navItems
    .map((it) => docMeta[it.slug]?.updated)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`;
}
