import { fetchReleases } from "@/lib/github";
import { projects as curatedProjects } from "@/data/projects";
import type { Release } from "@/types/release";
import { formatDate, formatFileSize } from "@/lib/utils";

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
      entry.fixed?.length ? `Fixed:\n${entry.fixed.map((f) => `- ${f}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    prerelease: false,
    assets: [],
  }));
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

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-16">
          <h1 className="font-swiss font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-swiss-fg mb-4">
            Releases
          </h1>
          <p className="font-swiss text-base text-swiss-fg/70 leading-relaxed">
            Release history and changelog for {projectSlug ? `${projectSlug}` : "Tala"}.
          </p>
        </div>

        {releases.length === 0 ? (
          <div className="border-2 border-swiss-border p-10 text-center">
            <span className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40">
              No releases published yet.
            </span>
          </div>
        ) : (
          <div className="space-y-0 border-2 border-swiss-border">
            {releases.map((release, i) => (
              <div
                key={release.tagName}
                className={`border-b-2 border-swiss-border py-10 last:border-0 px-6 ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`font-swiss font-black text-lg tracking-tighter uppercase text-swiss-fg px-3 py-1 border-2 border-swiss-border ${i === 0 ? "bg-swiss-accent text-swiss-bg border-swiss-accent" : ""}`}>
                    {release.name || release.tagName}
                  </span>
                  <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
                    {formatDate(release.publishedAt)}
                  </span>
                  {i === 0 && !release.prerelease && (
                    <span className="section-number">Current</span>
                  )}
                  {release.prerelease && (
                    <span className="section-number">
                      Pre-release
                    </span>
                  )}
                </div>

                {release.body && (
                  <p className="font-swiss text-base text-swiss-fg/70 mb-6 max-w-2xl leading-relaxed">
                    {release.body}
                  </p>
                )}

                {release.assets.length > 0 && (
                  <div className="space-y-2">
                    {release.assets.map((asset) => (
                      <div
                        key={asset.name}
                        className="flex flex-wrap items-center gap-3 py-2 border-b border-swiss-border/50 last:border-0"
                      >
                        <a
                          href={asset.downloadUrl}
                          className="font-swiss text-sm font-medium text-swiss-fg/70 hover:text-swiss-accent break-all transition-colors duration-150"
                        >
                          {asset.name}
                        </a>
                        <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">
                          {formatFileSize(asset.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}