import { Hero } from "@/components/home/Hero";
import { WorkFolders } from "@/components/home/WorkFolders";
import { AboutCard } from "@/components/home/AboutCard";
import { getAllProjects } from "@/lib/githubProjects";

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <>
      <Hero />
      {projects.length > 0 && <WorkFolders projects={projects} />}
      <AboutCard />
    </>
  );
}
