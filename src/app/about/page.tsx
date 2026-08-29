import { AboutContent } from "./AboutContent";
import { getAllProjects } from "@/lib/githubProjects";

export const metadata = {
  title: "About",
  description: "About Lorenz Malabanan — independent software developer.",
};

export default async function AboutPage() {
  const projects = await getAllProjects();
  return <AboutContent projects={projects} />;
}