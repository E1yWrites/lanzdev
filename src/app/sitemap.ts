import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/githubProjects";
import { getAllDocSlugs } from "@/data/docs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lorenzmalabanan.com";

  const staticPages = ["", "/projects", "/downloads", "/releases", "/docs", "/about", "/contact", "/terms", "/privacy", "/license"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const projects = await getAllProjects();

  const projectPages = projects.map((p) => {
    const lastModified = p.releaseDate ? new Date(p.releaseDate) : undefined;
    return {
      url: `${baseUrl}/projects/${p.slug}`,
      ...(lastModified && !Number.isNaN(lastModified.getTime())
        ? { lastModified }
        : { lastModified: new Date() }),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    };
  });

  const docPages = getAllDocSlugs().map((slug) => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...docPages];
}