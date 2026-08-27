import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getAllDocSlugs } from "@/data/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lorenzmalabanan.dev";

  const staticPages = ["", "/projects", "/downloads", "/releases", "/docs", "/about", "/contact", "/terms", "/privacy", "/license"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const projectPages = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p.releaseDate),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const docPages = getAllDocSlugs().map((slug) => ({
    url: `${baseUrl}/docs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...docPages];
}
