import { AboutCard } from "@/components/home/AboutCard";
import { Capabilities } from "@/components/home/Capabilities";
import { Hero } from "@/components/home/Hero";
import { Showreel, type ReelItem } from "@/components/home/Showreel";
import { WorkFolders } from "@/components/home/WorkFolders";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { getAllProjects } from "@/lib/githubProjects";

const CAPTIONS: Record<string, string> = {
  parada: "Still circling? See which zone has room, meet Lottie, and watch one gate event reach both screens.",
  tala: "A pencil writes “tala”, the day turns to night, and v1.1.0’s features arrive.",
};

const BAND = ["Smart parking", "Notes + handwriting", "Web", "Mobile", "Desktop", "Computer vision", "Motion", "Batangas, PH"];

export default async function Home() {
  const projects = await getAllProjects();
  const reel: ReelItem[] = projects.flatMap((p) => (p.film ? [{ slug: p.slug, name: p.name, caption: CAPTIONS[p.slug] ?? p.tagline, film: p.film }] : []));

  return (
    <>
      <Hero />
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
