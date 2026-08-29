import { cache } from "react";
import { projects as curatedProjects } from "@/data/projects";
import type { Project, Platform, ProjectStatus, DownloadInfo } from "@/types/project";
import type { Release } from "@/types/release";
import {
  downloadsFromRelease,
  fetchRepoByName,
  fetchRepoLatestRelease,
  fetchUserRepos,
  type GithubRepo,
} from "./github";

export interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  technologies: string[];
  platforms: Platform[];
  status: ProjectStatus;
}

// Repos that should never appear as projects on the site.
const EXCLUDED_REPO_NAMES = new Set(["lanzdev"]);

function toTitleCase(name: string): string {
  return name
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function mapRepoToProject(repo: GithubRepo): Project {
  const description =
    repo.description ||
    "A project built and maintained independently. Visit the repository for more details.";

  return {
    id: repo.name.toLowerCase(),
    slug: repo.name.toLowerCase(),
    name: toTitleCase(repo.name),
    tagline: repo.description || "Open source project on GitHub.",
    description,
    status: repo.archived ? "archived" : "in-progress",
    version: "",
    releaseDate: repo.updated_at || repo.pushed_at,
    platforms: repo.language ? (["windows", "macos", "linux"] as Platform[]) : [],
    technologies: repo.language ? [repo.language] : [],
    license: repo.license?.spdx_id || "Open Source",
    heroImage: undefined,
    screenshots: [],
    features: [],
    githubUrl: repo.html_url,
    demoUrl: repo.homepage || undefined,
    downloads: {},
    featured: false,
    changelog: [],
  };
}

type EnrichedDownloads = {
  windows?: DownloadInfo;
  macos?: DownloadInfo;
  linux?: DownloadInfo;
};

function enrichProjectFromRelease(project: Project, release: Release): Project {
  const { downloads, version, releaseDate } = downloadsFromRelease(release);
  const hasDownloads = Object.keys(downloads).length > 0;
  if (!hasDownloads) return project;

  return {
    ...project,
    version: version || project.version,
    releaseDate: releaseDate || project.releaseDate,
    downloads: downloads as EnrichedDownloads,
    platforms: Object.keys(downloads) as Platform[],
    status: project.status === "archived" ? project.status : ("released" as ProjectStatus),
  };
}

async function enrichProjectFromRepo(
  project: Project,
  repo: GithubRepo | undefined
): Promise<Project> {
  if (!repo) return project;
  const release = await fetchRepoLatestRelease(repo.name);
  if (!release) return project;
  return enrichProjectFromRelease(project, release);
}

export const getAllProjects = cache(async (): Promise<Project[]> => {
  let repos: GithubRepo[] = [];
  try {
    repos = await fetchUserRepos();
  } catch {
    repos = [];
  }
  const repoByName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));

  const result: Project[] = [];

  for (const curated of curatedProjects) {
    const repo = repoByName.get(curated.slug.toLowerCase());
    result.push(await enrichProjectFromRepo(curated, repo));
  }

  for (const repo of repos) {
    if (repo.fork) continue;
    if (EXCLUDED_REPO_NAMES.has(repo.name)) continue;
    if (result.some((p) => p.slug === repo.name.toLowerCase())) {
      continue;
    }
    result.push(await enrichProjectFromRepo(mapRepoToProject(repo), repo));
  }

  return result;
});

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug);
}

export async function getFeaturedProject(): Promise<Project | undefined> {
  const featured = curatedProjects.find((p) => p.featured);
  if (!featured) return undefined;
  try {
    const repo = await fetchRepoByName(featured.slug);
    return await enrichProjectFromRepo(featured, repo ?? undefined);
  } catch {
    return featured;
  }
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  const all = await getAllProjects();
  return all.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    technologies: p.technologies,
    platforms: p.platforms,
    status: p.status,
  }));
}