import { Download } from "lucide-react";
import { fetchReleases } from "@/lib/github";
import { projects as curatedProjects } from "@/data/projects";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReleaseNotes, TimelineEntry } from "@/components/project/ReleaseNotes";
import type { Release, ReleaseAsset } from "@/types/release";
import { formatDate, formatFileSize, slugToTitle } from "@/lib/utils";

export const metadata = {
  title: "Releases",
  description: "Release history and changelog.",
};

export const revalidate = 3600;

function fallbackReleasesFromChangelog(): Release[] {
  const featured = curatedProjects.find((p) => p.featured);
  if (!featured) return [];
  return featured.changelog.map((entry) => ({
    tagName: `v${entry.version}`,
    name: `${featured.name} v${entry.version}`,
    publishedAt: entry.date,
    body: [
      entry.added?.length ? `Added:\n${entry.added.map((a) => `- ${a}`).join("\n")}` : "",
      entry.changed?.length ? `Changed:\n${entry.changed.map((c) => `- ${c}`).join("\n")}` : "",
      entry.fixed?.length ? `Fixed:\n${entry.fixed.map((f) => `- ${f}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    prerelease: false,
    assets: [],
  }));
}

function assetPlatform(name: string) {
  const n = name.toLowerCase();
  if (/\.(exe|msi)$/.test(n)) return "Windows";
  if (/\.(dmg|app\.tar\.gz|app\.zip)$/.test(n)) return "macOS";
  if (/\.(appimage|deb|rpm)$/.test(n)) return "Linux";
  if (/\.(sig|sha256|txt|json)$/.test(n)) return "Checksum";
  return "Asset";
}

function AssetList({ assets }: { assets: ReleaseAsset[] }) {
  return (
    <div className="mt-8 max-w-2xl">
      <h4 className="t-label mb-3 leading-normal text-swiss-fg/60">
        Assets · {assets.length}
      </h4>
      <ul className="divide-y divide-ink/10 overflow-hidden rounded-md border border-ink/10">
        {assets.map((asset) => (
          <li key={asset.name}>
            <a
              href={asset.downloadUrl}
              className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 px-4 py-3 transition-colors duration-fast hover:bg-ink/[0.04]"
            >
              <span className="t-label text-swiss-fg/60">
                {assetPlatform(asset.name)}
              </span>
              <span className="min-w-0 truncate font-mono text-xs text-swiss-fg/80 group-hover:text-swiss-fg">{asset.name}</span>
              <span className="flex items-center gap-3 font-mono text-[11px] text-swiss-fg/40">
                {formatFileSize(asset.size)}
                <Download size={14} strokeWidth={2} aria-hidden="true" className="transition-colors duration-fast group-hover:text-swiss-accent" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ReleasesPage({
  searchParams,
}: {
  searchParams?: { project?: string };
}) {
  const projectSlug = searchParams?.project && searchParams.project !== "tala" ? searchParams.project : undefined;
  let releases = await fetchReleases(projectSlug || "tala");
  if (releases.length === 0 && !projectSlug) {
    releases = fallbackReleasesFromChangelog();
  }

  const projectName = projectSlug
    ? curatedProjects.find((p) => p.slug === projectSlug)?.name ?? slugToTitle(projectSlug)
    : "Tala";
  const latestIndex = releases.findIndex((r) => !r.prerelease);

  return (
    <>
      <PageHeader
        eyebrow={`Releases / ${projectName}`}
        title="Releases"
        lede={`Release history and changelog for ${projectName}.`}
        stats={[
          ["Latest", releases[latestIndex]?.tagName],
          ["Releases", releases.length ? String(releases.length).padStart(2, "0") : undefined],
          ["Published", releases[0] && formatDate(releases[0].publishedAt)],
        ]}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        {releases.length === 0 ? (
          <div className="rounded-lg border border-dashed border-ink/15 p-10 text-center">
            <span className="t-label text-swiss-fg/60">
              No releases published yet.
            </span>
          </div>
        ) : (
          releases.map((release, i) => {
            const latest = i === latestIndex;
            const tags = [latest && "Latest", release.prerelease && "Pre-release"].filter(Boolean) as string[];
            // "Tala v1.0.1" only repeats the rail; keep titles that say something more.
            const title =
              release.name && !release.name.toLowerCase().endsWith(release.tagName.toLowerCase()) ? release.name : undefined;
            return (
              <TimelineEntry
                key={release.tagName}
                version={release.tagName}
                date={formatDate(release.publishedAt)}
                latest={latest}
                tags={tags}
              >
                {title && (
                  <p className="font-display font-light tracking-tight mb-6 text-xl text-swiss-fg md:text-2xl">{title}</p>
                )}
                {release.body ? (
                  <ReleaseNotes body={release.body} />
                ) : (
                  <p className="font-swiss text-sm text-swiss-fg/50">No notes for this release.</p>
                )}
                {release.assets.length > 0 && <AssetList assets={release.assets} />}
              </TimelineEntry>
            );
          })
        )}
      </section>
    </>
  );
}
