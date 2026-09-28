import { getAllProjects, getProjectBySlug } from "@/lib/githubProjects";
import { notFound } from "next/navigation";
import { ProjectPageClient } from "./ProjectPageClient";

interface Props {
  params: { slug: string };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: Props) {
  const projects = await getAllProjects();
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;

  return (
    <ProjectPageClient
      project={project}
      next={next && { slug: next.slug, name: next.name, tagline: next.tagline }}
    />
  );
}
