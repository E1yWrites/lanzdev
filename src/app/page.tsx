import { Hero } from "@/components/sections/Hero";
import { FeaturedSoftware } from "@/components/sections/FeaturedSoftware";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ClosingWordmark } from "@/components/sections/ClosingWordmark";
import { getAllProjects, getFeaturedProject } from "@/lib/githubProjects";

export default async function Home() {
  const [featured, allProjects] = await Promise.all([
    getFeaturedProject(),
    getAllProjects(),
  ]);

  const otherProjects = featured
    ? allProjects.filter((p) => p.slug !== featured.slug)
    : allProjects;

  return (
    <>
      <Hero />
      {featured && <FeaturedSoftware project={featured} />}
      {otherProjects.length > 0 && <SelectedWork projects={otherProjects} />}
      <HowIBuild />
      {featured && <DownloadSection project={featured} />}
      <AboutPreview />
      <ClosingWordmark />
    </>
  );
}