export const SITE_NAME = "Lorenz.dev";
export const SITE_URL = "https://lorenzmalabanan.dev";
export const SITE_DESCRIPTION =
  "Software made by a maker, for people who need something.";

export const GITHUB_USERNAME = "E1yWrites";
export const GITHUB_REPO = "tala";

// Optional GitHub token for higher API rate limits (`ghp_...`, `github_pat_...`,
// or `gho_...`). Public data works without it.
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

export function asset(path: string): string {
  return path;
}