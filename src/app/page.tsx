import { AboutCard } from "@/components/home/AboutCard";
import { Capabilities } from "@/components/home/Capabilities";
import { Hero } from "@/components/home/Hero";
import type { RoomFacts } from "@/components/home/RoomCard";
import { Showreel, type ReelItem } from "@/components/home/Showreel";
import { WorkFolders } from "@/components/home/WorkFolders";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { siteConfig } from "@/data/config";
import { getAllProjects } from "@/lib/githubProjects";
import { platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

const CAPTIONS: Record<string, string> = {
  parada: "Still circling? See which zone has room, meet Lottie, and watch one gate event reach both screens.",
  tala: "A pencil writes “tala”, the day turns to night, and v1.1.0’s features arrive.",
};

const BAND = ["Smart parking", "Notes + handwriting", "Web", "Mobile", "Desktop", "Computer vision", "Motion", "Batangas, PH"];

/** The rows on a project's card in the hero room: all from the project's own data. */
function projectFacts(p: Project | undefined): [string, string][] | undefined {
  if (!p) return undefined;
  const rows: [string, string][] = [["Status", projectStatus(p.status).label]];
  if (p.version) rows.push(["Version", `v${p.version}`]);
  rows.push(["Runs on", platformSummary(p)], ["Built with", p.technologies.slice(0, 5).join(" · ")]);
  return rows;
}

export default async function Home() {
  const projects = await getAllProjects();
  const reel: ReelItem[] = projects.flatMap((p) => (p.film ? [{ slug: p.slug, name: p.name, caption: CAPTIONS[p.slug] ?? p.tagline, film: p.film }] : []));

  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
  const facts: RoomFacts = {
    parada: projectFacts(bySlug("parada")),
    tala: projectFacts(bySlug("tala")),
    about: [
      ["Studying", `BS Information Technology · ${siteConfig.education.level}`],
      ["Recognition", siteConfig.recognition[0].title],
      ["Certified", siteConfig.certifications[0].title],
    ],
    contact: [
      ["Email", siteConfig.email],
      ["Based in", "Batangas City, PH"],
    ],
  };

  return (
    <>
      <Hero facts={facts} reel={reel} />
      <VelocityMarquee
        className="border-y border-dotted border-ink/25 py-5"
        items={BAND.map((word) => (
          <>
            <span className="px-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-none tracking-tight text-ink md:px-10">{word}</span>
            <svg aria-hidden="true" viewBox="-1 -1 2 2" className="h-5 w-5 shrink-0 text-accent md:h-7 md:w-7">
              <path d="M0-1C.1-.2.2-.1 1 0 .2.1.1.2 0 1-.1.2-.2.1-1 0-.2-.1-.1-.2 0-1Z" fill="currentColor" />
            </svg>
          </>
        ))}
      />
      {projects.length > 0 && <WorkFolders projects={projects} />}
      {reel.length > 0 && <Showreel items={reel} />}
      <Capabilities />
      <AboutCard />
    </>
  );
}
