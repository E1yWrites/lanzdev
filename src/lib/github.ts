import type { Release, ReleaseAsset } from "@/types/release";
import { GITHUB_REPO, GITHUB_USERNAME, GITHUB_TOKEN } from "./constants";

const GITHUB_API = "https://api.github.com";
const REVALIDATE = 3600; // 1 hour

export interface GithubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  pushed_at: string;
  updated_at: string;
  archived: boolean;
  fork: boolean;
  topics: string[];
  stargazers_count: number;
  license: { spdx_id: string | null } | null;
}

interface GithubFetchOptions {
  revalidate?: number;
}

async function githubFetch<T>(path: string, opts: GithubFetchOptions = {}): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: GITHUB_TOKEN
      ? { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" }
      : { Accept: "application/vnd.github+json" },
    next: { revalidate: opts.revalidate ?? REVALIDATE },
  });

  if (!res.ok) throw new Error(`GitHub API error ${res.status} for ${path}`);

  return res.json() as Promise<T>;
}

export async function fetchUserRepos(username: string = GITHUB_USERNAME): Promise<GithubRepo[]> {
  const data = (await githubFetch<Record<string, unknown>[]>(
    `/users/${username}/repos?per_page=100&sort=updated`
  )) as unknown[];

  return data.map((r) => {
    const repo = r as Record<string, unknown>;
    return {
      name: repo.name as string,
      full_name: repo.full_name as string,
      description: (repo.description as string) ?? null,
      html_url: repo.html_url as string,
      homepage: (repo.homepage as string) ?? null,
      language: (repo.language as string) ?? null,
      pushed_at: (repo.pushed_at as string) ?? (repo.updated_at as string) ?? "",
      updated_at: (repo.updated_at as string) ?? "",
      archived: Boolean(repo.archived),
      fork: Boolean(repo.fork),
      topics: Array.isArray(repo.topics) ? (repo.topics as string[]) : [],
      stargazers_count: Number(repo.stargazers_count) || 0,
      license: repo.license
        ? { spdx_id: ((repo.license as Record<string, unknown>).spdx_id as string) ?? null }
        : null,
    };
  });
}

export async function fetchRepoByName(
  repoName: string,
  username: string = GITHUB_USERNAME
): Promise<GithubRepo | null> {
  try {
    return await githubFetch<GithubRepo>(`/repos/${username}/${repoName}`);
  } catch {
    return null;
  }
}

function parseRelease(r: Record<string, unknown>): Release {
  return {
    tagName: r.tag_name as string,
    name: r.name as string,
    publishedAt: r.published_at as string,
    body: r.body as string,
    prerelease: Boolean(r.prerelease),
    assets: ((r.assets as Record<string, unknown>[]) || []).map((a) => ({
      name: a.name as string,
      size: Number(a.size) || 0,
      downloadUrl: a.browser_download_url as string,
      contentType: a.content_type as string,
    })),
  };
}

export async function fetchRepoLatestRelease(repoName: string): Promise<Release | null> {
  try {
    const data = await githubFetch<Record<string, unknown>>(
      `/repos/${GITHUB_USERNAME}/${repoName}/releases/latest`
    );
    return parseRelease(data);
  } catch {
    return null;
  }
}

export async function fetchReleases(repoName: string = GITHUB_REPO): Promise<Release[]> {
  try {
    const data = await githubFetch<Record<string, unknown>[]>(
      `/repos/${GITHUB_USERNAME}/${repoName}/releases?per_page=10`
    );
    return data.map(parseRelease);
  } catch {
    return [];
  }
}

const WINDOWS_PATTERN = /\.(exe|msi)$/i;
const MACOS_PATTERN = /\.(dmg|tar\.gz|tgz|app\.zip)$/i;
const LINUX_PATTERN = /\.(appimage|deb|rpm)$/i;

function pickAsset(
  assets: ReleaseAsset[],
  matcher: RegExp,
  preference: string[]
): ReleaseAsset | null {
  for (const ext of preference) {
    const found = assets.find((a) => a.name.toLowerCase().endsWith(`.${ext}`));
    if (found) return found;
  }
  return assets.find((a) => matcher.test(a.name)) ?? null;
}

export function downloadsFromRelease(release: Release): {
  downloads: Record<string, { available: boolean; url?: string; version?: string; architecture?: string; fileSize?: string }>;
  version: string;
  releaseDate: string;
} {
  const version = release.tagName.replace(/^v/i, "");
  const assets = release.assets || [];
  const map: Record<string, { available: boolean; url?: string; version?: string; architecture?: string; fileSize?: string }> = {};

  const windowsAsset = pickAsset(assets, WINDOWS_PATTERN, ["exe", "msi"]);
  const macosAsset = pickAsset(assets, MACOS_PATTERN, ["app.tar.gz", "dmg", "tar.gz"]);
  const linuxAsset = pickAsset(assets, LINUX_PATTERN, ["deb", "appimage", "rpm"]);

  const fileSize = (size: number) =>
    size === 0 ? undefined : formatFileSize(size);

  if (windowsAsset) {
    map.windows = {
      available: true,
      url: windowsAsset.downloadUrl,
      version,
      architecture: /(arm|aarch)/i.test(windowsAsset.name) ? "ARM64" : "x64",
      fileSize: fileSize(windowsAsset.size),
    };
  }
  if (macosAsset) {
    map.macos = {
      available: true,
      url: macosAsset.downloadUrl,
      version,
      architecture: /(arm|aarch)/i.test(macosAsset.name) ? "ARM64" : "x64",
      fileSize: fileSize(macosAsset.size),
    };
  }
  if (linuxAsset) {
    map.linux = {
      available: true,
      url: linuxAsset.downloadUrl,
      version,
      architecture: "x64",
      fileSize: fileSize(linuxAsset.size),
    };
  }

  return {
    downloads: map,
    version,
    releaseDate: release.publishedAt,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}