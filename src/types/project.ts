export type Platform = "windows" | "macos" | "linux";

export type ProjectStatus =
  | "released"
  | "in-progress"
  | "prototype"
  | "archived"
  | "planned";

export interface DownloadInfo {
  available: boolean;
  url?: string;
  version?: string;
  architecture?: string;
  fileSize?: string;
}

export interface ProjectFeature {
  name: string;
  available: boolean;
  description?: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectChangelogEntry {
  version: string;
  date: string;
  current?: boolean;
  added?: string[];
  changed?: string[];
  fixed?: string[];
  security?: string[];
  breaking?: string[];
}

export interface ProjectFilm {
  webm: string;
  mp4: string;
  poster: string;
  /** Seconds. */
  duration: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: "done" | "active" | "next";
  /** ISO date the phase landed (from the repository history). */
  date?: string;
}

export interface ProjectStat {
  value: string;
  label: string;
}

/** Procedural 3D model in src/three that represents the project. */
export type ProjectModel = "parada" | "tala";

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  version: string;
  releaseDate: string;
  platforms: Platform[];
  technologies: string[];
  license: string;
  /** Square app icon, shown on a light tile (downloads panel). */
  icon?: string;
  /** Transparent render of the project's 3D model (art/ Remotion project). */
  cover?: string;
  /** Live 3D model shown in place of the cover once WebGL is ready. */
  model?: ProjectModel;
  /** 15-second showcase film rendered in art/. */
  film?: ProjectFilm;
  /** Folder colour on the home page. */
  tone?: "accent" | "solar" | "sheet";
  /** Where it runs when it isn't a desktop download, e.g. "Mobile · Web". */
  surfaces?: string;
  /** Short line under the name on the home page. */
  role?: string;
  stats?: ProjectStat[];
  milestones?: ProjectMilestone[];
  links?: { label: string; href: string }[];
  heroImage?: string;
  screenshots: ProjectScreenshot[];
  features: ProjectFeature[];
  githubUrl: string;
  demoUrl?: string;
  documentationUrl?: string;
  downloads: {
    windows?: DownloadInfo;
    macos?: DownloadInfo;
    linux?: DownloadInfo;
  };
  featured: boolean;
  story?: {
    whyItExists: string;
    content: string;
  };
  changelog: ProjectChangelogEntry[];
}
