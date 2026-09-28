import { ProjectsContent } from "./ProjectsContent";
import { getAllProjects } from "@/lib/githubProjects";

export const metadata = {
  title: "Projects",
  description: "PARADA, a smart parking system with OCR-assisted gate cameras, and Tala, a local-first note-taking app — designed and built by Lorenz Malabanan.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <ProjectsContent projects={projects} />;
}