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
