import type { Platform, Project, ProjectStatus } from "@/types/project";

type BadgeVariant = "released" | "in-progress" | "prototype" | "archived" | "planned";

export const PLATFORMS: { key: Platform; label: string; detail: string }[] = [
  { key: "windows", label: "Windows", detail: "Windows 10 / 11 · x64" },
  { key: "macos", label: "macOS", detail: "Apple Silicon · ARM64" },
  { key: "linux", label: "Linux", detail: "x86_64 · AppImage / DEB / RPM" },
];

export const platformLabel = (key: Platform) => PLATFORMS.find((p) => p.key === key)?.label ?? key;

const STATUS: Record<ProjectStatus, { variant: BadgeVariant; label: string }> = {
  released: { variant: "released", label: "Released" },
  "in-progress": { variant: "in-progress", label: "In progress" },
  prototype: { variant: "prototype", label: "Prototype" },
  archived: { variant: "archived", label: "Archived" },
  planned: { variant: "planned", label: "Planned" },
};

export const projectStatus = (status: ProjectStatus) => STATUS[status];

/** "Windows / macOS" for desktop builds, "Web" for a live demo, otherwise "Source". */
export function platformSummary(project: Pick<Project, "platforms" | "demoUrl">) {
  if (project.platforms.length) return project.platforms.map(platformLabel).join(" / ");
  return project.demoUrl ? "Web" : "Source";
}

export function hasDownloads(project: Project) {
  return PLATFORMS.some(({ key }) => project.downloads[key]?.available);
}

/** Best-effort client OS detection, used only to highlight a download. */
export function detectPlatform(userAgent: string): Platform | null {
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|android/.test(ua)) return null;
  if (ua.includes("windows")) return "windows";
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macos";
  if (ua.includes("linux")) return "linux";
  return null;
}
