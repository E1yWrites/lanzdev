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
  parada: {
    label: "PARADA",
    tagline: "Smart parking with zone-level availability from OCR-assisted gate cameras.",
    platform: "Mobile · Web · API",
    stack: "Expo · Next.js · Express · FastAPI",
    featured: "parada-overview",
  },
  tala: {
    label: "TALA",
    tagline: "A local-first note-taking workspace for writing, drawing and thinking.",
    version: "v1.1.0",
    platform: "Windows · Web",
    stack: "React · Tauri · TypeScript",
    featured: "getting-started",
  },
};

export const projectLabel = (project: string) => projectMeta[project]?.label ?? project;

export interface DocMeta {
  description: string;
  /** ISO date (YYYY-MM-DD) */
  updated: string;
}

export const docMeta: Record<string, DocMeta> = {
  "parada-overview": { description: "What PARADA is, the one number it trusts, and where it stands.", updated: "2026-09-28" },
  "parada-architecture": { description: "Monorepo layout, data flow and the realtime contract.", updated: "2026-09-28" },
  "parada-vision": { description: "The plate pipeline and its published Phase 14 benchmark.", updated: "2026-09-28" },
  "parada-local": { description: "Install, run every service and test against real PostgreSQL.", updated: "2026-09-28" },
  "parada-landing": { description: "The capstone landing page and its GSAP pipeline.", updated: "2026-09-28" },
  "getting-started": { description: "Your first five minutes with Tala — download, install and write.", updated: "2026-09-28" },
  installation: { description: "Windows installers, Linux builds, the web app and checksums.", updated: "2026-09-28" },
  features: { description: "Rich text, handwriting, gestures, documents and search.", updated: "2026-09-28" },
  "keyboard-shortcuts": { description: "Global, editor and drawing shortcuts in one place.", updated: "2026-09-28" },
  "pen-tools": { description: "The Draw popover, six presets, lasso and stylus settings.", updated: "2026-09-28" },
  exporting: { description: "Tala .zip packages, legacy JSON backups and safe imports.", updated: "2026-09-28" },
  troubleshooting: { description: "Common issues and the fastest fixes.", updated: "2026-09-28" },
  faq: { description: "Licensing, accounts, storage and moving between devices.", updated: "2026-09-28" },
  "developer-setup": { description: "Clone, build, test and package Tala from source.", updated: "2026-09-28" },
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
