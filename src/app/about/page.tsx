import { AboutContent } from "./AboutContent";
import { getAllProjects } from "@/lib/githubProjects";

export const metadata = {
  title: "About",
  description: "Lorenz “Lanz” Malabanan — BSIT student at LPU-Batangas and independent developer: education, recognition, certifications and organisations.",
};

export default async function AboutPage() {
  const projects = await getAllProjects();
  return <AboutContent projects={projects} />;
}