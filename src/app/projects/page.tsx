import { ProjectsContent } from "./ProjectsContent";
import { getAllProjects } from "@/lib/githubProjects";

export const metadata = {
  title: "Projects",
  description: "Software I've designed and built.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsContent projects={projects} />;
}