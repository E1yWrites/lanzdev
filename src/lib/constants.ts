export const SITE_NAME = "Lorenz.dev";
export const SITE_URL = "https://lorenzmalabanan.dev";
export const SITE_DESCRIPTION =
  "Software made by a maker, for people who need something.";

export const GITHUB_USERNAME = "E1yWrites";
export const GITHUB_REPO = "tala";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
