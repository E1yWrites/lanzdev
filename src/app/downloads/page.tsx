import { DownloadsContent } from "./DownloadsContent";
import { getFeaturedProject } from "@/lib/githubProjects";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Downloads",
  description: "Download the latest builds of software designed and maintained independently.",
};

export default async function DownloadsPage() {
  const project = await getFeaturedProject();
  if (!project) notFound();
  return <DownloadsContent project={project} />;
}