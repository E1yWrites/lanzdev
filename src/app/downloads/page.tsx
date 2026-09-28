import { DownloadsContent } from "./DownloadsContent";
import { getAllProjects, getFeaturedProject } from "@/lib/githubProjects";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Downloads",
  description: "Download the latest builds of software designed and maintained independently.",
};

export default async function DownloadsPage() {
  const [project, all] = await Promise.all([getFeaturedProject(), getAllProjects()]);
  if (!project) notFound();
  const others = all.filter((p) => p.slug !== project.slug);
  return <DownloadsContent project={project} others={others} />;
}
