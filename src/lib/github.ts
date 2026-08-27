import type { Release } from "@/types/release";
import { GITHUB_USERNAME, GITHUB_REPO } from "./constants";

const GITHUB_API = "https://api.github.com";

export async function fetchReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/releases?per_page=10`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return getStaticReleases();

    const data = await res.json();

    return data.map((r: Record<string, unknown>) => ({
      tagName: r.tag_name as string,
      name: r.name as string,
      publishedAt: r.published_at as string,
      body: r.body as string,
      prerelease: r.prerelease as boolean,
      assets: ((r.assets as Record<string, unknown>[]) || []).map(
        (a: Record<string, unknown>) => ({
          name: a.name as string,
          size: a.size as number,
          downloadUrl: a.browser_download_url as string,
          contentType: a.content_type as string,
        })
      ),
    }));
  } catch {
    return getStaticReleases();
  }
}

export async function fetchLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/releases/latest`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return getStaticReleases()[0] || null;

    const r = await res.json();

    return {
      tagName: r.tag_name,
      name: r.name,
      publishedAt: r.published_at,
      body: r.body,
      prerelease: r.prerelease,
      assets: (r.assets || []).map(
        (a: Record<string, unknown>) => ({
          name: a.name as string,
          size: a.size as number,
          downloadUrl: a.browser_download_url as string,
          contentType: a.content_type as string,
        })
      ),
    };
  } catch {
    return getStaticReleases()[0] || null;
  }
}

function getStaticReleases(): Release[] {
  return [
    {
      tagName: "v1.0.1",
      name: "Tala v1.0.1",
      publishedAt: "2026-08-25T09:41:06Z",
      body: "Bug fixes and new features including pen tool presets, multi-select mode, long-press preview, and various stability improvements.",
      prerelease: false,
      assets: [
        {
          name: "Tala_1.0.1_aarch64.dmg",
          size: 5468489,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.1/Tala_1.0.1_aarch64.dmg",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.1_x64-setup.exe",
          size: 4166737,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.1/Tala_1.0.1_x64-setup.exe",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.1_x64_en-US.msi",
          size: 5132288,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.1/Tala_1.0.1_x64_en-US.msi",
          contentType: "application/zip",
        },
        {
          name: "Tala_aarch64.app.tar.gz",
          size: 5215169,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.1/Tala_aarch64.app.tar.gz",
          contentType: "application/zip",
        },
      ],
    },
    {
      tagName: "v1.0.0",
      name: "Tala v1.0.0",
      publishedAt: "2026-08-24T05:36:21Z",
      body: "First official release of Tala — a local-first, hand-drawn aesthetic note-taking app inspired by pagtatala.",
      prerelease: false,
      assets: [
        {
          name: "Tala-1.0.0-1.x86_64.rpm",
          size: 6291028,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.0/Tala-1.0.0-1.x86_64.rpm",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.0_amd64.AppImage",
          size: 83745272,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.0/Tala_1.0.0_amd64.AppImage",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.0_amd64.deb",
          size: 6291028,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.0/Tala_1.0.0_amd64.deb",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.0_x64-setup.exe",
          size: 4166168,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.0/Tala_1.0.0_x64-setup.exe",
          contentType: "application/zip",
        },
        {
          name: "Tala_1.0.0_x64_en-US.msi",
          size: 5132288,
          downloadUrl:
            "https://github.com/E1yWrites/tala/releases/download/v1.0.0/Tala_1.0.0_x64_en-US.msi",
          contentType: "application/zip",
        },
      ],
    },
  ];
}
